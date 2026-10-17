export interface StandingItem {
  position: number;
  team: string;
  shortName: string;
  team_id?: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export interface FixtureItem {
  id: string | number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  date: string;
  time: string;
  status: "completed" | "live" | "scheduled";
}

export interface TopScorerItem {
  name: string;
  team: string;
  goals: number;
}

export interface SuperLigData {
  standings: StandingItem[];
  fixtures: FixtureItem[];
  topScorers: TopScorerItem[];
  updatedAt: string;
}

export function cleanTeamName(raw: string): string {
  if (!raw) return "";
  const cleaned = raw
    .replace(/\s+A\.Ş\.?/gi, "")
    .replace(/\s+FUTBOL\s+KULÜBÜ/gi, "")
    .replace(/RAMS\s+/gi, "")
    .replace(/TÜMOSAN\s+/gi, "")
    .replace(/CORENDON\s+/gi, "")
    .replace(/ZECORNER\s+/gi, "")
    .replace(/HESAP\.COM\s+/gi, "")
    .replace(/İKAS\s+/gi, "")
    .replace(/MISIRLI\.COM\.TR\s+/gi, "")
    .replace(/BELLONA\s+/gi, "")
    .replace(/NETGLOBAL\s+/gi, "")
    .replace(/ATAKAŞ\s+/gi, "")
    .replace(/İKAS\s+/gi, "")
    .trim();

  // Title case Turkish
  return cleaned
    .toLocaleLowerCase("tr-TR")
    .replace(/(^|\s)[a-zçğıöşü]/g, (char) => char.toLocaleUpperCase("tr-TR"));
}

const DEFAULT_FIXTURES: FixtureItem[] = [
  { id: 1, homeTeam: "Galatasaray", awayTeam: "Beşiktaş", homeScore: 2, awayScore: 1, date: "17 Ekim 2026", time: "20:00", status: "completed" },
  { id: 2, homeTeam: "Fenerbahçe", awayTeam: "Trabzonspor", homeScore: 1, awayScore: 1, date: "18 Ekim 2026", time: "19:00", status: "completed" },
  { id: 3, homeTeam: "Göztepe", awayTeam: "Samsunspor", homeScore: null, awayScore: null, date: "Bugün", time: "16:00", status: "live" },
  { id: 4, homeTeam: "Başakşehir", awayTeam: "Eyüpspor", homeScore: null, awayScore: null, date: "Bugün", time: "19:00", status: "scheduled" },
  { id: 5, homeTeam: "Konyaspor", awayTeam: "Alanyaspor", homeScore: null, awayScore: null, date: "Yarın", time: "16:00", status: "scheduled" },
  { id: 6, homeTeam: "Kasımpaşa", awayTeam: "Çaykur Rizespor", homeScore: null, awayScore: null, date: "Yarın", time: "19:00", status: "scheduled" },
];

const DEFAULT_STANDINGS: StandingItem[] = [
  { position: 1, team: "GALATASARAY A.Ş.", shortName: "Galatasaray", played: 17, won: 13, drawn: 3, lost: 1, goals_for: 39, goals_against: 12, goal_difference: 27, points: 42 },
  { position: 2, team: "FENERBAHÇE A.Ş.", shortName: "Fenerbahçe", played: 17, won: 11, drawn: 6, lost: 0, goals_for: 39, goals_against: 14, goal_difference: 25, points: 39 },
  { position: 3, team: "TRABZONSPOR A.Ş.", shortName: "Trabzonspor", played: 17, won: 10, drawn: 5, lost: 2, goals_for: 33, goals_against: 20, goal_difference: 13, points: 35 },
  { position: 4, team: "GÖZTEPE A.Ş.", shortName: "Göztepe", played: 17, won: 9, drawn: 5, lost: 3, goals_for: 21, goals_against: 9, goal_difference: 12, points: 32 },
  { position: 5, team: "BEŞİKTAŞ A.Ş.", shortName: "Beşiktaş", played: 17, won: 8, drawn: 5, lost: 4, goals_for: 30, goals_against: 22, goal_difference: 8, points: 29 },
  { position: 6, team: "SAMSUNSPOR A.Ş.", shortName: "Samsunspor", played: 17, won: 6, drawn: 7, lost: 4, goals_for: 22, goals_against: 20, goal_difference: 2, points: 25 },
  { position: 7, team: "RAMS BAŞAKŞEHİR FUTBOL KULÜBÜ", shortName: "Başakşehir", played: 17, won: 6, drawn: 5, lost: 6, goals_for: 27, goals_against: 18, goal_difference: 9, points: 23 },
  { position: 8, team: "KOCAELİSPOR", shortName: "Kocaelispor", played: 17, won: 6, drawn: 5, lost: 6, goals_for: 15, goals_against: 17, goal_difference: -2, points: 23 },
  { position: 9, team: "GAZİANTEP FUTBOL KULÜBÜ A.Ş.", shortName: "Gaziantep FK", played: 17, won: 6, drawn: 5, lost: 6, goals_for: 24, goals_against: 30, goal_difference: -6, points: 23 },
  { position: 10, team: "CORENDON ALANYASPOR", shortName: "Alanyaspor", played: 17, won: 4, drawn: 9, lost: 4, goals_for: 16, goals_against: 15, goal_difference: 1, points: 21 },
  { position: 11, team: "GENÇLERBİRLİĞİ", shortName: "Gençlerbirliği", played: 17, won: 5, drawn: 3, lost: 9, goals_for: 21, goals_against: 24, goal_difference: -3, points: 18 },
  { position: 12, team: "ÇAYKUR RİZESPOR A.Ş.", shortName: "Çaykur Rizespor", played: 17, won: 4, drawn: 6, lost: 7, goals_for: 20, goals_against: 24, goal_difference: -4, points: 18 },
  { position: 13, team: "TÜMOSAN KONYASPOR", shortName: "Konyaspor", played: 17, won: 4, drawn: 5, lost: 8, goals_for: 21, goals_against: 29, goal_difference: -8, points: 17 },
  { position: 14, team: "KASIMPAŞA A.Ş.", shortName: "Kasımpaşa", played: 17, won: 3, drawn: 6, lost: 8, goals_for: 14, goals_against: 24, goal_difference: -10, points: 15 },
  { position: 15, team: "HESAP.COM ANTALYASPOR", shortName: "Antalyaspor", played: 17, won: 4, drawn: 3, lost: 10, goals_for: 16, goals_against: 31, goal_difference: -15, points: 15 },
  { position: 16, team: "ZECORNER KAYSERİSPOR", shortName: "Kayserispor", played: 17, won: 2, drawn: 9, lost: 6, goals_for: 16, goals_against: 33, goal_difference: -17, points: 15 },
  { position: 17, team: "İKAS EYÜPSPOR", shortName: "Eyüpspor", played: 17, won: 3, drawn: 4, lost: 10, goals_for: 10, goals_against: 24, goal_difference: -14, points: 13 },
  { position: 18, team: "MISIRLI.COM.TR FATİH KARAGÜMRÜK", shortName: "Fatih Karagümrük", played: 17, won: 2, drawn: 6, lost: 9, goals_for: 12, goals_against: 28, goal_difference: -16, points: 12 },
];

const DEFAULT_SCORERS: TopScorerItem[] = [
  { name: "Eldor Shomurodov", team: "Başakşehir", goals: 12 },
  { name: "Paul Onuachu", team: "Trabzonspor", goals: 11 },
  { name: "Anderson Talisca", team: "Fenerbahçe", goals: 9 },
  { name: "Victor Osimhen", team: "Galatasaray", goals: 9 },
  { name: "Ciro Immobile", team: "Beşiktaş", goals: 8 },
];

let cachedData: SuperLigData | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function getSuperLigData(): Promise<SuperLigData> {
  const now = Date.now();
  if (cachedData && cacheExpiresAt > now) {
    return cachedData;
  }

  try {
    const res = await fetch("https://raw.githubusercontent.com/slaweally/superlig-api/main/tff_superlig_data.json", {
      headers: { "User-Agent": "Mansetle-News-App" },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const data = (await res.json()) as {
        standings?: Array<Record<string, unknown>>;
        top_scorers?: Array<Record<string, unknown>>;
        fixtures?: Array<Record<string, unknown>>;
        meta?: { scraped_at?: string };
      };

      const standings: StandingItem[] = Array.isArray(data.standings) && data.standings.length > 0
        ? data.standings.map((s, idx) => ({
            position: Number(s.position ?? idx + 1),
            team: String(s.team ?? ""),
            shortName: cleanTeamName(String(s.team ?? "")),
            team_id: Number(s.team_id ?? 0),
            played: Number(s.played ?? 0),
            won: Number(s.won ?? 0),
            drawn: Number(s.drawn ?? 0),
            lost: Number(s.lost ?? 0),
            goals_for: Number(s.goals_for ?? 0),
            goals_against: Number(s.goals_against ?? 0),
            goal_difference: Number(s.goal_difference ?? 0),
            points: Number(s.points ?? 0),
          }))
        : DEFAULT_STANDINGS;

      const topScorers: TopScorerItem[] = Array.isArray(data.top_scorers) && data.top_scorers.length > 0
        ? data.top_scorers.slice(0, 5).map((scorer) => ({
            name: String(scorer.name ?? "").toLowerCase().replace(/(^|\s)[a-zçğıöşü]/g, (c) => c.toUpperCase()),
            team: cleanTeamName(String(scorer.team ?? "")),
            goals: Number(scorer.goals ?? 0),
          }))
        : DEFAULT_SCORERS;

      const fixtures: FixtureItem[] = DEFAULT_FIXTURES;

      cachedData = {
        standings,
        fixtures,
        topScorers,
        updatedAt: data.meta?.scraped_at ?? new Date().toLocaleDateString("tr-TR"),
      };
      cacheExpiresAt = now + CACHE_TTL_MS;
      return cachedData;
    }
  } catch (err) {
    console.error("[superlig] failed to fetch live json, using fallback", err);
  }

  return {
    standings: DEFAULT_STANDINGS,
    fixtures: DEFAULT_FIXTURES,
    topScorers: DEFAULT_SCORERS,
    updatedAt: new Date().toLocaleDateString("tr-TR"),
  };
}
