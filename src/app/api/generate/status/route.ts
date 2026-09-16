import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/errors';
import { getVisitorIdentity } from '@/lib/generation-credit-store';
import { getPortraitTask, savePortraitResult } from '@/lib/portrait-store';
import { publicPortraitStatus } from '@/lib/portrait-preview.mjs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = process.env.NANOBANANA_API_KEY;
  const taskId = req.nextUrl.searchParams.get('taskId');

  if (!token) {
    return NextResponse.json({ error: 'NANOBANANA_API_KEY is missing' }, { status: 500 });
  }

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  try {
    const identity = await getVisitorIdentity();
    const portrait = await getPortraitTask(taskId);
    if (!portrait || portrait.visitorId !== identity.visitorId) {
      return NextResponse.json({ error: 'Portrait not found' }, { status: 404 });
    }
    const baseUrl = 'https://api.nanobananaapi.ai/api/v1/nanobanana';
    const statusRes = await fetch(`${baseUrl}/record-info?taskId=${taskId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const statusData = await statusRes.json();

    const successFlag = statusData.successFlag ?? statusData.data?.successFlag;
    const originalUrl = (statusData.response || statusData.data?.response)?.resultImageUrl;
    if (successFlag === 1 && originalUrl) await savePortraitResult(portrait, originalUrl);
    return NextResponse.json(publicPortraitStatus(statusData, portrait.portraitId), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error: unknown) {
    console.error('Status Check Error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to check generation status') },
      { status: 500 }
    );
  }
}
