import { NOTE_MAP, REVERSE_NOTE_MAP, A4_FREQUENCY, A4_OFFSET, SEMITONES_PER_OCTAVE } from '../constants/notes'

/**
 * Converts English note notation to French solfège
 * @param englishNote - Note in English (e.g., 'C4', 'D5')
 * @returns Note in French solfège (e.g., 'Do4', 'Ré5')
 */
export function toFrenchNote(englishNote: string): string {
  const noteName = englishNote[0]
  const octave = englishNote.slice(1)
  return `${NOTE_MAP[noteName]}${octave}`
}

/**
 * Converts French solfège to English note notation
 * @param frenchNote - Note in French (e.g., 'Do4', 'Ré5')
 * @returns Note in English (e.g., 'C4', 'D5')
 */
export function toEnglishNote(frenchNote: string): string {
  // Handle notes with accidentals (e.g., 'Ré#4')
  const match = frenchNote.match(/^([A-Za-zéèà]+)(#|b)?(\d+)$/)
  if (!match) return frenchNote
  
  const [, noteName, accidental = '', octave] = match
  const englishName = REVERSE_NOTE_MAP[noteName]
  return englishName ? `${englishName}${accidental}${octave}` : frenchNote
}

/**
 * Converts frequency to note name (English notation)
 * @param frequency - Frequency in Hz
 * @returns Note name with octave (e.g., 'C4')
 */
export function frequencyToNote(frequency: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const c0 = A4_FREQUENCY * Math.pow(2, -A4_OFFSET)
  
  if (frequency < 1) return ''
  
  const halfSteps = SEMITONES_PER_OCTAVE * (Math.log(frequency / c0) / Math.log(2))
  const octave = Math.floor(halfSteps / SEMITONES_PER_OCTAVE)
  const note = Math.round(halfSteps % SEMITONES_PER_OCTAVE)
  
  return `${noteNames[note]}${octave}`
}

/**
 * Gets the display name for a note (French solfège with octave)
 * @param englishNote - Note in English (e.g., 'C4')
 * @returns Display name (e.g., 'Do4')
 */
export function getDisplayNoteName(englishNote: string): string {
  return toFrenchNote(englishNote)
}
