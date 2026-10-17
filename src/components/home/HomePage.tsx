import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { LiveArticle } from "@/lib/news";
import { categoryNames } from "@/lib/site";
import { estimateReadTime, formatRelativeTime } from "@/lib/utils";

function ArticleImage({ article, className }: { article: LiveArticle; className: string }) {
  if (!article.imageUrl) {
    return (
      <div
        className={`${className} grid place-items-center bg-gradient-to-br from-buletin/90 via-buletin to-ink p-6 text-center font-serif text-2xl font-bold text-white`}
      >
        <span>{categoryNames[article.category] ?? "Mansetle"}</span>
      </div>
    );
  }
  return (
    <img
      src={article.imageUrl}
      alt={article.title}
      className={className}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  );
}

// 4'lü Standart Kart (Kaynak ajans adı kaldırıldı, sade ve şık)
function GridCard({ article }: { article: LiveArticle }) {
  return (
    <Link to="/haber/$slug" params={{ slug: article.slug }} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-soft">
        <ArticleImage
          article={article}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
        <span className="text-buletin">{categoryNames[article.category] ?? article.category}</span>
        <span>•</span>
        <span>{formatRelativeTime(article.publishedAt)}</span>
      </div>
      <h3 className="mt-1.5 font-serif text-[18px] leading-snug font-bold text-ink group-hover:text-buletin line-clamp-2">
        {article.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{article.summary}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-muted">
        <span>{estimateReadTime(article.bodyMarkdown)}</span>
      </div>
    </Link>
  );
}

// Yatay Kompakt Kart (Kaynak ajans adı kaldırıldı)
function CompactCard({ article }: { article: LiveArticle }) {
  return (
    <Link
      to="/haber/$slug"
      params={{ slug: article.slug }}
      className="group flex gap-3.5 rounded-xl border border-line bg-paper p-3 transition hover:border-buletin/40 shadow-2xs"
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-line bg-soft">
        <ArticleImage
          article={article}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
          <span className="text-buletin">{categoryNames[article.category] ?? article.category}</span>
          <span>•</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>
        <h4 className="mt-1 line-clamp-2 font-serif text-sm font-bold text-ink group-hover:text-buletin">
          {article.title}
        </h4>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] font-semibold text-muted">
          <span>{estimateReadTime(article.bodyMarkdown)}</span>
        </div>
      </div>
    </Link>
  );
}

// Dikey Overlay Kart (Görsel üstü karartmalı tam zemin kart)
function OverlayCard({ article, className = "" }: { article: LiveArticle; className?: string }) {
  return (
    <Link
      to="/haber/$slug"
      params={{ slug: article.slug }}
      className={`group relative flex h-[430px] sm:h-[480px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-line bg-ink p-6 transition shadow-sm hover:border-buletin/50 ${className}`}
    >
      <div className="absolute inset-0">
        <ArticleImage
          article={article}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
      </div>

      <div className="relative z-10 text-white">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
          <span className="rounded bg-buletin px-2 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
            {categoryNames[article.category] ?? article.category}
          </span>
          <span>•</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>
        <h3 className="mt-3 font-serif text-[20px] sm:text-[23px] leading-snug font-bold text-white group-hover:text-buletin/90 line-clamp-3">
          {article.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/80">
          {article.summary}
        </p>
        <div className="mt-3.5 flex items-center gap-2 text-xs font-semibold text-white/70">
          <span>{estimateReadTime(article.bodyMarkdown)}</span>
        </div>
      </div>
    </Link>
  );
}

// Manşet Slider (Kayan haber karuseli)
function HeroSlider({ articles }: { articles: LiveArticle[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const count = articles.length;
  const current = articles[index] ?? articles[0];

  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 5500);
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
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Link
        to="/haber/$slug"
        params={{ slug: current.slug }}
        className="group grid items-center gap-6 rounded-3xl border border-line bg-paper p-4 transition md:grid-cols-12 md:gap-10 md:p-6 hover:border-buletin/40 shadow-xs"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-soft md:col-span-7">
          <ArticleImage
            article={current}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="md:col-span-5 md:pr-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <span className="rounded-md bg-buletin/10 px-2 py-0.5 font-bold text-buletin uppercase tracking-wider">
              {categoryNames[current.category] ?? current.category}
            </span>
            <span>•</span>
            <span>{formatRelativeTime(current.publishedAt)}</span>
          </div>
          <h2 className="mt-3.5 font-serif text-[26px] leading-[1.18] font-bold text-ink sm:text-[32px] md:text-[36px] group-hover:text-buletin line-clamp-3">
            {current.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted sm:text-[15px]">
            {current.summary}
          </p>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted">
              <span>{estimateReadTime(current.bodyMarkdown)}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-buletin group-hover:translate-x-1 transition-transform">
              Haberi oku <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>

      {/* Slider Kontrolleri (Oklar ve İndikatör Çubukları) */}
      {count > 1 ? (
        <div className="mt-4 flex items-center justify-between px-2">
          {/* Çizgi / Nokta İndikatörleri */}
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

          {/* İleri / Geri Butonları */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Önceki haber"
              className="flex size-9 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-buletin hover:text-buletin shadow-xs"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Sonraki haber"
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

export function HomePage({ articles: initialArticles }: { articles: LiveArticle[] }) {
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

  // Sayfalama & Bölüm Paylaşımı
  const sliderArticles = items.slice(0, 5); // Üst slider için ilk 5 haber
  const latestNews = items.slice(1, 5); // Son Haberler 4'lü
  const mustRead1 = items[5]; // Öne Çıkanlar Sol (Overlay)
  const mustReadHero = items[6]; // Öne Çıkanlar Merkez (Overlay)
  const mustReadCompact1 = items[7]; // Öne Çıkanlar Sağ 1
  const mustReadCompact2 = items[8]; // Öne Çıkanlar Sağ 2
  const mustReadCompact3 = items[9]; // Öne Çıkanlar Sağ 3 (İstendi: 2 yerine 3 haber)
  const editorsPick = items[10]; // Editörün Seçimi Panoramik Kart
  const editorsGrid = items.slice(11, 15); // Panoramik altı 4'lü

  // Gündem & Ekonomi Filtresi
  const gundemEkonomiPool = items.filter((a) =>
    ["gundem", "turkiye", "para"].includes(a.category)
  );
  const catLeft = (
    gundemEkonomiPool.length >= 2 ? gundemEkonomiPool : items.slice(15, 17)
  ).slice(0, 2);

  // Spor & Teknoloji Filtresi
  const sporTeknolojiPool = items.filter((a) =>
    ["spor", "teknoloji"].includes(a.category)
  );
  const catRight = (
    sporTeknolojiPool.length >= 2 ? sporTeknolojiPool : items.slice(17, 19)
  ).slice(0, 2);

  const moreNews = items.slice(15, 27); // Kalan gelişmeler

  return (
    <div className="pb-16 md:pb-24">
      {/* Yüklenme / Boş Durum */}
      {loading && items.length === 0 ? (
        <section className="container-buletin py-16">
          <div className="grid items-center gap-7 md:grid-cols-2 md:gap-10">
            <div className="aspect-[4/3] w-full animate-pulse rounded-2xl bg-soft" />
            <div className="space-y-4">
              <div className="h-4 w-28 animate-pulse rounded bg-soft" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-soft" />
              <div className="h-16 w-3/4 animate-pulse rounded-lg bg-soft" />
            </div>
          </div>
        </section>
      ) : items.length === 0 ? (
        <section className="container-buletin py-20 text-center">
          <h2 className="font-serif text-3xl font-bold">Haberler hazırlanıyor</h2>
          <p className="mt-3 text-muted">Yayınlanan haberler burada anında görünecek.</p>
        </section>
      ) : (
        <>
          {/* 1. Üst Manşet Slider (Kayan Tekli Haber) */}
          <section className="container-buletin pt-6 md:pt-8">
            <HeroSlider articles={sliderArticles} />
          </section>

          {/* 2. Son Haberler (Latest News - 4'lü Izgara) */}
          {latestNews.length > 0 ? (
            <section className="container-buletin mt-14 md:mt-18">
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

          {/* 3. Öne Çıkanlar (Sol Overlay, Merkez Overlay, Sağ 3 Kompakt) */}
          {mustReadHero ? (
            <section className="container-buletin mt-14 md:mt-20">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <div>
                  <h2 className="font-serif text-[24px] font-bold text-ink sm:text-[28px]">
                    Öne Çıkanlar
                  </h2>
                  <p className="text-xs text-muted">Günün en çok konuşulan gelişmeleri</p>
                </div>
                <Link
                  to="/kategori/$slug"
                  params={{ slug: "son-haberler" }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-buletin hover:underline"
                >
                  Tümünü gör <ChevronRight className="size-3.5" />
                </Link>
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                {/* 1. Sütun (Sol Kart): Enerji Bakanı gibi OVERLAY KART */}
                {mustRead1 ? (
                  <div className="lg:col-span-4">
                    <OverlayCard article={mustRead1} />
                  </div>
                ) : null}

                {/* 2. Sütun (Merkez Kart): OVERLAY KART */}
                <div className="lg:col-span-4">
                  <OverlayCard article={mustReadHero} />
                </div>

                {/* 3. Sütun (Sağ Kartlar): 3 Adet Kompakt Kart */}
                <div className="space-y-3.5 lg:col-span-4 flex flex-col justify-between">
                  {mustReadCompact1 ? <CompactCard article={mustReadCompact1} /> : null}
                  {mustReadCompact2 ? <CompactCard article={mustReadCompact2} /> : null}
                  {mustReadCompact3 ? <CompactCard article={mustReadCompact3} /> : null}
                </div>
              </div>
            </section>
          ) : null}

          {/* 4. Editörün Seçimi (Emoji ve alt metin kaldırıldı) */}
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

              {/* Geniş Panoramik Kart */}
              <Link
                to="/haber/$slug"
                params={{ slug: editorsPick.slug }}
                className="group relative block aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-line bg-ink shadow-sm hover:border-buletin/50"
              >
                <div className="absolute inset-0">
                  <ArticleImage
                    article={editorsPick}
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                  <h3 className="mt-3 max-w-3xl font-serif text-[22px] leading-tight font-bold text-white group-hover:text-buletin/90 sm:text-[30px] md:text-[36px]">
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

              {/* Panoramik Altındaki 4'lü Izgara */}
              {editorsGrid.length > 0 ? (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {editorsGrid.map((article) => (
                    <GridCard key={article.slug} article={article} />
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {/* 5. Kategori İkilisi (Gündem & Ekonomi vs Spor & Teknoloji) */}
          {catLeft.length > 0 || catRight.length > 0 ? (
            <section className="container-buletin mt-14 md:mt-20">
              <div className="grid gap-10 md:grid-cols-2">
                {/* Sol Kategori: Gündem & Ekonomi */}
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

                {/* Sağ Kategori: Spor & Teknoloji */}
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
              </div>
            </section>
          ) : null}

          {/* 6. Tüm Gelişmeler (Arşiv linki son-haberler olarak düzeltildi) */}
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
