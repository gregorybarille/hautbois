import { InstrumentId } from "@/shared/instruments";

// Central registry of spaced-repetition deck keys (localStorage).
export const DECK = {
  notes: "srs2-notes",
  intervals: "srs2-intervals",
  scales: "srs2-scales",
  fingerings: (instrument: InstrumentId) => `srs2-fingerings-${instrument}`,
} as const;
