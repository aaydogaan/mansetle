import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { LiveArticle } from "@/lib/news";

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
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link key={article.slug} to="/haber/$slug" params={{ slug: article.slug }} className="group rounded-card border border-line bg-surface p-5 transition hover:-translate-y-0.5 hover:border-buletin/40">
          <p className="text-xs font-semibold text-buletin">{article.category}</p>
          <h2 className="mt-3 font-serif text-[23px] leading-snug font-bold text-ink group-hover:text-buletin">{article.title}</h2>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{article.summary}</p>
          <p className="mt-5 text-xs text-muted">{article.sourceName}</p>
        </Link>
      ))}
    </div>
  );
}
