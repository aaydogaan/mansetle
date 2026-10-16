import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ArticleCard, CategoryRead, MetaRow } from "@/components/news/ArticleCard";
import { getArticle, relatedArticles } from "@/data/content";
import { useSaved } from "@/store/saved";

export const Route = createFileRoute("/haber/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article, related: relatedArticles(article) };
  },
  component: ArticlePage,
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.article.title} — Mansetle` : "Mansetle" }],
  }),
});

function ArticlePage() {
  const { article, related } = Route.useLoaderData();
  const { has, toggle } = useSaved();
  const saved = has(article.slug);

  return (
    <SiteShell>
      <article className="container-buletin py-8 md:py-12">
        <p className="text-[13px] text-muted">
          <Link to="/" className="hover:text-buletin">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link to="/kategori/$slug" params={{ slug: article.categorySlug }} className="hover:text-buletin">
            {article.category}
          </Link>
        </p>
        <h1 className="mt-4 max-w-3xl font-serif font-bold text-[36px] leading-[1.15] md:text-[48px]">{article.title}</h1>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <MetaRow article={article} />
            <div className="mt-2">
              <CategoryRead article={article} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggle(article.slug)}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[13px] font-medium hover:border-ink transition-colors"
          >
            {saved ? <BookmarkCheck className="size-4 text-buletin" /> : <Bookmark className="size-4" />}
            {saved ? "Kaydedildi" : "Haberi Kaydet"}
          </button>
        </div>
        <img src={article.image} alt="" className="mt-8 w-full rounded-2xl object-cover md:max-h-[520px]" />
        <div className="mx-auto mt-10 max-w-[680px] space-y-5 text-[17px] leading-[1.75] text-ink">
          {article.body.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </article>
      {related.length > 0 ? (
        <section className="container-buletin pb-8">
          <h2 className="mb-6 font-serif font-bold text-[28px]">{article.category} Kategorisinden Diğer Haberler</h2>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
