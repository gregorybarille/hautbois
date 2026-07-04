import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { isAudioSupported, playClick } from "@/shared/audio/synth";
import { recordSession } from "@/shared/progress/history";
import {
  BEATS_PER_BAR,
  Difficulty,
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

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const SUBSLOTS = 4; // sixteenth grid per beat

export const RhythmTrainer = () => {
  const { t } = useTranslation();
  const audioOk = isAudioSupported();

  const [bpm, setBpm] = useState(80);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [pattern, setPattern] = useState<RhythmPattern>(() =>
    generatePattern("easy"),
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

    // Recording bar
    after(BEATS_PER_BAR * beatMs, () => {
      recordStart.current = performance.now();
      accepting.current = true;
      setPhase("playing");
      setCountBeat(0);
    });
    for (let i = 0; i < BEATS_PER_BAR; i++) {
      after((BEATS_PER_BAR + i) * beatMs, () => {
        playClick(i === 0);
        setActiveBeat(i);
      });
    }

    // End
    after(2 * BEATS_PER_BAR * beatMs, () => {
      accepting.current = false;
      setActiveBeat(null);
      setPhase("done");
      evaluate(beatMs);
    });
  }, [bpm, after, clearTimers, evaluate]);

  const tap = useCallback(() => {
    if (!accepting.current) return;
    taps.current.push(performance.now());
    setTapFlash((f) => f + 1);
  }, []);

  // Spacebar taps while recording.
  useEffect(() => {
    if (phase !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, tap]);

  const newPattern = () => {
    clearTimers();
    setPhase("idle");
    setResult(null);
    setActiveBeat(null);
    setPattern(generatePattern(difficulty));
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

      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t("rhythm.difficulty")}
          </span>
          <Select
            value={difficulty}
            onValueChange={(v) => {
              const d = v as Difficulty;
              setDifficulty(d);
              clearTimers();
              setPhase("idle");
              setResult(null);
              setPattern(generatePattern(d));
            }}
          >
            <SelectTrigger className="w-40" disabled={running}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {t(`rhythm.levels.${d}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

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
        disabled={phase !== "playing"}
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
        <Button variant="outline" onClick={newPattern} disabled={running}>
          <RefreshCw className="size-5" />
          {t("rhythm.newPattern")}
        </Button>
      </div>
    </div>
  );
};
