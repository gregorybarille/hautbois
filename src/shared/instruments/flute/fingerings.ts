// Boehm-system transverse flute keys.
export interface FluteKeys {
  // Left hand
  thumbB: boolean; // Thumb B key
  thumbBb: boolean; // Thumb B♭ lever (Briccialdi)
  l1: boolean; // Index
  l2: boolean; // Middle
  l3: boolean; // Ring
  gSharp: boolean; // Pinky

  // Right hand
  r1: boolean; // Index
  r2: boolean; // Middle
  r3: boolean; // Ring
  dSharp: boolean; // Pinky E♭/D# key (pressed for most notes)
  lowCSharp: boolean; // Foot joint roller
  lowC: boolean; // Foot joint roller
}

// Standard Boehm fingerings, first octave (C4-B4) and second octave
// ("Aigu", C5-B5). Generated from standard charts — verify against a
// published fingering chart before relying on them.
export const FLUTE_FINGERINGS: Record<string, Partial<FluteKeys>> = {
  // First octave
  Do: {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    lowCSharp: true,
    lowC: true,
  },
  "Do#": {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    lowCSharp: true,
  },
  Ré: {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
  },
  "Mi♭": {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    dSharp: true,
  },
  Mi: {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    dSharp: true,
  },
  Fa: {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r1: true,
    dSharp: true,
  },
  "Fa#": {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r3: true,
    dSharp: true,
  },
  Sol: { thumbB: true, l1: true, l2: true, l3: true, dSharp: true },
  "Sol#": {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    gSharp: true,
    dSharp: true,
  },
  La: { thumbB: true, l1: true, l2: true, dSharp: true },
  // Pouce Si♭ (Briccialdi), le doigté enseigné en premier en France;
  // alternative « 1 et 1 » : thumbB + l1 + r1 + dSharp
  "Si♭": { thumbBb: true, l1: true, dSharp: true },
  Si: { thumbB: true, l1: true, dSharp: true },

  // Second octave (overblown; D5/E♭5 lift L1)
  "Do Aigu": { l1: true, dSharp: true },
  "Do# Aigu": { dSharp: true },
  "Ré Aigu": {
    thumbB: true,
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
  },
  "Mi♭ Aigu": {
    thumbB: true,
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    r3: true,
    dSharp: true,
  },
  "Mi Aigu": {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r1: true,
    r2: true,
    dSharp: true,
  },
  "Fa Aigu": {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r1: true,
    dSharp: true,
  },
  "Fa# Aigu": {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    r3: true,
    dSharp: true,
  },
  "Sol Aigu": { thumbB: true, l1: true, l2: true, l3: true, dSharp: true },
  "Sol# Aigu": {
    thumbB: true,
    l1: true,
    l2: true,
    l3: true,
    gSharp: true,
    dSharp: true,
  },
  "La Aigu": { thumbB: true, l1: true, l2: true, dSharp: true },
  "Si♭ Aigu": { thumbBb: true, l1: true, dSharp: true },
  "Si Aigu": { thumbB: true, l1: true, dSharp: true },
};
