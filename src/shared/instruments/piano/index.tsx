import { InstrumentConfig } from "../types";
import { noteSemitone } from "../../music/notes";
import { PianoKeyboard } from "./PianoKeyboard";

const CHROMATIC = [
  "Do",
  "Do#",
  "Ré",
  "Mi♭",
  "Mi",
  "Fa",
  "Fa#",
  "Sol",
  "Sol#",
  "La",
  "Si♭",
  "Si",
];

// Three octaves: Grave (C3), middle (C4), Aigu (C5)
const PIANO_NOTES = [
  ...CHROMATIC.map((n) => `${n} Grave`),
  ...CHROMATIC,
  ...CHROMATIC.map((n) => `${n} Aigu`),
];

export const piano: InstrumentConfig = {
  id: "piano",
  labelKey: "instruments.piano",
  notes: PIANO_NOTES,
  layout: "wide",
  NoteChart: ({ note, darkMode }) => {
    const semitone = noteSemitone(note);
    return (
      <PianoKeyboard
        // noteSemitone is C4-relative; the keyboard starts at C3
        highlightSemitone={semitone === null ? null : semitone + 12}
        darkMode={darkMode}
      />
    );
  },
};
