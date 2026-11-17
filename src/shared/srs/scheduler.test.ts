import { expect, test } from "vitest";
import { Deck, dueItems, selectPractice } from "./scheduler";

const card = (due: number, box = 1) => ({ box, due, reps: 1, lapses: 0 });

test("dueItems returns studied, overdue cards soonest first", () => {
  const now = Date.now();
  const deck: Deck = { a: card(now - 10), b: card(now - 1000), c: card(now + 60_000) };
  expect(dueItems(deck, ["a", "b", "c", "new"])).toEqual(["b", "a"]);
});

test("selectPractice fills the round without back-to-back repeats", () => {
  const round = selectPractice({}, ["Do", "Ré"], 10);
  expect(round).toHaveLength(10);
  round.slice(1).forEach((id, i) => expect(id).not.toBe(round[i]));
});
