import { InstrumentConfig } from "../types";
import { CHROMATIC_NOTES, noteSemitone } from "../../music/notes";
import { PianoKeyboard } from "./PianoKeyboard";

// Three octaves: Grave (C3), middle (C4), Aigu (C5)
const PIANO_NOTES = [
  ...CHROMATIC_NOTES.map((n) => `${n} Grave`),
  ...CHROMATIC_NOTES,
  ...CHROMATIC_NOTES.map((n) => `${n} Aigu`),
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
