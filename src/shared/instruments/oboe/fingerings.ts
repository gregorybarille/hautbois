export type KeyState = "open" | "closed" | "half";

export interface OboeKeys {
  // Left Hand
  octave1: boolean; // Thumb
  octave2: boolean; // Side
  octave3: boolean; // Side
  l1: KeyState; // Index
  l2: boolean; // Middle
  l3: boolean; // Ring
  gSharp: boolean; // Ab (Pinky)
  leftEb: boolean; // Side
  leftF: boolean; // Side
  lowB: boolean; // Pinky
  lowBb: boolean; // Pinky

  // Right Hand
  r1: boolean; // Index
  r2: boolean; // Middle
  r3: boolean; // Ring
  banana: boolean; // C alternate
  c: boolean; // Pinky
  cSharp: boolean; // Db (Pinky)
  rightEb: boolean; // Pinky
}

export const DEFAULT_KEYS: OboeKeys = {
  octave1: false,
  octave2: false,
  octave3: false,
  l1: "open",
  l2: false,
  l3: false,
  gSharp: false,
  leftEb: false,
  leftF: false,
  lowB: false,
  lowBb: false,
  r1: false,
  r2: false,
  r3: false,
  banana: false,
  c: false,
  cSharp: false,
  rightEb: false,
};

// Basic fingering chart
export const OBOE_FINGERINGS: Record<string, Partial<OboeKeys>> = {
  // Low Register
  "Si♭ Grave": {
    l1: "closed",
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    lowBb: true,
    lowB: true,
    c: true,
  },
  "Si Grave": {
    l1: "closed",
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    lowB: true,
    c: true,
  },
  Do: {
    l1: "closed",
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    c: true,
  },
  "Do#": {
    l1: "closed",
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    cSharp: true,
    c: true,
  }, // C# needs C usually pressed on some oboes or linked mechanism? Simplified here.
  Ré: { l1: "closed", l2: true, l3: true, r1: true, r2: true, r3: true },
  "Mi♭": {
    l1: "closed",
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    rightEb: true,
  },
  Mi: { l1: "closed", l2: true, l3: true, r1: true, r2: true },
  Fa: {
    l1: "closed",
    l2: true,
    l3: true,
    r1: true,
    r2: false,
    r3: true,
    rightEb: true,
  }, // Forked F
  "Fa#": { l1: "closed", l2: true, l3: true, r2: true },
  Sol: { l1: "closed", l2: true, l3: true },
  "Sol#": { l1: "closed", l2: true, l3: true, gSharp: true },
  La: { l1: "closed", l2: true },
  "Si♭": { l1: "closed", l2: true, r1: true }, // A + R1 side? Or Bis? Let's assume standard A + R1
  Si: { l1: "closed" },
  "Do Aigu": { l2: true, r1: true },
  "Do# Aigu": {
    l1: "half",
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    cSharp: true,
  }, // Starts half hole range usually C# or D
  "Ré Aigu": { l1: "half", l2: true, l3: true, r1: true, r2: true, r3: true },
  "Mi♭ Aigu": {
    l1: "half",
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    rightEb: true,
  },
  "Mi Aigu": { l1: "half", l2: true, l3: true, r1: true, r2: true },
  "Fa Aigu": {
    l1: "half",
    l2: true,
    l3: true,
    r1: true,
    r3: true,
    rightEb: true,
  },
  "Sol Aigu": { l1: "half", l2: true, l3: true, octave3: true }, // Often octave 2 or 3 depending on model
};
