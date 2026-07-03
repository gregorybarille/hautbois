import { InstrumentConfig } from "../types";
import { GUITAR_CHORDS, GUITAR_NOTES } from "./chords";
import { GuitarChordDiagram } from "./GuitarFretboard";

export const guitar: InstrumentConfig = {
  id: "guitar",
  labelKey: "instruments.guitar",
  notes: GUITAR_NOTES,
  layout: "wide",
  NoteChart: ({ note, darkMode }) => {
    const chord = GUITAR_CHORDS[note];
    if (!chord) return null;
    return <GuitarChordDiagram chord={chord} darkMode={darkMode} />;
  },
};
