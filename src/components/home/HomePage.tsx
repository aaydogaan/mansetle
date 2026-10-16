import { LiveNews } from "@/components/news/LiveNews";
import { SourceFeeds } from "./SourceFeeds";

export function HomePage() {
  return (
    <div>
      <section className="container-buletin pt-6 md:pt-8">
        <div className="rounded-banner bg-paper px-6 py-9 text-center md:px-12 md:py-12">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-buletin uppercase">Bağımsız haber akışı</p>
          <h1 className="mx-auto mt-3 max-w-[760px] font-serif text-[30px] leading-snug font-bold text-ink md:text-[42px]">Günün önemli gelişmeleri, Mansetle’de.</h1>
        </div>
      </section>
      <section className="container-buletin mt-14 md:mt-16">
        <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-[11px] font-semibold tracking-[0.22em] text-buletin uppercase">Yayın akışı</p><h2 className="mt-2 font-serif text-[32px] font-bold text-ink">Son Haberler</h2></div></div>
        <LiveNews limit={18} />
      </section>
      <SourceFeeds />
    </div>
  );
}
