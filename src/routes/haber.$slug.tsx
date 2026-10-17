import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/layout/SiteShell";
import { getPublishedArticle, getPublishedArticles } from "@/lib/news.functions";
import type { LiveArticle } from "@/lib/news";
import { absoluteUrl, categoryNames, pageTitle, seoHead, site, trimDescription } from "@/lib/site";
import { estimateReadTime, formatFullDateTime, formatRelativeTime } from "@/lib/utils";

export const Route = createFileRoute("/haber/$slug")({
  loader: async ({ params }) => {
    try {
      const [article, allArticles] = await Promise.all([
        getPublishedArticle({ data: { slug: params.slug } }),
        getPublishedArticles({ data: { limit: 12 } }),
      ]);
      const otherArticles = allArticles.filter((item) => item.slug !== params.slug);
      return { article, topStories: otherArticles.slice(0, 4), related: otherArticles.slice(4, 7) };
    } catch (error) {
      console.error("[article] could not load published article", error);
      return { article: null, topStories: [], related: [] };
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
      logo: { "@type": "ImageObject", url: absoluteUrl("/logos/mansetle-logo.webp") },
    },
    isBasedOn: article.sourceUrl,
  }).replace(/</g, "\\u003c");
}

function getPhotoCredit(article: LiveArticle): string {
  if (article.imageMode === "ai") return "Mansetle / Yapay Zeka";
  const src = article.sourceName?.trim();
  if (!src) return "Mansetle";
  if (/anadolu|aa/i.test(src)) return "AA";
  if (/trt/i.test(src)) return "TRT Haber";
  return src;
}

function FacebookIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon({ className = "size-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ArticlePage() {
  const { article, topStories } = Route.useLoaderData();
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

        {/* 1. Üst Kategori & Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-muted">
          <Link to="/" className="hover:text-buletin">
            Ana Sayfa
          </Link>
          <span>/</span>
          <Link to="/kategori/$slug" params={{ slug: article.category }} className="text-buletin hover:underline">
            {category}
          </Link>
        </div>

        {/* 2. Ana Başlık */}
        <h1 className="mt-4 font-serif text-[32px] leading-[1.18] font-bold text-ink sm:text-[40px] md:text-[46px] max-w-4xl">
          {article.title}
        </h1>

        {/* 3. Mansetle Profili & Paylaşım Çubuğu (Ekran Görüntüsü Tasarımı) */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-line py-3.5 text-xs">
          {/* Sol: Mansetle Profil Avatarlı Byline */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-ink text-white font-serif font-bold text-sm shadow-2xs">
              <span className="font-bold tracking-tight text-white">M</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-muted">
              <span className="font-bold text-ink">Mansetle Editörü</span>
              <span>•</span>
              <time dateTime={article.publishedAt ?? undefined}>
                {formatFullDateTime(article.publishedAt)}
              </time>
              <span>•</span>
              <span className="font-bold text-buletin">{category}</span>
              <span>•</span>
              <span>{estimateReadTime(article.bodyMarkdown)}</span>
            </div>
          </div>

          {/* Sağ: Paylaşım Butonları (X, Facebook, Kopyala) */}
          <div className="flex items-center gap-2 text-muted">
            <span className="font-semibold text-xs text-ink/75">Paylaş:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="X'te Paylaş"
              title="X'te Paylaş"
              className="flex size-8 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-buletin hover:text-buletin shadow-2xs"
            >
              <TwitterIcon className="size-3.5" />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook'ta Paylaş"
              title="Facebook'ta Paylaş"
              className="flex size-8 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-buletin hover:text-buletin shadow-2xs"
            >
              <FacebookIcon className="size-3.5" />
            </a>
            <button
              onClick={copyUrl}
              aria-label="Bağlantıyı kopyala"
              title="Bağlantıyı kopyala"
              className="flex size-8 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-buletin hover:text-buletin shadow-2xs"
            >
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            </button>
          </div>
        </div>

        {/* 4. Ana İçerik ve Sağ Sidebar Grid */}
        <div className="mt-8 grid gap-12 lg:grid-cols-12 items-start">
          {/* Sol: Ana Haber İçeriği */}
          <div className="lg:col-span-8">
            {/* Kapak Görseli ve Fotoğraf Kaynağı */}
            {article.imageUrl ? (
              <figure className="mb-8">
                <div className="overflow-hidden rounded-2xl border border-line bg-soft shadow-xs">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="aspect-video w-full object-cover"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <figcaption className="mt-2 text-[12px] font-normal text-muted">
                  [Fotoğraf: {getPhotoCredit(article)}]
                </figcaption>
              </figure>
            ) : null}

            {/* Özet Giriş Paragrafı (Lead Paragraph) */}
            <p className="text-lg sm:text-xl font-medium leading-relaxed text-ink/90">
              {article.summary}
            </p>

            {/* Gövde Metni */}
            <div className="mt-6 space-y-6 text-[17px] leading-[1.85] text-ink/90">
              {article.bodyMarkdown.split(/\n{2,}/).map((paragraph, index) => {
                // Özel alıntı vurgusu için ilk uzun paragraftan sonra şık alıntı bloğu ekleme desteği
                if (index === 2 && paragraph.length > 80) {
                  return (
                    <blockquote
                      key={index}
                      className="my-6 border-l-4 border-buletin pl-4 font-serif text-[18px] sm:text-[19px] italic font-semibold text-ink leading-relaxed"
                    >
                      "{paragraph}"
                    </blockquote>
                  );
                }
                return (
                  <p key={index} className="break-words">
                    {paragraph}
                  </p>
                );
              })}
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

          {/* Sağ: Şık Yan Menü (Top Stories / Son Haberler - Kategoriler kaldırıldı) */}
          <aside className="space-y-6 lg:col-span-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-2xl font-bold text-ink">Son Haberler</h3>
              <Link
                to="/kategori/$slug"
                params={{ slug: "son-haberler" }}
                className="text-xs font-bold text-buletin hover:underline"
              >
                Tümü
              </Link>
            </div>

            {/* Ekran Görüntüsündeki gibi Görseli Üstte Temiz Kartlar */}
            <div className="space-y-5">
              {topStories.map((item) => (
                <Link
                  key={item.slug}
                  to="/haber/$slug"
                  params={{ slug: item.slug }}
                  className="group flex flex-col rounded-2xl border border-line bg-paper p-3.5 transition hover:border-buletin/40 shadow-2xs"
                >
                  {item.imageUrl ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-soft">
                      <img
                        src={item.imageUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                    <span className="text-buletin font-bold">
                      {categoryNames[item.category] ?? item.category}
                    </span>
                    <span>•</span>
                    <span>{formatRelativeTime(item.publishedAt)}</span>
                  </div>
                  <h4 className="mt-1 line-clamp-2 font-serif text-[15px] font-bold text-ink group-hover:text-buletin leading-snug">
                    {item.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-muted">
                    <span className="text-buletin">{categoryNames[item.category] ?? item.category}</span>
                    <span>•</span>
                    <span>{estimateReadTime(item.bodyMarkdown)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </article>
    </SiteShell>
  );
}
