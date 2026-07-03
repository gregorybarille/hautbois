// Shared model for the app's French note-name convention:
// "Do", "Fa#", "Si♭", plus an optional register suffix (" Grave" / " Aigu")
// meaning one octave below / above the middle octave (C4).
export type NoteBase = "Do" | "Ré" | "Mi" | "Fa" | "Sol" | "La" | "Si";
export type Register = "grave" | "middle" | "aigu";

export interface ParsedNote {
  base: NoteBase;
  accidental: -1 | 0 | 1; // ♭ / natural / #
  register: Register;
}

// Treble-staff step of each base note in the middle octave.
// Step 0 = F5 (top line), +1 per half-space going down, so Do (C4) = 10.
const BASE_STEPS: Record<NoteBase, number> = {
  Do: 10,
  Ré: 9,
  Mi: 8,
  Fa: 7,
  Sol: 6,
  La: 5,
  Si: 4,
};

// Semitones above Do within one octave.
const BASE_SEMITONES: Record<NoteBase, number> = {
  Do: 0,
  Ré: 2,
  Mi: 4,
  Fa: 5,
  Sol: 7,
  La: 9,
  Si: 11,
};

export const NOTE_BASES = Object.keys(BASE_STEPS) as NoteBase[];

export function parseNote(name: string): ParsedNote | null {
  let rest = name;
  let register: Register = "middle";
  if (rest.endsWith(" Grave")) {
    register = "grave";
    rest = rest.slice(0, -" Grave".length);
  } else if (rest.endsWith(" Aigu")) {
    register = "aigu";
    rest = rest.slice(0, -" Aigu".length);
  }

  let accidental: ParsedNote["accidental"] = 0;
  if (rest.endsWith("♭")) {
    accidental = -1;
    rest = rest.slice(0, -1);
  } else if (rest.endsWith("#")) {
    accidental = 1;
    rest = rest.slice(0, -1);
  }

  if (!(rest in BASE_STEPS)) return null;
  return { base: rest as NoteBase, accidental, register };
}

// Treble-staff step for a note name (see BASE_STEPS). Accidentals share the
// position of their natural. Returns null for unknown names.
export function noteStep(name: string): number | null {
  const parsed = parseNote(name);
  if (!parsed) return null;
  const registerSteps =
    parsed.register === "grave" ? 7 : parsed.register === "aigu" ? -7 : 0;
  return BASE_STEPS[parsed.base] + registerSteps;
}

// Semitone index relative to Do of the middle octave (C4 = 0).
// Returns null for unknown names.
export function noteSemitone(name: string): number | null {
  const parsed = parseNote(name);
  if (!parsed) return null;
  const registerSemitones =
    parsed.register === "grave" ? -12 : parsed.register === "aigu" ? 12 : 0;
  return BASE_SEMITONES[parsed.base] + parsed.accidental + registerSemitones;
}
