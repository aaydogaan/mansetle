import { createFileRoute } from "@tanstack/react-router";
import { findPublishedArticle } from "@/lib/news.server";

export const Route = createFileRoute("/api/news/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const article = await findPublishedArticle(params.slug);
          return article
            ? Response.json({ article })
            : Response.json({ error: "Haber bulunamadı." }, { status: 404 });
        } catch (error) {
          console.error("[news] could not load article", error);
          return Response.json({ error: "Haber yüklenemedi." }, { status: 503 });
        }
      },
    },
  },
});
