import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import type { LiveArticle } from "@/lib/news.server";

export const Route = createFileRoute("/haber/$slug")({ component: ArticlePage });

function ArticlePage() {
  const { slug } = Route.useParams();
  const [article, setArticle] = useState<LiveArticle | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(`/api/news/${encodeURIComponent(slug)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((payload: { article?: LiveArticle } | null) => setArticle(payload?.article ?? null))
      .catch(() => setArticle(null))
      .finally(() => setReady(true));
  }, [slug]);

  return <SiteShell>{!ready ? <p className="container-buletin py-16 text-muted">Haber yükleniyor…</p> : !article ? <p className="container-buletin py-16 text-muted">Haber bulunamadı.</p> : <article className="container-buletin py-10 md:py-14"><p className="text-sm text-muted"><Link to="/" className="hover:text-buletin">Ana Sayfa</Link><span className="mx-2">/</span><Link to="/kategori/$slug" params={{ slug: article.category }} className="hover:text-buletin">{article.category}</Link></p><p className="mt-8 text-xs font-semibold text-buletin">{article.sourceName}</p><h1 className="mt-3 max-w-4xl font-serif text-[36px] leading-[1.15] font-bold text-ink md:text-[52px]">{article.title}</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">{article.summary}</p><div className="mt-10 max-w-3xl space-y-5 text-[17px] leading-[1.8] text-ink">{article.bodyMarkdown.split(/\n{2,}/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div><a className="mt-10 inline-flex text-sm font-semibold text-buletin hover:text-buletin-dark" href={article.sourceUrl} target="_blank" rel="noreferrer">Kaynağa git</a></article>}</SiteShell>;
}
