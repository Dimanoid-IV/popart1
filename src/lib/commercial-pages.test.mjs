import assert from 'node:assert/strict';
import test from 'node:test';
import { localizePath } from './locales.ts';

test('commercial language switching reaches the real translated slug or English homepage', () => {
  assert.equal(localizePath('/et/portree-fotost', 'ru'), '/ru/portret-po-foto');
  assert.equal(localizePath('/ru/portret-po-foto', 'et'), '/et/portree-fotost');
  assert.equal(localizePath('/ru/portret-po-foto', 'en'), '/');
  assert.equal(localizePath('/et/portree-fotost', 'et'), '/et/portree-fotost');
  assert.equal(localizePath('/ru/delivery', 'et'), '/et/delivery');
});
