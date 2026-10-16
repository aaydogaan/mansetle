import type { Article } from "@/data/content";
import { ArticleCard } from "./ArticleCard";

export function ArticleList({ articles, empty }: { articles: Article[]; empty: string }) {
  if (articles.length === 0) {
    return <p className="py-16 text-center text-muted">{empty}</p>;
  }
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} />
      ))}
    </div>
  );
}

export function PageIntro({ kicker, title, body }: { kicker?: string; title: string; body?: string }) {
  return (
    <div className="mb-10">
      {kicker ? (
        <p className="text-[11px] font-semibold tracking-[0.22em] text-subtle uppercase">{kicker}</p>
      ) : null}
      <h1 className="mt-2 font-serif font-bold text-[36px] leading-tight text-ink md:text-[42px]">{title}</h1>
      {body ? <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{body}</p> : null}
    </div>
  );
}
