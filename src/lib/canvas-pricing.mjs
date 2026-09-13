const CANVAS_PRICES_CENTS = new Map([
  ['45x30 cm', 4500],
  ['60x40 cm', 5500],
  ['80x54 cm', 6800],
  ['90x60 cm', 7500],
]);

export function getCanvasPriceCents(size) {
  const amount = CANVAS_PRICES_CENTS.get(size);
  if (!amount) throw new Error('Unknown canvas size');
  return amount;
}
