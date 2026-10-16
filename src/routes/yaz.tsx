import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/layout/SiteShell";
import { PageIntro } from "@/components/news/ArticleList";

type Draft = {
  id: string;
  title: string;
  category: string;
  body: string;
  savedAt: string;
};

const KEY = "mansetle-drafts";

export const Route = createFileRoute("/yaz")({ component: WritePage });

function WritePage() {
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Gündem");
  const [body, setBody] = useState("");
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const item: Draft = {
      id: `draft-${Date.now()}`,
      title: title.trim(),
      category,
      body: body.trim(),
      savedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const next = [item, ...drafts];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore storage write errors
    }
    setDrafts(next);
    setTitle("");
    setBody("");
    setSaved(true);
  };

  return (
    <SiteShell>
      <div className="container-buletin py-10 md:py-14">
        <PageIntro
          kicker="Yazı İşleri"
          title="Yeni Haber / Taslak Yaz"
          body="Taslaklarınız bu cihazda güvenle saklanır. İstediğiniz an düzenleyebilir veya yayınlayabilirsiniz."
        />
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Manşet Başlığı"
              className="h-14 w-full border-b border-line bg-transparent font-serif font-bold text-[28px] outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 rounded-lg border border-line bg-surface px-3 text-[14px]"
            >
              {["Gündem", "Türkiye", "Dünya", "Para", "Spor", "Teknoloji", "Kültür", "Yaşam", "Eğlence"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Giriş paragrafı ve haberin detayları..."
              rows={14}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed outline-none"
            />
            <button type="submit" className="h-12 rounded-lg bg-buletin px-6 text-[14px] font-semibold text-white hover:bg-buletin-dark">
              Taslağı Kaydet
            </button>
            {saved ? <p className="text-sm text-muted">Taslak bu cihaza kaydedildi.</p> : null}
          </form>
          <aside>
            <h2 className="font-serif font-bold text-2xl">Taslaklarınız</h2>
            <div className="mt-4 space-y-3">
              {drafts.length === 0 ? <p className="text-sm text-muted">Henüz kaydedilmiş taslak yok.</p> : null}
              {drafts.map((d) => (
                <article key={d.id} className="rounded-xl border border-line p-4">
                  <p className="text-[12px] text-buletin font-medium">{d.category}</p>
                  <h3 className="mt-1 font-serif font-bold text-[18px] leading-snug">{d.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[13px] text-muted">{d.body}</p>
                  <p className="mt-2 text-[11px] text-subtle">{d.savedAt}</p>
                </article>
              ))}
            </div>
            <p className="mt-6 text-[13px] text-muted">
              Gündeme göz atmak mı istiyorsunuz?{" "}
              <Link to="/hikayeler" className="text-buletin font-medium">
                Masaları İnceleyin
              </Link>
              .
            </p>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}
