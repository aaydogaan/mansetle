import { useState, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { navLinks } from "@/data/content";
import { useTheme } from "@/store/theme";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isDark, toggleTheme, mounted } = useTheme();

  const [todayFormatted, setTodayFormatted] = useState("");
  useEffect(() => {
    try {
      setTodayFormatted(
        new Intl.DateTimeFormat("tr-TR", {
          day: "numeric",
          month: "long",
          weekday: "long",
        }).format(new Date())
      );
    } catch {
      setTodayFormatted("Bugün");
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-surface/95 backdrop-blur-md transition-colors">
      <div className="container-buletin flex h-[76px] items-center justify-between gap-4 lg:gap-8">
        {/* Sol Alan: Logo & Tarih */}
        <div className="flex shrink-0 items-center gap-3.5">
          <Link to="/" preload="intent" className="flex items-center transition-opacity hover:opacity-90">
            <img
              src="/logos/mansetle-logo.webp"
              alt="Mansetle"
              className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-all"
            />
          </Link>
          {todayFormatted ? (
            <div className="hidden xl:flex flex-col border-l border-line/70 pl-3 text-[11px] leading-tight text-muted select-none">
              <span className="font-semibold text-ink/85">{todayFormatted}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] mt-0.5">
                <span className="size-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" /> Canlı Yayın
              </span>
            </div>
          ) : null}
        </div>

        {/* Orta Alan: Tam Ortalı Kategoriler */}
        <nav className="hidden flex-1 items-center justify-center gap-3.5 text-[14px] font-medium text-ink md:flex lg:gap-5.5 xl:gap-6.5">
          {navLinks.map((link) => {
            const active = pathname === `/kategori/${link.slug}`;
            return (
              <Link
                key={link.slug}
                to="/kategori/$slug"
                params={{ slug: link.slug }}
                preload="intent"
                className={cn(
                  "whitespace-nowrap py-1 transition-colors hover:text-buletin",
                  active ? "border-b-2 border-buletin font-bold text-buletin" : "text-ink/80 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sağ Alan: Tema Butonu, Kaydedilenler ve Profil */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Karanlık / Aydınlık Mod Toggle Butonu */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Aydınlık moda geç" : "Karanlık moda geç"}
            title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
            className="inline-flex size-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper hover:text-buletin"
          >
            {mounted ? (
              isDark ? (
                <Sun className="size-[19px] text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="size-[19px] transition-transform duration-200 hover:-rotate-12" />
              )
            ) : (
              <span className="size-[19px]" />
            )}
          </button>

          <button
            type="button"
            className="ml-1 inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-paper md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      {open ? (
        <div className="border-t border-line bg-surface md:hidden">
          <nav className="container-buletin flex flex-col gap-1 py-4">
            <div className="mb-2 flex items-center justify-between border-b border-line px-3 pb-3">
              <span className="text-[13px] font-medium text-muted">Tema Tercihi</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1.5 text-[13px] font-medium text-ink"
              >
                {isDark ? (
                  <>
                    <Sun className="size-4 text-amber-400" />
                    <span>Aydınlık Mod</span>
                  </>
                ) : (
                  <>
                    <Moon className="size-4" />
                    <span>Karanlık Mod</span>
                  </>
                )}
              </button>
            </div>

            {navLinks.map((link) => {
              const active = pathname === `/kategori/${link.slug}`;
              return (
                <Link
                  key={link.slug}
                  to="/kategori/$slug"
                  params={{ slug: link.slug }}
                  preload="intent"
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors",
                    active ? "bg-buletin/10 font-semibold text-buletin" : "text-ink hover:bg-paper"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
