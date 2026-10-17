import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { SuperLigData } from "@/lib/superlig.server";

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
      <div className="border-b border-line px-4 py-3 sm:px-5 bg-surface/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-sans text-[13px] sm:text-[14px] font-black uppercase tracking-wider text-ink">
              TRENDYOL SÜPER LİG
            </h3>
            <p className="text-[11px] font-medium text-muted">
              {data.season} Sezonu • {data.currentWeek}. Hafta
            </p>
          </div>

          {/* Sekme Butonları (Puan Durumu & Fikstür) */}
          <div className="flex rounded-lg border border-line bg-paper p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("standings")}
              className={`rounded-md px-3 py-1 transition-all ${
                activeTab === "standings"
                  ? "bg-buletin text-white shadow-2xs font-bold"
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
                  ? "bg-buletin text-white shadow-2xs font-bold"
                  : "text-muted hover:text-ink"
              }`}
            >
              {data.currentWeek}. Hafta Fikstürü
            </button>
          </div>
        </div>
      </div>

      {/* İçerik Alanı */}
      <div className="p-2.5 sm:p-4">
        {/* 1. Puan Durumu Sekmesi */}
        {activeTab === "standings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-soft/80 text-[11px] font-bold text-muted border-b border-line">
                  <th className="py-2 pl-3 w-8 text-center">#</th>
                  <th className="py-2 pl-2">TAKIM</th>
                  <th className="py-2 px-1 text-center w-7">O</th>
                  <th className="py-2 px-1 text-center w-7 hidden sm:table-cell">G</th>
                  <th className="py-2 px-1 text-center w-7 hidden sm:table-cell">B</th>
                  <th className="py-2 px-1 text-center w-7 hidden sm:table-cell">M</th>
                  <th className="py-2 px-1 text-center w-7 hidden md:table-cell">A</th>
                  <th className="py-2 px-1 text-center w-7 hidden md:table-cell">Y</th>
                  <th className="py-2 px-1 text-center w-8">AV</th>
                  <th className="py-2 pr-3 text-center w-8 font-black text-ink">P</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {displayedStandings.map((team) => {
                  return (
                    <tr
                      key={team.position}
                      className="group transition-colors hover:bg-soft/50"
                    >
                      {/* Sıra & Trend Oku */}
                      <td className="py-2 pl-2 text-center text-xs font-semibold text-muted">
                        <div className="flex items-center justify-center gap-1">
                          <span>{team.position}</span>
                          {team.trend === "up" ? (
                            <span className="text-[8px] text-emerald-600 font-bold leading-none">▲</span>
                          ) : team.trend === "down" ? (
                            <span className="text-[8px] text-rose-600 font-bold leading-none">▼</span>
                          ) : null}
                        </div>
                      </td>

                      {/* Takım Adı (Sade, logosuz, net tipografi) */}
                      <td className="py-2 pl-2 font-medium text-ink">
                        <span className="truncate text-xs font-semibold text-ink">
                          {team.shortName}
                        </span>
                      </td>

                      <td className="py-2 px-1 text-center text-muted">{team.played}</td>
                      <td className="py-2 px-1 text-center text-muted hidden sm:table-cell">{team.won}</td>
                      <td className="py-2 px-1 text-center text-muted hidden sm:table-cell">{team.drawn}</td>
                      <td className="py-2 px-1 text-center text-muted hidden sm:table-cell">{team.lost}</td>
                      <td className="py-2 px-1 text-center text-muted hidden md:table-cell">{team.goals_for}</td>
                      <td className="py-2 px-1 text-center text-muted hidden md:table-cell">{team.goals_against}</td>
                      <td className="py-2 px-1 text-center text-muted font-medium">
                        {team.goal_difference}
                      </td>
                      <td className="py-2 pr-3 text-center font-black text-ink text-[13px]">
                        {team.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Genişlet / Kısalt Butonu (İnce, zarif) */}
            <div className="mt-3 flex items-center justify-center border-t border-line/60 pt-2.5 px-2">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-normal text-muted hover:text-ink transition-colors cursor-pointer py-1 px-3 rounded-md hover:bg-soft"
              >
                {showAll ? (
                  <>
                    <span>Daha az göster</span>
                    <ChevronUp className="size-3.5" />
                  </>
                ) : (
                  <>
                    <span>Tüm tabloyu gör ({data.standings.length})</span>
                    <ChevronDown className="size-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* 2. 8. Hafta Fikstürü Sekmesi */}
        {activeTab === "fixtures" && (
          <div className="space-y-2">
            {data.fixtures.map((match) => {
              return (
                <div
                  key={match.id}
                  className={`relative flex items-center justify-between rounded-xl border border-line bg-surface/40 px-3 py-2 text-xs transition-colors hover:bg-surface ${
                    match.isDerby ? "border-buletin/40 bg-buletin/5" : ""
                  }`}
                >
                  {/* Ev Sahibi */}
                  <div className="w-[38%] font-semibold text-ink text-right truncate">
                    <span className="truncate text-xs">{match.homeTeam}</span>
                  </div>

                  {/* Skor / Saat Alanı */}
                  <div className="w-[24%] text-center shrink-0">
                    {match.status === "completed" ? (
                      <div className="inline-flex items-center gap-1">
                        <span className="rounded bg-paper border border-line px-2 py-0.5 font-bold font-mono text-[12px] text-ink shadow-2xs">
                          {match.homeScore} - {match.awayScore}
                        </span>
                        <span className="text-[10px] font-bold text-muted">MS</span>
                      </div>
                    ) : match.status === "live" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-600 px-2 py-0.5 font-bold text-white text-[10px] animate-pulse">
                        <span>CANLI</span>
                      </span>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-ink text-[12px]">{match.time}</span>
                        <span className="text-[10px] font-medium text-muted">{match.date}</span>
                      </div>
                    )}
                  </div>

                  {/* Deplasman */}
                  <div className="w-[38%] font-semibold text-ink text-left truncate">
                    <span className="truncate text-xs">{match.awayTeam}</span>
                  </div>

                  {/* Derbi Rozeti */}
                  {match.isDerby && (
                    <span className="absolute -top-2 right-3 rounded bg-buletin px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider text-white shadow-2xs">
                      DERBİ
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

