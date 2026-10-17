import { Link } from "@tanstack/react-router";
import { ArrowUp } from "lucide-react";
import { footerColumns } from "@/data/content";



export function Footer() {
  const displayColumns = footerColumns.slice(0, 4);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-line/70 bg-paper/40 pt-14 pb-10 text-ink transition-colors">
      <div className="container-buletin">
        {/* Üst Alan: Logo, Slogan ve Menü Kolonları */}
        <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
          <div>
            <Link to="/" className="inline-block transition-opacity hover:opacity-90">
              <img
                src="/logos/mansetle-logo.webp"
                alt="Mansetle"
                className="h-10 sm:h-11 md:h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-[280px] font-serif text-[15px] font-semibold leading-relaxed text-ink/85">
              Bugünden ne varsa, Mansetle’de.
            </p>
            <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-muted">
              Günün en önemli gelişmelerini, analizlerini ve özel haberlerini anlık olarak takip edin.
            </p>
          </div>

          {/* Sadeleştirilmiş Kategori Izgarası (4 Kolon) */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {displayColumns.map((col) => (
              <FooterCol key={col.title} title={col.title} links={col.links} />
            ))}
          </div>
        </div>

        {/* Alt Çizgi ve Sub-Footer */}
        <div className="mt-12 border-t border-line/80 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-[13px] text-muted sm:flex-row">
            <p className="text-center sm:text-left">
              © 2026 <span className="font-semibold text-ink">Mansetle</span>. Tüm hakları saklıdır. Yayınlanan haber ve içerikler kaynak gösterilmeden alıntılanamaz.
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12px] font-medium text-ink transition-all hover:border-buletin hover:text-buletin shadow-xs"
              aria-label="Yukarı çık"
            >
              <span>Yukarı Çık</span>
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: readonly { label: string; slug: string }[] }) {
  return (
    <div>
      <h3 className="font-serif text-[15px] font-bold text-ink">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to="/kategori/$slug"
              params={{ slug: link.slug }}
              className="inline-block text-[13.5px] text-muted transition-all duration-150 hover:translate-x-1 hover:text-buletin"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
