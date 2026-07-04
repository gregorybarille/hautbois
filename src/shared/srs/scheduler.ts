// Spaced-repetition scheduler with review due-dates. Each card has a "box"
// (mastery level) and a "due" timestamp: the next time it should be reviewed.
// Successful reviews push the due date further out; failures reset it. Items
// never studied (absent from the deck) are "new": practice drills prioritize
// them, but they are not counted as due reviews.

export interface Card {
  box: number;
  due: number; // epoch ms of next review
  reps: number;
  lapses: number;
}

export type Deck = Record<string, Card>;

const MAX_BOX = 5;
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

// Interval granted after a successful review, indexed by the *new* box.
const INTERVALS = [
  10 * MINUTE, // box 1
  1 * DAY, // box 2
  3 * DAY, // box 3
  7 * DAY, // box 4
  21 * DAY, // box 5
];

const FAIL_INTERVAL = 5 * MINUTE;

export function loadDeck(key: string): Deck {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Deck) : {};
  } catch {
    return {};
  }
}

export function saveDeck(key: string, deck: Deck): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(deck));
  } catch {
    // ignore quota / private mode
  }
}

export function getCard(deck: Deck, id: string): Card {
  return deck[id] ?? { box: 0, due: 0, reps: 0, lapses: 0 };
}

// Read-only helpers below accept either a deck key (loaded internally) or an
// already-loaded Deck, so callers that need several answers about the same
// deck (e.g. due count + new count) can load it once and reuse it instead of
// re-reading and re-parsing localStorage per call.
function resolveDeck(keyOrDeck: string | Deck): Deck {
  return typeof keyOrDeck === "string" ? loadDeck(keyOrDeck) : keyOrDeck;
}

export function isDue(card: Card, now = Date.now()): boolean {
  return card.due <= now;
}

// Fisher-Yates shuffle (copy). Exposed so features drawing cards from decks
// can randomize order without re-implementing it.
export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Record a review result for an item and persist the deck.
export function review(key: string, id: string, correct: boolean): Deck {
  const deck = loadDeck(key);
  const card = getCard(deck, id);
  const now = Date.now();

  let next: Card;
  if (correct) {
    const box = Math.min(card.box + 1, MAX_BOX);
    next = {
      box,
      due: now + INTERVALS[Math.min(box, INTERVALS.length) - 1],
      reps: card.reps + 1,
      lapses: card.lapses,
    };
  } else {
    next = {
      box: 0,
      due: now + FAIL_INTERVAL,
      reps: card.reps + 1,
      lapses: card.lapses + 1,
    };
  }

  const updated = { ...deck, [id]: next };
  saveDeck(key, updated);
  return updated;
}

// Number of already-studied items currently due for review.
export function dueCount(
  keyOrDeck: string | Deck,
  items: string[],
  now = Date.now(),
): number {
  const deck = resolveDeck(keyOrDeck);
  return items.filter((id) => {
    const card = getCard(deck, id);
    return card.reps > 0 && isDue(card, now);
  }).length;
}

// Items never studied yet (new cards). Kept in the given order.
export function newItems(keyOrDeck: string | Deck, items: string[]): string[] {
  const deck = resolveDeck(keyOrDeck);
  return items.filter((id) => getCard(deck, id).reps === 0);
}

export function newCount(keyOrDeck: string | Deck, items: string[]): number {
  return newItems(keyOrDeck, items).length;
}

// Items ordered by review priority: due items first (soonest due first),
// then the rest by ascending mastery. Ties are randomized (via a pre-shuffle
// feeding a stable sort) so practice rounds don't come out in list order.
export function orderByPriority(
  keyOrDeck: string | Deck,
  items: string[],
): string[] {
  const deck = resolveDeck(keyOrDeck);
  const now = Date.now();
  return shuffle(items).sort((a, b) => {
    const ca = getCard(deck, a);
    const cb = getCard(deck, b);
    const da = ca.reps > 0 && isDue(ca, now);
    const db = cb.reps > 0 && isDue(cb, now);
    if (da !== db) return da ? -1 : 1;
    if (da) return ca.due - cb.due; // both due: soonest first
    return ca.box - cb.box; // neither due: weakest first
  });
}

// Already-studied items that are due right now, ordered soonest-first.
export function dueItems(keyOrDeck: string | Deck, items: string[]): string[] {
  const deck = resolveDeck(keyOrDeck);
  const now = Date.now();
  return items
    .filter((id) => {
      const card = getCard(deck, id);
      return card.reps > 0 && isDue(card, now);
    })
    .sort((a, b) => getCard(deck, a).due - getCard(deck, b).due);
}

// Pick `count` items for a practice round (due/weak first), allowing repeats
// only when there are fewer distinct items than requested, never twice in a
// row.
export function selectPractice(
  keyOrDeck: string | Deck,
  items: string[],
  count: number,
): string[] {
  if (items.length === 0) return [];
  const ordered = orderByPriority(keyOrDeck, items);
  const result: string[] = [];
  let i = 0;
  let previous: string | null = null;
  while (result.length < count) {
    let candidate = ordered[i % ordered.length];
    if (candidate === previous && ordered.length > 1) {
      candidate = ordered[(i + 1) % ordered.length];
      i++;
    }
    result.push(candidate);
    previous = candidate;
    i++;
  }
  return result;
}

// One weighted pick, biased toward due and weak items (for continuous drills).
export function pickWeighted(keyOrDeck: string | Deck, items: string[]): string {
  const deck = resolveDeck(keyOrDeck);
  const now = Date.now();
  const weights = items.map((id) => {
    const card = getCard(deck, id);
    const dueBoost = isDue(card, now) ? 3 : 1;
    return (dueBoost * 1) / (card.box + 1);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

// Weakest reviewed items (for the "focus" panel): lowest box, seen at least
// once, most-lapsed first.
export function weakItems(keyOrDeck: string | Deck, max: number): string[] {
  const deck = resolveDeck(keyOrDeck);
  return Object.entries(deck)
    .filter(([, card]) => card.reps > 0 && card.box < 3)
    .sort((a, b) => a[1].box - b[1].box || b[1].lapses - a[1].lapses)
    .slice(0, max)
    .map(([id]) => id);
}
