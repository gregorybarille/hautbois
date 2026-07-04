// Music theory helpers built on the app's French note-name convention.
// Absolute semitone index is relative to middle Do (C4 = 0), matching
// noteSemitone() in notes.ts. Available app range (staff + charts) is
// roughly -12 (Do Grave) .. 23 (Si Aigu).
import { CHROMATIC_NOTES, NOTE_BASES, noteSemitone, parseNote } from "./notes";

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
  // Scale degree (letter offset from the root) of each interval, used for
  // enharmonic spelling. Omitted for the chromatic scale, which has none.
  degrees?: number[];
}

const DIATONIC_DEGREES = [0, 1, 2, 3, 4, 5, 6, 7];
const ARPEGGIO_DEGREES = [0, 2, 4, 7];

export const SCALE_TYPES: ScaleType[] = [
  { id: "major", labelKey: "scales.types.major", intervals: [0, 2, 4, 5, 7, 9, 11, 12], degrees: DIATONIC_DEGREES },
  { id: "minor_natural", labelKey: "scales.types.minor_natural", intervals: [0, 2, 3, 5, 7, 8, 10, 12], degrees: DIATONIC_DEGREES },
  { id: "minor_harmonic", labelKey: "scales.types.minor_harmonic", intervals: [0, 2, 3, 5, 7, 8, 11, 12], degrees: DIATONIC_DEGREES },
  { id: "minor_melodic", labelKey: "scales.types.minor_melodic", intervals: [0, 2, 3, 5, 7, 9, 11, 12], degrees: DIATONIC_DEGREES },
  { id: "arp_major", labelKey: "scales.types.arp_major", intervals: [0, 4, 7, 12], degrees: ARPEGGIO_DEGREES },
  { id: "arp_minor", labelKey: "scales.types.arp_minor", intervals: [0, 3, 7, 12], degrees: ARPEGGIO_DEGREES },
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

export interface ScaleNote {
  name: string;
  semitone: number;
}

// --- Intervals (for ear training) ---
export interface Interval {
  semitones: number;
  labelKey: string;
}

// One octave of intervals, ascending.
export const INTERVALS: Interval[] = [
  { semitones: 1, labelKey: "ear.intervals.m2" },
  { semitones: 2, labelKey: "ear.intervals.M2" },
  { semitones: 3, labelKey: "ear.intervals.m3" },
  { semitones: 4, labelKey: "ear.intervals.M3" },
  { semitones: 5, labelKey: "ear.intervals.P4" },
  { semitones: 6, labelKey: "ear.intervals.TT" },
  { semitones: 7, labelKey: "ear.intervals.P5" },
  { semitones: 8, labelKey: "ear.intervals.m6" },
  { semitones: 9, labelKey: "ear.intervals.M6" },
  { semitones: 10, labelKey: "ear.intervals.m7" },
  { semitones: 11, labelKey: "ear.intervals.M7" },
  { semitones: 12, labelKey: "ear.intervals.P8" },
];

// SRS card ids for the intervals deck, and the reverse lookup. Every feature
// must go through these so the decks never fragment across id schemes.
export const INTERVAL_IDS = INTERVALS.map((i) => String(i.semitones));
export const INTERVAL_BY_ID: Record<string, Interval> = Object.fromEntries(
  INTERVALS.map((i) => [String(i.semitones), i]),
);

// Comfortable mid-range roots for interval drills (La3 .. Mi4).
export const INTERVAL_ROOT_MIN = -9;
export const INTERVAL_ROOT_MAX = 4;

export const randomIntervalRoot = (): number =>
  INTERVAL_ROOT_MIN +
  Math.floor(Math.random() * (INTERVAL_ROOT_MAX - INTERVAL_ROOT_MIN + 1));

// Spell an absolute semitone as the given scale degree of `root`: the degree
// fixes the letter, the accidental makes up the difference (Fa# majeure gets
// La# and Mi#, not Si♭ and Fa). Falls back to the chromatic spelling when a
// single accidental isn't enough (double sharps/flats).
function spellDegree(root: string, degree: number, semitone: number): string {
  const parsed = parseNote(root);
  if (!parsed) return semitoneToName(semitone);
  const letterIdx = NOTE_BASES.indexOf(parsed.base) + degree;
  const letter = NOTE_BASES[letterIdx % 7];
  const octave = Math.floor(letterIdx / 7);
  const natural = (noteSemitone(letter) ?? 0) + 12 * octave;
  const accidental = semitone - natural;
  if (accidental < -1 || accidental > 1 || octave < -1 || octave > 1) {
    return semitoneToName(semitone);
  }
  const acc = accidental === 1 ? "#" : accidental === -1 ? "♭" : "";
  const suffix = octave === 1 ? " Aigu" : octave === -1 ? " Grave" : "";
  return `${letter}${acc}${suffix}`;
}

// Generate the ascending note sequence for a scale/arpeggio starting on the
// middle-octave root. Notes stay within the app's playable range.
export function generateScale(root: string, type: ScaleTypeId): ScaleNote[] {
  const base = noteSemitone(root) ?? 0;
  const { intervals, degrees } = SCALE_TYPES_BY_ID[type];
  return intervals.map((offset, i) => {
    const semitone = base + offset;
    const name = degrees
      ? spellDegree(root, degrees[i], semitone)
      : semitoneToName(semitone);
    return { name, semitone };
  });
}
