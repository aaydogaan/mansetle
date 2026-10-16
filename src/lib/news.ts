export type LiveArticle = {
  slug: string;
  title: string;
  summary: string;
  bodyMarkdown: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl: string | null;
  imageMode: "auto" | "manual" | "ai" | "none";
  publishedAt: string;
};
