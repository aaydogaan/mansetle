import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";
import { SiteShell } from "@/components/layout/SiteShell";
import { pageTitle, seoHead, site } from "@/lib/site";
import { getPublishedArticles } from "@/lib/news.functions";

export const Route = createFileRoute("/")({
  staleTime: 60_000,
  loader: async () => ({ articles: await getPublishedArticles({ data: { limit: 36 } }) }),
  head: () => seoHead({ title: pageTitle(), description: site.description, path: "/" }),
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
