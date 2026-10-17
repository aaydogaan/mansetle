import { useEffect, useState } from "react";
import { ExternalLink, LoaderCircle } from "lucide-react";

type FeedItem = { title: string; url: string; publishedAt: string | null };
type SourceFeed = { source: string; items: FeedItem[]; error?: string };

const sources = [
  { id: "trt", name: "TRT Haber", url: "https://www.trthaber.com/" },
  { id: "aa", name: "Anadolu Ajansı", url: "https://www.aa.com.tr/" },
  { id: "ntv_teknoloji", name: "NTV Teknoloji", url: "https://www.ntv.com.tr/teknoloji" },
] as const;

export function SourceFeeds() {
  const [feeds, setFeeds] = useState<SourceFeed[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all(
      sources.map(async (source) => {
        try {
          const response = await fetch(`/api/source-feed/${source.id}`);
          const payload = (await response.json()) as SourceFeed;
          return response.ok
            ? payload
            : { source: source.name, items: [], error: payload.error ?? "Akış alınamadı." };
        } catch {
          return { source: source.name, items: [], error: "Akış alınamadı." };
        }
      }),
    ).then((nextFeeds) => {
      if (active) setFeeds(nextFeeds);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="container-buletin mt-16 md:mt-20">
      <div className="rounded-banner border border-line bg-paper px-6 py-7 md:px-9">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-buletin uppercase">
          Canlı gündem
        </p>
        <h2 className="mt-2 font-serif text-[28px] leading-none font-bold text-ink md:text-[32px]">
          Son Haberler
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Seçili kaynaklardan gelen güncel başlıklar kayda alınır. Yayın metinleri editör
          onayından sonra oluşturulur.
        </p>
        {!feeds.length ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted">
            <LoaderCircle className="size-4 animate-spin" /> Akışlar yükleniyor…
          </div>
        ) : null}
        <div className="mt-7 grid gap-7 lg:grid-cols-2">
          {feeds.map((feed) => {
            const source = sources.find((item) => item.name === feed.source);
            return (
              <div key={feed.source} className="rounded-card border border-line bg-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-serif text-xl font-bold text-ink">{feed.source}</h3>
                  {source ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-buletin hover:text-buletin-dark"
                    >
                      Kaynağa git <ExternalLink className="size-3.5" />
                    </a>
                  ) : null}
                </div>
                {feed.error ? <p className="mt-5 text-sm text-muted">{feed.error}</p> : null}
                {feed.items.length ? (
                  <ol className="mt-4 divide-y divide-line border-y border-line">
                    {feed.items.map((item) => (
                      <li key={item.url} className="py-3">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-start justify-between gap-3"
                        >
                          <span className="font-serif text-[16px] leading-snug font-semibold text-ink group-hover:text-buletin">
                            {item.title}
                          </span>
                          <ExternalLink className="mt-1 size-3.5 shrink-0 text-muted group-hover:text-buletin" />
                        </a>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
