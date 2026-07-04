import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { MusicScore } from "../../shared/components/music/MusicScore";
import { InstrumentConfig } from "../../shared/instruments";

interface FingeringHelperProps {
  instrument: InstrumentConfig;
}

export const FingeringHelper = ({ instrument }: FingeringHelperProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const NOTES = instrument.notes;

  // Filter for natural notes only (no sharp or flat symbols)
  const naturalNotes = useMemo(
    () => NOTES.filter((n) => !n.includes("♭") && !n.includes("#")),
    [NOTES],
  );

  // Initialize with the instrument's first available natural note
  const [selectedNote, setSelectedNote] = useState(
    () => naturalNotes[0] ?? NOTES[0],
  );

  // Determine base note (without accidental) of the currently selected note
  const currentBaseNote = useMemo(
    () => selectedNote.replace(/[♭#]/, ""),
    [selectedNote],
  );

  // Find available variations for the current base note
  const variations = useMemo(() => {
    return {
      flat: NOTES.find(
        (n) => n.replace(/[♭#]/, "") === currentBaseNote && n.includes("♭"),
      ),
      sharp: NOTES.find(
        (n) => n.replace(/[♭#]/, "") === currentBaseNote && n.includes("#"),
      ),
      natural: NOTES.find((n) => n === currentBaseNote),
    };
  }, [NOTES, currentBaseNote]);

  const handleScoreClick = (note: string) => {
    // When clicking score (natural note), reset to natural
    setSelectedNote(note);
  };

  const isFlat = selectedNote.includes("♭");
  const isSharp = selectedNote.includes("#");
  const isWide = instrument.layout === "wide";

  const toggleFlat = () => {
    if (isFlat && variations.natural) setSelectedNote(variations.natural);
    else if (variations.flat) setSelectedNote(variations.flat);
  };

  const toggleSharp = () => {
    if (isSharp && variations.natural) setSelectedNote(variations.natural);
    else if (variations.sharp) setSelectedNote(variations.sharp);
  };

  // Partition section: staff (fills available width) + accidental variations.
  const partition = (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <MusicScore
          notes={naturalNotes}
          activeNote={currentBaseNote}
          onNoteClick={handleScoreClick}
          darkMode={darkMode}
        />
      </div>

      <div className="mt-5 flex flex-col items-center">
        <span className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Variations
        </span>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={isFlat ? "default" : "outline"}
            disabled={!variations.flat}
            onClick={toggleFlat}
            className="size-14 rounded-full font-serif text-3xl"
          >
            ♭
          </Button>
          <Button
            type="button"
            variant={isSharp ? "default" : "outline"}
            disabled={!variations.sharp}
            onClick={toggleSharp}
            className="size-14 rounded-full font-serif text-3xl"
          >
            ♯
          </Button>
        </div>
      </div>
    </section>
  );

  // Instrument fingering chart, shown in a bordered panel.
  const chartPanel = (
    <aside
      className={cn(
        "flex min-h-0 flex-col items-center rounded-2xl border border-border bg-card/40 p-4",
        isWide ? "w-full shrink-0" : "shrink-0 lg:w-72",
      )}
    >
      <h3 className="mb-3 shrink-0 text-3xl font-semibold text-foreground">
        {selectedNote}
      </h3>
      <div className="flex min-h-0 w-full flex-1 items-center justify-center">
        <instrument.NoteChart
          note={selectedNote}
          height={isWide ? 200 : 650}
          darkMode={darkMode}
        />
      </div>
    </aside>
  );

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
      <h2 className="mb-4 shrink-0 text-2xl font-semibold text-foreground">
        {t("menu.fingeringHelper.title")}
      </h2>

      <div
        className={cn(
          "flex min-h-0 flex-1 gap-6",
          isWide ? "flex-col" : "flex-col lg:flex-row lg:items-stretch",
        )}
      >
        {partition}
        {chartPanel}
      </div>
    </div>
  );
};
