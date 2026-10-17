import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/recep-auth.server";
import { invalidateArticleCache } from "@/lib/news.server";

export const Route = createFileRoute("/api/recep/dismiss")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });

        const body = (await request.json().catch(() => ({}))) as {
          feedItemId?: number;
          feedItemIds?: number[];
          articleId?: number;
        };

        const sql = await getSql();

        // 1. Single or Bulk Incoming Feed Item Dismissal
        const ids = Array.isArray(body.feedItemIds)
          ? body.feedItemIds.filter(Number.isInteger)
          : Number.isInteger(body.feedItemId)
          ? [body.feedItemId!]
          : [];

        if (ids.length > 0) {
          for (const id of ids) {
            // Check if article already exists
            const existing = await sql.query<{ id: number; status: string }>(
              "SELECT id, status FROM news_articles WHERE source_feed_item_id = $1",
              [id]
            );

            if (existing[0]) {
              // Update status to rejected
              await sql.query("UPDATE news_articles SET status = 'rejected' WHERE id = $1", [existing[0].id]);
            } else {
              // Find feed item
              const feed = await sql.query<{ id: number; title: string }>(
                "SELECT id, external_title AS title FROM source_feed_items WHERE id = $1",
                [id]
              );
              if (feed[0]) {
                const uniqueSlug = `rejected-${id}-${Date.now()}`;
                await sql.query(
                  `INSERT INTO news_articles (source_feed_item_id, slug, title, summary, body_markdown, category, status, ai_model)
                   VALUES ($1, $2, $3, '', '', 'gundem', 'rejected', 'manual')`,
                  [id, uniqueSlug, feed[0].title]
                );
              }
            }
          }

          invalidateArticleCache();
          return Response.json({ success: true, count: ids.length });
        }

        // 2. Draft / Published Article Deletion
        if (Number.isInteger(body.articleId)) {
          await sql.query("UPDATE news_articles SET status = 'rejected' WHERE id = $1", [body.articleId]);
          invalidateArticleCache();
          return Response.json({ success: true, articleId: body.articleId });
        }

        return Response.json({ error: "Geçersiz istek parametreleri." }, { status: 400 });
      },
    },
  },
});
