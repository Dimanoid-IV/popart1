import test from 'node:test';
import assert from 'node:assert/strict';
import { getCanvasPriceCents } from './canvas-pricing.mjs';

test('canvas checkout uses the server price instead of a client supplied amount', () => {
  assert.equal(getCanvasPriceCents('45x30 cm'), 4500);
  assert.equal(getCanvasPriceCents('90x60 cm'), 7500);
});

test('unknown canvas sizes are rejected', () => {
  assert.throws(() => getCanvasPriceCents('90x60 cm hacked'), /Unknown canvas size/);
});
