// Practice history persisted in localStorage. Each finished round/attempt is
// stored as a session so we can chart accuracy over time, compute streaks,
// and surface daily goals.

export type ExerciseId = "score" | "ear" | "rhythm";

export interface Session {
  exercise: ExerciseId;
  at: number; // epoch ms
  correct: number;
  total: number;
}

const KEY = "hautbois-progress";
const MAX_SESSIONS = 500;

export function loadHistory(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

export function recordSession(
  exercise: ExerciseId,
  correct: number,
  total: number,
): void {
  if (total <= 0) return;
  try {
    const history = loadHistory();
    history.push({ exercise, at: Date.now(), correct, total });
    const trimmed = history.slice(-MAX_SESSIONS);
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // ignore quota / private mode
  }
}

// Local YYYY-MM-DD key for grouping sessions by day.
function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function sessionsToday(history: Session[]): number {
  const today = dayKey(Date.now());
  return history.filter((s) => dayKey(s.at) === today).length;
}

// Number of consecutive days (ending today or yesterday) with >=1 session.
export function currentStreak(history: Session[]): number {
  if (history.length === 0) return 0;
  const days = new Set(history.map((s) => dayKey(s.at)));
  const oneDay = 24 * 60 * 60 * 1000;

  const todayKey = dayKey(Date.now());
  const yesterdayKey = dayKey(Date.now() - oneDay);
  // Streak is only "live" if there was activity today or yesterday.
  if (!days.has(todayKey) && !days.has(yesterdayKey)) return 0;

  let streak = 0;
  let cursor = days.has(todayKey) ? Date.now() : Date.now() - oneDay;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor -= oneDay;
  }
  return streak;
}

export interface ExerciseStats {
  count: number;
  lastAccuracy: number | null; // 0..100
  series: number[]; // accuracy per session (chronological)
}

export function statsFor(
  history: Session[],
  exercise: ExerciseId,
): ExerciseStats {
  const sessions = history.filter((s) => s.exercise === exercise);
  const series = sessions.map((s) => Math.round((s.correct / s.total) * 100));
  return {
    count: sessions.length,
    lastAccuracy: series.length ? series[series.length - 1] : null,
    series,
  };
}
