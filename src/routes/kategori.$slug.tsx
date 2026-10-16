import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { LiveNews } from "@/components/news/LiveNews";
import { PageIntro } from "@/components/news/ArticleList";
import { categoryLabel } from "@/data/content";

export const Route = createFileRoute("/kategori/$slug")({
  loader: ({ params }) => ({
    slug: params.slug,
    title: categoryLabel[params.slug] ?? params.slug.replace(/-/g, " "),
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug, title } = Route.useLoaderData();
  return (
    <SiteShell>
      <div className="container-buletin py-10 md:py-14">
        <PageIntro kicker="Kategori" title={title} body="Bu kategorideki yayınlanmış haberler." />
        <LiveNews category={slug} />
      </div>
    </SiteShell>
  );
}
