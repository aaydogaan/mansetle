import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/recep-auth.server";

export const Route = createFileRoute("/api/recep/publish")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });
        const body = (await request.json()) as { articleId?: number };
        if (!Number.isInteger(body.articleId)) return Response.json({ error: "Geçersiz taslak." }, { status: 400 });
        const sql = await getSql();
        const result = await sql.query<{ id: number }>("UPDATE news_articles SET status = 'published', published_at = now() WHERE id = $1 AND status = 'draft' RETURNING id", [body.articleId]);
        if (!result[0]) return Response.json({ error: "Taslak bulunamadı veya zaten yayında." }, { status: 404 });
        return Response.json({ ok: true });
      },
    },
  },
});
