import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Volume2, Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MusicScore } from "@/shared/components/music/MusicScore";
import { ChoiceGrid, FeedbackRow, TFn } from "@/shared/components/quiz";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { NOTE_BASES } from "@/shared/music/notes";
import {
  INTERVALS,
  INTERVAL_IDS,
  SCALE_TYPES_BY_ID,
  generateScale,
  randomIntervalRoot,
  semitoneToFrequency,
} from "@/shared/music/theory";
import {
  isAudioSupported,
  playInterval,
  playSequence,
} from "@/shared/audio/synth";
import {
  Deck,
  dueItems,
  loadDeck,
  newItems,
  review,
  shuffle,
} from "@/shared/srs/scheduler";
import { DECK, parseScaleCardId } from "@/shared/srs/decks";
import { recordSession } from "@/shared/progress/history";
import { InstrumentConfig } from "@/shared/instruments";
import { View } from "@/shared/components";

type CardType = "note" | "interval" | "fingering" | "scale";

interface ReviewCard {
  type: CardType;
  deck: string;
  id: string;
  // Root semitone for interval cards, drawn when the queue is built.
  root?: number;
}

interface ReviewProps {
  instrument: InstrumentConfig;
  onNavigate: (view: View) => void;
}

const SESSION_MAX = 20;

export const Review = ({ instrument, onNavigate }: ReviewProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const audioOk = isAudioSupported();

  // Build the session queue once: everything currently due, topped up with
  // new (never-studied) cards when there is room left. Each deck is loaded
  // from localStorage once and reused for both the due and new lookups.
  const queue = useMemo<ReviewCard[]>(() => {
    const scalesDeck = loadDeck(DECK.scales);
    const scaleIds = Object.keys(scalesDeck).filter(
      (id) => parseScaleCardId(id) !== null,
    );
    const fingeringsKey = DECK.fingerings(instrument.id);
    const sources: { type: CardType; key: string; ids: string[]; deck: Deck }[] =
      [
        { type: "note", key: DECK.notes, ids: NOTE_BASES, deck: loadDeck(DECK.notes) },
        {
          type: "interval",
          key: DECK.intervals,
          ids: INTERVAL_IDS,
          deck: loadDeck(DECK.intervals),
        },
        {
          type: "fingering",
          key: fingeringsKey,
          ids: instrument.notes,
          deck: loadDeck(fingeringsKey),
        },
        { type: "scale", key: DECK.scales, ids: scaleIds, deck: scalesDeck },
      ];
    const toCard = (type: CardType, key: string, id: string): ReviewCard => ({
      type,
      deck: key,
      id,
      root: type === "interval" ? randomIntervalRoot() : undefined,
    });

    const due = sources.flatMap((s) =>
      dueItems(s.deck, s.ids).map((id) => toCard(s.type, s.key, id)),
    );
    const fresh = sources.flatMap((s) =>
      newItems(s.deck, s.ids).map((id) => toCard(s.type, s.key, id)),
    );

    return shuffle([
      ...shuffle(due).slice(0, SESSION_MAX),
      ...shuffle(fresh).slice(0, Math.max(0, SESSION_MAX - due.length)),
    ]);
  }, [instrument]);

  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState<{
    chosen: string;
    correct: boolean;
  } | null>(null);

  const cardsTotal = queue.length;
  const done = idx >= cardsTotal;
  const card = done ? null : queue[idx];

  // Auto-play the first card if it is an interval (the user just navigated
  // here, so a gesture already unlocked audio). Later cards play in advance().
  const playedFirst = useRef(false);
  useEffect(() => {
    if (playedFirst.current) return;
    playedFirst.current = true;
    const first = queue[0];
    if (first?.type === "interval" && first.root !== undefined) {
      playInterval(first.root, Number(first.id));
    }
  }, [queue]);

  // Log the finished session to practice history exactly once.
  const recorded = useRef(false);
  useEffect(() => {
    if (done && cardsTotal > 0 && !recorded.current) {
      recorded.current = true;
      recordSession("review", correctCount, cardsTotal);
    }
  }, [done, cardsTotal, correctCount]);

  // Move to the next card, resetting per-card state in the same event so the
  // new card never renders with the previous card's answer or reveal.
  const advance = () => {
    const nextIdx = idx + 1;
    setIdx(nextIdx);
    setRevealed(false);
    setAnswer(null);
    const nextCard = queue[nextIdx];
    if (nextCard?.type === "interval" && nextCard.root !== undefined) {
      playInterval(nextCard.root, Number(nextCard.id));
    }
  };

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
    advance();
  };

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
          onNext={advance}
          darkMode={darkMode}
          t={t}
        />
      )}

      {card.type === "interval" && (
        <IntervalCard
          size={Number(card.id)}
          answer={answer}
          audioOk={audioOk}
          onReplay={() => playInterval(card.root ?? 0, Number(card.id))}
          onAnswer={answerAuto}
          onNext={advance}
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
    <div className="rounded-2xl border-2 border-blue-500 bg-slate-50 p-4 dark:bg-slate-900">
      <MusicScore notes={[note]} noteSpacing={80} darkMode={darkMode} />
    </div>
    <ChoiceGrid
      options={NOTE_BASES}
      getId={(base) => base}
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
      options={INTERVALS}
      getId={(interval) => String(interval.semitones)}
      getLabel={(interval) => t(interval.labelKey)}
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
  // Queue building filters out unparseable ids, so this is just a type guard.
  const parsed = parseScaleCardId(id);
  if (!parsed) return null;
  const { root, type } = parsed;
  const scale = generateScale(root, type);
  const typeLabel = t(SCALE_TYPES_BY_ID[type].labelKey);
  return (
    <>
      <p className="text-muted-foreground">{t("review.recallScale")}</p>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <span className="text-3xl font-bold text-foreground">
          {root} {typeLabel}
        </span>
        {revealed ? (
          <>
            <div className="w-full rounded-2xl border-2 border-blue-500 bg-slate-50 p-4 dark:bg-slate-900">
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
