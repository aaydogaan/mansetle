import { useEffect, useState, type ComponentProps, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, CircleCheck, FileImage, FilePenLine, ImageOff, Inbox, LoaderCircle, LogOut, RefreshCw, Save, Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/recep")({ component: RecepPage });

type QueueView = "incoming" | "drafts" | "published";
type QueueItem = {
  id: number;
  title: string;
  url: string;
  sourceName: string;
  articleId: number | null;
  status: "draft" | "published" | null;
  articleTitle: string | null;
  articleSummary: string | null;
  articleBody: string | null;
  coverImageUrl: string | null;
  coverImageMode: "auto" | "manual" | "ai" | "none" | null;
  createdAt: string | null;
  publishedAt: string | null;
};
type QueuePayload = {
  items: QueueItem[];
  view: QueueView;
  counts: Record<QueueView, number>;
  pagination: { page: number; total: number; totalPages: number };
};

const tabs: Array<{ id: QueueView; label: string; icon: typeof Inbox; description: string }> = [
  { id: "incoming", label: "Gelen Haberler", icon: Inbox, description: "Kaynaklardan yeni gelen başlıklar" },
  { id: "drafts", label: "Taslaklar", icon: FilePenLine, description: "İnceleme bekleyen metinler" },
  { id: "published", label: "Yayınlananlar", icon: CircleCheck, description: "Sitede görünen haberler" },
];

async function responseMessage(response: Response) {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null;
  return payload?.error || "İşlem tamamlanamadı. Lütfen tekrar deneyin.";
}

function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : null;
}

function ActionButton({ children, className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold disabled:opacity-60 sm:w-auto ${className}`}
    >
      {children}
    </button>
  );
}

function RecepPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mansetle_admin_session") === "1" ? true : null;
    }
    return null;
  });
  const [password, setPassword] = useState("");
  const [queue, setQueue] = useState<QueuePayload | null>(null);
  const [cachedCounts, setCachedCounts] = useState<Record<QueueView, number> | null>(null);
  const [view, setView] = useState<QueueView>("incoming");
  const [loadingView, setLoadingView] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [savedCoverId, setSavedCoverId] = useState<number | null>(null);
  const [coverUrls, setCoverUrls] = useState<Record<number, string>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const loadQueue = async (nextView = view, page = 1) => {
    setLoadingView(true);
    try {
      const response = await fetch(`/api/recep/queue?view=${nextView}&page=${page}`, {
        credentials: "include",
      });
      if (response.status === 401) {
        setAuthenticated(false);
        localStorage.removeItem("mansetle_admin_session");
        return;
      }
      if (!response.ok) throw new Error(await responseMessage(response));
      const payload = (await response.json()) as QueuePayload;
      setQueue(payload);
      setCachedCounts(payload.counts);
      setView(payload.view);
    } finally {
      setLoadingView(false);
    }
  };

  useEffect(() => {
    void fetch("/api/recep/session", { credentials: "include" })
      .then((response) => response.json())
      .then((payload: { authenticated?: boolean }) => {
        const isAuth = Boolean(payload.authenticated);
        setAuthenticated(isAuth);
        if (isAuth) {
          localStorage.setItem("mansetle_admin_session", "1");
          return loadQueue("incoming");
        } else {
          localStorage.removeItem("mansetle_admin_session");
        }
      })
      .catch(() => {
        setAuthenticated(false);
        localStorage.removeItem("mansetle_admin_session");
      });
  }, []);

  const run = async (key: string, task: () => Promise<void>, fallback: string) => {
    setBusy(key);
    setMessage("");
    try {
      await task();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : fallback);
    } finally {
      setBusy(null);
    }
  };

  const login = async (event: FormEvent) => {
    event.preventDefault();
    await run(
      "login",
      async () => {
        const response = await fetch("/api/recep/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ password }),
        });
        if (!response.ok) throw new Error(await responseMessage(response));
        localStorage.setItem("mansetle_admin_session", "1");
        setPassword("");
        setAuthenticated(true);
        await loadQueue("incoming");
      },
      "Giriş yapılamadı."
    );
  };

  const refreshSources = () =>
    run(
      "refresh",
      async () => {
        const results = await Promise.all([
          fetch("/api/source-feed/trt", { credentials: "include" }),
          fetch("/api/source-feed/aa", { credentials: "include" }),
        ]);
        if (results.some((response) => !response.ok)) throw new Error("Kaynaklardan biri güncellenemedi.");
        await loadQueue("incoming");
        setMessage("Kaynaklar yenilendi; yeni başlıklar Gelen Haberler bölümüne eklendi.");
      },
      "Kaynaklar güncellenemedi."
    );

  const generate = (item: QueueItem) =>
    run(
      `generate-${item.id}`,
      async () => {
        const response = await fetch("/api/recep/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sourceFeedItemId: item.id }),
        });
        if (!response.ok) throw new Error(await responseMessage(response));
        await loadQueue("drafts");
        setMessage("Taslak oluşturuldu ve Taslaklar bölümüne taşındı.");
      },
      "Taslak oluşturulamadı."
    );

  const publish = (item: QueueItem) => {
    if (!item.articleId) return;
    const articleId = item.articleId;
    const enteredCover = coverUrls[articleId]?.trim();
    return run(
      `publish-${articleId}`,
      async () => {
        const response = await fetch("/api/recep/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            articleId,
            coverImageUrl: enteredCover || undefined,
          }),
        });
        if (!response.ok) throw new Error(await responseMessage(response));
        await loadQueue("published");
        setMessage("Haber başarıyla yayınlandı ve ana sayfaya eklendi.");
      },
      "Haber yayınlanamadı."
    );
  };

  const setCover = (item: QueueItem, mode: "manual" | "none" | "auto") => {
    if (!item.articleId) return;
    const articleId = item.articleId;
    let urlToSave = (coverUrls[articleId] ?? item.coverImageUrl ?? "").trim();
    if (mode === "manual") {
      if (!urlToSave) {
        setMessage("Lütfen bir görsel URL'si girin.");
        return;
      }
      if (!/^https?:\/\//i.test(urlToSave)) {
        urlToSave = `https://${urlToSave}`;
      }
    }
    return run(
      `cover-${articleId}`,
      async () => {
        const response = await fetch("/api/recep/cover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ articleId, mode, imageUrl: urlToSave }),
        });
        if (!response.ok) throw new Error(await responseMessage(response));

        // Optimistically update item in local queue state so UI updates instantly
        setQueue((current) => {
          if (!current) return current;
          return {
            ...current,
            items: current.items.map((i) =>
              i.articleId === articleId
                ? {
                    ...i,
                    coverImageMode: mode,
                    coverImageUrl: mode === "manual" ? urlToSave : mode === "none" ? null : i.coverImageUrl,
                  }
                : i
            ),
          };
        });

        // Clear local input buffer for this article
        setCoverUrls((curr) => {
          const next = { ...curr };
          delete next[articleId];
          return next;
        });

        setSavedCoverId(articleId);
        setTimeout(() => setSavedCoverId(null), 3500);

        setMessage(
          mode === "none"
            ? "Kapak görseli kaldırıldı (haber görselsiz ayarlandı)."
            : mode === "manual"
            ? (item.status === "published" ? "Yayındaki haberin kapak görseli güncellendi." : "Görsel URL'si kaydedildi.")
            : "Kaynak görseline dönüldü."
        );
      },
      "Kapak ayarlanamadı."
    );
  };

  const generateCover = (item: QueueItem) => {
    if (!item.articleId) return;
    return run(
      `ai-cover-${item.articleId}`,
      async () => {
        const response = await fetch("/api/recep/generate-cover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ articleId: item.articleId }),
        });
        if (!response.ok) throw new Error(await responseMessage(response));
        await loadQueue(view, queue?.pagination.page);
        setMessage("AI kapak oluşturuldu ve habere eklendi.");
      },
      "AI kapak oluşturulamadı."
    );
  };

  const logout = async () => {
    await fetch("/api/recep/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("mansetle_admin_session");
    setAuthenticated(false);
    setQueue(null);
    setCachedCounts(null);
  };

  if (authenticated === null) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface">
        <LoaderCircle className="size-6 animate-spin text-buletin" />
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center bg-surface px-4 py-8 text-ink">
        <form onSubmit={login} className="w-full max-w-sm rounded-2xl border border-line bg-paper p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold tracking-[0.2em] text-buletin uppercase">Mansetle Yönetim</p>
          <h1 className="mt-3 font-serif text-3xl font-bold">Yayın masası</h1>
          <p className="mt-2 text-sm text-muted">Haber taslaklarını oluşturmak ve yayınlamak için giriş yap.</p>
          <label className="mt-6 block text-sm font-semibold">Yönetici parolası</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 h-11 w-full rounded-lg border border-line bg-surface px-3 outline-none focus:border-buletin"
          />
          {message ? <p className="mt-3 text-sm text-buletin">{message}</p> : null}
          <ActionButton disabled={busy === "login"} className="mt-6 bg-buletin text-white">
            {busy === "login" ? <LoaderCircle className="size-4 animate-spin" /> : null} Giriş yap
          </ActionButton>
        </form>
      </main>
    );
  }

  const activeTab = tabs.find((tab) => tab.id === view) ?? tabs[0];

  return (
    <main className="min-h-screen bg-surface text-ink">
      <header className="border-b border-line bg-paper">
        <div className="container-buletin flex min-h-20 items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-buletin uppercase">Mansetle Yönetim</p>
            <h1 className="mt-1 font-serif text-2xl font-bold">Yayın masası</h1>
          </div>
          <button
            onClick={() => void logout()}
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
          >
            <LogOut className="size-4" /> Çıkış
          </button>
        </div>
      </header>

      <section className="container-buletin py-5 sm:py-8 md:py-12">
        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-paper p-4 sm:p-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-buletin uppercase">Editoryal iş akışı</p>
            <h2 className="mt-2 font-serif text-2xl font-bold">Haber merkezini yönet</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Kaynakları yenile, taslağı incele, kapağı ayarla ve yalnızca onayladığın metinleri yayına al.
            </p>
          </div>
          <ActionButton
            disabled={busy === "refresh"}
            onClick={() => void refreshSources()}
            className="bg-ink text-surface"
          >
            <RefreshCw className={`size-4 ${busy === "refresh" ? "animate-spin" : ""}`} /> Kaynakları yenile
          </ActionButton>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = cachedCounts ? cachedCounts[tab.id] : null;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setMessage("");
                  void loadQueue(tab.id);
                }}
                className={`min-h-28 rounded-xl border p-4 text-left transition ${
                  view === tab.id
                    ? "border-buletin bg-buletin/5 ring-1 ring-buletin/30"
                    : "border-line bg-paper hover:border-buletin/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-buletin" />
                  {count !== null ? (
                    <span className="rounded-full bg-surface px-2.5 py-1 text-sm font-bold text-ink">
                      {count}
                    </span>
                  ) : (
                    <span className="inline-block h-6 w-9 animate-pulse rounded-full bg-soft" />
                  )}
                </div>
                <p className="mt-4 font-semibold">{tab.label}</p>
                <p className="mt-1 text-xs text-muted">{tab.description}</p>
              </button>
            );
          })}
        </div>

        {message ? (
          <p className="mt-5 rounded-xl bg-soft px-4 py-3 text-sm font-medium" role="status">
            {message}
          </p>
        ) : null}

        <div className="mt-8">
          <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-serif text-2xl font-bold">{activeTab.label}</h2>
                <p className="mt-1 text-sm text-muted">{activeTab.description}</p>
              </div>
              {loadingView ? <LoaderCircle className="size-5 animate-spin text-buletin" /> : null}
            </div>
            {queue ? <span className="shrink-0 text-sm text-muted">Toplam {queue.pagination.total} kayıt</span> : null}
          </div>

          <div className={`mt-5 grid gap-4 transition-opacity ${loadingView ? "opacity-60" : "opacity-100"}`}>
            {queue?.items.map((item) => {
              const timestamp = formatDate(item.status === "published" ? item.publishedAt : item.createdAt);
              const hasArticle = Boolean(item.articleId);
              const effectiveCover = coverUrls[item.articleId!] ?? item.coverImageUrl;

              return (
                <article key={item.id} className="rounded-2xl border border-line bg-paper p-4 sm:p-5">
                  <div className="flex flex-col justify-between gap-4 md:flex-row">
                    <div className="flex gap-4 max-w-3xl">
                      {/* Küçük Liste Kapak Önizleme (Varsa) */}
                      {item.coverImageUrl && item.coverImageMode !== "none" ? (
                        <div className="hidden sm:block size-20 shrink-0 overflow-hidden rounded-xl border border-line bg-soft">
                          <img
                            src={item.coverImageUrl}
                            alt=""
                            referrerPolicy="no-referrer"
                            className="size-full object-cover"
                          />
                        </div>
                      ) : null}

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold tracking-wide text-buletin uppercase">{item.sourceName}</p>
                          {savedCoverId === item.articleId ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              <Check className="size-3" /> Kapak güncellendi
                            </span>
                          ) : null}
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 block break-words font-serif text-lg font-bold hover:text-buletin sm:text-xl"
                        >
                          {item.status ? item.articleTitle : item.title}
                        </a>
                        {timestamp ? <p className="mt-2 text-xs text-muted">{timestamp}</p> : null}
                      </div>
                    </div>

                    <div className="w-full shrink-0 md:w-auto flex items-center gap-2">
                      {item.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/15 px-3 py-1.5 text-xs font-bold text-emerald-700">
                          <Check className="size-3.5" /> Yayında
                        </span>
                      ) : hasArticle ? (
                        <ActionButton
                          disabled={busy === `publish-${item.articleId}`}
                          onClick={() => void publish(item)}
                          className="bg-buletin text-white shadow-sm hover:opacity-95"
                        >
                          {busy === `publish-${item.articleId}` ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <Send className="size-4" />
                          )}
                          Yayınla
                        </ActionButton>
                      ) : (
                        <ActionButton
                          disabled={busy === `generate-${item.id}`}
                          onClick={() => void generate(item)}
                          className="bg-ink text-surface"
                        >
                          {busy === `generate-${item.id}` ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <Sparkles className="size-4" />
                          )}
                          Taslak oluştur
                        </ActionButton>
                      )}
                    </div>
                  </div>

                  {hasArticle ? (
                    <details className="mt-5 border-t border-line pt-4">
                      <summary className="cursor-pointer text-sm font-bold text-ink hover:text-buletin">
                        {item.status === "published" ? "Kapak görselini veya metni düzenle" : "Taslağı ve kapağı incele"}
                      </summary>
                      <h3 className="mt-4 break-words font-serif text-xl font-bold">{item.articleTitle}</h3>
                      <p className="mt-2 text-sm font-medium text-muted">{item.articleSummary}</p>
                      <div className="mt-4 whitespace-pre-wrap break-words text-[15px] leading-7 text-muted">
                        {item.articleBody}
                      </div>

                      <div className="mt-6 rounded-xl border border-line bg-surface p-4 sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-ink">Kapak görseli</p>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                  item.coverImageMode === "ai"
                                    ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                                    : item.coverImageMode === "manual"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                    : item.coverImageMode === "none"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                    : "bg-soft text-muted"
                                }`}
                              >
                                {item.coverImageMode === "ai"
                                  ? "AI üretimi"
                                  : item.coverImageMode === "manual"
                                  ? "Özel URL"
                                  : item.coverImageMode === "none"
                                  ? "Görselsiz"
                                  : "Kaynak görseli"}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted">
                              {item.status === "published"
                                ? "Görsel URL'si yapıştırıp 'Kapağı Kaydet' butonuna bastığında sitedeki kapak anında güncellenir."
                                : "Görsel bağlantısı girebilir veya AI ile üretebilirsin. 'Yayınla' butonuna bastığında otomatik kaydedilir."}
                            </p>
                          </div>
                          <ActionButton
                            disabled={busy === `ai-cover-${item.articleId}`}
                            onClick={() => void generateCover(item)}
                            className="min-h-9 bg-ink px-3 text-xs text-surface"
                          >
                            {busy === `ai-cover-${item.articleId}` ? (
                              <LoaderCircle className="size-3.5 animate-spin" />
                            ) : (
                              <FileImage className="size-3.5" />
                            )}
                            AI kapak oluştur
                          </ActionButton>
                        </div>

                        {/* Canlı Görsel Önizleme */}
                        {effectiveCover && item.coverImageMode !== "none" ? (
                          <div className="relative mt-3 aspect-video max-w-sm overflow-hidden rounded-xl border border-line bg-soft shadow-xs">
                            <img
                              src={effectiveCover}
                              alt="Kapak önizleme"
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover"
                              onError={() => setImageErrors((prev) => ({ ...prev, [item.articleId!]: true }))}
                              onLoad={() => setImageErrors((prev) => ({ ...prev, [item.articleId!]: false }))}
                            />
                            {imageErrors[item.articleId!] ? (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-3 text-center text-xs font-semibold text-rose-300">
                                ⚠️ Görsel yüklenemedi. Bağlantıyı kontrol edin.
                              </div>
                            ) : null}
                          </div>
                        ) : null}

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            void setCover(item, "manual");
                          }}
                          className="mt-4 flex flex-col gap-2.5 sm:flex-row"
                        >
                          <input
                            value={coverUrls[item.articleId!] ?? item.coverImageUrl ?? ""}
                            onChange={(event) => {
                              const val = event.target.value;
                              setCoverUrls((current) => ({ ...current, [item.articleId!]: val }));
                              setImageErrors((prev) => ({ ...prev, [item.articleId!]: false }));
                            }}
                            placeholder="https://... görsel URL'si yapıştırın"
                            className="h-11 min-w-0 flex-1 rounded-lg border border-line bg-paper px-3.5 text-sm outline-none focus:border-buletin focus:ring-1 focus:ring-buletin"
                          />
                          <ActionButton
                            type="submit"
                            disabled={busy === `cover-${item.articleId}`}
                            className="min-h-11 bg-buletin text-white px-5 text-sm shadow-xs hover:opacity-95"
                          >
                            {busy === `cover-${item.articleId}` ? (
                              <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                              <Save className="size-4" />
                            )}
                            Kapağı Kaydet
                          </ActionButton>
                        </form>

                        <div className="mt-3.5 flex flex-wrap gap-2">
                          <ActionButton
                            disabled={busy === `cover-${item.articleId}`}
                            onClick={() => void setCover(item, "none")}
                            className="min-h-9 border border-line bg-paper px-3 text-xs text-muted hover:border-amber-500/50 hover:text-amber-700"
                          >
                            <ImageOff className="size-3.5" /> Görseli kaldır
                          </ActionButton>
                          <ActionButton
                            disabled={busy === `cover-${item.articleId}`}
                            onClick={() => void setCover(item, "auto")}
                            className="min-h-9 px-3 text-xs text-muted hover:text-buletin"
                          >
                            Kaynak görseline dön
                          </ActionButton>
                        </div>
                      </div>
                    </details>
                  ) : null}
                </article>
              );
            })}

            {queue && !queue.items.length && !loadingView ? (
              <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted sm:p-10">
                Bu bölümde kayıt yok.
              </p>
            ) : null}
          </div>

          {queue && queue.pagination.totalPages > 1 ? (
            <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-between">
              <button
                disabled={queue.pagination.page <= 1}
                onClick={() => void loadQueue(view, queue.pagination.page - 1)}
                className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-line px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                <ChevronLeft className="size-4" /> Önceki
              </button>
              <span className="col-span-2 order-first text-center text-sm text-muted sm:order-none sm:col-auto">
                Sayfa {queue.pagination.page} / {queue.pagination.totalPages}
              </span>
              <button
                disabled={queue.pagination.page >= queue.pagination.totalPages}
                onClick={() => void loadQueue(view, queue.pagination.page + 1)}
                className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg border border-line px-3 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Sonraki <ChevronRight className="size-4" />
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
