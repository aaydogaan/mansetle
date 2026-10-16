import { Link } from "@tanstack/react-router";
import type { Article } from "@/data/content";
import { cn, formatReadTime, formatTimeLabel } from "@/lib/utils";
import { SourceBadge } from "./SourceBadge";

type Variant = "grid" | "overlay" | "compact" | "featured";

type Props = {
  article: Article;
  variant?: Variant;
  className?: string;
  imageClass?: string;
};

export function MetaRow({ article, light = false }: { article: Article; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2 text-[12px]", light ? "text-white/85" : "text-muted")}>
      <SourceBadge sourceId={article.sourceId} size="sm" />
      <span className="font-medium">{article.source}</span>
      <span className={light ? "text-white/55" : "text-subtle"}>•</span>
      <span>{formatTimeLabel(article.timeLabel)}</span>
    </div>
  );
}

export function CategoryRead({ article, light = false }: { article: Article; light?: boolean }) {
  return (
    <p className="text-[12.5px]">
      <span className="font-medium text-buletin">{article.category}</span>
      <span className={cn("mx-1.5", light ? "text-white/50" : "text-subtle")}>•</span>
      <span className={light ? "text-white/75" : "text-muted"}>{formatReadTime(article.readTime)}</span>
    </p>
  );
}

export function ArticleCard({ article, variant = "grid", className, imageClass }: Props) {
  if (variant === "overlay") {
    return (
      <Link to="/haber/$slug" params={{ slug: article.slug }} className={cn("group block", className)}>
        <article className="relative overflow-hidden rounded-xl">
          <img
            src={article.image}
            alt=""
            className={cn("h-full w-full object-cover", imageClass ?? "min-h-[340px]")}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/5" />
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <MetaRow article={article} light />
            <h3 className="mt-2.5 font-serif font-bold text-[22px] leading-snug text-white md:text-[26px]">
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-white/80">{article.excerpt}</p>
            <div className="mt-3">
              <CategoryRead article={article} light />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to="/haber/$slug" params={{ slug: article.slug }} className={cn("group block", className)}>
        <article>
          <img
            src={article.image}
            alt=""
            className={cn("w-full rounded-xl object-cover", imageClass ?? "h-[118px]")}
          />
          <div className="mt-3">
            <MetaRow article={article} />
            <h3 className="mt-2 font-serif font-bold text-[16px] leading-snug text-ink group-hover:text-buletin">
              {article.title}
            </h3>
            <div className="mt-2">
              <CategoryRead article={article} />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link to="/haber/$slug" params={{ slug: article.slug }} className={cn("group block", className)}>
        <article className="relative overflow-hidden rounded-2xl">
          <img src={article.image} alt="" className={cn("w-full object-cover", imageClass ?? "h-[340px] md:h-[420px]")} />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <MetaRow article={article} light />
            <h3 className="mt-3 font-serif font-bold text-[26px] leading-snug text-white md:text-[34px]">{article.title}</h3>
            <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-white/85">{article.excerpt}</p>
            <div className="mt-3">
              <CategoryRead article={article} light />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link to="/haber/$slug" params={{ slug: article.slug }} className={cn("group block", className)}>
      <article>
        <img
          src={article.image}
          alt=""
          className={cn("w-full rounded-xl object-cover", imageClass ?? "aspect-4/3")}
        />
        <div className="mt-3.5">
          <MetaRow article={article} />
          <h3 className="mt-2.5 font-serif font-bold text-[18px] leading-snug text-ink group-hover:text-buletin md:text-[19px]">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-muted">{article.excerpt}</p>
          <div className="mt-3">
            <CategoryRead article={article} />
          </div>
        </div>
      </article>
    </Link>
  );
}
