import { expect, test } from "vitest";
import { Session, currentStreak } from "./history";

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return { exercise: "ear", at: d.getTime(), correct: 1, total: 1 } as Session;
};

test("streak counts consecutive days ending yesterday", () => {
  expect(currentStreak([daysAgo(1), daysAgo(2), daysAgo(4)])).toBe(2);
});

test("streak is broken after a missed day", () => {
  expect(currentStreak([daysAgo(2), daysAgo(3)])).toBe(0);
});
