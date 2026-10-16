import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { ArticleList } from "@/components/news/ArticleList";
import { articlesByCreator, getCreator } from "@/data/content";

export const Route = createFileRoute("/yazar/$slug")({
  loader: ({ params }) => {
    const creator = getCreator(params.slug);
    if (!creator) throw notFound();
    return { creator, articles: articlesByCreator(creator.slug) };
  },
  component: CreatorProfile,
});

function CreatorProfile() {
  const { creator, articles } = Route.useLoaderData();
  return (
    <SiteShell>
      <div className="container-buletin py-10 md:py-14">
        <div className="mb-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <img src={creator.avatar} alt="" className="size-24 rounded-full object-cover" />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-subtle uppercase">{creator.outlet}</p>
            <h1 className="mt-1 font-serif font-bold text-4xl">{creator.name}</h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{creator.bio}</p>
          </div>
        </div>
        <h2 className="mb-6 font-serif font-bold text-2xl">Yayınlanan Yazılar</h2>
        <ArticleList articles={articles} empty="Henüz yayınlanmış bir yazı bulunmuyor." />
      </div>
    </SiteShell>
  );
}
