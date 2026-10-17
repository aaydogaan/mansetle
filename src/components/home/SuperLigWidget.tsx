import { useState } from "react";
import { Trophy, Calendar, Award, ChevronDown, ChevronUp } from "lucide-react";
import type { SuperLigData } from "@/lib/superlig.server";

export function SuperLigWidget({ data }: { data?: SuperLigData | null }) {
  const [activeTab, setActiveTab] = useState<"standings" | "fixtures" | "scorers">("standings");
  const [showAll, setShowAll] = useState(false);

  if (!data || !data.standings || data.standings.length === 0) {
    return null;
  }

  const displayedStandings = showAll ? data.standings : data.standings.slice(0, 7);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-xs">
      {/* Üst Başlık & Sekmeler */}
      <div className="border-b border-line bg-soft/50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-buletin text-white shadow-2xs">
              <Trophy className="size-4.5" />
            </div>
            <div>
              <h3 className="font-serif text-[17px] font-bold text-ink leading-tight">
                Trendyol Süper Lig
              </h3>
              <p className="text-[11px] font-medium text-muted">
                Puan Durumu & Güncel Fikstür
              </p>
            </div>
          </div>

          {/* Sekme Butonları */}
          <div className="flex rounded-lg border border-line bg-paper p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("standings")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                activeTab === "standings"
                  ? "bg-buletin text-white shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Trophy className="size-3 hidden sm:inline" />
              <span>Puan Durumu</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("fixtures")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                activeTab === "fixtures"
                  ? "bg-buletin text-white shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Calendar className="size-3 hidden sm:inline" />
              <span>Fikstür</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("scorers")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors ${
                activeTab === "scorers"
                  ? "bg-buletin text-white shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Award className="size-3 hidden sm:inline" />
              <span>Gol Krallığı</span>
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
                  const isTop1 = team.position === 1;
                  const isEurope = team.position >= 2 && team.position <= 4;
                  const isRelegation = team.position >= 16;

                  return (
                    <tr
                      key={team.position}
                      className="group transition-colors hover:bg-soft/50"
                    >
                      <td className="py-2 pl-2 text-center font-bold">
                        <span
                          className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                            isTop1
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
                      <td className="py-2 pl-1 font-semibold text-ink">
                        <div className="flex items-center gap-1.5 truncate max-w-[140px] sm:max-w-none">
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
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-amber-500 inline-block" /> Şampiyonlar Ligi
                </span>
                <span className="flex items-center gap-1">
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

        {/* 2. Fikstür / Maçlar Sekmesi */}
        {activeTab === "fixtures" && (
          <div className="space-y-2.5">
            {data.fixtures.map((match) => (
              <div
                key={match.id}
                className="flex items-center justify-between rounded-xl border border-line bg-soft/40 px-3.5 py-2.5 text-xs transition-colors hover:bg-soft"
              >
                {/* Ev Sahibi */}
                <div className="w-[38%] font-semibold text-ink text-right truncate">
                  {match.homeTeam}
                </div>

                {/* Skor / Saat */}
                <div className="w-[24%] text-center shrink-0">
                  {match.status === "completed" ? (
                    <span className="inline-block rounded-md bg-paper border border-line px-2.5 py-0.5 font-bold font-mono text-[13px] text-ink">
                      {match.homeScore} - {match.awayScore}
                    </span>
                  ) : match.status === "live" ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 font-bold text-white text-[11px] animate-pulse">
                      <span>CANLI</span>
                    </span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-ink">{match.time}</span>
                      <span className="text-[10px] text-muted">{match.date}</span>
                    </div>
                  )}
                </div>

                {/* Deplasman */}
                <div className="w-[38%] font-semibold text-ink text-left truncate">
                  {match.awayTeam}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Gol Krallığı Sekmesi */}
        {activeTab === "scorers" && (
          <div className="space-y-2">
            {data.topScorers.map((scorer, index) => (
              <div
                key={scorer.name + index}
                className="flex items-center justify-between rounded-xl border border-line bg-soft/40 px-3.5 py-2 text-xs transition-colors hover:bg-soft"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-5.5 items-center justify-center rounded-full bg-paper border border-line text-[11px] font-bold text-muted">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-bold text-ink text-[13px]">{scorer.name}</div>
                    <div className="text-[11px] text-muted">{scorer.team}</div>
                  </div>
                </div>
                <div className="rounded-lg bg-buletin/10 px-2.5 py-1 text-right">
                  <span className="font-black text-buletin text-sm">{scorer.goals}</span>
                  <span className="ml-1 text-[10px] font-semibold text-buletin">GOL</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
