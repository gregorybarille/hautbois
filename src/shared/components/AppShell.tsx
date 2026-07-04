import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Music,
  FileText,
  HandMetal,
  ListMusic,
  Ear,
  Drum,
  LineChart,
  Menu,
  X,
  LucideIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
  | "earTraining"
  | "rhythm"
  | "progress";

const NAV: { view: View; icon: LucideIcon; labelKey: string }[] = [
  { view: "scoreFlashcards", icon: Music, labelKey: "nav.score" },
  { view: "nameFlashcards", icon: FileText, labelKey: "nav.name" },
  { view: "fingeringHelper", icon: HandMetal, labelKey: "nav.fingering" },
  { view: "scales", icon: ListMusic, labelKey: "nav.scales" },
  { view: "earTraining", icon: Ear, labelKey: "nav.ear" },
  { view: "rhythm", icon: Drum, labelKey: "nav.rhythm" },
  { view: "progress", icon: LineChart, labelKey: "nav.progress" },
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
  const [navOpen, setNavOpen] = useState(false);

  // Close the mobile drawer on Escape.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const instrumentPicker = (
    <Select
      value={instrumentId}
      onValueChange={(value) => onInstrumentChange(value as InstrumentId)}
    >
      <SelectTrigger className="w-full" aria-label={t("menu.instrumentPicker")}>
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
      onClick={() => {
        onViewChange("home");
        setNavOpen(false);
      }}
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

  // Full sidebar content, shared by the desktop rail and the mobile drawer.
  const sidebar = (
    <>
      <div className="px-2">{brand}</div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ view: v, icon: Icon, labelKey }) => {
          const active = v === view;
          return (
            <button
              key={v}
              type="button"
              onClick={() => {
                onViewChange(v);
                setNavOpen(false);
              }}
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
          {instrumentPicker}
        </div>
        <div className="flex items-center justify-between border-t border-border px-2 pt-3">
          <span className="text-sm text-muted-foreground">{t("app.title")}</span>
          <ThemeToggle />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r border-border bg-card/40 p-4 md:flex">
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center gap-2 border-b border-border px-3 py-2 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setNavOpen(true)}
          aria-label={t("nav.open")}
        >
          <Menu className="size-5" />
        </Button>
        <div className="min-w-0 flex-1">{brand}</div>
        <ThemeToggle />
      </header>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setNavOpen(false)}
          />
          <aside className="animate-in slide-in-from-left absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col gap-6 border-r border-border bg-background p-4 duration-200">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setNavOpen(false)}
                aria-label={t("nav.close")}
              >
                <X className="size-5" />
              </Button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
};
