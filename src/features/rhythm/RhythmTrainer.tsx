import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { isAudioSupported, playClick } from "@/shared/audio/synth";
import { recordSession } from "@/shared/progress/history";
import { RhythmNotation } from "@/shared/components/music/RhythmNotation";
import {
  BEATS_PER_BAR,
  RHYTHM_CELL_TYPES,
  RHYTHM_CELL_TYPE_IDS,
  RhythmPattern,
  generatePattern,
} from "@/shared/music/rhythm";

type Phase = "idle" | "countin" | "playing" | "done";

interface OnsetResult {
  onset: number;
  hit: boolean;
  errorMs: number | null;
}

interface Result {
  hits: number;
  total: number;
  extra: number;
  meanErrorMs: number;
  perOnset: OnsetResult[];
}

const SUBSLOTS = 4; // sixteenth grid per beat
// Taps are accepted slightly outside the recording bar, so an anticipated
// downbeat or a late final off-beat still lands inside the scoring tolerance
// (which is capped at 220 ms in evaluate()).
const TAP_WINDOW_PAD_MS = 250;

export const RhythmTrainer = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const audioOk = isAudioSupported();

  const [bpm, setBpm] = useState(80);
  // Which rhythmic cell types (quarter/eighths/sixteenths/...) are in play.
  const [enabledCellIds, setEnabledCellIds] = useLocalStorage<string[]>(
    "rhythm-enabled-cells",
    RHYTHM_CELL_TYPE_IDS,
  );
  const activeCellIds =
    enabledCellIds.length > 0 ? enabledCellIds : RHYTHM_CELL_TYPE_IDS;
  const [pattern, setPattern] = useState<RhythmPattern>(() =>
    generatePattern(activeCellIds),
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const [countBeat, setCountBeat] = useState(0);
  const [activeBeat, setActiveBeat] = useState<number | null>(null);
  const [tapFlash, setTapFlash] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  const timeouts = useRef<number[]>([]);
  const taps = useRef<number[]>([]);
  const recordStart = useRef<number>(0);
  const accepting = useRef(false);

  const clearTimers = useCallback(() => {
    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timeouts.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const evaluate = useCallback(
    (beatMs: number) => {
      const tolerance = Math.min(beatMs * 0.45, 220);
      const used = new Set<number>();
      const taken = [...taps.current].sort((a, b) => a - b);
      let errorSum = 0;
      let hits = 0;

      const perOnset: OnsetResult[] = pattern.onsets.map((onset) => {
        const expected = recordStart.current + onset * beatMs;
        let bestIdx = -1;
        let bestErr = Infinity;
        taken.forEach((tap, idx) => {
          if (used.has(idx)) return;
          const err = Math.abs(tap - expected);
          if (err < bestErr) {
            bestErr = err;
            bestIdx = idx;
          }
        });
        if (bestIdx >= 0 && bestErr <= tolerance) {
          used.add(bestIdx);
          hits += 1;
          errorSum += bestErr;
          return { onset, hit: true, errorMs: Math.round(bestErr) };
        }
        return { onset, hit: false, errorMs: null };
      });

      setResult({
        hits,
        total: pattern.onsets.length,
        extra: taken.length - used.size,
        meanErrorMs: hits ? Math.round(errorSum / hits) : 0,
        perOnset,
      });
      recordSession("rhythm", hits, pattern.onsets.length);
    },
    [pattern],
  );

  const start = useCallback(() => {
    clearTimers();
    taps.current = [];
    accepting.current = false;
    setResult(null);
    setActiveBeat(null);
    setPhase("countin");

    const beatMs = 60000 / bpm;

    // Count-in bar
    for (let i = 0; i < BEATS_PER_BAR; i++) {
      after(i * beatMs, () => {
        playClick(i === 0);
        setCountBeat(i + 1);
      });
    }

    // Open the tap window just before the recording bar, so anticipated
    // first-beat taps aren't dropped.
    after(Math.max(0, BEATS_PER_BAR * beatMs - TAP_WINDOW_PAD_MS), () => {
      accepting.current = true;
    });

    // Recording bar
    after(BEATS_PER_BAR * beatMs, () => {
      recordStart.current = performance.now();
      setPhase("playing");
      setCountBeat(0);
    });
    for (let i = 0; i < BEATS_PER_BAR; i++) {
      after((BEATS_PER_BAR + i) * beatMs, () => {
        playClick(i === 0);
        setActiveBeat(i);
      });
    }

    // End: clear the beat highlight at the bar boundary, but keep accepting
    // taps for the padding window before scoring.
    after(2 * BEATS_PER_BAR * beatMs, () => setActiveBeat(null));
    after(2 * BEATS_PER_BAR * beatMs + TAP_WINDOW_PAD_MS, () => {
      accepting.current = false;
      setPhase("done");
      evaluate(beatMs);
    });
  }, [bpm, after, clearTimers, evaluate]);

  const tap = useCallback(() => {
    if (!accepting.current) return;
    taps.current.push(performance.now());
    setTapFlash((f) => f + 1);
  }, []);

  // Spacebar taps while recording (the count-in is included so taps in the
  // pre-bar padding window register; tap() gates on accepting itself).
  useEffect(() => {
    if (phase !== "playing" && phase !== "countin") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, tap]);

  const newPattern = (cellIds: string[] = activeCellIds) => {
    clearTimers();
    accepting.current = false;
    setPhase("idle");
    setResult(null);
    setActiveBeat(null);
    setPattern(generatePattern(cellIds));
  };

  const toggleCellType = (id: string) => {
    const has = activeCellIds.includes(id);
    if (has && activeCellIds.length === 1) return; // keep at least one enabled
    const next = has
      ? activeCellIds.filter((x) => x !== id)
      : [...activeCellIds, id];
    setEnabledCellIds(next);
    if (!running) newPattern(next);
  };

  const onsetStatus = (onset: number): "hit" | "miss" | null => {
    if (!result) return null;
    const r = result.perOnset.find((o) => o.onset === onset);
    return r ? (r.hit ? "hit" : "miss") : null;
  };

  const running = phase === "countin" || phase === "playing";
  const scorePct = result
    ? Math.round((result.hits / Math.max(1, result.total)) * 100)
    : 0;

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          {t("menu.rhythm.title")}
        </h2>
        <p className="text-muted-foreground">{t("rhythm.instructions")}</p>
      </div>

      {!audioOk && (
        <Alert variant="destructive">
          <AlertTitle>{t("rhythm.noAudioTitle")}</AlertTitle>
          <AlertDescription>{t("rhythm.noAudio")}</AlertDescription>
        </Alert>
      )}

      {/* Which rhythmic cell types to practice */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {t("rhythm.selectTypes")}
        </span>
        <div className="flex flex-wrap gap-2">
          {RHYTHM_CELL_TYPES.map((cell) => {
            const active = activeCellIds.includes(cell.id);
            return (
              <button
                key={cell.id}
                type="button"
                aria-pressed={active}
                disabled={running}
                onClick={() => toggleCellType(cell.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {t(cell.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t("rhythm.tempo")} — {bpm} BPM
          </span>
          <input
            type="range"
            min={40}
            max={160}
            step={1}
            value={bpm}
            disabled={running}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-primary disabled:opacity-50"
          />
        </label>
      </div>

      {/* Rhythmic notation */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-slate-50 p-2 dark:bg-slate-900">
        <RhythmNotation
          pattern={pattern}
          activeBeat={activeBeat}
          onsetStatus={onsetStatus}
          darkMode={darkMode}
        />
      </div>

      {/* Pattern display */}
      <div className="flex gap-2">
        {pattern.beats.map((cell, beatIdx) => {
          const filled = new Set(cell.map((frac) => Math.round(frac * SUBSLOTS)));
          return (
            <div
              key={beatIdx}
              className={cn(
                "flex flex-1 items-center justify-around rounded-lg border p-3 transition-colors",
                activeBeat === beatIdx
                  ? "border-primary bg-primary/10"
                  : "border-border",
              )}
            >
              {Array.from({ length: SUBSLOTS }).map((_, slot) => {
                const onset = beatIdx + slot / SUBSLOTS;
                const status = onsetStatus(onset);
                const isHit = filled.has(slot);
                return (
                  <span
                    key={slot}
                    className={cn(
                      "size-3 rounded-full",
                      !isHit && "bg-muted",
                      isHit && status === null && "bg-foreground",
                      isHit && status === "hit" && "bg-green-500",
                      isHit && status === "miss" && "bg-red-500",
                    )}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Count-in / tap zone */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          tap();
        }}
        disabled={!running}
        className={cn(
          "flex h-40 select-none flex-col items-center justify-center rounded-2xl border-2 text-lg font-semibold transition-colors",
          phase === "playing"
            ? "border-primary bg-primary/5 text-foreground active:bg-primary/15"
            : "border-dashed border-border text-muted-foreground",
        )}
      >
        {phase === "countin" && (
          <span className="text-5xl font-bold text-primary">{countBeat}</span>
        )}
        {phase === "playing" && (
          <span key={tapFlash} className="animate-in zoom-in-50 duration-100">
            {t("rhythm.tapHere")}
          </span>
        )}
        {(phase === "idle" || phase === "done") && (
          <span>{t("rhythm.tapHint")}</span>
        )}
      </button>

      {/* Result */}
      {phase === "done" && result && (
        <div className="flex flex-wrap items-center justify-center gap-3 text-center">
          <Badge className="bg-green-600 text-white">
            {result.hits}/{result.total}
          </Badge>
          <span className="text-lg font-semibold text-foreground">
            {scorePct}%
          </span>
          <span className="text-sm text-muted-foreground">
            {t("rhythm.meanError")} : {result.meanErrorMs} ms
          </span>
          {result.extra > 0 && (
            <span className="text-sm text-red-600 dark:text-red-400">
              +{result.extra} {t("rhythm.extra")}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-center gap-3">
        <Button onClick={start} disabled={!audioOk || running}>
          <Play className="size-5" />
          {phase === "done" ? t("rhythm.retry") : t("rhythm.start")}
        </Button>
        <Button variant="outline" onClick={() => newPattern()} disabled={running}>
          <RefreshCw className="size-5" />
          {t("rhythm.newPattern")}
        </Button>
      </div>
    </div>
  );
};
