import { InstrumentConfig, InstrumentId } from "./types";
import { oboe } from "./oboe";
import { flute } from "./flute";
import { piano } from "./piano";

export type { InstrumentConfig, InstrumentId, NoteChartProps } from "./types";

export const INSTRUMENTS: Record<InstrumentId, InstrumentConfig> = {
  oboe,
  flute,
  piano,
};

export const INSTRUMENT_IDS = Object.keys(INSTRUMENTS) as InstrumentId[];

export const DEFAULT_INSTRUMENT: InstrumentId = "oboe";
