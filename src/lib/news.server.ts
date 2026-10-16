import { getSql } from "@/lib/db";
import type { LiveArticle } from "@/lib/news";

const selectArticle = `
  SELECT a.slug, a.title, a.summary, a.body_markdown AS "bodyMarkdown", a.category,
         s.name AS "sourceName", f.external_url AS "sourceUrl",
         CASE WHEN a.cover_image_mode = 'none' THEN NULL ELSE COALESCE(a.cover_image_url, f.image_url) END AS "imageUrl",
         a.cover_image_mode AS "imageMode", a.published_at AS "publishedAt"
  FROM news_articles a
  JOIN source_feed_items f ON f.id = a.source_feed_item_id
  JOIN news_sources s ON s.id = f.source_id
  WHERE a.status = 'published'`;

export async function listPublishedArticles(category?: string, limit = 24): Promise<LiveArticle[]> {
  const sql = await getSql();
  if (category) {
    return sql.query<LiveArticle>(
      `${selectArticle} AND a.category = $1 ORDER BY a.published_at DESC LIMIT $2`,
      [category, limit],
    );
  }
  return sql.query<LiveArticle>(`${selectArticle} ORDER BY a.published_at DESC LIMIT $1`, [limit]);
}

export async function findPublishedArticle(slug: string): Promise<LiveArticle | null> {
  const sql = await getSql();
  // 1. Try exact slug match
  const rows = await sql.query<LiveArticle>(`${selectArticle} AND a.slug = $1 LIMIT 1`, [slug]);
  if (rows[0]) return rows[0];

  // 2. Backward compatibility: if URL had old ID suffix like '-189', fallback to match by id
  const idMatch = slug.match(/-(\d+)$/);
  if (idMatch) {
    const fallbackId = Number(idMatch[1]);
    const fallbackRows = await sql.query<LiveArticle>(
      `${selectArticle} AND (a.id = $1 OR a.source_feed_item_id = $1) LIMIT 1`,
      [fallbackId]
    );
    if (fallbackRows[0]) return fallbackRows[0];
  }

  return null;
}
