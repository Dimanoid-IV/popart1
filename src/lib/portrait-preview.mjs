import sharp from 'sharp';

export function requireOwnedPortrait(portrait, visitorId) {
  if (!portrait || portrait.visitorId !== visitorId || !portrait.originalUrl) throw new Error('Portrait not found');
  return portrait;
}

export function publicPortraitStatus(status, portraitId) {
  const successFlag = status.successFlag ?? status.data?.successFlag;
  return {
    code: status.code ?? 200,
    successFlag,
    ...(successFlag === 1 ? { response: { resultImageUrl: `/api/portraits/${portraitId}/preview`, portraitId } } : {}),
    ...([2, 3].includes(successFlag) ? { errorMessage: 'Generation failed' } : {}),
  };
}

export async function createPortraitPreview(input) {
  const resized = await sharp(input, { limitInputPixels: 40000000 }).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).toBuffer();
  const { width, height } = await sharp(resized).metadata();
  const fontSize = Math.max(22, Math.round(width * 0.045));
  // Vector glyphs keep the mark readable on servers without installed fonts.
  const glyphs = {
    P: ['11110','10001','10001','11110','10000','10000','10000'],
    O: ['01110','10001','10001','10001','10001','10001','01110'],
    A: ['01110','10001','10001','11111','10001','10001','10001'],
    R: ['11110','10001','10001','11110','10100','10010','10001'],
    T: ['11111','00100','00100','00100','00100','00100','00100'],
    E: ['11111','10000','10000','11110','10000','10000','11111'],
    '.': ['00000','00000','00000','00000','00000','00100','00100'],
  };
  const label = 'POPART.EE';
  const cell = fontSize / 7;
  const left = (width - label.length * 6 * cell) / 2;
  const top = height - fontSize * 2;
  const shapes = [...label].flatMap((letter, i) => glyphs[letter].flatMap((row, y) => [...row].map((bit, x) => bit === '1' ? `<rect x="${left + (i * 6 + x) * cell}" y="${top + y * cell}" width="${cell}" height="${cell}"/>` : ''))).join('');
  const watermark = Buffer.from(`<svg width="${width}" height="${height}"><g fill="white" fill-opacity="0.65" stroke="#333" stroke-opacity="0.25" stroke-width="0.5">${shapes}</g></svg>`);
  return sharp(resized).composite([{ input: watermark }]).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
}
