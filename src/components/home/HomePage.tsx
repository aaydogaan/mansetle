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

// 4'lü Standart Kart
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
        <span className="text-buletin font-bold">{categoryNames[article.category] ?? article.category}</span>
        <span>•</span>
        <span>{formatRelativeTime(article.publishedAt)}</span>
      </div>
      <h3 className="mt-1.5 font-serif text-[18px] leading-snug font-bold text-ink group-hover:text-buletin line-clamp-2">
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

// Sağ Sütun Kartı (Görseli üstte, Qatar/Wrexham stili)
function SideImageCard({ article }: { article: LiveArticle }) {
  return (
    <Link
      to="/haber/$slug"
      params={{ slug: article.slug }}
      className="group flex flex-col rounded-2xl border border-line bg-paper p-3.5 transition hover:border-buletin/40 shadow-2xs"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-soft">
        <ArticleImage
          article={article}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
        <span className="text-buletin font-bold">{categoryNames[article.category] ?? article.category}</span>
        <span>•</span>
        <span>{formatRelativeTime(article.publishedAt)}</span>
      </div>
      <h4 className="mt-1 line-clamp-2 font-serif text-sm sm:text-[15px] font-bold text-ink group-hover:text-buletin leading-snug">
        {article.title}
      </h4>
      <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-muted">
        <span className="text-buletin">{categoryNames[article.category] ?? article.category}</span>
        <span>•</span>
        <span>{estimateReadTime(article.bodyMarkdown)}</span>
      </div>
    </Link>
  );
}

// 3-4 Saniyede Bir Dönen Merkez Manşet Kartı (Taylor Swift stili)
function CenterRotatingCard({ articles }: { articles: LiveArticle[] }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const count = articles.length;
  const current = articles[index] ?? articles[0];

  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 3500); // 3.5 saniyede bir otomatik geçiş
    return () => clearInterval(interval);
  }, [count, isPaused]);

  if (!current) return null;

  return (
    <div
      className="relative size-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Link
        to="/haber/$slug"
        params={{ slug: current.slug }}
        className="group relative flex h-[460px] sm:h-[500px] w-full flex-col justify-end overflow-hidden rounded-3xl border border-line bg-ink p-6 sm:p-7 transition shadow-md hover:border-buletin/60"
      >
        <div className="absolute inset-0">
          <ArticleImage
            article={current}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
        </div>

        <div className="relative z-10 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/85">
            <span className="rounded bg-buletin px-2.5 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
              {categoryNames[current.category] ?? current.category}
            </span>
            <span>•</span>
            <span>{formatRelativeTime(current.publishedAt)}</span>
          </div>

          <h3 className="mt-3 font-serif text-[22px] sm:text-[26px] leading-snug font-bold text-white group-hover:text-buletin/90 line-clamp-3">
            {current.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-relaxed text-white/80">
            {current.summary}
          </p>

          <div className="mt-4 flex items-center justify-between pt-2 border-t border-white/20 text-xs font-semibold text-white/75">
            <div className="flex items-center gap-2">
              <span className="text-buletin/90 font-bold">
                {categoryNames[current.category] ?? current.category}
              </span>
              <span>•</span>
              <span>{estimateReadTime(current.bodyMarkdown)}</span>
            </div>
            <span className="inline-flex items-center gap-1 font-bold text-white group-hover:text-buletin transition">
              Oku →
            </span>
          </div>
        </div>
      </Link>

      {/* Dönen Haber İndikatör Çizgileri */}
      {count > 1 ? (
        <div className="absolute bottom-2.5 right-6 z-20 flex items-center gap-1.5">
          {articles.map((item, idx) => (
            <button
              key={item.slug}
              onClick={() => setIndex(idx)}
              aria-label={`Slayt ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === index ? "w-6 bg-buletin" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
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

  // Sayfalama ve Bölüm Paylaşımı
  // 1. Öne Çıkanlar (Must Read Asimetrik Karusel)
  const leftStory = items[0]; // Sol dikey kart (Ukrayna tankı stili)
  const centerRotatingStories = items.slice(1, 6); // Merkez dönen 3-4 sn slider (Taylor Swift stili)
  const rightStory1 = items[6]; // Sağ üst kart (Qatar stili)
  const rightStory2 = items[7]; // Sağ alt kart (Wrexham stili)

  // 2. Son Haberler (4'lü ızgara)
  const latestNews = items.slice(8, 12);

  // 3. Editörün Seçimi
  const editorsPick = items[12];
  const editorsGrid = items.slice(13, 17);

  // 4. Kategori İkilileri
  const gundemEkonomiPool = items.filter((a) =>
    ["gundem", "turkiye", "para"].includes(a.category)
  );
  const catLeft = (
    gundemEkonomiPool.length >= 2 ? gundemEkonomiPool : items.slice(17, 19)
  ).slice(0, 2);

  const sporTeknolojiPool = items.filter((a) =>
    ["spor", "teknoloji"].includes(a.category)
  );
  const catRight = (
    sporTeknolojiPool.length >= 2 ? sporTeknolojiPool : items.slice(19, 21)
  ).slice(0, 2);

  // 5. Kalan Gelişmeler
  const moreNews = items.slice(21, 33);

  return (
    <div className="pb-16 md:pb-24">
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
          {/* 1. Sitenin En Üstü: Must Read / Öne Çıkanlar Karuseli (Ekran Görüntüsü Tasarımı) */}
          <section className="container-buletin pt-6 md:pt-8">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <h2 className="font-serif text-[26px] font-bold text-ink sm:text-[32px]">
                Öne Çıkanlar
              </h2>
              <Link
                to="/kategori/$slug"
                params={{ slug: "son-haberler" }}
                className="inline-flex items-center gap-1 text-sm font-bold text-buletin hover:underline"
              >
                Tümünü gör <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 items-stretch">
              {/* Sol Sütun: Dikey Görsel & Başlık Kartı (Ukrayna Tankı Stili) */}
              {leftStory ? (
                <div className="lg:col-span-4 flex">
                  <Link
                    to="/haber/$slug"
                    params={{ slug: leftStory.slug }}
                    className="group flex flex-col justify-between rounded-3xl border border-line bg-paper p-4 sm:p-5 transition hover:border-buletin/40 shadow-xs w-full"
                  >
                    <div>
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-soft">
                        <ArticleImage
                          article={leftStory}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                        <span className="text-buletin font-bold">
                          {categoryNames[leftStory.category] ?? leftStory.category}
                        </span>
                        <span>•</span>
                        <span>{formatRelativeTime(leftStory.publishedAt)}</span>
                      </div>
                      <h3 className="mt-2 font-serif text-[20px] font-bold text-ink group-hover:text-buletin leading-snug line-clamp-3">
                        {leftStory.title}
                      </h3>
                      <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-muted">
                        {leftStory.summary}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-line/60 pt-3 text-[11px] font-semibold text-muted">
                      <span className="text-buletin font-bold">
                        {categoryNames[leftStory.category] ?? leftStory.category}
                      </span>
                      <span>•</span>
                      <span>{estimateReadTime(leftStory.bodyMarkdown)}</span>
                    </div>
                  </Link>
                </div>
              ) : null}

              {/* Merkez Sütun: 3-4 Saniyede Bir Dönen Büyük Kart (Taylor Swift Stili) */}
              <div className="lg:col-span-4 flex">
                <CenterRotatingCard articles={centerRotatingStories} />
              </div>

              {/* Sağ Sütun: 2 Adet Görseli Üstte Kart (Qatar / Wrexham Stili) */}
              <div className="space-y-4 lg:col-span-4 flex flex-col justify-between">
                {rightStory1 ? <SideImageCard article={rightStory1} /> : null}
                {rightStory2 ? <SideImageCard article={rightStory2} /> : null}
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

              {editorsGrid.length > 0 ? (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {editorsGrid.map((article) => (
                    <GridCard key={article.slug} article={article} />
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {/* 4. Kategori İkilisi (Gündem & Ekonomi vs Spor & Teknoloji) */}
          {catLeft.length > 0 || catRight.length > 0 ? (
            <section className="container-buletin mt-14 md:mt-20">
              <div className="grid gap-10 md:grid-cols-2">
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
