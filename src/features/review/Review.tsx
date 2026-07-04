import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Volume2, Eye, Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MusicScore } from "@/shared/components/music/MusicScore";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { NOTE_BASES } from "@/shared/music/notes";
import {
  INTERVALS,
  SCALE_TYPES_BY_ID,
  ScaleTypeId,
  generateScale,
  semitoneToFrequency,
} from "@/shared/music/theory";
import { isAudioSupported, playSequence } from "@/shared/audio/synth";
import { dueItems, loadDeck, review } from "@/shared/srs/scheduler";
import { DECK } from "@/shared/srs/decks";
import { InstrumentConfig } from "@/shared/instruments";
import { View } from "@/shared/components";

type CardType = "note" | "interval" | "fingering" | "scale";

interface ReviewCard {
  type: CardType;
  deck: string;
  id: string;
}

interface ReviewProps {
  instrument: InstrumentConfig;
  onNavigate: (view: View) => void;
}

const SESSION_MAX = 20;
const INTERVAL_ROOT_MIN = -9;
const INTERVAL_ROOT_MAX = 4;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const Review = ({ instrument, onNavigate }: ReviewProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const audioOk = isAudioSupported();

  // Build the session queue once, from everything currently due.
  const queue = useMemo<ReviewCard[]>(() => {
    const notes = dueItems(DECK.notes, NOTE_BASES).map((id) => ({
      type: "note" as const,
      deck: DECK.notes,
      id,
    }));
    const intervals = dueItems(
      DECK.intervals,
      INTERVALS.map((i) => String(i.semitones)),
    ).map((id) => ({ type: "interval" as const, deck: DECK.intervals, id }));
    const fingerings = dueItems(
      DECK.fingerings(instrument.id),
      instrument.notes,
    ).map((id) => ({
      type: "fingering" as const,
      deck: DECK.fingerings(instrument.id),
      id,
    }));
    const scales = dueItems(DECK.scales, Object.keys(loadDeck(DECK.scales))).map(
      (id) => ({ type: "scale" as const, deck: DECK.scales, id }),
    );

    return shuffle([...notes, ...intervals, ...fingerings, ...scales]).slice(
      0,
      SESSION_MAX,
    );
  }, [instrument]);

  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState<{
    chosen: string;
    correct: boolean;
  } | null>(null);
  const [intervalRoot, setIntervalRoot] = useState(0);

  const cardsTotal = queue.length;
  const done = idx >= cardsTotal;
  const card = done ? null : queue[idx];

  // Reset per-card state and auto-play the interval when a card appears.
  useEffect(() => {
    if (!card) return;
    setRevealed(false);
    setAnswer(null);
    if (card.type === "interval") {
      const root =
        INTERVAL_ROOT_MIN +
        Math.floor(Math.random() * (INTERVAL_ROOT_MAX - INTERVAL_ROOT_MIN + 1));
      setIntervalRoot(root);
      const size = Number(card.id);
      playSequence([root, root + size].map(semitoneToFrequency), 2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, cardsTotal]);

  const grade = (correct: boolean) => {
    if (!card) return;
    review(card.deck, card.id, correct);
    if (correct) setCorrectCount((c) => c + 1);
  };

  const answerAuto = (chosen: string) => {
    if (!card || answer) return;
    const correct = chosen === card.id;
    setAnswer({ chosen, correct });
    grade(correct);
  };

  const answerSelf = (known: boolean) => {
    grade(known);
    setIdx((i) => i + 1);
  };

  const next = () => setIdx((i) => i + 1);

  if (cardsTotal === 0) {
    return (
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-semibold text-foreground">
          {t("review.allDoneTitle")}
        </p>
        <p className="text-muted-foreground">{t("review.allDone")}</p>
        <Button onClick={() => onNavigate("home")}>
          {t("review.backHome")}
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-2xl font-bold text-foreground">
          {t("review.finished")}
        </p>
        <p className="text-lg text-muted-foreground">
          {correctCount} / {cardsTotal}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onNavigate("progress")}>
            {t("review.toProgress")}
          </Button>
          <Button onClick={() => onNavigate("home")}>
            {t("review.backHome")}
          </Button>
        </div>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {t("menu.review.title")}
        </h2>
        <Badge variant="outline">
          {idx + 1} / {cardsTotal}
        </Badge>
      </div>

      {card.type === "note" && (
        <NoteCard
          note={card.id}
          answer={answer}
          onAnswer={answerAuto}
          onNext={next}
          darkMode={darkMode}
          t={t}
        />
      )}

      {card.type === "interval" && (
        <IntervalCard
          size={Number(card.id)}
          answer={answer}
          audioOk={audioOk}
          onReplay={() =>
            playSequence(
              [intervalRoot, intervalRoot + Number(card.id)].map(
                semitoneToFrequency,
              ),
              2,
            )
          }
          onAnswer={answerAuto}
          onNext={next}
          t={t}
        />
      )}

      {card.type === "fingering" && (
        <RevealCard
          title={card.id}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onGrade={answerSelf}
          t={t}
        >
          <instrument.NoteChart
            note={card.id}
            height={340}
            darkMode={darkMode}
          />
        </RevealCard>
      )}

      {card.type === "scale" && (
        <ScaleReviewCard
          id={card.id}
          revealed={revealed}
          audioOk={audioOk}
          onReveal={() => setRevealed(true)}
          onGrade={answerSelf}
          darkMode={darkMode}
          t={t}
        />
      )}
    </div>
  );
};

type TFn = (key: string) => string;

// --- Auto-graded: note on the staff ---
const NoteCard = ({
  note,
  answer,
  onAnswer,
  onNext,
  darkMode,
  t,
}: {
  note: string;
  answer: { chosen: string; correct: boolean } | null;
  onAnswer: (v: string) => void;
  onNext: () => void;
  darkMode: boolean;
  t: TFn;
}) => (
  <>
    <p className="text-muted-foreground">{t("review.nameNote")}</p>
    <div className="rounded-2xl border-2 border-blue-500 bg-white p-4 dark:bg-slate-900">
      <MusicScore notes={[note]} noteSpacing={80} darkMode={darkMode} />
    </div>
    <ChoiceGrid
      options={NOTE_BASES}
      correctId={note}
      answer={answer}
      onAnswer={onAnswer}
    />
    <FeedbackRow answer={answer} onNext={onNext} t={t} />
  </>
);

// --- Auto-graded: interval by ear ---
const IntervalCard = ({
  size,
  answer,
  audioOk,
  onReplay,
  onAnswer,
  onNext,
  t,
}: {
  size: number;
  answer: { chosen: string; correct: boolean } | null;
  audioOk: boolean;
  onReplay: () => void;
  onAnswer: (v: string) => void;
  onNext: () => void;
  t: TFn;
}) => (
  <>
    <p className="text-muted-foreground">{t("review.identifyInterval")}</p>
    <div className="flex justify-center">
      <Button
        size="lg"
        onClick={onReplay}
        disabled={!audioOk}
        className="h-14 rounded-full px-8"
      >
        <Volume2 className="size-5" />
        {t("ear.replay")}
      </Button>
    </div>
    <ChoiceGrid
      options={INTERVALS.map((i) => String(i.semitones))}
      labelFor={(id) =>
        t(INTERVALS.find((i) => String(i.semitones) === id)!.labelKey)
      }
      correctId={String(size)}
      answer={answer}
      onAnswer={onAnswer}
    />
    <FeedbackRow answer={answer} onNext={onNext} t={t} />
  </>
);

// --- Self-graded reveal (fingering) ---
const RevealCard = ({
  title,
  revealed,
  onReveal,
  onGrade,
  t,
  children,
}: {
  title: string;
  revealed: boolean;
  onReveal: () => void;
  onGrade: (known: boolean) => void;
  t: TFn;
  children: React.ReactNode;
}) => (
  <>
    <p className="text-muted-foreground">{t("review.recallFingering")}</p>
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <span className="text-4xl font-bold text-foreground">{title}</span>
      {revealed ? (
        <div className="flex justify-center">{children}</div>
      ) : (
        <Button variant="outline" onClick={onReveal}>
          <Eye className="size-4" />
          {t("review.reveal")}
        </Button>
      )}
    </div>
    {revealed && <SelfGradeRow onGrade={onGrade} t={t} />}
  </>
);

// --- Self-graded scale ---
const ScaleReviewCard = ({
  id,
  revealed,
  audioOk,
  onReveal,
  onGrade,
  darkMode,
  t,
}: {
  id: string;
  revealed: boolean;
  audioOk: boolean;
  onReveal: () => void;
  onGrade: (known: boolean) => void;
  darkMode: boolean;
  t: TFn;
}) => {
  const [root, type] = id.split("|");
  const scale = generateScale(root, type as ScaleTypeId);
  const typeLabel = t(SCALE_TYPES_BY_ID[type as ScaleTypeId].labelKey);
  return (
    <>
      <p className="text-muted-foreground">{t("review.recallScale")}</p>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <span className="text-3xl font-bold text-foreground">
          {root} {typeLabel}
        </span>
        {revealed ? (
          <>
            <div className="w-full rounded-2xl border-2 border-blue-500 bg-white p-4 dark:bg-slate-900">
              <MusicScore
                notes={scale.map((n) => n.name)}
                noteSpacing={56}
                darkMode={darkMode}
              />
            </div>
            {audioOk && (
              <Button
                variant="outline"
                onClick={() =>
                  playSequence(
                    scale.map((n) => semitoneToFrequency(n.semitone)),
                  )
                }
              >
                <Volume2 className="size-4" />
                {t("scales.play")}
              </Button>
            )}
          </>
        ) : (
          <Button variant="outline" onClick={onReveal}>
            <Eye className="size-4" />
            {t("review.reveal")}
          </Button>
        )}
      </div>
      {revealed && <SelfGradeRow onGrade={onGrade} t={t} />}
    </>
  );
};

// --- Shared bits ---
const ChoiceGrid = ({
  options,
  labelFor,
  correctId,
  answer,
  onAnswer,
}: {
  options: string[];
  labelFor?: (id: string) => string;
  correctId: string;
  answer: { chosen: string; correct: boolean } | null;
  onAnswer: (id: string) => void;
}) => (
  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
    {options.map((id) => {
      const isCorrect = answer && id === correctId;
      const isWrong = answer && !answer.correct && id === answer.chosen;
      return (
        <Button
          key={id}
          variant="outline"
          disabled={!!answer}
          onClick={() => onAnswer(id)}
          className={cn(
            "h-14 font-semibold disabled:opacity-100",
            isCorrect &&
              "border-green-500 bg-green-500/15 text-green-700 dark:text-green-300",
            isWrong &&
              "border-red-500 bg-red-500/15 text-red-700 dark:text-red-300",
          )}
        >
          {labelFor ? labelFor(id) : id}
        </Button>
      );
    })}
  </div>
);

const FeedbackRow = ({
  answer,
  onNext,
  t,
}: {
  answer: { chosen: string; correct: boolean } | null;
  onNext: () => void;
  t: TFn;
}) => (
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
        <Button onClick={onNext}>
          {t("ear.next")}
          <ArrowRight className="size-4" />
        </Button>
      </>
    )}
  </div>
);

const SelfGradeRow = ({
  onGrade,
  t,
}: {
  onGrade: (known: boolean) => void;
  t: TFn;
}) => (
  <div className="flex justify-center gap-3">
    <Button
      variant="outline"
      onClick={() => onGrade(false)}
      className="border-red-500/40 text-red-600 dark:text-red-400"
    >
      <X className="size-4" />
      {t("review.dontKnow")}
    </Button>
    <Button
      onClick={() => onGrade(true)}
      className="bg-green-600 text-white hover:bg-green-600/90"
    >
      <Check className="size-4" />
      {t("review.know")}
    </Button>
  </div>
);
