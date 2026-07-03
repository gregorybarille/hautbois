import { InstrumentConfig } from "../types";
import { FLUTE_FINGERINGS } from "./fingerings";
import { FluteFingeringChart } from "./FluteFingeringChart";

export const flute: InstrumentConfig = {
  id: "flute",
  labelKey: "instruments.flute",
  notes: Object.keys(FLUTE_FINGERINGS),
  layout: "tall",
  NoteChart: ({ note, darkMode, height = 650 }) => (
    <FluteFingeringChart
      keys={FLUTE_FINGERINGS[note]}
      darkMode={darkMode}
      height={height}
    />
  ),
};
