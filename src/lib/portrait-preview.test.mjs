import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { createPortraitPreview, publicPortraitStatus, requireOwnedPortrait } from './portrait-preview.mjs';

test('successful browser status never contains the provider original URL', () => {
  const result = publicPortraitStatus({ code: 200, data: { successFlag: 1, response: { resultImageUrl: 'https://provider.example/original.png' }, secret: 'hidden' } }, 'portrait-123');
  assert.deepEqual(result, { code: 200, successFlag: 1, response: { resultImageUrl: '/api/portraits/portrait-123/preview', portraitId: 'portrait-123' } });
  assert.equal(JSON.stringify(result).includes('provider.example'), false);
});

test('another visitor cannot select an original for printing', () => {
  assert.throws(() => requireOwnedPortrait({ visitorId: 'owner', originalUrl: 'https://provider.example/image.png' }, 'other'), /Portrait not found/);
  assert.equal(requireOwnedPortrait({ visitorId: 'owner', originalUrl: 'https://provider.example/image.png' }, 'owner').originalUrl, 'https://provider.example/image.png');
});

test('preview remains high quality but is limited to 1200 pixels and watermarked', async () => {
  const input = await sharp({ create: { width: 2000, height: 3000, channels: 3, background: '#eeeeee' } }).png().toBuffer();
  const output = await createPortraitPreview(input);
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.width, 800);
  assert.equal(metadata.height, 1200);
  assert.equal(metadata.format, 'jpeg');
  const pixels = await sharp(output).raw().toBuffer();
  assert.ok(pixels.subarray(pixels.length - 800 * 150 * 3).some((pixel) => pixel < 180), 'watermark changes pixels near bottom');
});
