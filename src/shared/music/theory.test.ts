import { expect, test } from "vitest";
import { generateScale } from "./theory";

const names = (root: string) => generateScale(root, "major").map((n) => n.name);

test("spells a major scale by degree", () => {
  expect(names("Fa#")).toEqual(["Fa#", "Sol#", "La#", "Si", "Do# Aigu", "Ré# Aigu", "Mi# Aigu", "Fa# Aigu"]);
});

test("keeps the degree spelling in the grave register", () => {
  expect(names("Fa# Grave")).toEqual(["Fa# Grave", "Sol# Grave", "La# Grave", "Si Grave", "Do#", "Ré#", "Mi#", "Fa#"]);
});
