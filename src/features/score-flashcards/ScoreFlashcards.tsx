import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MusicScore } from "../../shared/components/music/MusicScore";
import { NOTE_BASES } from "../../shared/music/notes";
import { useNoteSpeechRecognition } from "../../shared/hooks/useNoteSpeechRecognition";

// Notes naturelles uniquement (Do, Ré, Mi, Fa, Sol, La, Si)
const NATURAL_NOTES: string[] = NOTE_BASES;

const STATUS_COLORS = {
  current: "#3b82f6",
  correct: "#22c55e",
  incorrect: "#ef4444",
};

interface NoteResult {
  note: string;
  status: "pending" | "correct" | "incorrect";
  userAnswer?: string;
}

export const ScoreFlashcards = () => {
  const { t } = useTranslation();
  const [generatedNotes, setGeneratedNotes] = useState<NoteResult[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  // Générer 10 notes aléatoires
  const generateNotes = useCallback(() => {
    const notes: NoteResult[] = [];
    for (let i = 0; i < 10; i++) {
      const randomNote =
        NATURAL_NOTES[Math.floor(Math.random() * NATURAL_NOTES.length)];
      notes.push({
        note: randomNote,
        status: "pending",
      });
    }
    setGeneratedNotes(notes);
    setCurrentNoteIndex(0);
    setScore({ correct: 0, incorrect: 0 });
  }, []);

  // Initialiser les notes au montage
  useEffect(() => {
    generateNotes();
  }, [generateNotes]);

  // Vérifier la réponse
  const checkAnswer = useCallback(
    (selectedNote: string) => {
      if (currentNoteIndex >= generatedNotes.length) return;

      const currentNote = generatedNotes[currentNoteIndex].note;
      const isCorrect = selectedNote === currentNote;

      const newNotes = [...generatedNotes];
      newNotes[currentNoteIndex] = {
        ...newNotes[currentNoteIndex],
        status: isCorrect ? "correct" : "incorrect",
        userAnswer: selectedNote,
      };
      setGeneratedNotes(newNotes);

      // Mettre à jour le score
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      }));

      // Passer à la note suivante directement
      setCurrentNoteIndex((prev) => prev + 1);
    },
    [currentNoteIndex, generatedNotes],
  );

  const voice = useNoteSpeechRecognition(checkAnswer);

  // Calcul de la progression
  const progress = generatedNotes.length
    ? (currentNoteIndex / generatedNotes.length) * 100
    : 0;
  const isComplete = currentNoteIndex >= generatedNotes.length;

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {t("menu.scoreFlashcards.title")}
        </h2>
        <p className="text-muted-foreground">
          Dictez ou cliquez sur la note correspondante
        </p>
      </div>

      {!voice.supported && (
        <Alert className="text-amber-600 dark:text-amber-400">
          <AlertTitle>Dictée vocale non disponible</AlertTitle>
          <AlertDescription>
            Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez
            les boutons pour répondre.
          </AlertDescription>
        </Alert>
      )}

      {voice.error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur de dictée vocale</AlertTitle>
          <AlertDescription>
            {voice.error}. Utilisez les boutons pour répondre.
          </AlertDescription>
        </Alert>
      )}

      {/* Progression */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Progression : {currentNoteIndex} / {generatedNotes.length}
          </span>
          <div className="flex gap-2">
            <Badge className="bg-green-600 text-white">✓ {score.correct}</Badge>
            <Badge variant="destructive">✗ {score.incorrect}</Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>

      {/* Partition musicale */}
      <div className="overflow-hidden rounded-2xl border-2 border-blue-500 bg-gradient-to-b from-white to-slate-50 p-4 shadow-[0_4px_12px_rgba(34,139,230,0.1)] dark:from-slate-900 dark:to-slate-950">
        <MusicScore
          notes={generatedNotes.map((n) => n.note)}
          noteSpacing={70}
          noteColor={(_, index) => {
            if (index === currentNoteIndex) return STATUS_COLORS.current;
            const status = generatedNotes[index]?.status;
            return status === "pending" ? undefined : STATUS_COLORS[status];
          }}
        />
      </div>

      {/* Sélection de notes */}
      {!isComplete ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={voice.toggle}
                  size="icon-lg"
                  disabled={!voice.supported}
                  variant={voice.listening ? "default" : "secondary"}
                  className={
                    voice.listening
                      ? "size-13 rounded-full bg-red-600 text-white hover:bg-red-600/90"
                      : "size-13 rounded-full text-blue-600 dark:text-blue-400"
                  }
                >
                  {voice.listening ? (
                    <MicOff className="size-6" />
                  ) : (
                    <Mic className="size-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {voice.listening
                  ? "Arrêter la dictée"
                  : "Activer la dictée vocale"}
              </TooltipContent>
            </Tooltip>

            {voice.transcript && (
              <div className="rounded-lg border-2 border-blue-500 bg-blue-50 px-4 py-2 text-center dark:bg-blue-950/40">
                <span className="text-sm text-muted-foreground">
                  🎤 Vous dites :{" "}
                </span>
                <span className="text-base font-medium text-blue-700 dark:text-blue-300">
                  {voice.transcript}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-7">
            {NATURAL_NOTES.map((note) => (
              <Button
                key={note}
                onClick={() => checkAnswer(note)}
                variant="secondary"
                className="h-16 text-xl font-bold text-blue-700 dark:text-blue-300"
              >
                {note}
              </Button>
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={generateNotes}>
              <RefreshCw className="size-5" />
              Générer de nouvelles notes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="rounded-xl bg-gradient-to-br from-green-100 to-sky-100 p-8 text-center dark:from-green-950/50 dark:to-sky-950/50">
            <p className="mb-3 text-xl font-bold text-green-800 dark:text-green-300">
              ✅ Exercice terminé !
            </p>
            <p className="mb-3 text-lg font-medium text-foreground">
              Score final : {score.correct} / {generatedNotes.length}
            </p>
            <p className="text-muted-foreground">
              Taux de réussite :{" "}
              {Math.round((score.correct / generatedNotes.length) * 100)}%
            </p>
          </div>

          <Button size="lg" onClick={generateNotes}>
            <RefreshCw className="size-6" />
            Nouvelle série
          </Button>
        </div>
      )}
    </div>
  );
};
