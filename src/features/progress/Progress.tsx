import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Flame, CalendarCheck, Music, Ear, Drum, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ExerciseId,
  currentStreak,
  loadHistory,
  sessionsToday,
  statsFor,
} from "@/shared/progress/history";
import {
  Deck,
  dueCount,
  loadDeck,
  newCount,
  weakItems,
} from "@/shared/srs/scheduler";
import { DECK } from "@/shared/srs/decks";
import { INTERVAL_BY_ID, INTERVAL_IDS } from "@/shared/music/theory";
import { NOTE_BASES } from "@/shared/music/notes";
import { InstrumentConfig } from "@/shared/instruments";
import { View } from "@/shared/components";

const DAILY_GOAL = 3;

interface ProgressViewProps {
  instrument: InstrumentConfig;
  onNavigate: (view: View) => void;
}

// Tiny inline sparkline for a 0..100 accuracy series.
const Sparkline = ({ values }: { values: number[] }) => {
  if (values.length === 0) return null;
  const w = 100;
  const h = 30;
  if (values.length === 1) {
    const y = h - (values[0] / 100) * h;
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none">
        <circle cx={w / 2} cy={y} r={2.5} className="fill-primary" />
      </svg>
    );
  }
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - (v / 100) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        className="stroke-primary"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

export const ProgressView = ({ instrument, onNavigate }: ProgressViewProps) => {
  const { t } = useTranslation();

  const history = useMemo(() => loadHistory(), []);
  const streak = useMemo(() => currentStreak(history), [history]);
  const today = useMemo(() => sessionsToday(history), [history]);

  const exercises: { id: ExerciseId; icon: typeof Music; labelKey: string }[] = [
    { id: "score", icon: Music, labelKey: "nav.score" },
    { id: "ear", icon: Ear, labelKey: "nav.ear" },
    { id: "rhythm", icon: Drum, labelKey: "nav.rhythm" },
  ];

  // Due reviews vs never-studied items across decks (current instrument).
  // Each deck is loaded from localStorage once and reused for both counts.
  const { totalDue, totalNew } = useMemo(() => {
    const scalesDeck = loadDeck(DECK.scales);
    const decks: [Deck, string[]][] = [
      [loadDeck(DECK.notes), NOTE_BASES],
      [loadDeck(DECK.intervals), INTERVAL_IDS],
      [loadDeck(DECK.fingerings(instrument.id)), instrument.notes],
      [scalesDeck, Object.keys(scalesDeck)],
    ];
    return {
      totalDue: decks.reduce((n, [deck, ids]) => n + dueCount(deck, ids), 0),
      totalNew: decks.reduce((n, [deck, ids]) => n + newCount(deck, ids), 0),
    };
  }, [instrument]);

  // Weak items from SRS decks (lowest boxes first).
  const weakNotes = useMemo(() => weakItems(DECK.notes, 3), []);

  const weakIntervals = useMemo(
    () =>
      weakItems(DECK.intervals, 3).map((id) => {
        const interval = INTERVAL_BY_ID[id];
        return interval ? t(interval.labelKey) : id;
      }),
    [t],
  );

  const isEmpty = history.length === 0;

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-5 overflow-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {t("menu.progress.title")}
        </h2>
        <p className="text-muted-foreground">{t("progress.subtitle")}</p>
      </div>

      {/* Review call-to-action */}
      <Card className="flex-row items-center gap-4 p-5">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <RefreshCw className="size-6" />
        </span>
        <div className="flex-1">
          <p className="text-lg font-semibold text-foreground">
            {totalDue > 0
              ? t("progress.dueCount", { count: totalDue })
              : totalNew > 0
                ? t("progress.newCount", { count: totalNew })
                : t("progress.allCaughtUp")}
          </p>
          <p className="text-sm text-muted-foreground">
            {t("progress.reviewHint")}
          </p>
        </div>
        <Button
          onClick={() => onNavigate("review")}
          disabled={totalDue + totalNew === 0}
        >
          {t("progress.review")}
        </Button>
      </Card>

      {isEmpty ? (
        <Card className="items-center gap-2 p-10 text-center">
          <p className="text-lg font-medium text-foreground">
            {t("progress.emptyTitle")}
          </p>
          <p className="text-muted-foreground">{t("progress.empty")}</p>
        </Card>
      ) : (
        <>
          {/* Goals */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="flex-row items-center gap-4 p-5">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-500">
                <Flame className="size-6" />
              </span>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {streak} {t("progress.days")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("progress.streak")}
                </p>
              </div>
            </Card>
            <Card className="flex-row items-center gap-4 p-5">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CalendarCheck className="size-6" />
              </span>
              <div className="flex-1">
                <p className="text-2xl font-bold text-foreground">
                  {today}
                  <span className="text-base font-normal text-muted-foreground">
                    {" "}
                    / {DAILY_GOAL}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("progress.todayGoal")}
                </p>
              </div>
              {today >= DAILY_GOAL && (
                <Badge className="bg-green-600 text-white">✓</Badge>
              )}
            </Card>
          </div>

          {/* Per-exercise stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {exercises.map(({ id, icon: Icon, labelKey }) => {
              const stats = statsFor(history, id);
              return (
                <Card key={id} className="gap-3 p-5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="size-4" />
                    <span className="text-sm font-medium">{t(labelKey)}</span>
                  </div>
                  {stats.count === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {t("progress.noData")}
                    </p>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-foreground">
                          {stats.lastAccuracy}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {stats.count} {t("progress.sessions")}
                        </span>
                      </div>
                      <Sparkline values={stats.series} />
                    </>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Weak items */}
          {(weakNotes.length > 0 || weakIntervals.length > 0) && (
            <Card className="gap-3 p-5">
              <p className="text-sm font-semibold text-foreground">
                {t("progress.focus")}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
                {weakNotes.length > 0 && (
                  <WeakList label={t("nav.score")} items={weakNotes} />
                )}
                {weakIntervals.length > 0 && (
                  <WeakList label={t("nav.ear")} items={weakIntervals} />
                )}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

const WeakList = ({ label, items }: { label: string; items: string[] }) => (
  <div className="flex flex-col gap-2">
    <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {label}
    </span>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-sm font-medium",
            "text-amber-700 dark:text-amber-300",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);
