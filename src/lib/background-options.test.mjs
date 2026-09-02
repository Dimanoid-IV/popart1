import assert from "node:assert/strict";
import test from "node:test";

import { selectBackgroundPair, selectBackgrounds } from "./background-options.ts";

test("each portrait variant uses its independently chosen palette", () => {
  const selected = selectBackgroundPair(["turquoise", "coral"]);

  assert.match(selected[0], /deep turquoise, indigo and violet/);
  assert.match(selected[1], /coral, rose, purple and warm gold/);
});

test("a chosen palette is used for both generated portrait variants", () => {
  const selected = selectBackgrounds("lavender", () => 0.99);

  assert.equal(selected.length, 2);
  assert.equal(selected[0], selected[1]);
  assert.match(selected[0], /magenta, lavender and electric blue/);
});

test("surprise mode keeps two different randomly selected backgrounds", () => {
  const randomValues = [0.1, 0.8];
  let index = 0;
  const selected = selectBackgrounds("surprise", () => randomValues[index++]);

  assert.equal(selected.length, 2);
  assert.notEqual(selected[0], selected[1]);
});

test("an unknown palette safely falls back to surprise mode", () => {
  const selected = selectBackgrounds("unknown", () => 0.25);

  assert.equal(selected.length, 2);
  assert.notEqual(selected[0], selected[1]);
});
