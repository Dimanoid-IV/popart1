export const FREE_GENERATION_ROUNDS = 3;
export const PAID_GENERATION_ROUNDS = 3;
export const CREDIT_PACK_PRICE_CENTS = 299;

const nonNegativeInteger = (value) => {
  const parsed = Number.parseInt(String(value ?? 0), 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export function normalizeCreditSnapshot(snapshot) {
  const freeUsed = Math.min(FREE_GENERATION_ROUNDS, nonNegativeInteger(snapshot?.freeUsed));
  const paidRemaining = nonNegativeInteger(snapshot?.paidRemaining);
  const freeRemaining = FREE_GENERATION_ROUNDS - freeUsed;

  return {
    freeRemaining,
    paidRemaining,
    totalRemaining: freeRemaining + paidRemaining,
  };
}
