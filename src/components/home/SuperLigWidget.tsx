import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { SuperLigData } from "@/lib/superlig.server";

// Resmi Kulüp Logoları (Yerel ve Hızlı)
const TEAM_LOGOS: Record<string, string> = {
  Galatasaray: "/logos/teams/galatasaray.png",
  "Amed SK": "/logos/teams/amed_sk.png",
  Beşiktaş: "/logos/teams/besiktas.png",
  Fenerbahçe: "/logos/teams/fenerbahce.png",
  Trabzonspor: "/logos/teams/trabzonspor.png",
  "Çorum FK": "/logos/teams/corum_fk.png",
  "Arca Çorum FK": "/logos/teams/corum_fk.png",
  Alanyaspor: "/logos/teams/alanyaspor.png",
  "Corendon Alanyaspor": "/logos/teams/alanyaspor.png",
  Kocaelispor: "/logos/teams/kocaelispor.png",
  "Erzurumspor FK": "/logos/teams/erzurumspor_fk.png",
  Erzurumspor: "/logos/teams/erzurumspor_fk.png",
  Kasımpaşa: "/logos/teams/kasimpasa.png",
  "Ç. Rizespor": "/logos/teams/caykur_rizespor.png",
  "Çaykur Rizespor": "/logos/teams/caykur_rizespor.png",
  Başakşehir: "/logos/teams/basaksehir.png",
  "Rams Başakşehir": "/logos/teams/basaksehir.png",
  "Gaziantep FK": "/logos/teams/gaziantep_fk.png",
  Gençlerbirliği: "/logos/teams/genclerbirligi.png",
  Göztepe: "/logos/teams/goztepe.png",
  Konyaspor: "/logos/teams/konyaspor.png",
  "Tümosan Konyaspor": "/logos/teams/konyaspor.png",
  Samsunspor: "/logos/teams/samsunspor.png",
  Eyüpspor: "/logos/teams/eyupspor.png",
  "İkas Eyüpspor": "/logos/teams/eyupspor.png",
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
      {/* Üst Başlık & Sekmeler (Gerçek Spor Portalı Stili) */}
      <div className="border-b border-line px-4 py-3 sm:px-5 bg-surface/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Başlık (Trendyol WebP logosu kaldırıldı, gerçek spor portalları gibi temiz tipografi) */}
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
        {/* 1. Puan Durumu Sekmesi (Mackolik / Resim 2 Birebir Tasarım) */}
        {activeTab === "standings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-soft/80 text-[11px] font-bold text-muted border-b border-line">
                  <th className="py-2 pl-3 w-7 text-center">#</th>
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
                  const logo = TEAM_LOGOS[team.shortName] ?? TEAM_LOGOS[team.team];

                  // Sol kenar Avrupa / Düşme çizgisi
                  let borderLeftClass = "border-l-[3px] border-l-transparent";
                  if (team.position === 1) {
                    borderLeftClass = "border-l-[3px] border-l-emerald-500";
                  } else if (team.position === 2) {
                    borderLeftClass = "border-l-[3px] border-l-blue-500";
                  } else if (team.position === 3) {
                    borderLeftClass = "border-l-[3px] border-l-amber-500";
                  } else if (team.position === 4) {
                    borderLeftClass = "border-l-[3px] border-l-cyan-400";
                  } else if (team.position >= 16) {
                    borderLeftClass = "border-l-[3px] border-l-rose-500";
                  }

                  return (
                    <tr
                      key={team.position}
                      className={`group transition-colors hover:bg-soft/50 ${borderLeftClass}`}
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

                      {/* Takım Logosu & Adı (Renkli noktalar kaldırıldı, gerçek arma eklendi) */}
                      <td className="py-2 pl-2 font-medium text-ink">
                        <div className="flex items-center gap-2 truncate max-w-[130px] sm:max-w-none">
                          {logo ? (
                            <img
                              src={logo}
                              alt=""
                              className="size-4.5 sm:size-5 object-contain shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <span className="size-4.5 rounded-full bg-soft shrink-0" />
                          )}
                          <span className="truncate text-xs font-semibold text-ink">
                            {team.shortName}
                          </span>
                        </div>
                      </td>

                      <td className="py-2 px-1 text-center text-muted">{team.played}</td>
                      <td className="py-2 px-1 text-center text-muted hidden sm:table-cell">{team.won}</td>
                      <td className="py-2 px-1 text-center text-muted hidden sm:table-cell">{team.drawn}</td>
                      <td className="py-2 px-1 text-center text-muted hidden sm:table-cell">{team.lost}</td>
                      <td className="py-2 px-1 text-center text-muted hidden md:table-cell">{team.goals_for}</td>
                      <td className="py-2 px-1 text-center text-muted hidden md:table-cell">{team.goals_against}</td>
                      <td className="py-2 px-1 text-center text-muted font-medium">
                        {team.goal_difference > 0 ? team.goal_difference : team.goal_difference}
                      </td>
                      <td className="py-2 pr-3 text-center font-black text-ink text-[13px]">
                        {team.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Genişlet / Kısalt Butonu */}
            <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-2.5 px-2 text-[11px] text-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 inline-block" /> Şampiyonlar Ligi
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

        {/* 2. 8. Hafta Fikstürü Sekmesi (Renkli noktalar kaldırıldı, gerçek kulüp armaları yerleştirildi) */}
        {activeTab === "fixtures" && (
          <div className="space-y-2">
            {data.fixtures.map((match) => {
              const homeLogo = TEAM_LOGOS[match.homeTeam];
              const awayLogo = TEAM_LOGOS[match.awayTeam];

              return (
                <div
                  key={match.id}
                  className={`relative flex items-center justify-between rounded-xl border border-line bg-surface/40 px-3 py-2 text-xs transition-colors hover:bg-surface ${
                    match.isDerby ? "border-buletin/40 bg-buletin/5" : ""
                  }`}
                >
                  {/* Ev Sahibi (Takım Adı + Gerçek Kulüp Arması, Renkli Nokta Yok) */}
                  <div className="w-[38%] font-semibold text-ink text-right truncate flex items-center justify-end gap-2">
                    <span className="truncate text-xs">{match.homeTeam}</span>
                    {homeLogo ? (
                      <img
                        src={homeLogo}
                        alt=""
                        className="size-4.5 sm:size-5 object-contain shrink-0"
                        loading="lazy"
                      />
                    ) : null}
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

                  {/* Deplasman (Gerçek Kulüp Arması + Takım Adı, Renkli Nokta Yok) */}
                  <div className="w-[38%] font-semibold text-ink text-left truncate flex items-center gap-2">
                    {awayLogo ? (
                      <img
                        src={awayLogo}
                        alt=""
                        className="size-4.5 sm:size-5 object-contain shrink-0"
                        loading="lazy"
                      />
                    ) : null}
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
