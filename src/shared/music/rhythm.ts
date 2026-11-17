// Rhythmic pattern generation for the tapping trainer. A pattern is one bar
// of 4 beats; each beat holds onset positions (fractions of a beat) where a
// tap is expected. Onsets are also exposed as absolute beat positions.

export const BEATS_PER_BAR = 4;

// Rhythmic cell vocabulary: one beat's worth of onset fractions, plus the id
// used both for the type picker and for choosing how RhythmNotation draws
// the cell (quarter/rest get a single centered symbol, the rest use their
// literal onset fractions so the notation lines up with the tap grid below).
export interface RhythmCellType {
  id: string;
  labelKey: string;
  onsets: number[];
}

export const RHYTHM_CELL_TYPES: RhythmCellType[] = [
  { id: "quarter", labelKey: "rhythm.cellTypes.quarter", onsets: [0] },
  { id: "rest", labelKey: "rhythm.cellTypes.rest", onsets: [] },
  { id: "eighths", labelKey: "rhythm.cellTypes.eighths", onsets: [0, 0.5] },
  { id: "offbeat", labelKey: "rhythm.cellTypes.offbeat", onsets: [0.5] },
  {
    id: "sixteenths",
    labelKey: "rhythm.cellTypes.sixteenths",
    onsets: [0, 0.25, 0.5, 0.75],
  },
  { id: "dotted", labelKey: "rhythm.cellTypes.dotted", onsets: [0, 0.75] },
];

export const RHYTHM_CELL_TYPE_IDS = RHYTHM_CELL_TYPES.map((c) => c.id);

const CELLS_BY_ID: Record<string, RhythmCellType> = Object.fromEntries(
  RHYTHM_CELL_TYPES.map((c) => [c.id, c]),
);

export interface RhythmPattern {
  beats: number[][]; // per-beat onset fractions
  cellIds: string[]; // per-beat cell type id, for notation rendering
  onsets: number[]; // absolute beat positions (e.g. 0, 0.5, 1, 2.75)
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generate a bar using only the given cell types (falls back to the full
// vocabulary if none are selected). The downbeat always gets a quarter note
// so the count-in / tap alignment has a clear anchor.
export function generatePattern(cellTypeIds: string[]): RhythmPattern {
  const vocab = cellTypeIds.length > 0 ? cellTypeIds : RHYTHM_CELL_TYPE_IDS;
  const types = vocab.map((id) => CELLS_BY_ID[id]).filter(Boolean);
  const pool = types.length > 0 ? types : RHYTHM_CELL_TYPES;
  const quarter = CELLS_BY_ID.quarter;

  let cellIds: string[] = [];
  let beats: number[][] = [];

  // Retry until we get a musically usable bar (clear downbeat, enough hits).
  for (let attempt = 0; attempt < 20; attempt++) {
    const chosen = Array.from({ length: BEATS_PER_BAR }, (_, i) =>
      i === 0 ? quarter : pick(pool),
    );
    cellIds = chosen.map((c) => c.id);
    beats = chosen.map((c) => c.onsets);
    const total = beats.reduce((sum, cell) => sum + cell.length, 0);
    if (total >= 3) break;
  }

  const onsets: number[] = [];
  beats.forEach((cell, i) => cell.forEach((frac) => onsets.push(i + frac)));

  return { beats, cellIds, onsets };
}
