import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageIntro } from "@/components/news/ArticleList";
import { articlesByCreator, creators } from "@/data/content";

export const Route = createFileRoute("/yazarlar/")({ component: CreatorsPage });

function CreatorsPage() {
  return (
    <SiteShell>
      <div className="container-buletin py-10 md:py-14">
        <PageIntro
          kicker="Yazarlar"
          title="Haberin ve Analizin Arkasındaki İsimler"
          body="Muhabirler, analistler ve köşe yazarları — manşetlerin ötesindeki uzman bakış açılarını keşfedin."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => {
            const count = articlesByCreator(creator.slug).length;
            return (
              <Link
                key={creator.slug}
                to="/yazar/$slug"
                params={{ slug: creator.slug }}
                className="rounded-2xl border border-line p-5 hover:border-ink transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img src={creator.avatar} alt="" className="size-16 rounded-full object-cover" />
                  <div>
                    <p className="text-[16px] font-semibold">{creator.name}</p>
                    <p className="text-[13px] text-muted">{creator.outlet}</p>
                    <p className="mt-1 text-[12px] text-subtle">{count} yazı</p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-muted">{creator.bio}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </SiteShell>
  );
}
