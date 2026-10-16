import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/recep-auth.server";

export const Route = createFileRoute("/api/recep/queue")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });
        const sql = await getSql();
        const items = await sql.query(`SELECT f.id, f.external_title AS "title", f.external_url AS "url", s.name AS "sourceName", a.id AS "articleId", a.status, a.title AS "articleTitle", a.summary AS "articleSummary", a.body_markdown AS "articleBody" FROM source_feed_items f JOIN news_sources s ON s.id = f.source_id LEFT JOIN news_articles a ON a.source_feed_item_id = f.id ORDER BY f.last_seen_at DESC LIMIT 30`);
        return Response.json({ items });
      },
    },
  },
});
