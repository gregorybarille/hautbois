import type { ReactNode } from "react";

// Grows as instruments are added.
export type InstrumentId = "oboe" | "flute" | "piano";

export interface NoteChartProps {
  // French note name taken from this instrument's `notes` list.
  note: string;
  darkMode?: boolean;
  // Sizing hint; "wide" charts (piano, guitar) may size by width instead.
  height?: number;
}

export interface InstrumentConfig {
  id: InstrumentId;
  labelKey: string; // i18n key, e.g. "instruments.oboe"
  notes: string[]; // ordered note list (shared French convention)
  NoteChart: (props: NoteChartProps) => ReactNode;
  // FingeringHelper layout: "tall" charts sit beside the staff, "wide" below.
  layout: "tall" | "wide";
}
