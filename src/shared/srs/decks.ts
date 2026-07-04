import { InstrumentId } from "@/shared/instruments";
import { SCALE_TYPES_BY_ID, ScaleTypeId } from "@/shared/music/theory";
import { parseNote } from "@/shared/music/notes";

// Central registry of spaced-repetition deck keys (localStorage).
export const DECK = {
  notes: "srs2-notes",
  intervals: "srs2-intervals",
  scales: "srs2-scales",
  fingerings: (instrument: InstrumentId) => `srs2-fingerings-${instrument}`,
} as const;

// Card-id encoding for the scales deck. Compose and parse only through these
// helpers: the format is persisted in localStorage, so writers and readers
// must agree.
export const scaleCardId = (root: string, type: ScaleTypeId): string =>
  `${root}|${type}`;

export function parseScaleCardId(
  id: string,
): { root: string; type: ScaleTypeId } | null {
  const sep = id.indexOf("|");
  if (sep < 0) return null;
  const root = id.slice(0, sep);
  const type = id.slice(sep + 1) as ScaleTypeId;
  if (!(type in SCALE_TYPES_BY_ID) || !parseNote(root)) return null;
  return { root, type };
}
