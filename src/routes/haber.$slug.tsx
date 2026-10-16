import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { getPublishedArticle } from "@/lib/news.functions";
import type { LiveArticle } from "@/lib/news";
import { absoluteUrl, categoryNames, pageTitle, seoHead, site, trimDescription } from "@/lib/site";

export const Route = createFileRoute("/haber/$slug")({
  loader: async ({ params }) => {
    try { return { article: await getPublishedArticle({ data: { slug: params.slug } }) }; }
    catch (error) { console.error("[article] could not load published article", error); return { article: null }; }
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    return article ? seoHead({ title: pageTitle(article.title), description: trimDescription(article.summary), path: `/haber/${article.slug}`, type: "article" }) : { meta: [{ title: pageTitle("Haber bulunamadı") }, { name: "robots", content: "noindex, follow" }] };
  },
  component: ArticlePage,
});

function articleSchema(article: LiveArticle) {
  return JSON.stringify({ "@context": "https://schema.org", "@type": "NewsArticle", headline: article.title, description: trimDescription(article.summary), datePublished: article.publishedAt, dateModified: article.publishedAt, mainEntityOfPage: absoluteUrl(`/haber/${article.slug}`), url: absoluteUrl(`/haber/${article.slug}`), image: article.imageUrl ? [article.imageUrl] : undefined, publisher: { "@type": "Organization", name: site.name, url: site.url, logo: { "@type": "ImageObject", url: absoluteUrl("/mansetle-fav.png") } }, isBasedOn: article.sourceUrl }).replace(/</g, "\\u003c");
}

function ArticlePage() {
  const { article } = Route.useLoaderData();
  if (!article) return <SiteShell><p className="container-buletin py-16 text-muted">Haber bulunamadı.</p></SiteShell>;
  const category = categoryNames[article.category] ?? article.category;
  return <SiteShell><article className="container-buletin py-10 md:py-14"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema(article) }} /><p className="text-sm text-muted"><Link to="/" className="hover:text-buletin">Ana Sayfa</Link><span className="mx-2">/</span><Link to="/kategori/$slug" params={{ slug: article.category }} className="hover:text-buletin">{category}</Link></p><p className="mt-8 text-xs font-semibold text-buletin">{article.sourceName}</p><h1 className="mt-3 max-w-4xl font-serif text-[36px] leading-[1.15] font-bold text-ink md:text-[52px]">{article.title}</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{article.summary}</p>{article.imageUrl ? <figure className="mt-8 max-w-4xl overflow-hidden rounded-2xl bg-soft"><img src={article.imageUrl} alt={article.title} className="aspect-video w-full object-cover" loading="eager" referrerPolicy="no-referrer" /><figcaption className="px-4 py-3 text-xs text-muted">Kapak görseli</figcaption></figure> : null}<div className="mt-10 max-w-3xl space-y-5 text-[17px] leading-[1.8] text-ink">{article.bodyMarkdown.split(/\n{2,}/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><a className="mt-10 inline-flex text-sm font-semibold text-buletin hover:text-buletin-dark" href={article.sourceUrl} target="_blank" rel="noreferrer">Kaynağa git</a></article></SiteShell>;
}
