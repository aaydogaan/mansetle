import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { LiveArticle } from "@/lib/news";
import { categoryNames } from "@/lib/site";
import { estimateReadTime, formatRelativeTime } from "@/lib/utils";

export function LiveNews({ category, limit = 24 }: { category?: string; limit?: number }) {
  const [articles, setArticles] = useState<LiveArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams({ limit: String(limit) });
    if (category) query.set("category", category);
    fetch(`/api/news?${query}`)
      .then((response) => response.json())
      .then((payload: { articles?: LiveArticle[] }) => setArticles(payload.articles ?? []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [category, limit]);

  if (loading) return <p className="py-14 text-center text-muted">Haberler yükleniyor…</p>;
  if (!articles.length) return <p className="py-14 text-center text-muted">Henüz yayınlanmış haber yok.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link
          key={article.slug}
          to="/haber/$slug"
          params={{ slug: article.slug }}
          className="group flex flex-col rounded-2xl border border-line bg-paper p-4 transition hover:border-buletin/40 hover:-translate-y-0.5 shadow-2xs"
        >
          {article.imageUrl ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-soft">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="grid aspect-[16/10] w-full place-items-center rounded-xl bg-gradient-to-br from-buletin/90 via-buletin to-ink p-6 text-center font-serif text-xl font-bold text-white">
              <span>{categoryNames[article.category] ?? "Mansetle"}</span>
            </div>
          )}
          <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <span className="text-buletin">{categoryNames[article.category] ?? article.category}</span>
            <span>•</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
          <h2 className="mt-2 line-clamp-2 font-serif text-[18px] leading-snug font-bold text-ink group-hover:text-buletin">
            {article.title}
          </h2>
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
  );
}
