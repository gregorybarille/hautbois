// Rhythmic pattern generation for the tapping trainer. A pattern is one bar
// of 4 beats; each beat holds onset positions (fractions of a beat) where a
// tap is expected. Onsets are also exposed as absolute beat positions.

export type Difficulty = "easy" | "medium" | "hard";

export const BEATS_PER_BAR = 4;

// Candidate rhythmic cells (onset fractions within a single beat).
const CELLS: Record<Difficulty, number[][]> = {
  easy: [[0], []], // quarter, rest
  medium: [[0], [], [0, 0.5]], // + two eighths
  hard: [
    [0],
    [],
    [0, 0.5],
    [0, 0.25, 0.5, 0.75], // four sixteenths
    [0, 0.75], // dotted eighth + sixteenth
    [0.5], // off-beat eighth
  ],
};

export interface RhythmPattern {
  beats: number[][]; // per-beat onset fractions
  onsets: number[]; // absolute beat positions (e.g. 0, 0.5, 1, 2.75)
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function generatePattern(difficulty: Difficulty): RhythmPattern {
  const vocab = CELLS[difficulty];
  let beats: number[][] = [];

  // Retry until we get a musically usable bar (clear downbeat, enough hits).
  for (let attempt = 0; attempt < 20; attempt++) {
    beats = Array.from({ length: BEATS_PER_BAR }, (_, i) =>
      i === 0 ? [0] : pick(vocab),
    );
    const total = beats.reduce((sum, cell) => sum + cell.length, 0);
    if (total >= 3) break;
  }

  const onsets: number[] = [];
  beats.forEach((cell, i) => cell.forEach((frac) => onsets.push(i + frac)));

  return { beats, onsets };
}
