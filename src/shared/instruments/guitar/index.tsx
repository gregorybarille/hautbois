import { InstrumentConfig } from "../types";
import { CHROMATIC_NOTES } from "../../music/notes";
import { GuitarFretboard } from "./GuitarFretboard";

export const guitar: InstrumentConfig = {
  id: "guitar",
  labelKey: "instruments.guitar",
  // Pitch classes only: the fretboard shows every position of the note,
  // so register suffixes would be redundant.
  notes: CHROMATIC_NOTES,
  layout: "wide",
  NoteChart: ({ note, darkMode }) => (
    <GuitarFretboard note={note} darkMode={darkMode} />
  ),
};
