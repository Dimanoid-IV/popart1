import { createHash } from 'node:crypto';
import { getCanvasPriceCents } from './canvas-pricing.mjs';

/** Accept only a server-retrieved, completed canvas payment; expose no customer fields. */
export function verifiedPurchase(session) {
  if (!session || session.mode !== 'payment' || session.status !== 'complete' || session.payment_status !== 'paid' || session.currency !== 'eur' || session.metadata?.purchaseType === 'generation_credits' || !Number.isInteger(session.amount_total) || session.amount_total <= 0 || typeof session.id !== 'string') return null;
  try { getCanvasPriceCents(session.metadata?.size); } catch { return null; }
  return {
    transaction_id: createHash('sha256').update(session.id).digest('hex').slice(0, 32),
    value: session.amount_total / 100,
    currency: 'EUR',
    items: [{ item_id: 'canvas-portrait', item_name: 'PopArt canvas portrait', item_variant: session.metadata.size, price: session.amount_total / 100, quantity: 1 }],
  };
}
