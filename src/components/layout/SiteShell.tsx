import type { ReactNode } from "react";
import { ArrowUp } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({ children, showNewsletter: _showNewsletter = false }: { children: ReactNode; showNewsletter?: boolean }) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header />
      <main>{children}</main>
      <Footer />
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo(0, 0)}
        className="fixed right-5 bottom-5 z-40 inline-flex size-11 items-center justify-center rounded-full bg-surface text-buletin shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:bg-paper"
      >
        <ArrowUp className="size-5" strokeWidth={2.2} />
      </button>
    </div>
  );
}
