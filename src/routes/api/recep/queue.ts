import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/recep-auth.server";

const views = ["incoming", "drafts", "published"] as const;
type QueueView = (typeof views)[number];

function parseView(value: string | null): QueueView {
  return views.includes(value as QueueView) ? (value as QueueView) : "incoming";
}

export const Route = createFileRoute("/api/recep/queue")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });

        const url = new URL(request.url);
        const view = parseView(url.searchParams.get("view"));
        const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
        const pageSize = 8;
        const offset = (page - 1) * pageSize;

        const sql = await getSql();

        let countPromise: Promise<{ total: number }[]>;
        let itemsPromise: Promise<unknown[]>;

        if (view === "drafts") {
          countPromise = sql.query<{ total: number }>(
            "SELECT COUNT(*)::int AS total FROM news_articles WHERE status = 'draft'"
          );
          itemsPromise = sql.query(
            `SELECT f.id, f.external_title AS "title", f.external_url AS "url", s.name AS "sourceName",
                    a.id AS "articleId", a.status, a.title AS "articleTitle", a.summary AS "articleSummary",
                    a.body_markdown AS "articleBody", a.cover_image_url AS "coverImageUrl",
                    a.cover_image_mode AS "coverImageMode", a.created_at AS "createdAt", a.published_at AS "publishedAt"
             FROM news_articles a
             JOIN source_feed_items f ON f.id = a.source_feed_item_id
             JOIN news_sources s ON s.id = f.source_id
             WHERE a.status = 'draft'
             ORDER BY a.created_at DESC
             LIMIT $1 OFFSET $2`,
            [pageSize, offset]
          );
        } else if (view === "published") {
          countPromise = sql.query<{ total: number }>(
            "SELECT COUNT(*)::int AS total FROM news_articles WHERE status = 'published'"
          );
          itemsPromise = sql.query(
            `SELECT f.id, f.external_title AS "title", f.external_url AS "url", s.name AS "sourceName",
                    a.id AS "articleId", a.status, a.title AS "articleTitle", a.summary AS "articleSummary",
                    a.body_markdown AS "articleBody", a.cover_image_url AS "coverImageUrl",
                    a.cover_image_mode AS "coverImageMode", a.created_at AS "createdAt", a.published_at AS "publishedAt"
             FROM news_articles a
             JOIN source_feed_items f ON f.id = a.source_feed_item_id
             JOIN news_sources s ON s.id = f.source_id
             WHERE a.status = 'published'
             ORDER BY a.published_at DESC
             LIMIT $1 OFFSET $2`,
            [pageSize, offset]
          );
        } else {
          // incoming: items in source_feed_items that do NOT have a news_article
          countPromise = sql.query<{ total: number }>(
            "SELECT GREATEST(0, (SELECT COUNT(*) FROM source_feed_items) - (SELECT COUNT(*) FROM news_articles))::int AS total"
          );
          itemsPromise = sql.query(
            `SELECT f.id, f.external_title AS "title", f.external_url AS "url", s.name AS "sourceName",
                    NULL::bigint AS "articleId", NULL::text AS "status", NULL::text AS "articleTitle",
                    NULL::text AS "articleSummary", NULL::text AS "articleBody", NULL::text AS "coverImageUrl",
                    NULL::text AS "coverImageMode", NULL::timestamptz AS "createdAt", NULL::timestamptz AS "publishedAt"
             FROM source_feed_items f
             JOIN news_sources s ON s.id = f.source_id
             WHERE NOT EXISTS (SELECT 1 FROM news_articles a WHERE a.source_feed_item_id = f.id)
             ORDER BY f.last_seen_at DESC
             LIMIT $1 OFFSET $2`,
            [pageSize, offset]
          );
        }

        const countsPromise = sql.query<{ incoming: number; drafts: number; published: number }>(
          `SELECT 
             GREATEST(0, (SELECT COUNT(*) FROM source_feed_items) - (SELECT COUNT(*) FROM news_articles))::int AS incoming,
             (SELECT COUNT(*) FROM news_articles WHERE status = 'draft')::int AS drafts,
             (SELECT COUNT(*) FROM news_articles WHERE status = 'published')::int AS published`
        );

        const [countRows, items, counts] = await Promise.all([countPromise, itemsPromise, countsPromise]);
        const total = countRows[0]?.total ?? 0;

        return Response.json({
          items,
          view,
          counts: counts[0] ?? { incoming: 0, drafts: 0, published: 0 },
          pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
        });
      },
    },
  },
});
