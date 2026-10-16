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
