import { getSql } from "@/lib/db";

export type LiveArticle = {
  slug: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
};

const selectArticle = `
  SELECT a.slug, a.title, a.summary, a.body_markdown AS "bodyMarkdown", a.category,
         s.name AS "sourceName", f.external_url AS "sourceUrl", a.published_at AS "publishedAt"
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
  const rows = await sql.query<LiveArticle>(`${selectArticle} AND a.slug = $1 LIMIT 1`, [slug]);
  return rows[0] ?? null;
}
