import test from 'node:test';
import assert from 'node:assert/strict';
import { getGenerationFollowUpVisibility } from './order-flow-visibility.mjs';

test('changing the source photo becomes available after the first generation round', () => {
  assert.deepEqual(getGenerationFollowUpVisibility(0), { canChangePhoto: false, showContact: false });
  assert.deepEqual(getGenerationFollowUpVisibility(2), { canChangePhoto: true, showContact: false });
});

test('direct contact is offered after the second generation round', () => {
  assert.deepEqual(getGenerationFollowUpVisibility(4), { canChangePhoto: true, showContact: true });
  assert.deepEqual(getGenerationFollowUpVisibility(6), { canChangePhoto: true, showContact: true });
});
