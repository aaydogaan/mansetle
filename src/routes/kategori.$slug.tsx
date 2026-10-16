import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { ArticleList, PageIntro } from "@/components/news/ArticleList";
import {
  articles,
  articlesByCategory,
  categoryLabel,
  getArticle,
  homepage,
} from "@/data/content";

export const Route = createFileRoute("/kategori/$slug")({
  loader: ({ params }) => {
    const slug = params.slug;
    const title = categoryLabel[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    let list = articlesByCategory(slug);
    if (slug === "gundem" || slug === "turkiye") list = articles.slice(0, 8);
    if (slug === "dunya") list = articles.filter((a) => ["middle-east", "war", "inside-asia", "crime"].includes(a.categorySlug) || a.category.toLowerCase().includes("war"));
    if (slug === "para") list = articles.filter((a) => ["business", "work", "markets", "investment"].includes(a.categorySlug) || a.category.toLowerCase().includes("business"));
    if (slug === "spor") list = articles.filter((a) => ["sport", "sports"].includes(a.categorySlug) || a.category.toLowerCase().includes("sport"));
    if (slug === "teknoloji") list = articles.filter((a) => ["technology", "gadget", "future-tech"].includes(a.categorySlug) || a.category.toLowerCase().includes("tech"));
    if (slug === "kultur") list = articles.filter((a) => ["culture", "movies", "art"].includes(a.categorySlug) || a.category.toLowerCase().includes("culture"));
    if (slug === "yasam") list = articles.filter((a) => ["travel", "food", "climate"].includes(a.categorySlug) || a.category.toLowerCase().includes("travel"));
    if (slug === "eglence") list = articles.filter((a) => ["entertainment", "movies", "viral"].includes(a.categorySlug) || a.category.toLowerCase().includes("entertainment"));
    if (slug === "latest") list = homepage.latest.map((id) => getArticle(id)!);
    if (slug === "must-read") {
      list = [homepage.mustReadLeft, homepage.mustReadCenter, ...homepage.mustReadRight].map((id) => getArticle(id)!);
    }
    if (slug === "editors-pick") {
      list = [homepage.editorsHero, ...homepage.editorsGrid].map((id) => getArticle(id)!);
    }
    if (slug === "stories") list = articles;
    if (list.length === 0) {
      const q = slug.replace(/-/g, " ");
      list = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.body.some((p) => p.toLowerCase().includes(q)) ||
          a.category.toLowerCase().includes(q),
      );
    }
    if (list.length === 0) list = articles.slice(0, 8);
    return { slug, title, list };
  },
  component: CategoryPage,
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.title} — Mansetle` : "Mansetle" }],
  }),
});

function CategoryPage() {
  const { title, list } = Route.useLoaderData();
  return (
    <SiteShell>
      <div className="container-buletin py-10 md:py-14">
        <PageIntro kicker="Kategori" title={title} body={`Bu kategoride toplam ${list.length} haber bulunuyor.`} />
        <ArticleList articles={list} empty="Bu kategoride henüz yayınlanmış bir haber bulunmuyor." />
      </div>
    </SiteShell>
  );
}
