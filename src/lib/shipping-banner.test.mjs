import assert from "node:assert/strict";
import test from "node:test";

import { getShippingBanner } from "./shipping-banner.ts";

test("the free Estonia delivery promise follows the selected site language", () => {
  assert.equal(getShippingBanner("en"), "Free delivery across Estonia");
  assert.equal(getShippingBanner("ru"), "Бесплатная доставка по всей Эстонии");
  assert.equal(getShippingBanner("et"), "Tasuta kohaletoimetamine üle Eesti");
});
