import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { ArticleList, PageIntro } from "@/components/news/ArticleList";
import { SourceBadge } from "@/components/news/SourceBadge";
import { articles, articlesBySource, sources, storyOrder } from "@/data/content";
import { cn } from "@/lib/utils";

type StoriesSearch = { source?: string };

export const Route = createFileRoute("/hikayeler")({
  validateSearch: (search: Record<string, unknown>): StoriesSearch => ({
    source: typeof search.source === "string" ? search.source : undefined,
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const { source } = Route.useSearch();
  const active = source && sources[source] ? source : undefined;
  const list = active ? articlesBySource(active) : articles;

  return (
    <SiteShell>
      <div className="container-buletin py-10 md:py-14">
        <PageIntro
          kicker="Hikayeler"
          title="Tüm Masalardan Haberler"
          body="Yayıncılar ve yazarlardan derlenen tüm haberleri tek bir akışta inceleyin — spor, kültür, ekonomi ve günün özeti."
        />
        <div className="mb-10 flex gap-4 overflow-x-auto pb-2">
          <FilterChip href="/hikayeler" active={!active} label="Tümü" />
          {storyOrder.map((id) => (
            <FilterChip
              key={id}
              href={`/hikayeler?source=${id}`}
              active={active === id}
              label={sources[id].handle}
              sourceId={id}
            />
          ))}
        </div>
        <ArticleList articles={list} empty="Bu kaynakta henüz yayınlanmış bir haber bulunmuyor." />
      </div>
    </SiteShell>
  );
}

function FilterChip({
  href,
  active,
  label,
  sourceId,
}: {
  href: string;
  active: boolean;
  label: string;
  sourceId?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[13px]",
        active ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink hover:border-ink",
      )}
    >
      {sourceId ? <SourceBadge sourceId={sourceId} size="sm" /> : null}
      {label}
    </a>
  );
}
