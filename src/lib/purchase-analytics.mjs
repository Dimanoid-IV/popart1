import { createHash } from 'node:crypto';
import { getCanvasPriceCents } from './canvas-pricing.mjs';

/** Accept only a server-retrieved, completed canvas payment; expose no customer fields. */
export function verifiedPurchase(session, visitorId) {
  if (!session || session.mode !== 'payment' || session.status !== 'complete' || session.payment_status !== 'paid' || session.currency !== 'eur' || session.metadata?.purchaseType === 'generation_credits' || !Number.isInteger(session.amount_total) || session.amount_total <= 0 || typeof session.id !== 'string') return null;
  if (typeof visitorId !== 'string' || !visitorId || session.metadata?.visitorId !== visitorId) return null;
  let originalCents;
  try { originalCents = getCanvasPriceCents(session.metadata?.size); } catch { return null; }
  const discount = session.metadata?.depositDiscountCents ?? '0';
  if (!/^\d+$/.test(discount)) return null;
  const discountCents = Number(discount);
  if (!Number.isSafeInteger(discountCents) || discountCents > originalCents || (discountCents > 0 && !session.metadata?.depositReservationId)) return null;
  if (session.amount_total !== Math.max(50, originalCents - discountCents)) return null;
  return {
    transaction_id: createHash('sha256').update(session.id).digest('hex').slice(0, 32),
    value: session.amount_total / 100,
    currency: 'EUR',
    items: [{ item_id: 'canvas-portrait', item_name: 'PopArt canvas portrait', item_variant: session.metadata.size, price: session.amount_total / 100, quantity: 1 }],
  };
}
