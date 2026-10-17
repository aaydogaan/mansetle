import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { isSystemActive } from "@/lib/settings.server";

type FeedItem = { title: string; url: string; publishedAt: string | null; imageUrl: string | null };

const feeds = {
  trt: { name: "TRT Haber", url: "https://www.trthaber.com/sondakika_articles.rss" },
  aa: { name: "Anadolu Ajansı", url: "https://www.aa.com.tr/tr/rss/default?cat=guncel" },
  ntv_teknoloji: { name: "NTV Teknoloji", url: "https://www.ntv.com.tr/teknoloji.rss" },
} as const;

function clean(value: string): string { return value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim(); }
function tagValue(item: string, tag: string): string { const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i")); return clean(match?.[1] ?? ""); }

function imageUrl(item: string): string | null {
  // 1. AA style: <image>https://...</image>
  const imageTagMatch = item.match(/<image\b[^>]*>(?:<!\[CDATA\[)?\s*(https?:\/\/[^\]<]+)\s*(?:\]\]>)?<\/image>/i);
  if (imageTagMatch?.[1]) return clean(imageTagMatch[1]);

  // 2. enclosure or media:content with url attribute (TRT & NTV)
  const attrMatch = item.match(/<(?:media:content|media:thumbnail|enclosure|image)[^>]+\burl=["']([^"']+)["']/i);
  if (attrMatch?.[1]) return clean(attrMatch[1]);

  // 3. img tag inside description or content
  const imgMatch = item.match(/<img[^>]+\bsrc=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return clean(imgMatch[1]);

  return null;
}

import { fetchOgImage } from "@/lib/news.server";

function parseFeed(xml: string): FeedItem[] {
  const isAtom = /<entry\b/i.test(xml);
  const pattern = isAtom ? /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi : /<item\b[^>]*>([\s\S]*?)<\/item>/gi;

  return [...xml.matchAll(pattern)]
    .map((match) => {
      const source = match[1] ?? "";
      const title = tagValue(source, "title");
      let url = "";
      if (isAtom) {
        const linkMatch = source.match(/<link[^>]+href=["']([^"']+)["']/i);
        url = linkMatch?.[1] ? clean(linkMatch[1]) : tagValue(source, "id");
      } else {
        url = tagValue(source, "link");
      }
      const publishedAt = tagValue(source, "pubDate") || tagValue(source, "published") || tagValue(source, "updated") || null;
      return {
        title,
        url,
        publishedAt,
        imageUrl: imageUrl(source),
      };
    })
    .filter((item) => item.title && item.url)
    .slice(0, 15);
}

async function saveFeedItems(sourceId: keyof typeof feeds, feed: (typeof feeds)[keyof typeof feeds], items: FeedItem[]) {
  const sql = await getSql();
  await sql.query(`INSERT INTO news_sources (id, name, feed_url, website_url) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, feed_url = EXCLUDED.feed_url, updated_at = now()`, [sourceId, feed.name, feed.url, new URL(feed.url).origin]);
  await Promise.all(items.map(async (item) => {
    let finalImg = item.imageUrl;
    if (!finalImg) {
      finalImg = await fetchOgImage(item.url);
    }
    await sql.query(
      `INSERT INTO source_feed_items (source_id, external_url, external_title, published_at, image_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (source_id, external_url)
       DO UPDATE SET external_title = EXCLUDED.external_title,
                     published_at = COALESCE(EXCLUDED.published_at, source_feed_items.published_at),
                     image_url = COALESCE(EXCLUDED.image_url, source_feed_items.image_url),
                     last_seen_at = now()`,
      [sourceId, item.url, item.title, item.publishedAt, finalImg]
    );
    if (finalImg) {
      try {
        await sql.query(
          `UPDATE news_articles 
           SET cover_image_url = $1 
           WHERE source_feed_item_id IN (SELECT id FROM source_feed_items WHERE external_url = $2)
             AND (cover_image_url IS NULL OR cover_image_url = '' OR cover_image_url LIKE '%unsplash.com%')`,
          [finalImg, item.url]
        );
      } catch {
        // ignore
      }
    }
  }));
}

export const Route = createFileRoute("/api/source-feed/$source")({
  server: { handlers: { GET: async ({ params }) => {
    const active = await isSystemActive();
    if (!active) {
      return Response.json({ message: "Sistem duraklatıldı. Kaynak çekme kapalı.", items: [] });
    }
    const feed = feeds[params.source as keyof typeof feeds];
    if (!feed) return Response.json({ error: "Bilinmeyen kaynak." }, { status: 404 });
    try {
      const response = await fetch(feed.url, { headers: { "User-Agent": "Mansetle RSS Reader" }, signal: AbortSignal.timeout(10_000) });
      if (!response.ok) return Response.json({ error: `${feed.name} akışı şu anda alınamadı.` }, { status: 502 });
      const items = parseFeed(await response.text());
      await saveFeedItems(params.source as keyof typeof feeds, feed, items);
      return Response.json({ source: feed.name, items });
    } catch (error) { console.error("[source-feed] failed", error); return Response.json({ error: `${feed.name} akışına ulaşılamadı.` }, { status: 502 }); }
  } } },
});
