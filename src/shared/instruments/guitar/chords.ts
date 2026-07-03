export interface ChordFingering {
  // Fret per string [low Mi → high Mi]: -1 = muted, 0 = open, n ≥ 1 = fret number
  strings: [number, number, number, number, number, number];
  // Optional barre: one finger bars all strings between fromString and toString
  barre?: { fret: number; fromString: number; toString: number };
}

// Standard major chord fingerings, French conservatoire / méthode order.
// Open-position chords where possible; E-shape or A-shape barre otherwise.
export const GUITAR_CHORDS: Record<string, ChordFingering> = {
  Do:    { strings: [-1, 3, 2, 0, 1, 0] },
  "Do#": { strings: [-1, 4, 6, 6, 6, 4], barre: { fret: 4, fromString: 1, toString: 5 } },
  Ré:    { strings: [-1, -1, 0, 2, 3, 2] },
  "Mi♭": { strings: [-1, -1, 1, 3, 4, 3] },
  Mi:    { strings: [0, 2, 2, 1, 0, 0] },
  Fa:    { strings: [1, 3, 3, 2, 1, 1], barre: { fret: 1, fromString: 0, toString: 5 } },
  "Fa#": { strings: [2, 4, 4, 3, 2, 2], barre: { fret: 2, fromString: 0, toString: 5 } },
  Sol:   { strings: [3, 2, 0, 0, 0, 3] },
  "Sol#":{ strings: [4, 6, 6, 5, 4, 4], barre: { fret: 4, fromString: 0, toString: 5 } },
  La:    { strings: [-1, 0, 2, 2, 2, 0] },
  "Si♭": { strings: [-1, 1, 3, 3, 3, 1], barre: { fret: 1, fromString: 1, toString: 5 } },
  Si:    { strings: [-1, 2, 4, 4, 4, 2], barre: { fret: 2, fromString: 1, toString: 5 } },
};

export const GUITAR_NOTES = Object.keys(GUITAR_CHORDS);
