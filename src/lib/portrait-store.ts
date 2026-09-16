import { randomUUID } from 'node:crypto';
import { redis } from './generation-credit-store';

type Portrait = { visitorId: string; portraitId: string; originalUrl?: string };
const TTL = 30 * 24 * 60 * 60;

export async function registerPortraitTask(taskId: string, visitorId: string) {
  const portrait: Portrait = { visitorId, portraitId: randomUUID() };
  await redis(['SET', `popart:task:${taskId}`, JSON.stringify(portrait), 'EX', TTL]);
}

export async function getPortraitTask(taskId: string): Promise<Portrait | null> {
  const value = await redis<string | null>(['GET', `popart:task:${taskId}`]);
  return value ? JSON.parse(value) : null;
}

export async function savePortraitResult(portrait: Portrait, originalUrl: string) {
  await redis(['SET', `popart:portrait:${portrait.portraitId}`, JSON.stringify({ ...portrait, originalUrl }), 'EX', TTL]);
}

export async function getPortrait(portraitId: string): Promise<Portrait | null> {
  if (!/^[a-f0-9-]{36}$/.test(portraitId)) return null;
  const value = await redis<string | null>(['GET', `popart:portrait:${portraitId}`]);
  return value ? JSON.parse(value) : null;
}
