import { NextRequest, NextResponse } from 'next/server';

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
    const baseUrl = 'https://api.nanobananaapi.ai/api/v1/nanobanana';
    const statusRes = await fetch(`${baseUrl}/record-info?taskId=${taskId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const statusData = await statusRes.json();

    return NextResponse.json(statusData);
  } catch (error: any) {
    console.error('Status Check Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
