import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FREE_GENERATION_ROUNDS,
  PAID_GENERATION_ROUNDS,
  CREDIT_PACK_PRICE_CENTS,
  normalizeCreditSnapshot,
} from './generation-credits.mjs';

test('a new visitor receives two free generation rounds', () => {
  assert.equal(FREE_GENERATION_ROUNDS, 2);
  assert.deepEqual(normalizeCreditSnapshot(null), {
    freeRemaining: 2,
    paidRemaining: 0,
    totalRemaining: 2,
  });
});

test('paid packs add three rounds and cost 2.99 euros', () => {
  assert.equal(PAID_GENERATION_ROUNDS, 3);
  assert.equal(CREDIT_PACK_PRICE_CENTS, 299);
  assert.deepEqual(normalizeCreditSnapshot({ freeUsed: 2, paidRemaining: 3 }), {
    freeRemaining: 0,
    paidRemaining: 3,
    totalRemaining: 3,
  });
});

test('malformed and excessive stored values cannot grant extra free rounds', () => {
  assert.deepEqual(normalizeCreditSnapshot({ freeUsed: -4, paidRemaining: -8 }), {
    freeRemaining: 2,
    paidRemaining: 0,
    totalRemaining: 2,
  });
  assert.deepEqual(normalizeCreditSnapshot({ freeUsed: 99, paidRemaining: 1 }), {
    freeRemaining: 0,
    paidRemaining: 1,
    totalRemaining: 1,
  });
});
