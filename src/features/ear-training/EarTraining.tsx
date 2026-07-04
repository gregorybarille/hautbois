import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ChoiceGrid, FeedbackRow } from "@/shared/components/quiz";
import {
  INTERVALS,
  INTERVAL_IDS,
  randomIntervalRoot,
} from "@/shared/music/theory";
import { isAudioSupported, playInterval } from "@/shared/audio/synth";
import { pickWeighted, review } from "@/shared/srs/scheduler";
import { DECK } from "@/shared/srs/decks";
import { recordSession } from "@/shared/progress/history";

interface Question {
  semitones: number; // interval size
  root: number; // root semitone
}

interface Answer {
  chosen: number; // chosen interval size
  correct: boolean;
}

const makeQuestion = (): Question => ({
  semitones: Number(pickWeighted(DECK.intervals, INTERVAL_IDS)),
  root: randomIntervalRoot(),
});

const playQuestion = (q: Question) => playInterval(q.root, q.semitones);

export const EarTraining = () => {
  const { t } = useTranslation();
  const audioOk = isAudioSupported();

  // The first question isn't auto-played (audio needs a user gesture).
  const [question, setQuestion] = useState<Question>(makeQuestion);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  // Log history in rounds of 10 answered questions.
  const round = useRef({ answered: 0, correct: 0 });

  // Flush a partial round to history when leaving the view, so short
  // sessions still count toward the streak and daily goal.
  useEffect(
    () => () => {
      if (round.current.answered > 0) {
        recordSession("ear", round.current.correct, round.current.answered);
        round.current = { answered: 0, correct: 0 };
      }
    },
    [],
  );

  const nextQuestion = () => {
    const q = makeQuestion();
    setQuestion(q);
    setAnswer(null);
    playQuestion(q);
  };

  const handleAnswer = (chosen: number) => {
    if (answer) return;
    const correct = chosen === question.semitones;
    setAnswer({ chosen, correct });
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }));
    review(DECK.intervals, String(question.semitones), correct);

    round.current.answered += 1;
    if (correct) round.current.correct += 1;
    if (round.current.answered >= 10) {
      recordSession("ear", round.current.correct, round.current.answered);
      round.current = { answered: 0, correct: 0 };
    }
  };

  const choiceAnswer = answer
    ? { chosen: String(answer.chosen), correct: answer.correct }
    : null;

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
          onClick={() => playQuestion(question)}
          disabled={!audioOk}
          className="h-16 rounded-full px-8 text-lg"
        >
          <Volume2 className="size-6" />
          {t("ear.replay")}
        </Button>
      </div>

      {/* Interval choices */}
      <ChoiceGrid
        options={INTERVALS}
        getId={(interval) => String(interval.semitones)}
        getLabel={(interval) => t(interval.labelKey)}
        correctId={String(question.semitones)}
        answer={choiceAnswer}
        onAnswer={(id) => handleAnswer(Number(id))}
        className="grid-cols-2 sm:grid-cols-3"
      />

      {/* Feedback + next */}
      <FeedbackRow
        answer={choiceAnswer}
        onNext={nextQuestion}
        t={t}
        idle={
          <Button variant="ghost" onClick={nextQuestion} disabled={!audioOk}>
            <RotateCcw className="size-4" />
            {t("ear.skip")}
          </Button>
        }
      />
    </div>
  );
};
