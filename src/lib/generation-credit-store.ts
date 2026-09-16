import { createHash, randomUUID } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { FREE_GENERATION_ROUNDS, normalizeCreditSnapshot } from './generation-credits.mjs';

export const VISITOR_COOKIE = 'popart_visitor';
const FREE_WINDOW_SECONDS = 24 * 60 * 60;
const IP_FREE_LIMIT = 12;

type RedisResult<T> = { result?: T; error?: string };

export async function redis<T>(command: Array<string | number>): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('Generation credit storage is not configured');

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  const payload = await response.json() as RedisResult<T>;
  if (!response.ok || payload.error) throw new Error(payload.error || 'Credit storage request failed');
  return payload.result as T;
}

export async function getVisitorIdentity() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const visitorId = cookieStore.get(VISITOR_COOKIE)?.value || randomUUID();
  const forwarded = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwarded || headerStore.get('x-real-ip') || 'unknown';
  const ipHash = createHash('sha256').update(`${ip}:${process.env.CREDIT_FINGERPRINT_SALT || 'popart'}`).digest('hex').slice(0, 24);
  return { visitorId, isNew: !cookieStore.has(VISITOR_COOKIE), ipHash };
}

const keysFor = (visitorId: string, ipHash: string) => ({
  free: `popart:free:${visitorId}`,
  paid: `popart:paid:${visitorId}`,
  ip: `popart:ip:${ipHash}`,
});

export async function getCredits(visitorId: string) {
  const [freeUsed, paidRemaining, depositCents] = await redis<Array<string | null>>(['MGET', `popart:free:${visitorId}`, `popart:paid:${visitorId}`, `popart:deposit:${visitorId}`]);
  return { ...normalizeCreditSnapshot({ freeUsed, paidRemaining }), depositCents: Math.max(0, Number.parseInt(depositCents || '0', 10) || 0) };
}

export async function consumeGenerationCredit(visitorId: string, ipHash: string) {
  const keys = keysFor(visitorId, ipHash);
  const script = `
local freeUsed = tonumber(redis.call('GET', KEYS[1]) or '0')
local paid = tonumber(redis.call('GET', KEYS[2]) or '0')
local ipUsed = tonumber(redis.call('GET', KEYS[3]) or '0')
if freeUsed < tonumber(ARGV[1]) and ipUsed < tonumber(ARGV[2]) then
  local nextFree = redis.call('INCR', KEYS[1])
  local nextIp = redis.call('INCR', KEYS[3])
  if nextFree == 1 then redis.call('EXPIRE', KEYS[1], ARGV[3]) end
  if nextIp == 1 then redis.call('EXPIRE', KEYS[3], ARGV[3]) end
  return {1, tonumber(ARGV[1]) - nextFree, paid, 1}
end
if paid > 0 then
  local nextPaid = redis.call('DECR', KEYS[2])
  return {1, 0, nextPaid, 2}
end
return {0, math.max(0, tonumber(ARGV[1]) - freeUsed), paid, 0}
`;
  const [allowed, freeRemaining, paidRemaining, sourceCode] = await redis<[number, number, number, number]>([
    'EVAL', script, 3, keys.free, keys.paid, keys.ip, FREE_GENERATION_ROUNDS, IP_FREE_LIMIT, FREE_WINDOW_SECONDS,
  ]);
  const source: 'free' | 'paid' | null = sourceCode === 1 ? 'free' : sourceCode === 2 ? 'paid' : null;
  return { allowed: allowed === 1, source, freeRemaining, paidRemaining, totalRemaining: freeRemaining + paidRemaining };
}

export async function refundGenerationCredit(visitorId: string, ipHash: string, source: 'free' | 'paid') {
  const keys = keysFor(visitorId, ipHash);
  if (source === 'paid') return redis<number>(['INCR', keys.paid]);
  const script = `
if tonumber(redis.call('GET', KEYS[1]) or '0') > 0 then redis.call('DECR', KEYS[1]) end
if tonumber(redis.call('GET', KEYS[2]) or '0') > 0 then redis.call('DECR', KEYS[2]) end
return 1
`;
  return redis<number>(['EVAL', script, 2, keys.free, keys.ip]);
}

export async function grantPaidCredits(visitorId: string, checkoutSessionId: string, count: number, depositCents: number) {
  const script = `
if redis.call('SET', KEYS[1], '1', 'NX', 'EX', ARGV[1]) then
  local credits = redis.call('INCRBY', KEYS[2], ARGV[2])
  redis.call('INCRBY', KEYS[3], ARGV[3])
  return credits
end
return tonumber(redis.call('GET', KEYS[2]) or '0')
`;
  return redis<number>(['EVAL', script, 3, `popart:credit-event:${checkoutSessionId}`, `popart:paid:${visitorId}`, `popart:deposit:${visitorId}`, 90 * 24 * 60 * 60, count, depositCents]);
}

export async function reserveOrderDeposit(visitorId: string, reservationId: string, maxCents: number) {
  const now = Math.floor(Date.now() / 1000);
  const script = `
local prior = redis.call('HMGET', KEYS[2], 'amount', 'expires')
if prior[1] and tonumber(prior[2]) <= tonumber(ARGV[1]) then
  redis.call('INCRBY', KEYS[1], tonumber(prior[1]))
  redis.call('DEL', KEYS[2])
end
if redis.call('EXISTS', KEYS[2]) == 1 then return 0 end
local available = tonumber(redis.call('GET', KEYS[1]) or '0')
local amount = math.min(available, tonumber(ARGV[2]))
if amount <= 0 then return 0 end
redis.call('DECRBY', KEYS[1], amount)
redis.call('HSET', KEYS[2], 'id', ARGV[3], 'amount', amount, 'expires', tonumber(ARGV[1]) + 1800)
redis.call('EXPIRE', KEYS[2], 1800)
return amount
`;
  return redis<number>(['EVAL', script, 2, `popart:deposit:${visitorId}`, `popart:reservation:${visitorId}`, now, maxCents, reservationId]);
}

export async function releaseOrderDeposit(visitorId: string, reservationId: string) {
  const script = `
local current = redis.call('HGET', KEYS[2], 'id')
if current ~= ARGV[1] then return 0 end
local amount = tonumber(redis.call('HGET', KEYS[2], 'amount') or '0')
if amount > 0 then redis.call('INCRBY', KEYS[1], amount) end
redis.call('DEL', KEYS[2])
return amount
`;
  return redis<number>(['EVAL', script, 2, `popart:deposit:${visitorId}`, `popart:reservation:${visitorId}`, reservationId]);
}

export async function finalizeOrderDeposit(visitorId: string, reservationId: string) {
  const script = `if redis.call('HGET', KEYS[1], 'id') == ARGV[1] then return redis.call('DEL', KEYS[1]) end return 0`;
  return redis<number>(['EVAL', script, 1, `popart:reservation:${visitorId}`, reservationId]);
}
