import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";
import { SiteShell } from "@/components/layout/SiteShell";
import { pageTitle, seoHead, site, getArticleImageUrl } from "@/lib/site";
import { getPublishedArticles } from "@/lib/news.functions";

export const Route = createFileRoute("/")({
  staleTime: 60_000,
  gcTime: 300_000,
  loader: async () => ({ articles: await getPublishedArticles({ data: { limit: 36 } }) }),
  head: ({ loaderData }) => {
    const seo = seoHead({ title: pageTitle(), description: site.description, path: "/" });
    const articles = loaderData?.articles ?? [];
    const lcpArticle = articles[0];
    const lcpImageUrl = lcpArticle ? getArticleImageUrl(lcpArticle) : null;
    return {
      ...seo,
      links: [
        ...(seo.links ?? []),
        ...(lcpImageUrl
          ? [
              {
                rel: "preload",
                as: "image",
                href: lcpImageUrl,
                fetchPriority: "high" as const,
              },
            ]
          : []),
      ],
    };
  },
  component: Home,
});

function Home() {
  const { articles } = Route.useLoaderData();
  return (
    <SiteShell>
      <HomePage articles={articles} />
    </SiteShell>
  );
}
