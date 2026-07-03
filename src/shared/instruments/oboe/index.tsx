import { InstrumentConfig } from "../types";
import { OBOE_FINGERINGS } from "./fingerings";
import { OboeFingeringChart } from "./OboeFingeringChart";

export const oboe: InstrumentConfig = {
  id: "oboe",
  labelKey: "instruments.oboe",
  notes: Object.keys(OBOE_FINGERINGS),
  layout: "tall",
  NoteChart: ({ note, darkMode, height = 650 }) => (
    <OboeFingeringChart
      keys={OBOE_FINGERINGS[note]}
      darkMode={darkMode}
      height={height}
    />
  ),
};
