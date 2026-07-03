import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Info, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { InstrumentConfig } from "../../shared/instruments";

interface NameFlashcardsProps {
  instrument: InstrumentConfig;
}

export const NameFlashcards = ({ instrument }: NameFlashcardsProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const NOTES = instrument.notes;
  const [currentNote, setCurrentNote] = useState<string>(NOTES[0]);
  const [isFingeringVisible, setIsFingeringVisible] = useState(false);

  const nextNote = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * NOTES.length);
    } while (NOTES[nextIndex] === currentNote && NOTES.length > 1);

    setCurrentNote(NOTES[nextIndex]);
    setIsFingeringVisible(false);
  };

  const toggleFingering = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFingeringVisible(!isFingeringVisible);
  };

  const renderNoteDisplay = (noteStr: string) => {
    if (noteStr.includes("Grave")) {
      const noteName = noteStr.replace(" Grave", "");
      return (
        <span className="relative inline-flex items-center">
          <span>{noteName}</span>
          <ArrowDownRight
            className="absolute left-full ml-2 size-20 text-red-500"
            strokeWidth={2}
          />
        </span>
      );
    }
    if (noteStr.includes("Aigu")) {
      const noteName = noteStr.replace(" Aigu", "");
      return (
        <span className="relative inline-flex items-center">
          <span>{noteName}</span>
          <ArrowUpRight
            className="absolute left-full ml-2 size-20 text-blue-500"
            strokeWidth={2}
          />
        </span>
      );
    }
    return <span>{noteStr}</span>;
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col">
      <h2 className="mb-6 text-center text-2xl font-bold text-foreground sm:text-3xl">
        {t("menu.nameFlashcards.title")}
      </h2>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Card
          onClick={nextNote}
          className="relative flex aspect-[4/3] max-h-[60vh] w-full cursor-pointer items-center justify-center p-0 shadow-lg transition-all select-none hover:-translate-y-1 hover:shadow-xl"
        >
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={toggleFingering}
            aria-label="Show Fingering"
            className="absolute top-4 right-4 z-10 rounded-full text-blue-600 dark:text-blue-400"
          >
            <Info className="size-6" />
          </Button>

          <span className="text-7xl leading-none font-black text-blue-600 sm:text-8xl dark:text-blue-400">
            {renderNoteDisplay(currentNote)}
          </span>

          <span className="absolute bottom-6 text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Tap for next
          </span>
        </Card>
      </div>

      <Dialog open={isFingeringVisible} onOpenChange={setIsFingeringVisible}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Doigté : {currentNote}
            </DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[70vh] justify-center overflow-auto rounded-xl bg-card p-4">
            <instrument.NoteChart
              note={currentNote}
              height={360}
              darkMode={theme === "dark"}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
