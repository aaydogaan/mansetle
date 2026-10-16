import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

type FeedItem = {
  title: string;
  url: string;
  publishedAt: string | null;
};

const feeds = {
  trt: { name: "TRT Haber", url: "https://www.trthaber.com/sondakika_articles.rss" },
  aa: { name: "Anadolu Ajansı", url: "https://www.aa.com.tr/tr/rss/default?cat=guncel" },
} as const;

function clean(value: string): string {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function tagValue(item: string, tag: string): string {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return clean(match?.[1] ?? "");
}

function parseFeed(xml: string): FeedItem[] {
  return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)]
    .map((match) => {
      const source = match[1] ?? "";
      const title = tagValue(source, "title");
      const url = tagValue(source, "link");
      const date = tagValue(source, "pubDate");
      return { title, url, publishedAt: date || null };
    })
    .filter((item) => item.title && item.url)
    .slice(0, 5);
}

async function saveFeedItems(
  sourceId: keyof typeof feeds,
  feed: (typeof feeds)[keyof typeof feeds],
  items: FeedItem[],
) {
  const sql = await getSql();
  await sql.query(
    `INSERT INTO news_sources (id, name, feed_url, website_url)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       feed_url = EXCLUDED.feed_url,
       updated_at = now()`,
    [sourceId, feed.name, feed.url, new URL(feed.url).origin],
  );

  await Promise.all(
    items.map((item) =>
      sql.query(
        `INSERT INTO source_feed_items (source_id, external_url, external_title, published_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (source_id, external_url) DO UPDATE SET
           external_title = EXCLUDED.external_title,
           published_at = COALESCE(EXCLUDED.published_at, source_feed_items.published_at),
           last_seen_at = now()`,
        [sourceId, item.url, item.title, item.publishedAt],
      ),
    ),
  );
}

export const Route = createFileRoute("/api/source-feed/$source")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const feed = feeds[params.source as keyof typeof feeds];
        if (!feed) return Response.json({ error: "Bilinmeyen kaynak." }, { status: 404 });
        try {
          const response = await fetch(feed.url, {
            headers: { "User-Agent": "Mansetle RSS Preview" },
            signal: AbortSignal.timeout(10_000),
          });
          if (!response.ok) return Response.json({ error: `${feed.name} akışı şu anda alınamadı.` }, { status: 502 });
          const items = parseFeed(await response.text());
          try {
            await saveFeedItems(params.source as keyof typeof feeds, feed, items);
          } catch (error) {
            console.error("[source-feed] could not persist feed items", error);
          }
          return Response.json({ source: feed.name, items });
        } catch {
          return Response.json({ error: `${feed.name} akışına ulaşılamadı.` }, { status: 502 });
        }
      },
    },
  },
});
