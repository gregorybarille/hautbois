// Music theory helpers built on the app's French note-name convention.
// Absolute semitone index is relative to middle Do (C4 = 0), matching
// noteSemitone() in notes.ts. Available app range (staff + charts) is
// roughly -12 (Do Grave) .. 23 (Si Aigu).
import { CHROMATIC_NOTES } from "./notes";

export type ScaleTypeId =
  | "major"
  | "minor_natural"
  | "minor_harmonic"
  | "minor_melodic"
  | "arp_major"
  | "arp_minor"
  | "chromatic";

export interface ScaleType {
  id: ScaleTypeId;
  labelKey: string;
  // Semitone offsets from the root, ascending (includes the octave).
  intervals: number[];
}

export const SCALE_TYPES: ScaleType[] = [
  { id: "major", labelKey: "scales.types.major", intervals: [0, 2, 4, 5, 7, 9, 11, 12] },
  { id: "minor_natural", labelKey: "scales.types.minor_natural", intervals: [0, 2, 3, 5, 7, 8, 10, 12] },
  { id: "minor_harmonic", labelKey: "scales.types.minor_harmonic", intervals: [0, 2, 3, 5, 7, 8, 11, 12] },
  { id: "minor_melodic", labelKey: "scales.types.minor_melodic", intervals: [0, 2, 3, 5, 7, 9, 11, 12] },
  { id: "arp_major", labelKey: "scales.types.arp_major", intervals: [0, 4, 7, 12] },
  { id: "arp_minor", labelKey: "scales.types.arp_minor", intervals: [0, 3, 7, 12] },
  { id: "chromatic", labelKey: "scales.types.chromatic", intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
];

export const SCALE_TYPES_BY_ID: Record<ScaleTypeId, ScaleType> = Object.fromEntries(
  SCALE_TYPES.map((s) => [s.id, s]),
) as Record<ScaleTypeId, ScaleType>;

// Possible roots: the 12 pitch classes, spelled with the app convention.
export const SCALE_ROOTS = CHROMATIC_NOTES;

// Convert an absolute semitone (C4 = 0) to an app note name, adding the
// register suffix. Inverse of noteSemitone() for the app's spelling.
export function semitoneToName(semitone: number): string {
  const pitchClass = ((semitone % 12) + 12) % 12;
  const octave = Math.floor(semitone / 12); // 0 = middle, -1 = grave, 1 = aigu
  const base = CHROMATIC_NOTES[pitchClass];
  if (octave === 0) return base;
  if (octave === -1) return `${base} Grave`;
  if (octave === 1) return `${base} Aigu`;
  // Out of the app's 3-octave range: still return a best-effort name.
  return base;
}

// Frequency (Hz) for an absolute semitone. Middle Do = C4 = MIDI 60.
export function semitoneToFrequency(semitone: number): number {
  const midi = 60 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Semitone offset of a chromatic root (index in CHROMATIC_NOTES) is just its
// index, since CHROMATIC_NOTES is ascending from Do.
function rootSemitone(root: string): number {
  const idx = CHROMATIC_NOTES.indexOf(root);
  return idx < 0 ? 0 : idx;
}

export interface ScaleNote {
  name: string;
  semitone: number;
}

// Generate the ascending note sequence for a scale/arpeggio starting on the
// middle-octave root. Notes stay within the app's playable range.
export function generateScale(root: string, type: ScaleTypeId): ScaleNote[] {
  const base = rootSemitone(root);
  const { intervals } = SCALE_TYPES_BY_ID[type];
  return intervals.map((offset) => {
    const semitone = base + offset;
    return { name: semitoneToName(semitone), semitone };
  });
}
