import { createServerFn } from "@tanstack/react-start";
import type { LiveArticle } from "@/lib/news";

export const getPublishedArticle = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(
  async ({ data }): Promise<LiveArticle | null> => {
    const { slug } = data;
    if (!slug) return null;
    const { findPublishedArticle } = await import("@/lib/news.server");
    return findPublishedArticle(slug);
  },
  );

export const getPublishedArticles = createServerFn({ method: "GET" })
  .validator((data: { category?: string; limit?: number }) => data)
  .handler(async ({ data }): Promise<LiveArticle[]> => {
    try {
      const { listPublishedArticles } = await import("@/lib/news.server");
      const limit = Math.min(Math.max(data.limit ?? 18, 1), 48);
      return await listPublishedArticles(data.category, limit);
    } catch (error) {
      console.error("[news] could not load homepage articles", error);
      return [];
    }
  });
