import { noteSemitone } from "../../music/notes";

// Standard tuning, low to high: Mi La Ré Sol Si Mi (E A D G B E).
// Guitar notation sounds an octave lower than written; this module works on
// pitch classes (all positions of the note name), so it does not matter here.
export const OPEN_STRING_LABELS = ["Mi", "La", "Ré", "Sol", "Si", "Mi"];
const OPEN_STRING_PITCH_CLASSES = [4, 9, 2, 7, 11, 4];

export const MAX_FRET = 12;

export interface FretPosition {
  string: number; // 0 = low Mi (E), 5 = high Mi (E)
  fret: number; // 0 = open string
}

// Every place the note's pitch class can be played within frets 0-12.
export function getFretPositions(note: string): FretPosition[] {
  const semitone = noteSemitone(note);
  if (semitone === null) return [];
  const pitchClass = ((semitone % 12) + 12) % 12;

  const positions: FretPosition[] = [];
  OPEN_STRING_PITCH_CLASSES.forEach((open, string) => {
    for (
      let fret = (pitchClass - open + 12) % 12;
      fret <= MAX_FRET;
      fret += 12
    ) {
      positions.push({ string, fret });
    }
  });
  return positions;
}
