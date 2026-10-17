export interface StandingItem {
  position: number;
  team: string;
  shortName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  trend?: "up" | "down" | "same";
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
  isDerby?: boolean;
}

export interface SuperLigData {
  season: string;
  currentWeek: number;
  standings: StandingItem[];
  fixtures: FixtureItem[];
  updatedAt: string;
}

export const CURRENT_STANDINGS_2026_2027: StandingItem[] = [
  { position: 1, team: "Galatasaray", shortName: "Galatasaray", played: 8, won: 6, drawn: 1, lost: 1, goals_for: 17, goals_against: 11, goal_difference: 6, points: 19, trend: "same" },
  { position: 2, team: "Amed SK", shortName: "Amed SK", played: 8, won: 5, drawn: 2, lost: 1, goals_for: 18, goals_against: 9, goal_difference: 9, points: 17, trend: "up" },
  { position: 3, team: "Beşiktaş", shortName: "Beşiktaş", played: 7, won: 5, drawn: 0, lost: 2, goals_for: 16, goals_against: 8, goal_difference: 8, points: 15, trend: "down" },
  { position: 4, team: "Fenerbahçe", shortName: "Fenerbahçe", played: 7, won: 4, drawn: 1, lost: 2, goals_for: 19, goals_against: 6, goal_difference: 13, points: 13, trend: "same" },
  { position: 5, team: "Trabzonspor", shortName: "Trabzonspor", played: 7, won: 4, drawn: 1, lost: 2, goals_for: 16, goals_against: 5, goal_difference: 11, points: 13, trend: "same" },
  { position: 6, team: "Çorum FK", shortName: "Çorum FK", played: 8, won: 4, drawn: 1, lost: 3, goals_for: 18, goals_against: 13, goal_difference: 5, points: 13, trend: "up" },
  { position: 7, team: "Alanyaspor", shortName: "Alanyaspor", played: 7, won: 3, drawn: 3, lost: 1, goals_for: 8, goals_against: 6, goal_difference: 2, points: 12, trend: "down" },
  { position: 8, team: "Kocaelispor", shortName: "Kocaelispor", played: 7, won: 4, drawn: 0, lost: 3, goals_for: 8, goals_against: 6, goal_difference: 2, points: 12, trend: "down" },
  { position: 9, team: "Erzurumspor FK", shortName: "Erzurumspor FK", played: 8, won: 3, drawn: 2, lost: 3, goals_for: 5, goals_against: 11, goal_difference: -6, points: 11, trend: "up" },
  { position: 10, team: "Kasımpaşa", shortName: "Kasımpaşa", played: 7, won: 2, drawn: 4, lost: 1, goals_for: 8, goals_against: 8, goal_difference: 0, points: 10, trend: "down" },
  { position: 11, team: "Ç. Rizespor", shortName: "Ç. Rizespor", played: 8, won: 3, drawn: 1, lost: 4, goals_for: 8, goals_against: 11, goal_difference: -3, points: 10, trend: "same" },
  { position: 12, team: "Başakşehir", shortName: "Başakşehir", played: 7, won: 2, drawn: 2, lost: 3, goals_for: 10, goals_against: 11, goal_difference: -1, points: 8, trend: "down" },
  { position: 13, team: "Gaziantep FK", shortName: "Gaziantep FK", played: 7, won: 2, drawn: 2, lost: 3, goals_for: 7, goals_against: 10, goal_difference: -3, points: 8, trend: "same" },
  { position: 14, team: "Gençlerbirliği", shortName: "Gençlerbirliği", played: 8, won: 2, drawn: 2, lost: 4, goals_for: 7, goals_against: 16, goal_difference: -9, points: 8, trend: "down" },
  { position: 15, team: "Göztepe", shortName: "Göztepe", played: 7, won: 1, drawn: 3, lost: 3, goals_for: 15, goals_against: 15, goal_difference: 0, points: 6, trend: "same" },
  { position: 16, team: "Konyaspor", shortName: "Konyaspor", played: 8, won: 1, drawn: 2, lost: 5, goals_for: 4, goals_against: 9, goal_difference: -5, points: 5, trend: "down" },
  { position: 17, team: "Samsunspor", shortName: "Samsunspor", played: 7, won: 1, drawn: 1, lost: 5, goals_for: 6, goals_against: 15, goal_difference: -9, points: 4, trend: "same" },
  { position: 18, team: "Eyüpspor", shortName: "Eyüpspor", played: 8, won: 1, drawn: 0, lost: 7, goals_for: 2, goals_against: 22, goal_difference: -20, points: 3, trend: "same" },
];

export const CURRENT_WEEK_8_FIXTURES: FixtureItem[] = [
  { id: 1, homeTeam: "Çorum FK", awayTeam: "Ç. Rizespor", homeScore: 2, awayScore: 1, date: "16 Ekim", time: "MS", status: "completed" },
  { id: 2, homeTeam: "Erzurumspor FK", awayTeam: "Eyüpspor", homeScore: 2, awayScore: 0, date: "17 Ekim", time: "MS", status: "completed" },
  { id: 3, homeTeam: "Amed SK", awayTeam: "Konyaspor", homeScore: 1, awayScore: 0, date: "17 Ekim", time: "MS", status: "completed" },
  { id: 4, homeTeam: "Gençlerbirliği", awayTeam: "Galatasaray", homeScore: 0, awayScore: 1, date: "17 Ekim", time: "MS", status: "completed" },
  { id: 5, homeTeam: "Fenerbahçe", awayTeam: "Alanyaspor", homeScore: null, awayScore: null, date: "Bugün", time: "19:00", status: "scheduled" },
  { id: 6, homeTeam: "Kasımpaşa", awayTeam: "Samsunspor", homeScore: null, awayScore: null, date: "18 Ekim", time: "13:30", status: "scheduled" },
  { id: 7, homeTeam: "Kocaelispor", awayTeam: "Göztepe", homeScore: null, awayScore: null, date: "18 Ekim", time: "16:00", status: "scheduled" },
  { id: 8, homeTeam: "Başakşehir", awayTeam: "Gaziantep FK", homeScore: null, awayScore: null, date: "18 Ekim", time: "19:00", status: "scheduled" },
  { id: 9, homeTeam: "Trabzonspor", awayTeam: "Beşiktaş", homeScore: null, awayScore: null, date: "19 Ekim", time: "20:00", status: "scheduled", isDerby: true },
];

export async function getSuperLigData(): Promise<SuperLigData> {
  return {
    season: "2026-2027",
    currentWeek: 8,
    standings: CURRENT_STANDINGS_2026_2027,
    fixtures: CURRENT_WEEK_8_FIXTURES,
    updatedAt: "17 Ekim 2026",
  };
}
