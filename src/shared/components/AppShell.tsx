import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Music,
  FileText,
  HandMetal,
  ListMusic,
  Ear,
  LucideIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  INSTRUMENTS,
  INSTRUMENT_IDS,
  InstrumentId,
} from "@/shared/instruments";
import { ThemeToggle } from "./ThemeToggle";

export type View =
  | "home"
  | "scoreFlashcards"
  | "nameFlashcards"
  | "fingeringHelper"
  | "scales"
  | "earTraining";

const NAV: { view: View; icon: LucideIcon; labelKey: string }[] = [
  { view: "scoreFlashcards", icon: Music, labelKey: "nav.score" },
  { view: "nameFlashcards", icon: FileText, labelKey: "nav.name" },
  { view: "fingeringHelper", icon: HandMetal, labelKey: "nav.fingering" },
  { view: "scales", icon: ListMusic, labelKey: "nav.scales" },
  { view: "earTraining", icon: Ear, labelKey: "nav.ear" },
];

interface AppShellProps {
  view: View;
  onViewChange: (view: View) => void;
  instrumentId: InstrumentId;
  onInstrumentChange: (id: InstrumentId) => void;
  children: ReactNode;
}

export const AppShell = ({
  view,
  onViewChange,
  instrumentId,
  onInstrumentChange,
  children,
}: AppShellProps) => {
  const { t } = useTranslation();

  const instrumentPicker = (className?: string) => (
    <Select
      value={instrumentId}
      onValueChange={(value) => onInstrumentChange(value as InstrumentId)}
    >
      <SelectTrigger
        className={cn("w-full", className)}
        aria-label={t("menu.instrumentPicker")}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {INSTRUMENT_IDS.map((id) => (
          <SelectItem key={id} value={id}>
            {t(INSTRUMENTS[id].labelKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const brand = (
    <button
      type="button"
      onClick={() => onViewChange("home")}
      aria-label={t("nav.home")}
      aria-current={view === "home" ? "page" : undefined}
      className="flex min-w-0 items-center gap-2 rounded-lg text-left transition-opacity hover:opacity-80 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Music className="size-5" />
      </span>
      <span className="truncate text-lg font-semibold text-foreground">
        {t("app.title")}
      </span>
    </button>
  );

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-border bg-card/40 p-4 md:flex">
        <div className="px-2">{brand}</div>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ view: v, icon: Icon, labelKey }) => {
            const active = v === view;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onViewChange(v)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {t(labelKey)}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <div>
            <p className="mb-2 px-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {t("menu.instrumentPicker")}
            </p>
            {instrumentPicker()}
          </div>
          <div className="flex items-center justify-between border-t border-border px-2 pt-3">
            <span className="text-sm text-muted-foreground">
              {t("app.title")}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2 md:hidden">
        {brand}
        <div className="flex items-center gap-2">
          <div className="w-40">{instrumentPicker()}</div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </div>

        {/* Mobile bottom nav */}
        <nav
          className="grid border-t border-border bg-card/40 md:hidden"
          style={{
            gridTemplateColumns: `repeat(${NAV.length}, minmax(0, 1fr))`,
          }}
        >
          {NAV.map(({ view: v, icon: Icon, labelKey }) => {
            const active = v === view;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onViewChange(v)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 px-1 py-2 text-[0.7rem] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className="max-w-full truncate">{t(labelKey)}</span>
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
};
