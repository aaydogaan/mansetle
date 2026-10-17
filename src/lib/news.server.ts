import { getSql } from "@/lib/db";
import type { LiveArticle } from "@/lib/news";
import { turkishSlugify } from "@/lib/utils";

const selectArticle = `
  SELECT a.id AS "articleId", a.slug, a.title, a.summary, a.body_markdown AS "bodyMarkdown", a.category,
         s.name AS "sourceName", f.external_url AS "sourceUrl",
         CASE WHEN a.cover_image_mode = 'none' THEN NULL ELSE COALESCE(a.cover_image_url, f.image_url) END AS "imageUrl",
         a.cover_image_mode AS "imageMode", a.published_at AS "publishedAt"
  FROM news_articles a
  JOIN source_feed_items f ON f.id = a.source_feed_item_id
  JOIN news_sources s ON s.id = f.source_id
  WHERE a.status = 'published'`;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const globalCache = globalThis as typeof globalThis & {
  __articleListCache__?: Map<string, CacheEntry<LiveArticle[]>>;
  __singleArticleCache__?: Map<string, CacheEntry<LiveArticle | null>>;
};

globalCache.__articleListCache__ ??= new Map();
globalCache.__singleArticleCache__ ??= new Map();

const LIST_CACHE_TTL = 60_000; // 60 seconds
const ARTICLE_CACHE_TTL = 300_000; // 5 minutes

export function invalidateArticleCache() {
  globalCache.__articleListCache__?.clear();
  globalCache.__singleArticleCache__?.clear();
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(3500),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ??
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    if (match?.[1] && /^https?:\/\//i.test(match[1])) {
      return match[1].trim();
    }
  } catch {
    // ignore
  }
  return null;
}

let isBackfilling = false;
async function backfillMissingImages() {
  if (isBackfilling) return;
  isBackfilling = true;
  try {
    const sql = await getSql();
    const rows = await sql.query<{ id: number; externalUrl: string; articleId: number }>(
      `SELECT f.id, f.external_url AS "externalUrl", a.id AS "articleId"
       FROM source_feed_items f
       JOIN news_articles a ON a.source_feed_item_id = f.id
       WHERE a.status = 'published' AND (f.image_url IS NULL OR f.image_url = '' OR a.cover_image_url IS NULL)
       ORDER BY a.published_at DESC
       LIMIT 12`
    );
    if (rows.length === 0) {
      isBackfilling = false;
      return;
    }
    let updated = false;
    for (const row of rows) {
      const img = await fetchOgImage(row.externalUrl);
      if (img) {
        await sql.query("UPDATE source_feed_items SET image_url = $1 WHERE id = $2", [img, row.id]);
        await sql.query(
          "UPDATE news_articles SET cover_image_url = $1 WHERE id = $2 AND (cover_image_url IS NULL OR cover_image_url = '')",
          [img, row.articleId]
        );
        updated = true;
      }
    }
    if (updated) {
      invalidateArticleCache();
    }
  } catch (err) {
    console.error("[backfill] error backfilling images", err);
  } finally {
    isBackfilling = false;
  }
}

export async function listPublishedArticles(category?: string, limit = 24): Promise<LiveArticle[]> {
  const cacheKey = `${category ?? "all"}:${limit}`;
  const cached = globalCache.__articleListCache__?.get(cacheKey);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const sql = await getSql();
  let rows: LiveArticle[];
  if (category && category !== "son-haberler") {
    rows = await sql.query<LiveArticle>(
      `${selectArticle} AND a.category = $1 ORDER BY a.published_at DESC LIMIT $2`,
      [category, limit],
    );
  } else {
    rows = await sql.query<LiveArticle>(`${selectArticle} ORDER BY a.published_at DESC LIMIT $1`, [limit]);
  }

  // Check if any articles have missing images, and run non-blocking repair in background
  if (rows.some((item) => !item.imageUrl)) {
    backfillMissingImages().catch(() => {});
  }

  globalCache.__articleListCache__?.set(cacheKey, {
    data: rows,
    expiresAt: now + LIST_CACHE_TTL,
  });

  return rows;
}

async function ensureArticleHasImage(article: LiveArticle & { articleId?: number }): Promise<LiveArticle> {
  if (!article.imageUrl && article.sourceUrl) {
    const realImg = await fetchOgImage(article.sourceUrl);
    if (realImg) {
      article.imageUrl = realImg;
      try {
        const sql = await getSql();
        if (article.articleId) {
          await sql.query("UPDATE news_articles SET cover_image_url = $1 WHERE id = $2", [realImg, article.articleId]);
        }
        await sql.query("UPDATE source_feed_items SET image_url = $1 WHERE external_url = $2", [realImg, article.sourceUrl]);
      } catch {
        // ignore
      }
    }
  }
  return article;
}

export async function findPublishedArticle(slug: string): Promise<LiveArticle | null> {
  if (!slug) return null;
  const now = Date.now();
  const cached = globalCache.__singleArticleCache__?.get(slug);
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  const sql = await getSql();
  const normalizedSearchSlug = turkishSlugify(slug);

  // 1. Exact match by slug
  const rows = await sql.query<LiveArticle & { articleId: number }>(
    `${selectArticle} AND a.slug = $1 LIMIT 1`,
    [slug],
  );
  if (rows[0]) {
    const article = await ensureArticleHasImage(rows[0]);
    globalCache.__singleArticleCache__?.set(slug, { data: article, expiresAt: now + ARTICLE_CACHE_TTL });
    return article;
  }

  // 2. Normalized Turkish slug match
  if (normalizedSearchSlug && normalizedSearchSlug !== slug) {
    const normRows = await sql.query<LiveArticle & { articleId: number }>(
      `${selectArticle} AND a.slug = $1 LIMIT 1`,
      [normalizedSearchSlug],
    );
    if (normRows[0]) {
      const article = await ensureArticleHasImage(normRows[0]);
      globalCache.__singleArticleCache__?.set(slug, { data: article, expiresAt: now + ARTICLE_CACHE_TTL });
      return article;
    }
  }

  // 3. Backward compatibility: if URL had old ID suffix like '-189', fallback to match by id
  const idMatch = slug.match(/-(\d+)$/);
  if (idMatch) {
    const fallbackId = Number(idMatch[1]);
    const fallbackRows = await sql.query<LiveArticle & { articleId: number }>(
      `${selectArticle} AND (a.id = $1 OR a.source_feed_item_id = $1) LIMIT 1`,
      [fallbackId],
    );
    if (fallbackRows[0]) {
      const article = await ensureArticleHasImage(fallbackRows[0]);
      globalCache.__singleArticleCache__?.set(slug, { data: article, expiresAt: now + ARTICLE_CACHE_TTL });
      return article;
    }
  }

  // 4. Intelligent slug repair: compare published articles by their turkishSlugify title or simplified characters
  const allPublished = await sql.query<{ id: number; slug: string; title: string }>(
    "SELECT id, slug, title FROM news_articles WHERE status = 'published' ORDER BY id DESC LIMIT 100",
  );

  const cleanSearchLetters = slug.replace(/[^a-z0-9]/g, "");

  for (const item of allPublished) {
    const itemCleanSlug = turkishSlugify(item.title);
    const itemLetters = item.slug.replace(/[^a-z0-9]/g, "");
    const titleLetters = itemCleanSlug.replace(/[^a-z0-9]/g, "");

    if (
      itemCleanSlug === slug ||
      itemCleanSlug === normalizedSearchSlug ||
      (cleanSearchLetters.length > 8 && (itemLetters.includes(cleanSearchLetters) || cleanSearchLetters.includes(itemLetters))) ||
      (cleanSearchLetters.length > 8 && (titleLetters.includes(cleanSearchLetters) || cleanSearchLetters.includes(titleLetters)))
    ) {
      // Auto-update DB row to this clean slug so future requests are instantaneous
      try {
        await sql.query("UPDATE news_articles SET slug = $1 WHERE id = $2", [slug, item.id]);
      } catch {
        // In case of conflict, ignore
      }
      const matched = await sql.query<LiveArticle & { articleId: number }>(`${selectArticle} AND a.id = $1 LIMIT 1`, [item.id]);
      if (matched[0]) {
        const article = await ensureArticleHasImage(matched[0]);
        globalCache.__singleArticleCache__?.set(slug, { data: article, expiresAt: now + ARTICLE_CACHE_TTL });
        return article;
      }
    }
  }

  globalCache.__singleArticleCache__?.set(slug, { data: null, expiresAt: now + 30_000 });
  return null;
}
