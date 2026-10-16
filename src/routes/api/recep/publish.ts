import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/recep-auth.server";

export const Route = createFileRoute("/api/recep/publish")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });
        const body = (await request.json()) as { articleId?: number; coverImageUrl?: string; coverImageMode?: "auto" | "manual" | "ai" | "none" };
        if (!Number.isInteger(body.articleId)) return Response.json({ error: "Geçersiz taslak." }, { status: 400 });
        const sql = await getSql();

        // If coverImageUrl is provided, auto-update the cover image as manual before publishing
        const coverUrl = body.coverImageUrl?.trim();
        if (coverUrl && /^https?:\/\//i.test(coverUrl)) {
          await sql.query(
            "UPDATE news_articles SET cover_image_mode = 'manual', cover_image_url = $1 WHERE id = $2",
            [coverUrl, body.articleId]
          );
        } else if (body.coverImageMode && ["auto", "none"].includes(body.coverImageMode)) {
          await sql.query(
            "UPDATE news_articles SET cover_image_mode = $1, cover_image_url = NULL WHERE id = $2",
            [body.coverImageMode, body.articleId]
          );
        }

        const result = await sql.query<{ id: number }>(
          "UPDATE news_articles SET status = 'published', published_at = now() WHERE id = $1 AND status = 'draft' RETURNING id",
          [body.articleId]
        );
        if (!result[0]) return Response.json({ error: "Taslak bulunamadı veya zaten yayında." }, { status: 404 });
        return Response.json({ ok: true });
      },
    },
  },
});
