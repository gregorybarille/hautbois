import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { cn } from "@/lib/utils";
import { MusicScore } from "@/shared/components/music/MusicScore";
import {
  SCALE_ROOTS,
  SCALE_TYPES,
  ScaleTypeId,
  generateScale,
  semitoneToFrequency,
} from "@/shared/music/theory";
import { isAudioSupported, playFrequency, playSequence } from "@/shared/audio/synth";
import { InstrumentConfig } from "@/shared/instruments";

interface ScalesProps {
  instrument: InstrumentConfig;
}

const STEP_COLOR = "#3b82f6";

export const Scales = ({ instrument }: ScalesProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const audioOk = isAudioSupported();

  const [root, setRoot] = useState<string>("Do");
  const [type, setType] = useState<ScaleTypeId>("major");
  const [index, setIndex] = useState(0);

  const scale = useMemo(() => generateScale(root, type), [root, type]);
  const noteNames = useMemo(() => scale.map((n) => n.name), [scale]);

  // Keep the cursor in range when the scale changes.
  useEffect(() => {
    setIndex(0);
  }, [root, type]);

  const current = scale[index];
  const fingeringAvailable = instrument.notes.includes(current?.name ?? "");
  const isWide = instrument.layout === "wide";

  const playScale = () => {
    playSequence(scale.map((n) => semitoneToFrequency(n.semitone)));
  };

  const playCurrent = () => {
    if (current) playFrequency(semitoneToFrequency(current.semitone));
  };

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(scale.length - 1, next));
    setIndex(clamped);
    playFrequency(semitoneToFrequency(scale[clamped].semitone));
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
      <h2 className="mb-4 shrink-0 text-2xl font-semibold text-foreground">
        {t("menu.scales.title")}
      </h2>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t("scales.root")}
          </span>
          <Select value={root} onValueChange={setRoot}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCALE_ROOTS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {t("scales.type")}
          </span>
          <Select value={type} onValueChange={(v) => setType(v as ScaleTypeId)}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCALE_TYPES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {t(s.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        {audioOk && (
          <Button variant="outline" onClick={playScale} className="ml-auto">
            <Play className="size-4" />
            {t("scales.play")}
          </Button>
        )}
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 gap-6",
          isWide ? "flex-col" : "flex-col lg:flex-row lg:items-stretch",
        )}
      >
        {/* Staff */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <MusicScore
              notes={noteNames}
              noteSpacing={64}
              noteColor={(_, i) => (i === index ? STEP_COLOR : undefined)}
              onNoteClick={(note) => goTo(noteNames.indexOf(note))}
              darkMode={darkMode}
            />
          </div>

          {/* Stepper */}
          <div className="mt-5 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label={t("scales.prev")}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <div className="flex min-w-28 flex-col items-center">
              <span className="text-2xl font-semibold text-foreground">
                {current?.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {index + 1} / {scale.length}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon-lg"
              onClick={() => goTo(index + 1)}
              disabled={index === scale.length - 1}
              aria-label={t("scales.next")}
            >
              <ChevronRight className="size-5" />
            </Button>
            {audioOk && (
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={playCurrent}
                aria-label={t("scales.playNote")}
              >
                <Volume2 className="size-5" />
              </Button>
            )}
          </div>
        </section>

        {/* Fingering for the current note */}
        <aside
          className={cn(
            "flex min-h-0 flex-col items-center rounded-2xl border border-border bg-card/40 p-4",
            isWide ? "w-full shrink-0" : "shrink-0 lg:w-72",
          )}
        >
          <h3 className="mb-3 shrink-0 text-xl font-semibold text-foreground">
            {current?.name}
          </h3>
          <div className="flex min-h-0 w-full flex-1 items-center justify-center">
            {fingeringAvailable ? (
              <instrument.NoteChart
                note={current.name}
                height={isWide ? 200 : 560}
                darkMode={darkMode}
              />
            ) : (
              <p className="max-w-48 text-center text-sm text-muted-foreground">
                {t("scales.noFingering")}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
