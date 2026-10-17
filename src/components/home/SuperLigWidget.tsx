import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { SuperLigData } from "@/lib/superlig.server";

// Takım renkleri (Özgün kulüp kimliği)
const TEAM_COLORS: Record<string, string> = {
  Galatasaray: "bg-amber-500",
  Fenerbahçe: "bg-blue-600",
  Beşiktaş: "bg-zinc-900 dark:bg-zinc-100",
  Trabzonspor: "bg-rose-900",
  "Amed SK": "bg-emerald-600",
  "Çorum FK": "bg-red-700",
  Kocaelispor: "bg-emerald-700",
  Alanyaspor: "bg-orange-500",
  Kasımpaşa: "bg-blue-800",
  "Çaykur Rizespor": "bg-blue-700",
  Başakşehir: "bg-orange-600",
  "Gaziantep FK": "bg-red-600",
  Gençlerbirliği: "bg-red-600",
  Erzurumspor: "bg-sky-600",
  Göztepe: "bg-amber-400",
  Konyaspor: "bg-emerald-600",
  Samsunspor: "bg-red-600",
  Eyüpspor: "bg-purple-700",
};

export function SuperLigWidget({ data }: { data?: SuperLigData | null }) {
  const [activeTab, setActiveTab] = useState<"standings" | "fixtures">("standings");
  const [showAll, setShowAll] = useState(false);

  if (!data || !data.standings || data.standings.length === 0) {
    return null;
  }

  const displayedStandings = showAll ? data.standings : data.standings.slice(0, 7);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-2xs">
      {/* Üst Başlık & Sekmeler */}
      <div className="border-b border-line px-4 py-3.5 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Sol: Trendyol Logosu ve Başlık (Arka plansız, emojisiz) */}
          <div className="flex items-center gap-3">
            <img
              src="/images/trendyol-logo.webp"
              alt="Trendyol Süper Lig"
              className="h-7 sm:h-8 w-auto object-contain select-none"
            />
            <div>
              <h3 className="font-serif text-[16px] sm:text-[17px] font-bold text-ink leading-tight">
                Süper Lig
              </h3>
              <p className="text-[11px] font-medium text-muted">
                2026-2027 Sezonu • 8. Hafta
              </p>
            </div>
          </div>

          {/* Sekme Butonları (Puan Durumu & Fikstür) */}
          <div className="flex rounded-lg border border-line bg-surface p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("standings")}
              className={`rounded-md px-3 py-1 transition-all ${
                activeTab === "standings"
                  ? "bg-buletin text-white shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              Puan Durumu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fixtures")}
              className={`rounded-md px-3 py-1 transition-all ${
                activeTab === "fixtures"
                  ? "bg-buletin text-white shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              8. Hafta Fikstürü
            </button>
          </div>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="p-3 sm:p-5">
        {/* 1. Puan Durumu Sekmesi */}
        {activeTab === "standings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-line text-[11px] font-bold text-muted">
                  <th className="py-2 pl-2 w-8 text-center">#</th>
                  <th className="py-2 pl-1">Takım</th>
                  <th className="py-2 px-1 text-center w-8">O</th>
                  <th className="py-2 px-1 text-center w-8 hidden sm:table-cell">G</th>
                  <th className="py-2 px-1 text-center w-8 hidden sm:table-cell">B</th>
                  <th className="py-2 px-1 text-center w-8 hidden sm:table-cell">M</th>
                  <th className="py-2 px-1 text-center w-10">AV</th>
                  <th className="py-2 pr-2 text-right w-10 font-black text-ink">P</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {displayedStandings.map((team) => {
                  const isChampions = team.position === 1;
                  const isEurope = team.position >= 2 && team.position <= 4;
                  const isRelegation = team.position >= 16;
                  const colorClass = TEAM_COLORS[team.shortName] ?? "bg-zinc-500";

                  return (
                    <tr
                      key={team.position}
                      className="group transition-colors hover:bg-soft/50"
                    >
                      {/* Sıra Numarası */}
                      <td className="py-2 pl-2 text-center font-bold">
                        <span
                          className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                            isChampions
                              ? "bg-amber-500 text-white"
                              : isEurope
                              ? "bg-sky-500/15 text-sky-700 dark:text-sky-300"
                              : isRelegation
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                              : "text-muted"
                          }`}
                        >
                          {team.position}
                        </span>
                      </td>

                      {/* Takım Adı ve Renk İkonu */}
                      <td className="py-2 pl-1 font-semibold text-ink">
                        <div className="flex items-center gap-2 truncate max-w-[130px] sm:max-w-none">
                          <span className={`size-2 rounded-full shrink-0 ${colorClass}`} />
                          <span className="truncate">{team.shortName}</span>
                        </div>
                      </td>

                      <td className="py-2 px-1 text-center text-muted">{team.played}</td>
                      <td className="py-2 px-1 text-center text-muted hidden sm:table-cell">{team.won}</td>
                      <td className="py-2 px-1 text-center text-muted hidden sm:table-cell">{team.drawn}</td>
                      <td className="py-2 px-1 text-center text-muted hidden sm:table-cell">{team.lost}</td>
                      <td className="py-2 px-1 text-center text-muted font-medium">
                        {team.goal_difference > 0 ? `+${team.goal_difference}` : team.goal_difference}
                      </td>
                      <td className="py-2 pr-2 text-right font-black text-ink text-[13px]">
                        {team.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Genişlet / Kısalt Butonu */}
            <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-3 text-[11px] text-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-amber-500 inline-block" /> Şampiyonlar Ligi
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-rose-500 inline-block" /> Düşme Hattı
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="flex items-center gap-1 font-bold text-buletin hover:underline cursor-pointer"
              >
                {showAll ? (
                  <>
                    <span>Daha Az Göster</span>
                    <ChevronUp className="size-3.5" />
                  </>
                ) : (
                  <>
                    <span>Tüm Tabloyu Gör ({data.standings.length})</span>
                    <ChevronDown className="size-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 2. 8. Hafta Fikstürü Sekmesi */}
        {activeTab === "fixtures" && (
          <div className="space-y-2.5">
            {data.fixtures.map((match) => (
              <div
                key={match.id}
                className={`relative flex items-center justify-between rounded-xl border border-line bg-soft/40 px-3.5 py-2.5 text-xs transition-colors hover:bg-soft ${
                  match.isDerby ? "border-buletin/40 bg-buletin/5" : ""
                }`}
              >
                {/* Ev Sahibi */}
                <div className="w-[37%] font-semibold text-ink text-right truncate flex items-center justify-end gap-1.5">
                  <span className="truncate">{match.homeTeam}</span>
                  <span
                    className={`size-2 rounded-full shrink-0 ${
                      TEAM_COLORS[match.homeTeam] ?? "bg-zinc-400"
                    }`}
                  />
                </div>

                {/* Skor / Saat Alanı */}
                <div className="w-[26%] text-center shrink-0">
                  {match.status === "completed" ? (
                    <div className="inline-flex items-center gap-1">
                      <span className="rounded-md bg-paper border border-line px-2 py-0.5 font-bold font-mono text-[12px] text-ink">
                        {match.homeScore} - {match.awayScore}
                      </span>
                      <span className="text-[10px] font-semibold text-muted">MS</span>
                    </div>
                  ) : match.status === "live" ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 font-bold text-white text-[11px] animate-pulse">
                      <span>CANLI</span>
                    </span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-ink">{match.time}</span>
                      <span className="text-[10px] font-medium text-muted">{match.date}</span>
                    </div>
                  )}
                </div>

                {/* Deplasman */}
                <div className="w-[37%] font-semibold text-ink text-left truncate flex items-center gap-1.5">
                  <span
                    className={`size-2 rounded-full shrink-0 ${
                      TEAM_COLORS[match.awayTeam] ?? "bg-zinc-400"
                    }`}
                  />
                  <span className="truncate">{match.awayTeam}</span>
                </div>

                {/* Derbi Rozeti */}
                {match.isDerby && (
                  <span className="absolute -top-2 right-3 rounded bg-buletin px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider text-white shadow-2xs">
                    Derbi
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
