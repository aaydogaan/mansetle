import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
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
        <span className="text-buletin uppercase">{article.sourceName}</span>
        <span>•</span>
        <span>{formatRelativeTime(article.publishedAt)}</span>
      </div>
      <h3 className="mt-1.5 font-serif text-[18px] leading-snug font-bold text-ink group-hover:text-buletin line-clamp-2">
        {article.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">{article.summary}</p>
      <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold">
        <span className="text-buletin">{categoryNames[article.category] ?? article.category}</span>
        <span className="text-muted">•</span>
        <span className="text-muted">{estimateReadTime(article.bodyMarkdown)}</span>
      </div>
    </Link>
  );
}

// Yatay Kompakt Kart
function CompactCard({ article }: { article: LiveArticle }) {
  return (
    <Link
      to="/haber/$slug"
      params={{ slug: article.slug }}
      className="group flex gap-4 rounded-xl border border-line bg-paper p-3.5 transition hover:border-buletin/40"
    >
      <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-line bg-soft">
        <ArticleImage
          article={article}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
          <span className="text-buletin uppercase">{article.sourceName}</span>
          <span>•</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>
        <h4 className="mt-1 line-clamp-2 font-serif text-sm font-bold text-ink group-hover:text-buletin">
          {article.title}
        </h4>
        <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-muted">
          <span>{categoryNames[article.category] ?? article.category}</span>
          <span>•</span>
          <span>{estimateReadTime(article.bodyMarkdown)}</span>
        </div>
      </div>
    </Link>
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
  const hero = items[0];
  const latestNews = items.slice(1, 5); // 4 adet
  const mustRead1 = items[5]; // Dikey sol
  const mustReadHero = items[6]; // Büyük merkez overlay kart (Taylor Swift tarzı)
  const mustReadCompact1 = items[7]; // Sağ kompakt 1
  const mustReadCompact2 = items[8]; // Sağ kompakt 2
  const editorsPick = items[9]; // Geniş panoramik kart (iPhone tarzı)
  const editorsGrid = items.slice(10, 14); // Panoramik altı 4'lü
  const catLeft = items.slice(14, 16); // Gündem / Ekonomi 2'li
  const catRight = items.slice(16, 18); // Spor / Teknoloji 2'li
  const moreNews = items.slice(18, 26); // Kalan haberler

  return (
    <div className="pb-16 md:pb-24">
      {/* 1. Üst Karşılama Bandı (Welcome Banner) */}
      <section className="container-buletin pt-6 md:pt-8">
        <div className="rounded-2xl border border-line bg-paper px-6 py-7 text-center shadow-xs md:px-12 md:py-9">
          <p className="text-[11px] font-bold tracking-[0.26em] text-buletin uppercase">
            MANSETLE HABER MERKEZİ
          </p>
          <h1 className="mx-auto mt-2.5 max-w-2xl font-serif text-[26px] leading-snug font-bold text-ink sm:text-[34px] md:text-[38px]">
            Günün en önemli gelişmeleri, <span className="text-buletin">anlık ve tarafsız.</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-muted">
            Önemli başlıklar, teyitli bilgiler ve yapay zeka destekli editoryal haber deneyimi.
          </p>
        </div>
      </section>

      {/* Yüklenme / Boş Durum */}
      {loading && !hero ? (
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
      ) : !hero ? (
        <section className="container-buletin py-20 text-center">
          <h2 className="font-serif text-3xl font-bold">Haberler hazırlanıyor</h2>
          <p className="mt-3 text-muted">Yayınlanan haberler burada anında görünecek.</p>
        </section>
      ) : (
        <>
          {/* 2. Günün Manşeti (Hero Story) */}
          <section className="container-buletin mt-8 md:mt-12">
            <Link
              to="/haber/$slug"
              params={{ slug: hero.slug }}
              className="group grid items-center gap-6 rounded-3xl border border-line bg-paper p-4 transition md:grid-cols-12 md:gap-10 md:p-6 hover:border-buletin/40"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-soft md:col-span-7">
                <ArticleImage
                  article={hero}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="md:col-span-5 md:pr-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted">
                  <span className="rounded-md bg-buletin/10 px-2 py-0.5 font-bold text-buletin uppercase tracking-wider">
                    {hero.sourceName}
                  </span>
                  <span>•</span>
                  <span>{formatRelativeTime(hero.publishedAt)}</span>
                </div>
                <h2 className="mt-3.5 font-serif text-[28px] leading-[1.15] font-bold text-ink sm:text-[34px] md:text-[38px] group-hover:text-buletin">
                  {hero.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted sm:text-[15px]">
                  {hero.summary}
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="text-buletin">{categoryNames[hero.category] ?? hero.category}</span>
                    <span className="text-muted">•</span>
                    <span className="text-muted">{estimateReadTime(hero.bodyMarkdown)}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-buletin group-hover:translate-x-1 transition-transform">
                    Haberi oku <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            </Link>
          </section>

          {/* 3. Son Haberler (Latest News - 4'lü Izgara) */}
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
                  params={{ slug: "gundem" }}
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

          {/* 4. Öne Çıkanlar (Must Read - 3 Kolonlu Asimetrik Bölüm) */}
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
                  params={{ slug: "gundem" }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-buletin hover:underline"
                >
                  Tümünü gör <ChevronRight className="size-3.5" />
                </Link>
              </div>

              <div className="grid gap-6 lg:grid-cols-12">
                {/* 1. Sütun: Dikey Kart */}
                {mustRead1 ? (
                  <div className="lg:col-span-4">
                    <Link
                      to="/haber/$slug"
                      params={{ slug: mustRead1.slug }}
                      className="group flex flex-col h-full rounded-2xl border border-line bg-paper p-4 transition hover:border-buletin/40"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-line bg-soft">
                        <ArticleImage
                          article={mustRead1}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                        <span className="text-buletin uppercase">{mustRead1.sourceName}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(mustRead1.publishedAt)}</span>
                      </div>
                      <h3 className="mt-2 font-serif text-lg font-bold text-ink group-hover:text-buletin line-clamp-3">
                        {mustRead1.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted flex-1">
                        {mustRead1.summary}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold pt-3 border-t border-line/60">
                        <span className="text-buletin">
                          {categoryNames[mustRead1.category] ?? mustRead1.category}
                        </span>
                        <span className="text-muted">•</span>
                        <span className="text-muted">{estimateReadTime(mustRead1.bodyMarkdown)}</span>
                      </div>
                    </Link>
                  </div>
                ) : null}

                {/* 2. Sütun (Merkez Manşet): BÜYÜK Dikey Overlay Kart */}
                <div className="lg:col-span-5">
                  <Link
                    to="/haber/$slug"
                    params={{ slug: mustReadHero.slug }}
                    className="group relative flex h-[420px] sm:h-[480px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-line bg-ink p-6 transition shadow-sm hover:border-buletin/50"
                  >
                    <div className="absolute inset-0">
                      <ArticleImage
                        article={mustReadHero}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
                    </div>

                    <div className="relative z-10 text-white">
                      <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
                        <span className="rounded bg-buletin px-2 py-0.5 text-[11px] font-bold text-white uppercase">
                          {mustReadHero.sourceName}
                        </span>
                        <span>•</span>
                        <span>{formatRelativeTime(mustReadHero.publishedAt)}</span>
                      </div>
                      <h3 className="mt-3 font-serif text-[22px] leading-snug font-bold text-white group-hover:text-buletin/90 sm:text-[26px]">
                        {mustReadHero.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/80">
                        {mustReadHero.summary}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white/70">
                        <span>{categoryNames[mustReadHero.category] ?? mustReadHero.category}</span>
                        <span>•</span>
                        <span>{estimateReadTime(mustReadHero.bodyMarkdown)}</span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* 3. Sütun: 2 Adet Kompakt Kart */}
                <div className="space-y-4 lg:col-span-3">
                  {mustReadCompact1 ? <CompactCard article={mustReadCompact1} /> : null}
                  {mustReadCompact2 ? <CompactCard article={mustReadCompact2} /> : null}
                </div>
              </div>
            </section>
          ) : null}

          {/* 5. Editörün Seçimi (Editor's Pick - Panoramik Kart + 4'lü Izgara) */}
          {editorsPick ? (
            <section className="container-buletin mt-14 md:mt-20">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-buletin" />
                    <h2 className="font-serif text-[24px] font-bold text-ink sm:text-[28px]">
                      Editörün Seçimi
                    </h2>
                  </div>
                  <p className="text-xs text-muted">Özel dosya ve analizler</p>
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
                      {editorsPick.sourceName}
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
                    <span>{categoryNames[editorsPick.category] ?? editorsPick.category}</span>
                    <span>•</span>
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

          {/* 6. Kategori İkilisi (Gündem & Ekonomi vs Spor & Teknoloji) */}
          {catLeft.length > 0 || catRight.length > 0 ? (
            <section className="container-buletin mt-14 md:mt-20">
              <div className="grid gap-10 md:grid-cols-2">
                {/* Sol Kategori */}
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

                {/* Sağ Kategori */}
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

          {/* 7. Daha Fazla Haber (Varsa) */}
          {moreNews.length > 0 ? (
            <section className="container-buletin mt-14 md:mt-20">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <h2 className="font-serif text-2xl font-bold text-ink">Tüm Gelişmeler</h2>
                <Link to="/kategori/$slug" params={{ slug: "gundem" }} className="text-xs font-bold text-buletin">
                  Arşiv →
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
