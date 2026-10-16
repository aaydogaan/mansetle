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
        const filters: Record<QueueView, { where: string; order: string }> = {
          incoming: { where: "a.id IS NULL", order: "f.last_seen_at DESC" },
          drafts: { where: "a.status = 'draft'", order: "a.created_at DESC" },
          published: { where: "a.status = 'published'", order: "a.published_at DESC" },
        };
        const filter = filters[view];
        const sql = await getSql();
        const [countRows, items, counts] = await Promise.all([
          sql.query<{ total: number }>(`SELECT COUNT(*)::int AS total FROM source_feed_items f LEFT JOIN news_articles a ON a.source_feed_item_id = f.id WHERE ${filter.where}`),
          sql.query(`SELECT f.id, f.external_title AS "title", f.external_url AS "url", s.name AS "sourceName", a.id AS "articleId", a.status, a.title AS "articleTitle", a.summary AS "articleSummary", a.body_markdown AS "articleBody", a.created_at AS "createdAt", a.published_at AS "publishedAt" FROM source_feed_items f JOIN news_sources s ON s.id = f.source_id LEFT JOIN news_articles a ON a.source_feed_item_id = f.id WHERE ${filter.where} ORDER BY ${filter.order} LIMIT $1 OFFSET $2`, [pageSize, offset]),
          sql.query<{ incoming: number; drafts: number; published: number }>("SELECT COUNT(*) FILTER (WHERE a.id IS NULL)::int AS incoming, COUNT(*) FILTER (WHERE a.status = 'draft')::int AS drafts, COUNT(*) FILTER (WHERE a.status = 'published')::int AS published FROM source_feed_items f LEFT JOIN news_articles a ON a.source_feed_item_id = f.id"),
        ]);
        const total = countRows[0]?.total ?? 0;
        return Response.json({ items, view, counts: counts[0] ?? { incoming: 0, drafts: 0, published: 0 }, pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) } });
      },
    },
  },
});
