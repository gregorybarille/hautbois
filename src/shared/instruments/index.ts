import { InstrumentConfig, InstrumentId } from "./types";
import { oboe } from "./oboe";

export type { InstrumentConfig, InstrumentId, NoteChartProps } from "./types";

export const INSTRUMENTS: Record<InstrumentId, InstrumentConfig> = {
  oboe,
};

export const INSTRUMENT_IDS = Object.keys(INSTRUMENTS) as InstrumentId[];

export const DEFAULT_INSTRUMENT: InstrumentId = "oboe";
