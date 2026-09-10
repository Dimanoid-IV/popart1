/**
 * Display catalog for storefront schema. Keep in sync with OrderFlow prices;
 * do not use this file to change checkout calculation.
 */
export const CANVAS_OFFERS = [
  { size: "45x30", price: 45 },
  { size: "60x40", price: 55 },
  { size: "80x54", price: 68 },
  { size: "90x60", price: 75 },
] as const;
