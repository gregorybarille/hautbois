// Musical note names in solfège (French)
export const NOTE_NAMES = ['Do', 'Ré', 'Mi', 'Fa', 'Sol', 'La', 'Si'] as const

// Mapping between English notation and French solfège
export const NOTE_MAP: Record<string, string> = {
  C: 'Do',
  D: 'Ré',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
}

// Reverse mapping from French to English for VexFlow
export const REVERSE_NOTE_MAP: Record<string, string> = {
  Do: 'C',
  Ré: 'D',
  Mi: 'E',
  Fa: 'F',
  Sol: 'G',
  La: 'A',
  Si: 'B',
}

// English note names for internal use with audio libraries
export const ENGLISH_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const

// Octaves used in the app
export const OCTAVES = [4, 5, 6] as const

// Constants for pitch detection
export const A4_FREQUENCY = 440
export const A4_OFFSET = 4.75
export const SEMITONES_PER_OCTAVE = 12
export const DETECTION_THROTTLE_MS = 100

// Oboe fingering chart
export const OBOE_FINGERING_CHART: Record<string, string[]> = {
  'C4': ['Gauche : Pouce + 1,2,3', 'Droite : 1,2,3 + Do grave'],
  'D4': ['Gauche : Pouce + 1,2,3', 'Droite : 1,2,3'],
  'E4': ['Gauche : Pouce + 1,2', 'Droite : 1,2,3'],
  'F4': ['Gauche : Pouce + 1,2', 'Droite : 1,2'],
  'G4': ['Gauche : Pouce + 1,2', 'Droite : 1'],
  'A4': ['Gauche : Pouce + 1', 'Droite : 1'],
  'B4': ['Gauche : Pouce + 1', 'Droite : -'],
  'C5': ['Gauche : Pouce + 1,2', 'Droite : -'],
  'D5': ['Gauche : Pouce', 'Droite : -'],
  'E5': ['Gauche : Pouce (demi-trou) + 1', 'Droite : -'],
  'F5': ['Gauche : Pouce (demi-trou) + 1,2', 'Droite : 1'],
  'G5': ['Gauche : Pouce (demi-trou) + 1,2', 'Droite : -'],
  'A5': ['Gauche : Pouce (demi-trou) + 1', 'Droite : -'],
  'B5': ['Gauche : Pouce (demi-trou)', 'Droite : -'],
  'C6': ['Gauche : Pouce (demi-trou) + 2', 'Droite : -'],
}
