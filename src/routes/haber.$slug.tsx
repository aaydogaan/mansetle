import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ChevronRight, Clock, Copy, ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { getPublishedArticle, getPublishedArticles } from "@/lib/news.functions";
import type { LiveArticle } from "@/lib/news";
import { absoluteUrl, categoryNames, pageTitle, seoHead, site, trimDescription } from "@/lib/site";
import { estimateReadTime, formatFullDateTime, formatRelativeTime } from "@/lib/utils";

const TOP_SIDEBAR_CATEGORIES = [
  { slug: "gundem", name: "Gündem", color: "bg-red-500" },
  { slug: "para", name: "Ekonomi", color: "bg-emerald-500" },
  { slug: "spor", name: "Spor", color: "bg-blue-500" },
  { slug: "teknoloji", name: "Teknoloji", color: "bg-cyan-500" },
  { slug: "dunya", name: "Dünya", color: "bg-purple-500" },
];

export const Route = createFileRoute("/haber/$slug")({
  loader: async ({ params }) => {
    try {
      const [article, allArticles] = await Promise.all([
        getPublishedArticle({ data: { slug: params.slug } }),
        getPublishedArticles({ data: { limit: 10 } }),
      ]);
      const otherArticles = allArticles.filter((item) => item.slug !== params.slug);
      return { article, latest: otherArticles.slice(0, 5), related: otherArticles.slice(5, 8) };
    } catch (error) {
      console.error("[article] could not load published article", error);
      return { article: null, latest: [], related: [] };
    }
  },
  head: ({ loaderData }) => {
    const article = loaderData?.article;
    return article
      ? seoHead({
          title: pageTitle(article.title),
          description: trimDescription(article.summary),
          path: `/haber/${article.slug}`,
          type: "article",
        })
      : { meta: [{ title: pageTitle("Haber bulunamadı") }, { name: "robots", content: "noindex, follow" }] };
  },
  component: ArticlePage,
});

function articleSchema(article: LiveArticle) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: trimDescription(article.summary),
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: absoluteUrl(`/haber/${article.slug}`),
    url: absoluteUrl(`/haber/${article.slug}`),
    image: article.imageUrl ? [article.imageUrl] : undefined,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      logo: { "@type": "ImageObject", url: absoluteUrl("/mansetle-fav.png") },
    },
    isBasedOn: article.sourceUrl,
  }).replace(/</g, "\\u003c");
}

function ArticlePage() {
  const { article, latest, related } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);

  if (!article) {
    return (
      <SiteShell>
        <div className="container-buletin py-20 text-center">
          <h1 className="font-serif text-3xl font-bold text-ink">Haber bulunamadı</h1>
          <p className="mt-3 text-muted">Aradığınız haber yayından kaldırılmış veya taşınmış olabilir.</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg bg-buletin px-5 py-2.5 text-sm font-semibold text-white"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </SiteShell>
    );
  }

  const category = categoryNames[article.category] ?? article.category;
  const pageUrl = typeof window !== "undefined" ? window.location.href : absoluteUrl(`/haber/${article.slug}`);

  const copyUrl = () => {
    if (typeof navigator !== "undefined") {
      void navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <SiteShell>
      <article className="container-buletin py-8 md:py-12">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleSchema(article) }} />

        {/* Üst Kategori & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted">
          <Link to="/" className="hover:text-buletin">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link to="/kategori/$slug" params={{ slug: article.category }} className="text-buletin hover:underline">
            {category}
          </Link>
        </div>

        {/* Ana İçerik ve Yan Sidebar Grid */}
        <div className="mt-6 grid gap-10 lg:grid-cols-12">
          {/* Sol: Ana Haber İçeriği */}
          <div className="lg:col-span-8">
            <span className="inline-block rounded-md bg-buletin/10 px-2.5 py-1 text-xs font-bold text-buletin uppercase tracking-wider">
              {category}
            </span>

            <h1 className="mt-4 font-serif text-[32px] leading-[1.2] font-bold text-ink sm:text-[40px] md:text-[46px]">
              {article.title}
            </h1>

            {/* Tarih, Saat ve Okuma Süresi */}
            <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-line py-3.5 text-xs font-medium text-muted">
              <div className="flex items-center gap-1.5 text-ink">
                <Clock className="size-3.5 text-buletin" />
                <time dateTime={article.publishedAt ?? undefined}>
                  {formatFullDateTime(article.publishedAt)}
                </time>
              </div>
              <span>•</span>
              <span>{estimateReadTime(article.bodyMarkdown)}</span>
              <span>•</span>
              <span className="text-muted">{formatRelativeTime(article.publishedAt)}</span>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={copyUrl}
                  title="Bağlantıyı kopyala"
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-ink hover:border-buletin"
                >
                  {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
                  {copied ? "Kopyalandı" : "Paylaş"}
                </button>
              </div>
            </div>

            {/* Özet Giriş Paragrafı */}
            <p className="mt-6 text-lg font-medium leading-relaxed text-muted sm:text-xl">
              {article.summary}
            </p>

            {/* Kapak Görseli */}
            {article.imageUrl ? (
              <figure className="mt-7 overflow-hidden rounded-2xl border border-line bg-soft shadow-xs">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="aspect-video w-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </figure>
            ) : null}

            {/* Gövde Metni */}
            <div className="mt-8 space-y-6 text-[17px] leading-[1.85] text-ink/90">
              {article.bodyMarkdown.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index} className="break-words">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Alt Kısım: Sadece Kaynak */}
            <div className="mt-10 border-t border-line/60 pt-5">
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-buletin transition"
              >
                <span>Kaynak: {article.sourceName}</span>
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>

          {/* Sağ: Şık Yan Menü (Sidebar) */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Son Haberler Widget */}
            <div className="rounded-2xl border border-line bg-paper p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-serif text-lg font-bold text-ink">Son Haberler</h3>
                <Link to="/kategori/$slug" params={{ slug: "son-haberler" }} className="text-xs font-bold text-buletin hover:underline">
                  Tümü
                </Link>
              </div>

              <div className="mt-4 divide-y divide-line/70">
                {latest.map((item) => (
                  <Link
                    key={item.slug}
                    to="/haber/$slug"
                    params={{ slug: item.slug }}
                    className="group flex gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    {item.imageUrl ? (
                      <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-soft">
                        <img
                          src={item.imageUrl}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="size-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="grid size-16 shrink-0 place-items-center rounded-xl bg-buletin/10 text-xs font-bold text-buletin">
                        {item.category.slice(0, 3).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                        <span className="text-buletin">{categoryNames[item.category] ?? item.category}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(item.publishedAt)}</span>
                      </div>
                      <h4 className="mt-1 line-clamp-2 font-serif text-sm font-bold text-ink group-hover:text-buletin">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Kategoriler Widget - Şık ve Alt Alta 5 Kategori */}
            <div className="rounded-2xl border border-line bg-paper p-5 shadow-xs">
              <h3 className="border-b border-line pb-3 font-serif text-lg font-bold text-ink">
                Kategoriler
              </h3>
              <div className="mt-3 divide-y divide-line/60">
                {TOP_SIDEBAR_CATEGORIES.map(({ slug, name, color }) => (
                  <Link
                    key={slug}
                    to="/kategori/$slug"
                    params={{ slug }}
                    className="group flex items-center justify-between py-3 text-sm font-semibold text-ink transition hover:text-buletin"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`size-2 rounded-full ${color}`} />
                      <span>{name}</span>
                    </div>
                    <ChevronRight className="size-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-buletin" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Alt Kısım: İlginizi Çekebilir (Önerilen Haberler) */}
        {related && related.length > 0 ? (
          <div className="mt-16 border-t border-line pt-10 md:mt-20">
            <h2 className="font-serif text-2xl font-bold text-ink">İlginizi Çekebilir</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  to="/haber/$slug"
                  params={{ slug: item.slug }}
                  className="group block rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-1 hover:border-buletin/40"
                >
                  {item.imageUrl ? (
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-soft">
                      <img
                        src={item.imageUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="size-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                    <span className="text-buletin">{categoryNames[item.category] ?? item.category}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(item.publishedAt)}</span>
                  </div>
                  <h3 className="mt-2 line-clamp-2 font-serif text-base font-bold text-ink group-hover:text-buletin">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                    {item.summary}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    </SiteShell>
  );
}
