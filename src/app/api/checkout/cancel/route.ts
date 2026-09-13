import { NextRequest, NextResponse } from 'next/server';
import { getVisitorIdentity, releaseOrderDeposit } from '@/lib/generation-credit-store';

export async function GET(req: NextRequest) {
  const reservationId = req.nextUrl.searchParams.get('reservation');
  if (reservationId) {
    const identity = await getVisitorIdentity();
    await releaseOrderDeposit(identity.visitorId, reservationId);
  }
  return NextResponse.redirect(new URL('/#order-now', req.url));
}
