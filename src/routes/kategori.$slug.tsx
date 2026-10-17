import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { categoryNames, pageTitle, seoHead, getArticleImageUrl, DEFAULT_CATEGORY_IMAGES } from "@/lib/site";
import { getPublishedArticles } from "@/lib/news.functions";
import { getSuperLigDataFn } from "@/lib/superlig.functions";
import { SuperLigWidget } from "@/components/home/SuperLigWidget";
import type { LiveArticle } from "@/lib/news";
import { estimateReadTime, formatRelativeTime } from "@/lib/utils";

export const Route = createFileRoute("/kategori/$slug")({
  staleTime: 60_000,
  gcTime: 300_000,
  loader: async ({ params }) => {
    const slug = params.slug;
    const title = categoryNames[slug] ?? slug.replace(/-/g, " ");
    const [articles, superLigData] = await Promise.all([
      getPublishedArticles({ data: { category: slug, limit: 36 } }),
      slug === "spor" ? getSuperLigDataFn().catch(() => null) : Promise.resolve(null),
    ]);
    return { slug, title, articles, superLigData };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.title ?? "Kategori";
    const articles = loaderData?.articles ?? [];
    const lcpArticle = articles[0];
    const lcpImageUrl = lcpArticle ? getArticleImageUrl(lcpArticle) : null;
    const seo = seoHead({
      title: pageTitle(title),
      description: `${title} kategorisindeki en güncel ve özgün Mansetle haberleri.`,
      path: `/kategori/${loaderData?.slug ?? "gundem"}`,
    });
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
  component: CategoryPage,
});

function ArticleImage({
  article,
  className,
  priority = false,
}: {
  article: LiveArticle;
  className: string;
  priority?: boolean;
}) {
  const initialUrl = getArticleImageUrl(article);
  const [src, setSrc] = useState(initialUrl);

  useEffect(() => {
    setSrc(getArticleImageUrl(article));
  }, [article.imageUrl, article.category]);

  return (
    <img
      src={src}
      alt={article.title}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      referrerPolicy="no-referrer"
      onError={() => {
        const fallback = DEFAULT_CATEGORY_IMAGES[article.category] ?? DEFAULT_CATEGORY_IMAGES.gundem;
        if (src !== fallback) {
          setSrc(fallback);
        }
      }}
    />
  );
}

// Kategori İçi Öne Çıkan Karusel
function CategoryCarousel({ articles }: { articles: LiveArticle[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const count = articles.length;
  const current = articles[index] ?? articles[0];

  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 5000);
    return () => clearInterval(interval);
  }, [count, isPaused]);

  if (!current) return null;

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + count) % count);
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % count);
  };

  return (
    <div
      className="relative mb-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Link
        to="/haber/$slug"
        params={{ slug: current.slug }}
        className="group relative block aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-line bg-ink shadow-sm transition hover:border-buletin/50"
      >
        <div className="absolute inset-0">
          <ArticleImage
            article={current}
            priority={true}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/15" />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-8 md:p-10 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <span className="rounded bg-buletin px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
              {categoryNames[current.category] ?? current.category}
            </span>
            <span>•</span>
            <span suppressHydrationWarning>{formatRelativeTime(current.publishedAt)}</span>
          </div>

          <h3 className="mt-3 max-w-3xl font-serif text-[22px] sm:text-[30px] md:text-[36px] font-bold leading-tight text-white group-hover:text-buletin/90">
            {current.title}
          </h3>

          <p className="mt-2.5 max-w-2xl line-clamp-2 text-xs sm:text-sm leading-relaxed text-white/85">
            {current.summary}
          </p>

          <div className="mt-4 flex items-center justify-between pt-2">
            <span className="text-xs font-semibold text-white/70">
              {estimateReadTime(current.bodyMarkdown)}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-white group-hover:text-buletin group-hover:translate-x-1 transition">
              Haberi oku <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>

      {/* Karusel Okları ve Noktaları */}
      {count > 1 ? (
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            {articles.map((item, idx) => (
              <button
                key={item.slug}
                onClick={() => setIndex(idx)}
                aria-label={`Slayt ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === index ? "w-8 bg-buletin" : "w-2.5 bg-line hover:bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Önceki"
              className="flex size-9 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-buletin hover:text-buletin shadow-xs"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Sonraki"
              className="flex size-9 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-buletin hover:text-buletin shadow-xs"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CategoryPage() {
  const { slug, title, articles, superLigData } = Route.useLoaderData();

  const carouselArticles = articles.slice(0, 4);
  const gridArticles = articles.length > 4 ? articles.slice(4) : articles.slice(1);

  return (
    <SiteShell>
      <div className="container-buletin py-8 md:py-12">
        {/* Başlık ve Bilgi Alanı */}
        <div className="mb-8 border-b border-line pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <Link to="/" className="hover:text-buletin transition">Anasayfa</Link>
            <span>/</span>
            <span className="text-buletin">{title}</span>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink">{title}</h1>
              <p className="mt-1.5 text-sm text-muted">
                {slug === "son-haberler"
                  ? "Gündemden en son yayınlanan tüm gelişmeler."
                  : `${title} kategorisindeki en güncel ve doğrulanmış haberler.`}
              </p>
            </div>
            {articles.length > 0 && (
              <span className="inline-flex self-start sm:self-auto rounded-full bg-soft px-3 py-1 text-xs font-bold text-muted">
                {articles.length} Haber
              </span>
            )}
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-line bg-paper p-8">
            <h2 className="font-serif text-2xl font-bold text-ink">Bu kategoride henüz haber yok</h2>
            <p className="mt-2 text-sm text-muted">
              Yeni haberler eklendikçe burada anında listelenecektir.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-buletin px-4 py-2 text-sm font-bold text-white hover:bg-buletin/90 transition"
            >
              Anasayfaya Dön
            </Link>
          </div>
        ) : (
          <>
            {/* 1. Üst Profesyonel Karusel */}
            {carouselArticles.length > 0 ? (
              <CategoryCarousel articles={carouselArticles} />
            ) : null}

            {/* Süper Lig Masası (Sadece Spor Kategorisinde) */}
            {slug === "spor" && superLigData ? (
              <div className="mb-12">
                <SuperLigWidget data={superLigData} />
              </div>
            ) : null}

            {/* 2. Kategori Haber Izgarası */}
            {gridArticles.length > 0 ? (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                    Tüm {title} Haberleri
                  </h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {gridArticles.map((article) => (
                    <Link
                      key={article.slug}
                      to="/haber/$slug"
                      params={{ slug: article.slug }}
                      className="group flex flex-col rounded-2xl border border-line bg-paper p-4 transition hover:border-buletin/40 hover:-translate-y-0.5 shadow-2xs"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-soft">
                        <ArticleImage
                          article={article}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                        <span className="text-buletin">{categoryNames[article.category] ?? article.category}</span>
                        <span>•</span>
                        <span suppressHydrationWarning>{formatRelativeTime(article.publishedAt)}</span>
                      </div>
                      <h3 className="mt-2 line-clamp-2 font-serif text-[18px] leading-snug font-bold text-ink group-hover:text-buletin">
                        {article.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted flex-1">
                        {article.summary}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-[11px] font-semibold text-muted">
                        <span>{estimateReadTime(article.bodyMarkdown)}</span>
                        <span className="font-bold text-buletin group-hover:translate-x-0.5 transition-transform">
                          Oku →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </SiteShell>
  );
}
