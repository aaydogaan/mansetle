import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { LiveArticle } from "@/lib/news";
import { categoryNames, getArticleImageUrl, DEFAULT_CATEGORY_IMAGES } from "@/lib/site";
import { estimateReadTime, formatRelativeTime } from "@/lib/utils";
import { BreakingNewsBar } from "./BreakingNewsBar";
import { SuperLigWidget } from "./SuperLigWidget";
import type { SuperLigData } from "@/lib/superlig.server";

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

// 4'lü Standart Kart (Alttaki bölümler için)
function GridCard({ article }: { article: LiveArticle }) {
  return (
    <Link to="/haber/$slug" params={{ slug: article.slug }} className="block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-soft">
        <ArticleImage
          article={article}
          className="size-full object-cover"
        />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
        <span className="text-buletin font-bold">{categoryNames[article.category] ?? article.category}</span>
        <span>•</span>
        <span>{formatRelativeTime(article.publishedAt)}</span>
      </div>
      <h3 className="mt-1.5 font-serif text-[18px] leading-snug font-bold text-ink line-clamp-2">
        {article.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{article.summary}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-muted">
        <span className="text-buletin">{categoryNames[article.category] ?? article.category}</span>
        <span>•</span>
        <span>{estimateReadTime(article.bodyMarkdown)}</span>
      </div>
    </Link>
  );
}

// Yan Sütun Haber Kartı (Hem sol hem sağ için 2'şer adet)
function SideStoryItem({ article }: { article: LiveArticle }) {
  return (
    <Link
      to="/haber/$slug"
      params={{ slug: article.slug }}
      className="block w-full"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-soft">
        <ArticleImage
          article={article}
          priority={true}
          className="size-full object-cover"
        />
      </div>
      <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-muted">
        <span className="size-2 rounded-full bg-buletin inline-block shrink-0" />
        <span className="text-ink font-bold">
          {categoryNames[article.category] ?? article.category}
        </span>
        <span>•</span>
        <span>{formatRelativeTime(article.publishedAt)}</span>
      </div>
      <h4 className="mt-1 font-serif text-[16px] sm:text-[17px] font-bold text-ink leading-snug line-clamp-2">
        {article.title}
      </h4>
      <div className="mt-2 text-xs font-semibold text-muted">
        <span className="text-buletin font-bold">
          {categoryNames[article.category] ?? article.category}
        </span>
        <span>•</span>
        <span>{estimateReadTime(article.bodyMarkdown)}</span>
      </div>
    </Link>
  );
}

// 5 Saniyede Bir Dönen Genişletilmiş Merkez Manşet Kartı (Taylor Swift stili + Dot göstergesi)
function CenterRotatingCard({ articles }: { articles: LiveArticle[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const count = articles.length;
  const current = articles[index] ?? articles[0];

  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 5000); // 5 saniyede bir otomatik geçiş
    return () => clearInterval(interval);
  }, [count, isPaused]);

  if (!current) return null;

  return (
    <div
      className="relative size-full flex flex-col"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Link
        to="/haber/$slug"
        params={{ slug: current.slug }}
        className="relative flex h-[500px] sm:h-[530px] w-full flex-col justify-end overflow-hidden rounded-3xl bg-ink p-7 sm:p-8 text-white shadow-sm"
      >
        <div className="absolute inset-0">
          <ArticleImage
            article={current}
            priority={true}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
        </div>

        <div className="relative z-10 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
            <span className="size-2 rounded-full bg-buletin inline-block shrink-0" />
            <span className="font-bold text-white uppercase tracking-wider">
              {categoryNames[current.category] ?? current.category}
            </span>
            <span>•</span>
            <span>{formatRelativeTime(current.publishedAt)}</span>
          </div>

          <h3 className="mt-3 font-serif text-[24px] sm:text-[30px] leading-snug font-bold text-white line-clamp-3">
            {current.title}
          </h3>

          <p className="mt-2.5 text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-3 max-w-2xl">
            {current.summary}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/70">
            <span className="text-buletin font-bold">
              {categoryNames[current.category] ?? current.category}
            </span>
            <span>•</span>
            <span>{estimateReadTime(current.bodyMarkdown)}</span>
          </div>
        </div>
      </Link>

      {/* 5 Saniye Dots (Alttaki gösterge noktaları) */}
      {count > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2 py-1">
          {articles.map((item, idx) => (
            <button
              key={item.slug}
              onClick={() => setIndex(idx)}
              aria-label={`Slayt ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === index ? "w-8 bg-buletin" : "w-2.5 bg-line hover:bg-muted"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HomePage({
  articles: initialArticles,
  superLigData,
}: {
  articles: LiveArticle[];
  superLigData?: SuperLigData | null;
}) {
  const [items, setItems] = useState<LiveArticle[]>(initialArticles ?? []);
  const [loading, setLoading] = useState<boolean>(!initialArticles || initialArticles.length === 0);

  useEffect(() => {
    if (!initialArticles || initialArticles.length === 0) {
      setLoading(true);
      fetch("/api/news?limit=36")
        .then((res) => res.json())
        .then((data: { articles?: LiveArticle[] }) => {
          if (data.articles && data.articles.length > 0) {
            setItems(data.articles);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setItems(initialArticles);
      setLoading(false);
    }
  }, [initialArticles]);

  // Sayfalama ve Bölüm Paylaşımı
  // 1. Öne Çıkanlar (Sol 2 Haber + Orta Geniş 5s Dönen + Sağ 2 Haber)
  const leftStory1 = items[0];
  const leftStory2 = items[1];
  const centerRotatingStories = items.slice(2, 7); // 5 haber, 5 saniyede bir döner
  const rightStory1 = items[7];
  const rightStory2 = items[8];

  // 2. Son Haberler (4'lü ızgara)
  const latestNews = items.slice(9, 13);

  // 3. Editörün Seçimi
  const editorsPick = items[13];
  const editorsGrid = items.slice(14, 18);

  // 4. Kategori İkilileri
  const gundemEkonomiPool = items.filter((a) =>
    ["gundem", "turkiye", "para"].includes(a.category)
  );
  const catLeft = (
    gundemEkonomiPool.length >= 2 ? gundemEkonomiPool : items.slice(18, 20)
  ).slice(0, 2);

  const sporTeknolojiPool = items.filter((a) =>
    ["spor", "teknoloji"].includes(a.category)
  );
  const catRight = (
    sporTeknolojiPool.length >= 2 ? sporTeknolojiPool : items.slice(20, 22)
  ).slice(0, 2);

  // 5. Kalan Gelişmeler
  const moreNews = items.slice(22, 34);

  return (
    <div className="pb-16 md:pb-24">
      {/* 0. Son Haberler Ticker Bandı (Haber Vibe Veren Canlı Akış) */}
      <BreakingNewsBar articles={items} />

      {/* Yüklenme / Boş Durum */}
      {loading && items.length === 0 ? (
        <section className="container-buletin py-16">
          <div className="grid items-center gap-7 md:grid-cols-3 md:gap-8">
            <div className="h-[480px] w-full animate-pulse rounded-3xl bg-soft" />
            <div className="h-[480px] w-full animate-pulse rounded-3xl bg-soft" />
            <div className="h-[480px] w-full animate-pulse rounded-3xl bg-soft" />
          </div>
        </section>
      ) : items.length === 0 ? (
        <section className="container-buletin py-20 text-center">
          <h2 className="font-serif text-3xl font-bold">Haberler hazırlanıyor</h2>
          <p className="mt-3 text-muted">Yayınlanan haberler burada anında görünecek.</p>
        </section>
      ) : (
        <>
          {/* 1. Sitenin En Üstü: Must Read / Öne Çıkanlar (Sol 2 Haber + Orta Geniş 5s Dönen + Sağ 2 Haber) */}
          <section className="container-buletin pt-6 md:pt-8">
            <div className="mb-7 flex items-center justify-between">
              <h2 className="font-serif text-[28px] font-bold text-ink sm:text-[34px]">
                Öne Çıkanlar
              </h2>
              <Link
                to="/kategori/$slug"
                params={{ slug: "son-haberler" }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-buletin hover:underline"
              >
                <span>Tümünü gör</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-7 lg:grid-cols-12 items-start">
              {/* Sol Sütun: 2 Adet Haber (Görsel üstte, kutusuz/çerçevesiz zemin üstünde) */}
              <div className="space-y-7 lg:col-span-3">
                {leftStory1 ? <SideStoryItem article={leftStory1} /> : null}
                {leftStory2 ? <SideStoryItem article={leftStory2} /> : null}
              </div>

              {/* Merkez Sütun: Yatay Olarak Genişleyen 5 Saniyede Bir Dönen Manşet (lg:col-span-6) */}
              <div className="lg:col-span-6">
                <CenterRotatingCard articles={centerRotatingStories} />
              </div>

              {/* Sağ Sütun: 2 Adet Haber (Görsel üstte, kutusuz/çerçevesiz zemin üstünde) */}
              <div className="space-y-7 lg:col-span-3">
                {rightStory1 ? <SideStoryItem article={rightStory1} /> : null}
                {rightStory2 ? <SideStoryItem article={rightStory2} /> : null}
              </div>
            </div>
          </section>

          {/* 2. Son Haberler (4'lü Izgara) */}
          {latestNews.length > 0 ? (
            <section className="container-buletin mt-14 md:mt-20">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h2 className="font-serif text-[24px] font-bold text-ink sm:text-[28px]">
                    Son Haberler
                  </h2>
                  <p className="text-xs text-muted">Gündemden en taze başlıklar</p>
                </div>
                <Link
                  to="/kategori/$slug"
                  params={{ slug: "son-haberler" }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-buletin hover:underline"
                >
                  Tümünü gör <ChevronRight className="size-3.5" />
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {latestNews.map((article) => (
                  <GridCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          ) : null}

          {/* 3. Editörün Seçimi (Panoramik Kart + 4'lü Izgara) */}
          {editorsPick ? (
            <section className="container-buletin mt-14 md:mt-20">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h2 className="font-serif text-[24px] font-bold text-ink sm:text-[28px]">
                    Editörün Seçimi
                  </h2>
                </div>
                <Link
                  to="/kategori/$slug"
                  params={{ slug: "teknoloji" }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-buletin hover:underline"
                >
                  Tümünü gör <ChevronRight className="size-3.5" />
                </Link>
              </div>

              <Link
                to="/haber/$slug"
                params={{ slug: editorsPick.slug }}
                className="relative block aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-line bg-ink shadow-sm"
              >
                <div className="absolute inset-0">
                  <ArticleImage
                    article={editorsPick}
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 md:p-10 text-white z-10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
                    <span className="rounded bg-buletin px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                      {categoryNames[editorsPick.category] ?? editorsPick.category}
                    </span>
                    <span>•</span>
                    <span>{formatRelativeTime(editorsPick.publishedAt)}</span>
                  </div>
                  <h3 className="mt-3 max-w-3xl font-serif text-[22px] leading-tight font-bold text-white sm:text-[30px] md:text-[36px]">
                    {editorsPick.title}
                  </h3>
                  <p className="mt-2.5 max-w-2xl line-clamp-2 text-xs sm:text-sm leading-relaxed text-white/85">
                    {editorsPick.summary}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/70">
                    <span>{estimateReadTime(editorsPick.bodyMarkdown)}</span>
                  </div>
                </div>
              </Link>

              {editorsGrid.length > 0 ? (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {editorsGrid.map((article) => (
                    <GridCard key={article.slug} article={article} />
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {/* 4. Haberler ve Trendyol Süper Lig Masası */}
          <section className="container-buletin mt-14 md:mt-20">
            <div className="grid gap-10 lg:grid-cols-12 items-start">
              {/* Sol Sütun: Gündem & Spor Haberleri (7 Kolon) */}
              <div className="lg:col-span-7 space-y-12">
                {catLeft.length > 0 && (
                  <div>
                    <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
                      <h3 className="font-serif text-xl font-bold text-ink">Gündem & Ekonomi</h3>
                      <Link
                        to="/kategori/$slug"
                        params={{ slug: "para" }}
                        className="text-xs font-bold text-buletin hover:underline"
                      >
                        Tümü →
                      </Link>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {catLeft.map((article) => (
                        <GridCard key={article.slug} article={article} />
                      ))}
                    </div>
                  </div>
                )}

                {catRight.length > 0 && (
                  <div>
                    <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
                      <h3 className="font-serif text-xl font-bold text-ink">Spor & Teknoloji</h3>
                      <Link
                        to="/kategori/$slug"
                        params={{ slug: "spor" }}
                        className="text-xs font-bold text-buletin hover:underline"
                      >
                        Tümü →
                      </Link>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      {catRight.map((article) => (
                        <GridCard key={article.slug} article={article} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sağ Sütun: Trendyol Süper Lig Puan Durumu & Fikstür Widget (5 Kolon) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24">
                <SuperLigWidget data={superLigData} />
              </div>
            </div>
          </section>

          {/* 5. Tüm Gelişmeler */}
          {moreNews.length > 0 ? (
            <section className="container-buletin mt-14 md:mt-20">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <h2 className="font-serif text-2xl font-bold text-ink">Tüm Gelişmeler</h2>
                <Link
                  to="/kategori/$slug"
                  params={{ slug: "son-haberler" }}
                  className="text-xs font-bold text-buletin hover:underline"
                >
                  Tümünü Gör →
                </Link>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {moreNews.map((article) => (
                  <GridCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
