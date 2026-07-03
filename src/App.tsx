import { useState } from "react";
import { AppShell, View } from "./shared/components";
import { useLocalStorage } from "./shared/hooks/useLocalStorage";
import {
  DEFAULT_INSTRUMENT,
  INSTRUMENTS,
  InstrumentId,
} from "./shared/instruments";
import { Home } from "./features/home";
import { ScoreFlashcards } from "./features/score-flashcards";
import { NameFlashcards } from "./features/name-flashcards";
import { FingeringHelper } from "./features/fingering-helper";

function App() {
  const [view, setView] = useState<View>("home");
  const [instrumentId, setInstrumentId] = useLocalStorage<InstrumentId>(
    "hautbois-instrument",
    DEFAULT_INSTRUMENT,
  );
  // Guard against stale/garbage localStorage values
  const instrument = INSTRUMENTS[instrumentId] ?? INSTRUMENTS[DEFAULT_INSTRUMENT];

  return (
    <AppShell
      view={view}
      onViewChange={setView}
      instrumentId={instrument.id}
      onInstrumentChange={setInstrumentId}
    >
      {view === "home" && <Home onNavigate={setView} />}
      {view === "scoreFlashcards" && <ScoreFlashcards />}
      {view === "nameFlashcards" && (
        <NameFlashcards key={instrument.id} instrument={instrument} />
      )}
      {view === "fingeringHelper" && (
        <FingeringHelper key={instrument.id} instrument={instrument} />
      )}
    </AppShell>
  );
}

export default App;
