import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RotateCcw, ArrowRight, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { INTERVALS, semitoneToFrequency } from "@/shared/music/theory";
import { isAudioSupported, playSequence } from "@/shared/audio/synth";
import {
  loadBoxes,
  recordResult,
  saveBoxes,
  weightedDraw,
} from "@/shared/srs/leitner";
import { recordSession } from "@/shared/progress/history";

const SRS_KEY = "srs-ear-intervals";
// Comfortable mid-range roots (semitones relative to middle Do, C4 = 0).
const ROOT_MIN = -9; // La3
const ROOT_MAX = 4; // Mi4

interface Question {
  semitones: number; // interval size
  root: number; // root semitone
}

interface Answer {
  chosen: number; // chosen interval size
  correct: boolean;
}

const randomRoot = () =>
  ROOT_MIN + Math.floor(Math.random() * (ROOT_MAX - ROOT_MIN + 1));

export const EarTraining = () => {
  const { t } = useTranslation();
  const audioOk = isAudioSupported();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  // Log history in rounds of 10 answered questions.
  const round = useRef({ answered: 0, correct: 0 });

  const playQuestion = useCallback((q: Question) => {
    playSequence(
      [q.root, q.root + q.semitones].map(semitoneToFrequency),
      2,
    );
  }, []);

  const nextQuestion = useCallback(() => {
    const [size] = weightedDraw(
      INTERVALS.map((i) => String(i.semitones)),
      loadBoxes(SRS_KEY),
      1,
    );
    const q: Question = { semitones: Number(size), root: randomRoot() };
    setQuestion(q);
    setAnswer(null);
    playQuestion(q);
  }, [playQuestion]);

  useEffect(() => {
    // Prepare a first question but don't auto-play (needs a user gesture).
    const [size] = weightedDraw(
      INTERVALS.map((i) => String(i.semitones)),
      loadBoxes(SRS_KEY),
      1,
    );
    setQuestion({ semitones: Number(size), root: randomRoot() });
  }, []);

  const handleAnswer = (chosen: number) => {
    if (!question || answer) return;
    const correct = chosen === question.semitones;
    setAnswer({ chosen, correct });
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));
    saveBoxes(
      SRS_KEY,
      recordResult(loadBoxes(SRS_KEY), String(question.semitones), correct),
    );

    round.current.answered += 1;
    if (correct) round.current.correct += 1;
    if (round.current.answered >= 10) {
      recordSession("ear", round.current.correct, round.current.answered);
      round.current = { answered: 0, correct: 0 };
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {t("menu.earTraining.title")}
        </h2>
        <p className="text-muted-foreground">{t("ear.instructions")}</p>
      </div>

      {!audioOk && (
        <Alert variant="destructive">
          <AlertTitle>{t("ear.noAudioTitle")}</AlertTitle>
          <AlertDescription>{t("ear.noAudio")}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge className="bg-green-600 text-white">✓ {score.correct}</Badge>
          <Badge variant="destructive">✗ {score.incorrect}</Badge>
        </div>
      </div>

      {/* Replay */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() => question && playQuestion(question)}
          disabled={!audioOk || !question}
          className="h-16 rounded-full px-8 text-lg"
        >
          <Volume2 className="size-6" />
          {t("ear.replay")}
        </Button>
      </div>

      {/* Interval choices */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {INTERVALS.map((interval) => {
          const isCorrect = answer && interval.semitones === question?.semitones;
          const isWrongChoice =
            answer &&
            !answer.correct &&
            interval.semitones === answer.chosen;
          return (
            <Button
              key={interval.semitones}
              variant="outline"
              onClick={() => handleAnswer(interval.semitones)}
              disabled={!!answer}
              className={cn(
                "h-14 text-base font-semibold disabled:opacity-100",
                isCorrect &&
                  "border-green-500 bg-green-500/15 text-green-700 dark:text-green-300",
                isWrongChoice &&
                  "border-red-500 bg-red-500/15 text-red-700 dark:text-red-300",
              )}
            >
              {t(interval.labelKey)}
            </Button>
          );
        })}
      </div>

      {/* Feedback + next */}
      <div className="flex min-h-12 items-center justify-center gap-3">
        {answer && (
          <>
            <span
              className={cn(
                "text-lg font-semibold",
                answer.correct
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {answer.correct ? t("ear.correct") : t("ear.incorrect")}
            </span>
            <Button onClick={nextQuestion}>
              {t("ear.next")}
              <ArrowRight className="size-4" />
            </Button>
          </>
        )}
        {!answer && (
          <Button variant="ghost" onClick={nextQuestion} disabled={!audioOk}>
            <RotateCcw className="size-4" />
            {t("ear.skip")}
          </Button>
        )}
      </div>
    </div>
  );
};
