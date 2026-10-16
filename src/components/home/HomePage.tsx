import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { creators, getArticle, homepage, sources, storyOrder } from "@/data/content";
import { ArticleCard, CategoryRead, MetaRow } from "@/components/news/ArticleCard";
import { SectionHeader } from "@/components/news/SectionHeader";
import { SourceBadge } from "@/components/news/SourceBadge";
import { SourceFeeds } from "./SourceFeeds";

function must(slug: string) {
  const article = getArticle(slug);
  if (!article) throw new Error(`Missing article ${slug}`);
  return article;
}

export function HomePage() {
  const hero = must(homepage.hero);
  const latest = homepage.latest.map(must);
  const mustLeft = must(homepage.mustReadLeft);
  const mustCenter = must(homepage.mustReadCenter);
  const mustRight = homepage.mustReadRight.map(must);
  const editorsHero = must(homepage.editorsHero);
  const editorsGrid = homepage.editorsGrid.map(must);
  const business = homepage.business.map(must);
  const sport = homepage.sport.map(must);
  const topCreators = homepage.creators.map((slug) => creators.find((c) => c.slug === slug)!);

  return (
    <div>
      <section className="container-buletin pt-6 md:pt-8">
        <div className="rounded-[28px] bg-paper px-6 py-8 text-center md:px-12 md:py-10">
          <h1 className="mx-auto max-w-[760px] font-serif font-bold text-[26px] leading-snug text-ink md:text-[34px]">
            Mansetle, günün önemli gelişmelerini sade ve hızlı bir akışta buluşturur.
          </h1>
        </div>
      </section>

      <section className="container-buletin mt-10 md:mt-14">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <Link to="/haber/$slug" params={{ slug: hero.slug }} className="block">
            <img
              src={hero.image}
              alt=""
              className="aspect-4/3 w-full rounded-2xl object-cover object-[center_15%] md:aspect-16/10"
            />
          </Link>
          <div>
            <MetaRow article={hero} />
            <Link to="/haber/$slug" params={{ slug: hero.slug }}>
              <h2 className="mt-4 font-serif font-bold text-[34px] leading-[1.15] text-ink hover:text-buletin md:text-[44px]">
                {hero.title}
              </h2>
            </Link>
            <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">{hero.excerpt}</p>
            <div className="mt-5">
              <CategoryRead article={hero} />
            </div>
          </div>
        </div>
      </section>

      <SourceFeeds />


      <section className="container-buletin mt-16 md:mt-20">
        <SectionHeader title="Son Haberler" href="/kategori/$slug" params={{ slug: "gundem" }} />
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="container-buletin mt-16 md:mt-20">
        <SectionHeader title="Öne Çıkanlar" href="/hikayeler" />
        <div className="flex gap-5 overflow-x-auto pb-2 md:grid md:grid-cols-10 md:gap-3 md:overflow-visible">
          {storyOrder.map((id) => {
            const source = sources[id];
            return (
              <Link
                key={id}
                to="/hikayeler"
                search={{ source: id }}
                className="flex w-[76px] shrink-0 flex-col items-center gap-2 md:w-auto"
              >
                <span
                  className="inline-flex rounded-full p-[3px]"
                  style={{ boxShadow: `0 0 0 2px ${source.color}` }}
                >
                  <SourceBadge sourceId={id} size="lg" />
                </span>
                <span className="max-w-[76px] truncate text-center text-[11px] text-muted">{source.handle}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-buletin mt-16 md:mt-20">
        <SectionHeader title="Mutlaka Okuyun" href="/kategori/$slug" params={{ slug: "turkiye" }} />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <ArticleCard article={mustLeft} imageClass="aspect-4/3" />
          </div>
          <div className="lg:col-span-6">
            <ArticleCard article={mustCenter} variant="overlay" imageClass="min-h-[420px] h-full object-cover object-[center_20%]" />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-3">
            {mustRight.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="compact" imageClass="h-[132px]" />
            ))}
          </div>
        </div>
      </section>

      <section className="container-buletin mt-16 md:mt-20">
        <SectionHeader title="Editörün Seçtikleri" href="/kategori/$slug" params={{ slug: "dunya" }} />
        <ArticleCard article={editorsHero} variant="featured" imageClass="h-[300px] md:h-[420px] object-[center_40%]" />
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {editorsGrid.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="container-buletin mt-16 md:mt-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SplitHead title="Ekonomi" slug="para" />
            <div className="grid gap-6 sm:grid-cols-2">
              {business.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
          <div>
            <SplitHead title="Spor" slug="spor" />
            <div className="grid gap-6 sm:grid-cols-2">
              {sport.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-buletin mt-16 mb-4 md:mt-20">
        <SectionHeader title="Öne Çıkan Yazarlar" to="/yazarlar" />
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {topCreators.map((creator) => (
            <Link key={creator.slug} to="/yazar/$slug" params={{ slug: creator.slug }} className="flex items-center gap-3">
              <img src={creator.avatar} alt="" className="size-14 rounded-full object-cover" />
              <div>
                <p className="text-[15px] font-semibold text-ink">{creator.name}</p>
                <p className="text-[13px] text-muted">{creator.outlet}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function SplitHead({ title, slug }: { title: string; slug: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="font-serif font-bold text-[28px] leading-none text-ink md:text-[32px]">{title}</h2>
      <Link
        to="/kategori/$slug"
        params={{ slug }}
        aria-label={`Tüm ${title} haberlerini gör`}
        className="text-buletin hover:text-buletin-dark"
      >
        <ArrowRight className="size-5" />
      </Link>
    </div>
  );
}
