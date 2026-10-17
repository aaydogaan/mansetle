import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/recep-auth.server";
import { invalidateArticleCache } from "@/lib/news.server";

const allowedCategories = new Set([
  "gundem",
  "turkiye",
  "dunya",
  "para",
  "spor",
  "teknoloji",
  "kultur",
  "yasam",
  "eglence",
]);

export const Route = createFileRoute("/api/recep/category")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });

        const body = (await request.json().catch(() => ({}))) as {
          articleId?: number;
          category?: string;
        };

        if (!Number.isInteger(body.articleId)) {
          return Response.json({ error: "Geçersiz haber ID." }, { status: 400 });
        }

        const category = body.category?.trim().toLowerCase();
        if (!category || !allowedCategories.has(category)) {
          return Response.json({ error: "Geçersiz kategori." }, { status: 400 });
        }

        const sql = await getSql();
        await sql.query("UPDATE news_articles SET category = $1 WHERE id = $2", [category, body.articleId]);
        invalidateArticleCache();

        return Response.json({ success: true, articleId: body.articleId, category });
      },
    },
  },
});
