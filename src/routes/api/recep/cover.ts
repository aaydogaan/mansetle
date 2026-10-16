import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { isAdmin } from "@/lib/recep-auth.server";

type CoverMode = "auto" | "manual" | "none";

export const Route = createFileRoute("/api/recep/cover")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAdmin(request)) return Response.json({ error: "Yetkisiz." }, { status: 401 });
        const body = (await request.json()) as { articleId?: number; mode?: CoverMode; imageUrl?: string };
        if (!Number.isInteger(body.articleId) || !["auto", "manual", "none"].includes(body.mode ?? "")) {
          return Response.json({ error: "Geçersiz kapak ayarı." }, { status: 400 });
        }
        let imageUrl = body.imageUrl?.trim() ?? "";
        if (body.mode === "manual") {
          if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
            imageUrl = `https://${imageUrl}`;
          }
          try {
            const url = new URL(imageUrl);
            if (!/^https?:$/.test(url.protocol)) throw new Error();
          } catch {
            return Response.json({ error: "Geçerli bir görsel URL'si girin (örn: https://...)." }, { status: 400 });
          }
        }
        const sql = await getSql();
        await sql.query(
          "UPDATE news_articles SET cover_image_mode = $1, cover_image_url = $2 WHERE id = $3",
          [body.mode, body.mode === "manual" ? imageUrl : null, body.articleId]
        );
        return Response.json({ ok: true, mode: body.mode, imageUrl: body.mode === "manual" ? imageUrl : null });
      },
    },
  },
});
