// Minimal Leitner-style spaced-repetition helper. Each item has a "box"
// (0 = weak/new, higher = stronger). Selection is weighted toward weaker
// items so failed/new material recurs more often. Boxes persist in
// localStorage so progress carries across sessions.

export type Boxes = Record<string, number>;

const MAX_BOX = 5;

export function loadBoxes(key: string): Boxes {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Boxes) : {};
  } catch {
    return {};
  }
}

export function saveBoxes(key: string, boxes: Boxes): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(boxes));
  } catch {
    // ignore quota / private mode errors
  }
}

// Update an item's box after an answer: reset to 0 on failure, promote
// (capped) on success.
export function recordResult(
  boxes: Boxes,
  item: string,
  correct: boolean,
): Boxes {
  const current = boxes[item] ?? 0;
  const next = correct ? Math.min(current + 1, MAX_BOX) : 0;
  return { ...boxes, [item]: next };
}

// Weight for an item: weaker (lower box) → larger weight.
function weightFor(box: number): number {
  return 1 / (box + 1);
}

// Draw `count` items (repeats allowed, but never the same item twice in a
// row) with probability weighted toward weaker items.
export function weightedDraw(
  items: string[],
  boxes: Boxes,
  count: number,
): string[] {
  if (items.length === 0) return [];
  const result: string[] = [];
  let previous: string | null = null;

  for (let i = 0; i < count; i++) {
    const pool = items.length > 1 ? items.filter((it) => it !== previous) : items;
    const weights = pool.map((it) => weightFor(boxes[it] ?? 0));
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let chosen = pool[pool.length - 1];
    for (let j = 0; j < pool.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        chosen = pool[j];
        break;
      }
    }
    result.push(chosen);
    previous = chosen;
  }
  return result;
}
