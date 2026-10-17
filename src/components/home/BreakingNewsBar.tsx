import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import type { LiveArticle } from "@/lib/news";

function formatNewsTime(dateString: string | null): string {
  if (!dateString) return "Yeni";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Yeni";
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function BreakingNewsBar({ articles }: { articles: LiveArticle[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Take the 8 latest articles for the ticker
  const tickerItems = articles.slice(0, 10);
  const count = tickerItems.length;

  useEffect(() => {
    if (count <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, 4500); // 4.5 seconds per headline
    return () => clearInterval(interval);
  }, [count, isPaused]);

  if (count === 0) return null;

  const current = tickerItems[currentIndex] ?? tickerItems[0];
  const timeFormatted = formatNewsTime(current.publishedAt);

  return (
    <div
      className="container-buletin pt-3 pb-1"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative flex items-center overflow-hidden rounded-xl border border-line bg-soft/75 dark:bg-card/60 shadow-2xs backdrop-blur-xs transition-colors">
        {/* Sol Kırmızı Rozet: SON HABERLER */}
        <div className="flex shrink-0 items-center gap-1.5 bg-buletin px-3 sm:px-4 py-2 sm:py-2.5 text-white shadow-xs select-none">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-white" />
          </span>
          <span className="font-sans text-[11px] sm:text-[12px] font-black tracking-wider uppercase text-white whitespace-nowrap">
            SON HABERLER
          </span>
          <Flame className="size-3.5 text-white/90 hidden sm:inline-block" />
        </div>

        {/* Ticker / Haber Akışı */}
        <div className="relative flex-1 overflow-hidden px-2 sm:px-4 py-2 text-[13px] sm:text-[14px]">
          {/* Masaüstü: Tekil döngüsel haber */}
          <Link
            to="/haber/$slug"
            params={{ slug: current.slug }}
            className="group hidden sm:flex items-center gap-2.5 overflow-hidden transition-opacity hover:opacity-90"
          >
            <span className="shrink-0 font-mono text-[12px] font-bold text-buletin">
              {timeFormatted}
            </span>
            <span className="shrink-0 text-muted">•</span>
            <span className="truncate font-medium text-ink group-hover:text-buletin transition-colors">
              {current.title}
            </span>
          </Link>

          {/* Mobil: Sürekli kayan akıcı bant (Marquee) */}
          <div className="sm:hidden relative overflow-hidden flex items-center">
            <div className="flex whitespace-nowrap animate-marquee-ticker">
              {tickerItems.concat(tickerItems).map((item, idx) => (
                <Link
                  key={`${item.slug}-${idx}`}
                  to="/haber/$slug"
                  params={{ slug: item.slug }}
                  className="inline-flex items-center gap-2 pr-6 text-[12px] text-ink transition-colors hover:text-buletin"
                >
                  <span className="font-mono font-bold text-buletin text-[11px]">
                    {formatNewsTime(item.publishedAt)}
                  </span>
                  <span className="font-medium text-ink">{item.title}</span>
                  <span className="text-muted/50 font-normal">/</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ Alan: Önceki / Sonraki Butonları & Tümü Butonu */}
        <div className="flex shrink-0 items-center gap-1 pr-2.5">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + count) % count)}
            aria-label="Önceki haber"
            title="Önceki haber"
            className="hidden sm:inline-flex size-7 items-center justify-center rounded-full text-muted transition hover:bg-paper hover:text-ink"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % count)}
            aria-label="Sonraki haber"
            title="Sonraki haber"
            className="hidden sm:inline-flex size-7 items-center justify-center rounded-full text-muted transition hover:bg-paper hover:text-ink"
          >
            <ChevronRight className="size-4" />
          </button>

          <Link
            to="/kategori/$slug"
            params={{ slug: "son-haberler" }}
            className="ml-1 rounded-md px-2 py-1 text-[11px] sm:text-[12px] font-bold text-buletin transition hover:bg-buletin/10 whitespace-nowrap"
          >
            Tümü
          </Link>
        </div>
      </div>
    </div>
  );
}
