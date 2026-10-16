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
  const normalizedSearchSlug = turkishSlugify(slug);

  // 1. Exact match by slug
  const rows = await sql.query<LiveArticle & { articleId: number }>(
    `${selectArticle} AND a.slug = $1 LIMIT 1`,
    [slug],
  );
  if (rows[0]) return rows[0];

  // 2. Normalized Turkish slug match
  if (normalizedSearchSlug && normalizedSearchSlug !== slug) {
    const normRows = await sql.query<LiveArticle & { articleId: number }>(
      `${selectArticle} AND a.slug = $1 LIMIT 1`,
      [normalizedSearchSlug],
    );
    if (normRows[0]) return normRows[0];
  }

  // 3. Backward compatibility: if URL had old ID suffix like '-189', fallback to match by id
  const idMatch = slug.match(/-(\d+)$/);
  if (idMatch) {
    const fallbackId = Number(idMatch[1]);
    const fallbackRows = await sql.query<LiveArticle & { articleId: number }>(
      `${selectArticle} AND (a.id = $1 OR a.source_feed_item_id = $1) LIMIT 1`,
      [fallbackId],
    );
    if (fallbackRows[0]) return fallbackRows[0];
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
      const matched = await sql.query<LiveArticle>(`${selectArticle} AND a.id = $1 LIMIT 1`, [item.id]);
      if (matched[0]) return matched[0];
    }
  }

  return null;
}
