# Musicaä

A French-first music practice suite for instrumentalists: sight-reading and
note-naming flashcards, a fingering guide, scales/arpeggios, ear training,
rhythm tapping, and a spaced-repetition review session that ties them all
together. Everything runs client-side — no account, no server, no backend.

The repository is still named `hautbois` (the app started as an oboe-only
fingering helper); the product itself is now instrument-agnostic and titled
**Musicaä**.

Live app: https://gregorybarille.github.io/hautbois/

## Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) primitives (Radix under the hood)
- [react-i18next](https://react.i18next.com/) (French only, for now)
- [lucide-react](https://lucide.dev/) icons
- Web Audio API for all sound (no audio files/samples)
- Everything is persisted to `localStorage` — no backend is wired up (see [Data & persistence](#data--persistence))

## Getting started

Requires Node.js 18+.

```bash
npm install
npm run dev        # start the Vite dev server
```

| Script              | Purpose                                   |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Dev server with HMR                        |
| `npm run build`      | Type-checked production build (`dist/`)    |
| `npm run preview`    | Preview the production build locally       |
| `npm run lint`       | ESLint                                     |
| `npm run typecheck`  | `tsc --noEmit`                             |

## Project structure

```
src/
  App.tsx                 # top-level view switch (no router — see below)
  main.tsx                 # providers: Theme, Tooltip, ErrorBoundary
  index.css                # Tailwind + the OKLCH/slate theme tokens
  components/ui/           # shadcn/ui primitives (button, card, dialog, select, badge, alert…)
  lib/utils.ts              # `cn()` (clsx + tailwind-merge)

  features/                # one folder per screen, each with an index.ts barrel
    home/
    score-flashcards/       # "Cartes - Partition"
    name-flashcards/         # "Cartes - Nom de Notes"
    fingering-helper/         # "Guide des Doigtés"
    scales/                   # "Gammes & Arpèges"
    ear-training/              # "Entraînement de l'oreille"
    rhythm/                    # "Rythme"
    progress/                   # "Progression"
    review/                      # "Révision du jour"

  shared/
    components/             # AppShell, MenuCard, ThemeToggle, quiz.tsx
    components/music/        # <MusicScore> (SVG staff renderer)
    instruments/               # per-instrument fingering charts + shared chart theme
    music/                       # notes.ts, theory.ts, rhythm.ts — pure music-theory helpers
    audio/                        # synth.ts — Web Audio synth
    srs/                            # scheduler.ts + decks.ts — spaced repetition
    progress/                       # history.ts — practice-session log
    theme/                            # ThemeProvider (light/dark)
    i18n/                              # react-i18next config + fr.json
    hooks/                              # useLocalStorage, useNoteSpeechRecognition
    types/, utils/supabase.ts             # unused scaffolding for a future backend
```

## Architecture

### Navigation

There is **no router**. `App.tsx` holds a single `view: View` state value and
renders one feature component per value; `AppShell` renders the sidebar /
mobile drawer nav and calls `onViewChange` to switch it. Since the whole app
is one route, there's nothing to configure for deep-linking or a GitHub Pages
SPA fallback (`404.html`) — every load serves the same `index.html`.

The current instrument (`oboe | flute | piano | guitar`) is separate app-wide
state, persisted via `useLocalStorage("hautbois-instrument", …)` and passed
down to whichever feature needs it.

### Instruments (`shared/instruments/`)

Each instrument is an `InstrumentConfig` (`shared/instruments/types.ts`):

```ts
interface InstrumentConfig {
  id: InstrumentId;
  labelKey: string;             // i18n key
  notes: string[];               // this instrument's playable note range
  NoteChart: (props) => ReactNode; // renders one fingering diagram
  layout: "tall" | "wide";          // where the chart sits relative to the staff
}
```

`oboe`, `flute`, `piano`, and `guitar` each live in their own folder and
export one of these; `INSTRUMENTS` in `shared/instruments/index.ts` is the
registry every feature reads from. All four fingering charts share one color
palette via `chartTheme(darkMode)` (`shared/instruments/chartTheme.ts`) so a
theme tweak only has to happen in one place. `KeyLegend.tsx` is the shared
"Ouvert / Fermé / ½" legend used by the wind instrument charts.

### Music theory core (`shared/music/`)

- **`notes.ts`** — the app's French note-name convention (`Do`, `Fa#`, `Si♭`,
  with an optional `" Grave"` / `" Aigu"` register suffix). Exposes
  `parseNote`, `noteStep` (treble-staff position) and `noteSemitone`
  (absolute pitch, `Do4 = 0`) — every other music helper in the app builds on
  these two conversions.
- **`theory.ts`** — scales/arpeggios (`SCALE_TYPES`, `generateScale`) and
  intervals (`INTERVALS`) for ear training. `generateScale` spells each
  degree correctly per scale degree (not just nearest chromatic name), so
  e.g. Fa# majeure comes out `Fa#, Sol#, La#, Si, Do#, Ré#, Mi#, Fa#` instead
  of a chromatic best-effort spelling.
- **`rhythm.ts`** — generates one bar of tap-along rhythm (`generatePattern`)
  from a difficulty-scoped vocabulary of rhythmic cells.

### Audio engine (`shared/audio/synth.ts`)

A single lazily-created `AudioContext` (created on first use, after a user
gesture, per browser autoplay rules) drives everything: `playFrequency`,
`playSequence` (a run of notes at a given tempo), `playInterval` (two notes,
shared by ear training and review), and `playClick` (the rhythm trainer's
metronome). No audio files — every tone is a synthesized oscillator with a
short attack/release envelope.

### Spaced repetition (`shared/srs/`)

`scheduler.ts` implements a simple 5-box leveled scheduler: each `Card` has a
`box` (0–5), a `due` timestamp, `reps`, and `lapses`. A correct `review()`
call advances the box and pushes `due` out further (10 min → 1 day → 3 days →
7 days → 21 days); an incorrect one resets the box to 0 and sets `due` 5
minutes out. Items never studied (`reps === 0`) are treated as "new," not
"due" — so a fresh install doesn't falsely report has-things-to-review.

Every read helper (`dueCount`, `dueItems`, `newItems`, `orderByPriority`,
`pickWeighted`, `weakItems`, …) accepts either a deck's `localStorage` key or
an already-loaded `Deck`, so a caller that needs several answers about the
same deck (Progress's due/new counts, Review's queue) can load it once and
reuse it instead of re-parsing `localStorage` per call.

`decks.ts` is the single registry of deck keys (`srs2-notes`,
`srs2-intervals`, `srs2-scales`, `srs2-fingerings-<instrument>`) plus the
scale-card id codec (`scaleCardId` / `parseScaleCardId`, format
`"<root>|<scaleType>"`) so the id format is defined once instead of being
composed/parsed ad hoc in each feature.

### Progress & history (`shared/progress/history.ts`)

Every finished round calls `recordSession(exercise, correct, total)`, which
appends one `Session` to a capped (500-entry) list in `localStorage`
(`hautbois-progress`). `currentStreak` walks calendar days (via
`Date#setDate`, not fixed 24 h increments, so DST transitions can't skip or
double-count a day), `sessionsToday` powers the daily goal, and `statsFor`
produces the per-exercise accuracy series the Progress screen sparklines.

### Theming (`src/index.css` + `shared/theme/ThemeProvider.tsx`)

Colors are shadcn/ui CSS variables in OKLCH, tinted with a subtle slate hue
(~260°) rather than pure grayscale, defined once for light and once for
`.dark`. `ThemeProvider` tracks `light | dark` in state, persists it
(`hautbois-theme`), initializes from `prefers-color-scheme` on first load,
and toggles the `.dark` class + `color-scheme` on `<html>`.

### Internationalization (`shared/i18n/`)

`react-i18next` configured with a single `fr` resource
(`locales/fr.json`) — the app is French-only today; every user-facing string
goes through `t(...)`, so adding a locale later is a matter of adding another
resource, not restructuring components.

### Shared UI (`shared/components/`)

- **`AppShell`** — desktop sidebar / mobile drawer nav, instrument picker,
  theme toggle; owns the `View` union type.
- **`MenuCard`** — the home screen's tappable feature tiles.
- **`quiz.tsx`** — generic `ChoiceGrid<T>` (an auto-graded multiple-choice
  answer grid) and `FeedbackRow` (correct/incorrect + "next"), shared by Ear
  Training and Review so both quiz-style cards render and grade identically.
- **`components/music/MusicScore`** — an SVG treble-staff renderer. Takes
  note names (in the app's French/accidental spelling), computes staff
  position via `noteStep`, and draws ledger lines, note heads, stems, and
  sharp/flat glyphs as needed.

## Features

### Home (`features/home`)

The landing screen: app title/description plus one `MenuCard` per feature,
each navigating via `AppShell`'s `View` state.

### Cartes - Partition — Score Flashcards (`features/score-flashcards`)

Shows a note on the staff; the user answers by clicking a note-name button or
by voice (`useNoteSpeechRecognition`, French Web Speech API dictation,
Chrome-only). Rounds of 10 are drawn via `selectPractice` (SRS-aware:
due/weak notes surface first, ties shuffled so rounds aren't always in scale
order); each answer calls `review(DECK.notes, …)`, and the finished round
calls `recordSession("score", …)` exactly once (guarded by a ref so
re-renders can't double-log it).

### Cartes - Nom de Notes — Name Flashcards (`features/name-flashcards`)

The inverse drill: a big note name is shown, tap to reveal the fingering for
the current instrument (in a `Dialog`), tap the card to draw a new random
note. Not currently SRS-tracked — this one is uniform random practice.

### Guide des Doigtés — Fingering Helper (`features/fingering-helper`)

A reference/browse mode: click a note on the staff (naturals only) to see
its fingering chart for the current instrument, with sharp/flat toggle
buttons to see enharmonic variants where the instrument has a distinct
fingering for them.

### Gammes & Arpèges — Scales (`features/scales`)

Pick a root (12 pitch classes) and a scale/arpeggio type (major, natural /
harmonic / melodic minor, major/minor arpeggio, chromatic — `theory.ts`'s
`SCALE_TYPES`). Steps through the generated notes on the staff with correct
enharmonic spelling, shows the fingering for the current note, and can play
the whole scale or one note via the synth. A "Su / Pas su" self-grade posts
one `review(DECK.scales, scaleCardId(root, type), …)` per scale (not per
note — a scale is graded as a whole).

### Entraînement de l'oreille — Ear Training (`features/ear-training`)

Plays a two-note interval (root drawn from a comfortable mid-range,
`randomIntervalRoot()`); the user picks from all 12 interval-name buttons
(`ChoiceGrid`). Each answer both grades the SRS interval deck and counts
toward the current round; every 10 answered (or on unmount, so partial
rounds aren't lost) it logs one `recordSession("ear", …)`. Question
selection is SRS-weighted (`pickWeighted`) rather than uniform, so
under-practiced/due intervals come up more often.

### Rythme — Rhythm Trainer (`features/rhythm`)

Generates a one-bar rhythmic pattern for a chosen difficulty
(`generatePattern`), plays a count-in click, then a recording bar; the user
taps along (spacebar or on-screen button). Taps land in a window that opens
slightly before and closes slightly after the recording bar so an
anticipated first beat or a slightly-late final off-beat isn't unfairly
dropped, matching the scoring tolerance (`min(45% of a beat, 220 ms)`).
Scoring greedily matches each expected onset to its closest unused tap
within tolerance and reports hits/total, mean timing error, and extra
(unmatched) taps. Logs one `recordSession("rhythm", …)` per attempt.

### Progression — Progress (`features/progress`)

The practice dashboard: current streak, sessions-today vs. a daily goal,
per-exercise accuracy (with a small inline sparkline) from
`shared/progress/history.ts`, a "focus" panel of the weakest SRS items
(`weakItems`), and a review call-to-action showing how many items are due
vs. new across every deck for the current instrument.

### Révision du jour — Review (`features/review`)

The cross-feature spaced-repetition session: builds a queue (capped at 20)
from every deck's due items across notes/intervals/current-instrument
fingerings/scales, topped up with new (never-studied) items if there's room,
shuffled. Each card type renders through a small dispatcher (`NoteCard`,
`IntervalCard` — both auto-graded via the shared `ChoiceGrid`/`FeedbackRow`;
`RevealCard`, `ScaleReviewCard` — both self-graded via `SelfGradeRow`).
Finishing a session posts one `recordSession("review", …)`.

## Data & persistence

Everything lives in the browser's `localStorage`; there is no backend (see
below) and no login, so data is per-browser/per-device.

| Key                                | Holds                                             |
| ------------------------------------ | -------------------------------------------------- |
| `hautbois-instrument`                | Selected `InstrumentId`                             |
| `hautbois-theme`                      | `"light" \| "dark"`                                  |
| `hautbois-progress`                    | Practice session log (`Session[]`, capped at 500)     |
| `srs2-notes`                             | SRS deck for note-naming                               |
| `srs2-intervals`                          | SRS deck for ear-training intervals                     |
| `srs2-scales`                               | SRS deck for scales/arpeggios                            |
| `srs2-fingerings-<instrumentId>`              | SRS deck for fingerings, one per instrument                |

`src/shared/utils/supabase.ts` and `src/shared/types/index.ts` set up a
Supabase client and DB-row types (there's a matching migration under
`supabase/migrations/`), but neither is imported anywhere yet — they're
scaffolding for a possible future backend, not part of the current app.

## Deployment (GitHub Pages)

The app deploys as a static SPA via GitHub Actions:

- `.github/workflows/deploy.yml` builds (`npm ci && npm run typecheck &&
  npm run build`) and publishes `dist/` on every push to `main` (and on
  manual dispatch), using `actions/upload-pages-artifact` +
  `actions/deploy-pages`.
- `vite.config.ts` sets `base: "/hautbois/"` for production builds only
  (the dev server still runs at `/`), matching the project-pages URL
  `https://gregorybarille.github.io/hautbois/`.
- The repo's Pages source is set to "GitHub Actions" (no `gh-pages` branch
  involved).
- No SPA fallback (`404.html`) is needed — there's no client-side router, so
  every load serves the same single route.

To deploy: merge/push to `main`. The workflow will build and publish
automatically; check the **Actions** tab for status and the **Pages**
section of repo settings for the live URL.
