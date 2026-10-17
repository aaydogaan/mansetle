import { useEffect, useState, type ComponentProps, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Check, CheckSquare, ChevronLeft, ChevronRight, CircleCheck, ExternalLink, FileImage, FilePenLine, Filter, ImageOff, Inbox, Layers, LoaderCircle, LogOut, Pause, Play, RefreshCw, Save, Send, Sparkles, Square } from "lucide-react";

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
  const [systemActive, setSystemActive] = useState<boolean>(true);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [togglingSystem, setTogglingSystem] = useState<boolean>(false);
  const [selectedIncoming, setSelectedIncoming] = useState<number[]>([]);
  const [batchLoading, setBatchLoading] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; title: string } | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/recep/settings", { credentials: "include" });
      if (response.ok) {
        const payload = (await response.json()) as { active?: boolean };
        if (typeof payload.active === "boolean") setSystemActive(payload.active);
      }
    } catch {
      // Default to active
    }
  };

  const toggleSystem = async (nextActive: boolean) => {
    setTogglingSystem(true);
    try {
      const response = await fetch("/api/recep/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: nextActive }),
      });
      if (!response.ok) throw new Error(await responseMessage(response));
      const payload = (await response.json()) as { active: boolean };
      setSystemActive(payload.active);
      setShowPauseModal(false);
      setMessage(
        payload.active
          ? "Sistem aktifleştirildi. Kaynak çekme ve taslak üretimi açık."
          : "Sistem duraklatıldı. Kaynak çekme ve Gemini yapay zeka üretimi geçici olarak kapatıldı (0 Token modu)."
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "İşlem tamamlanamadı.");
    } finally {
      setTogglingSystem(false);
    }
  };

  const loadQueue = async (nextView = view, page = 1) => {
    setLoadingView(true);
    if (nextView !== view) {
      setSelectedIncoming([]);
    }
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

  const toggleSelect = (id: number) => {
    setSelectedIncoming((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllCurrentPage = (itemsOnPage: QueueItem[]) => {
    const ids = itemsOnPage.map((i) => i.id);
    const allSelected = ids.length > 0 && ids.every((id) => selectedIncoming.includes(id));
    if (allSelected) {
      setSelectedIncoming((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedIncoming((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const generateBatch = async () => {
    if (!systemActive) {
      setMessage("Sistem duraklatılmıştır. Yeni taslak oluşturmak için önce 'Sistemi Aç' butonuna tıklayın.");
      return;
    }
    if (selectedIncoming.length === 0) return;
    const idsToProcess = [...selectedIncoming];
    setBatchLoading(true);
    setBusy("batch-generate");
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < idsToProcess.length; i++) {
      const id = idsToProcess[i];
      const currentItem = queue?.items.find((x) => x.id === id);
      setBatchProgress({
        current: i + 1,
        total: idsToProcess.length,
        title: currentItem?.title || `#${id}`,
      });

      try {
        const response = await fetch("/api/recep/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sourceFeedItemId: id }),
        });
        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    setBatchProgress(null);
    setBatchLoading(false);
    setBusy(null);
    setSelectedIncoming([]);
    await loadQueue("incoming", queue?.pagination.page || 1);
    setMessage(
      `${successCount} haber için taslak başarıyla oluşturuldu.${
        failCount > 0 ? ` (${failCount} haber işlenemedi)` : ""
      } Dilediğiniz zaman 'Taslaklar' sekmesine geçip inceleyebilirsiniz.`
    );
  };

  useEffect(() => {
    void fetch("/api/recep/session", { credentials: "include" })
      .then((response) => response.json())
      .then((payload: { authenticated?: boolean }) => {
        const isAuth = Boolean(payload.authenticated);
        setAuthenticated(isAuth);
        if (isAuth) {
          localStorage.setItem("mansetle_admin_session", "1");
          void loadSettings();
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

  const refreshSources = () => {
    if (!systemActive) {
      setMessage("Sistem duraklatılmıştır. Kaynakları yenilemek için önce 'Sistemi Aç' butonunu kullanın.");
      return;
    }
    return run(
      "refresh",
      async () => {
        const results = await Promise.all([
          fetch("/api/source-feed/trt", { credentials: "include" }),
          fetch("/api/source-feed/aa", { credentials: "include" }),
          fetch("/api/source-feed/ntv_teknoloji", { credentials: "include" }),
        ]);
        if (results.some((response) => !response.ok)) throw new Error("Kaynaklardan biri güncellenemedi.");
        await loadQueue("incoming");
        setMessage("Kaynaklar yenilendi; yeni başlıklar Gelen Haberler bölümüne eklendi.");
      },
      "Kaynaklar güncellenemedi."
    );
  };

  const generate = (item: QueueItem) => {
    if (!systemActive) {
      setMessage("Sistem duraklatılmıştır. Yeni taslak oluşturmak için önce 'Sistemi Aç' butonuna tıklayın.");
      return;
    }
    return run(
      `generate-${item.id}`,
      async () => {
        const response = await fetch("/api/recep/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sourceFeedItemId: item.id }),
        });
        if (!response.ok) throw new Error(await responseMessage(response));
        // STAY ON INCOMING! Do not jump to drafts
        await loadQueue("incoming", queue?.pagination.page || 1);
        setMessage("Taslak oluşturuldu. Dilediğiniz zaman 'Taslaklar' sekmesine geçerek inceleyebilirsiniz.");
      },
      "Taslak oluşturulamadı."
    );
  };

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
    if (!systemActive) {
      setMessage("Sistem duraklatılmıştır. AI kapak görseli üretmek için önce 'Sistemi Aç' butonuna tıklayın.");
      return;
    }
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
      <header className="border-b border-line bg-paper sticky top-0 z-30 shadow-xs">
        <div className="container-buletin flex min-h-20 items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-buletin uppercase">Mansetle Yönetim</p>
            <h1 className="mt-1 font-serif text-2xl font-bold">Yayın masası</h1>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div
              className={`hidden sm:inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                systemActive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-700"
              }`}
            >
              <span
                className={`size-2 rounded-full ${
                  systemActive ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                }`}
              />
              {systemActive ? "Sistem: Aktif" : "Sistem: Duraklatıldı (0 Token)"}
            </div>

            {systemActive ? (
              <button
                type="button"
                onClick={() => setShowPauseModal(true)}
                disabled={togglingSystem}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition disabled:opacity-50 sm:text-sm"
                title="Sistemi duraklat ve yeni haber akışını kapat"
              >
                <Pause className="size-3.5 sm:size-4" />
                <span>Sistemi Kapat</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void toggleSystem(true)}
                disabled={togglingSystem}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50 sm:text-sm"
                title="Sistemi yeniden aktifleştir"
              >
                {togglingSystem ? <LoaderCircle className="size-3.5 sm:size-4 animate-spin" /> : <Play className="size-3.5 sm:size-4" />}
                <span>Sistemi Aç</span>
              </button>
            )}

            <button
              onClick={() => void logout()}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink pl-2 sm:pl-3 border-l border-line"
            >
              <LogOut className="size-4" /> Çıkış
            </button>
          </div>
        </div>
      </header>

      <section className="container-buletin py-5 sm:py-8 md:py-12">
        {!systemActive && (
          <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50/90 p-5 text-amber-950">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-amber-200/70 p-2 text-amber-900">
                  <Pause className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-amber-950">Sistem Duraklatıldı (0 Token Güvenli Mod)</h3>
                  <p className="mt-1 text-sm text-amber-900/90">
                    Yeni haber çekme ve Gemini yapay zeka üretimi şu an kapalıdır. Arka planda <strong>kesinlikle 0 token</strong> harcanır. Sitedeki mevcut yayınlanmış haberler yayında kalmaya devam eder.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void toggleSystem(true)}
                disabled={togglingSystem}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-sm transition"
              >
                <Play className="size-4" /> Sistemi Başlat
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col justify-between gap-5 rounded-2xl border border-line bg-paper p-4 sm:p-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-buletin uppercase">Editoryal iş akışı</p>
            <h2 className="mt-2 font-serif text-2xl font-bold">Haber merkezini yönet</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Kaynakları yenile, taslağı incele, kapağı ayarla ve yalnızca onayladığın metinleri yayına al.
            </p>
          </div>
          <ActionButton
            disabled={busy === "refresh" || !systemActive}
            onClick={() => void refreshSources()}
            className="bg-ink text-surface disabled:opacity-50"
            title={!systemActive ? "Sistem duraklatıldığı için kaynak yenileme kapalıdır" : ""}
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

          {/* Gelen Haberler İçin Filtreleme ve Toplu İşlem Çubuğu */}
          {view === "incoming" && queue && queue.items.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-paper p-3 sm:p-4">
                {/* Kaynak Filtreleri */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted mr-1">Kaynak:</span>
                  {[
                    { id: "all", label: "Tümü" },
                    { id: "ntv", label: "NTV Teknoloji" },
                    { id: "trt", label: "TRT Haber" },
                    { id: "aa", label: "Anadolu Ajansı" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSourceFilter(f.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        sourceFilter === f.id
                          ? "bg-ink text-surface shadow-xs"
                          : "border border-line bg-surface text-muted hover:text-ink hover:border-buletin/40"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Tümünü Seç Butonu */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => selectAllCurrentPage(queue.items)}
                    disabled={batchLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:border-buletin/60 transition disabled:opacity-50"
                  >
                    {queue.items.length > 0 && queue.items.every((i) => selectedIncoming.includes(i.id)) ? (
                      <>
                        <CheckSquare className="size-3.5 text-buletin" />
                        <span>Seçimi Kaldır</span>
                      </>
                    ) : (
                      <>
                        <Square className="size-3.5 text-muted" />
                        <span>Sayfadaki Tümünü Seç ({queue.items.length})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Seçilenler Varsa: Toplu Aksiyon Bannerı */}
              {selectedIncoming.length > 0 && (
                <div className="sticky top-20 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 border-buletin bg-buletin/10 p-3.5 sm:p-4 shadow-md backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-full bg-buletin text-white text-xs font-bold">
                      {selectedIncoming.length}
                    </span>
                    <span className="font-serif font-bold text-ink sm:text-base text-sm">
                      {selectedIncoming.length} adet haber seçildi
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedIncoming([])}
                      disabled={batchLoading}
                      className="rounded-lg border border-line bg-paper px-3 py-2 text-xs font-bold text-muted hover:text-ink transition disabled:opacity-50"
                    >
                      Vazgeç / Temizle
                    </button>
                    <button
                      type="button"
                      onClick={() => void generateBatch()}
                      disabled={batchLoading || !systemActive}
                      className="inline-flex items-center gap-2 rounded-lg bg-buletin px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition disabled:opacity-50"
                    >
                      {batchLoading ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                      <span>Seçilenlerden Taslak Hazırla ({selectedIncoming.length})</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Toplu İşlem Süreci İlerleme Göstergesi */}
              {batchLoading && batchProgress && (
                <div className="rounded-2xl border border-buletin/40 bg-paper p-4 shadow-sm animate-pulse">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2 text-buletin">
                      <LoaderCircle className="size-4 animate-spin" />
                      Yapay Zeka ile Taslaklar Hazırlanıyor...
                    </span>
                    <span className="text-ink">
                      {batchProgress.current} / {batchProgress.total}
                    </span>
                  </div>
                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-soft">
                    <div
                      className="h-full bg-buletin transition-all duration-300"
                      style={{
                        width: `${Math.round((batchProgress.current / batchProgress.total) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted truncate">
                    İşlenen: <strong>{batchProgress.title}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          <div className={`mt-5 grid gap-4 transition-opacity ${loadingView ? "opacity-60" : "opacity-100"}`}>
            {queue?.items
              .filter((item) => {
                if (view !== "incoming") return true;
                if (sourceFilter === "all") return true;
                if (sourceFilter === "ntv") return item.sourceName.toLowerCase().includes("ntv");
                if (sourceFilter === "trt") return item.sourceName.toLowerCase().includes("trt");
                if (sourceFilter === "aa")
                  return (
                    item.sourceName.toLowerCase().includes("anadolu") ||
                    item.sourceName.toLowerCase().includes("aa")
                  );
                return true;
              })
              .map((item) => {
                const timestamp = formatDate(item.status === "published" ? item.publishedAt : item.createdAt);
                const hasArticle = Boolean(item.articleId);
                const effectiveCover = coverUrls[item.articleId!] ?? item.coverImageUrl;
                const isSelected = selectedIncoming.includes(item.id);

                return (
                  <article
                    key={item.id}
                    className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                      isSelected
                        ? "border-buletin bg-buletin/[0.03] ring-2 ring-buletin/20"
                        : "border-line bg-paper"
                    }`}
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex items-start gap-3 sm:gap-4 max-w-3xl">
                        {/* Gelen Haberler İçin Checkbox */}
                        {view === "incoming" && (
                          <div className="pt-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(item.id)}
                              disabled={batchLoading}
                              aria-label={`${item.title} seç`}
                              className="size-4.5 rounded border-line text-buletin accent-buletin cursor-pointer focus:ring-buletin"
                            />
                          </div>
                        )}

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
                          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
                            {timestamp ? <span>{timestamp}</span> : null}
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-buletin hover:underline"
                            >
                              <span>Orijinal Kaynak</span>
                              <ExternalLink className="size-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="w-full shrink-0 md:w-auto flex items-center gap-2 justify-end">
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
                            disabled={busy === `generate-${item.id}` || batchLoading}
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

      {showPauseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-2xl">
            <div className="flex size-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
              <AlertTriangle className="size-6" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-ink">
              Sistemi Kapatmak İstiyor Musunuz?
            </h3>
            <div className="mt-3 space-y-2 text-sm text-muted">
              <p className="text-ink/90 font-medium">
                Sistemi kapattığınızda:
              </p>
              <ul className="list-inside list-disc space-y-1 text-ink/80 text-xs sm:text-sm pl-1">
                <li>RSS kaynaklarından yeni haber çekilmez.</li>
                <li>Gemini AI taslak ve kapak üretimi kilitlenir.</li>
                <li><strong>Arka planda 0 token</strong> harcanır, API sorgusu atılmaz.</li>
                <li>Mevcut yayınlanmış haberleriniz sitede görünmeye devam eder.</li>
              </ul>
              <p className="pt-2 text-xs text-muted">
                Domain bağlayana veya istediğiniz güne kadar sistemi kapalı tutabilirsiniz. Tekrar açmak için dilediğiniz an "Sistemi Aç" butonuna basmanız yeterlidir.
              </p>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowPauseModal(false)}
                disabled={togglingSystem}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-line px-4 text-sm font-semibold text-ink hover:bg-surface"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => void toggleSystem(false)}
                disabled={togglingSystem}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-bold text-white hover:bg-red-700 shadow-sm"
              >
                {togglingSystem ? <LoaderCircle className="size-4 animate-spin" /> : <Pause className="size-4" />}
                Evet, Sistemi Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
