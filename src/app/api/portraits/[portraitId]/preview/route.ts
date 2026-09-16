import { NextRequest, NextResponse } from 'next/server';
import { getPortrait } from '@/lib/portrait-store';
import { createPortraitPreview } from '@/lib/portrait-preview.mjs';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, context: { params: Promise<{ portraitId: string }> }) {
  const { portraitId } = await context.params;
  const portrait = await getPortrait(portraitId);
  if (!portrait?.originalUrl) return NextResponse.json({ error: 'Portrait not found' }, { status: 404 });
  try {
    const original = await fetch(portrait.originalUrl, { signal: AbortSignal.timeout(15000) });
    if (!original.ok) throw new Error('Image unavailable');
    const image = await createPortraitPreview(Buffer.from(await original.arrayBuffer()));
    return new NextResponse(new Uint8Array(image), { headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'private, max-age=3600',
      'Content-Disposition': 'inline; filename="popart-preview.jpg"',
      'X-Content-Type-Options': 'nosniff',
    } });
  } catch {
    return NextResponse.json({ error: 'Preview unavailable' }, { status: 502 });
  }
}
