import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Info, X, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button, Card } from "../../shared/components";
import { OboeFingeringChart } from "../../shared/components/oboe/OboeFingeringChart";
import { NOTES, OBOE_FINGERINGS } from "../../shared/constants/oboeFingerings";

interface NameFlashcardsProps {
  onBack: () => void;
}

export const NameFlashcards = ({ onBack }: NameFlashcardsProps) => {
  const { t } = useTranslation();
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
        <div className="flex items-center gap-2">
          <span>{noteName}</span>
          <ArrowDownRight
            className="w-24 h-24 text-secondary mt-4"
            strokeWidth={3}
          />
        </div>
      );
    }
    if (noteStr.includes("Aigu")) {
      const noteName = noteStr.replace(" Aigu", "");
      return (
        <div className="flex items-center gap-2">
          <span>{noteName}</span>
          <ArrowUpRight
            className="w-24 h-24 text-secondary mb-4"
            strokeWidth={3}
          />
        </div>
      );
    }
    return <span>{noteStr}</span>;
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        <div className="w-full flex justify-start mb-6">
          <Button onClick={onBack} variant="ghost">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("common.back")}
          </Button>
        </div>

        <h2 className="text-3xl font-bold mb-8 text-center">
          {t("menu.nameFlashcards.title")}
        </h2>

        {/* Flashcard container */}
        <div className="w-full relative">
          <Card
            onClick={nextNote}
            className="h-80 flex items-center justify-center cursor-pointer hover:shadow-2xl transition-all active:scale-95 select-none relative"
            hover
            noBody
          >
            {/* Info Button positioned absolute within the card */}
            <button
              onClick={toggleFingering}
              className="absolute top-4 right-4 z-10 btn btn-circle btn-ghost btn-sm text-info hover:bg-info/20"
              aria-label="Show Fingering"
            >
              <Info className="w-6 h-6" />
            </button>

            <div className="text-8xl font-black text-primary">
              {renderNoteDisplay(currentNote)}
            </div>
            <div className="absolute bottom-6 text-base-content/40 text-sm font-medium uppercase tracking-widest">
              Tap for next
            </div>
          </Card>
        </div>

        {/* Fingering Modal */}
        {isFingeringVisible && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsFingeringVisible(false)}
          >
            <div
              className="bg-base-100 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFingeringVisible(false)}
                className="absolute top-4 right-4 btn btn-circle btn-ghost btn-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold text-center mb-4">
                Doigté : {currentNote}
              </h3>

              <div className="flex justify-center bg-white rounded-xl p-4">
                <OboeFingeringChart
                  keys={OBOE_FINGERINGS[currentNote]}
                  height={400}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
