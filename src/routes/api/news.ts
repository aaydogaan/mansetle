import { createFileRoute } from "@tanstack/react-router";
import { listPublishedArticles } from "@/lib/news.server";

export const Route = createFileRoute("/api/news")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const category = url.searchParams.get("category")?.trim() || undefined;
        const rawLimit = Number(url.searchParams.get("limit") ?? "36");
        const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 72) : 36;
        try {
          return Response.json({ articles: await listPublishedArticles(category, limit) });
        } catch (error) {
          console.error("[news] could not load published articles", error);
          return Response.json({ articles: [] }, { status: 503 });
        }
      },
    },
  },
});
