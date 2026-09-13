import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { CREDIT_PACK_PRICE_CENTS, PAID_GENERATION_ROUNDS } from '@/lib/generation-credits.mjs';
import { getCredits, getVisitorIdentity, VISITOR_COOKIE } from '@/lib/generation-credit-store';
import { getErrorMessage } from '@/lib/errors';

export const dynamic = 'force-dynamic';

function withVisitorCookie(response: NextResponse, visitorId: string, isNew: boolean) {
  if (isNew) response.cookies.set(VISITOR_COOKIE, visitorId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 365 * 24 * 60 * 60, path: '/' });
  return response;
}

export async function GET() {
  try {
    const identity = await getVisitorIdentity();
    return withVisitorCookie(NextResponse.json(await getCredits(identity.visitorId)), identity.visitorId, identity.isNew);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, 'Failed to load generation credits') }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const identity = await getVisitorIdentity();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'PopArt.ee — 3 additional portrait generations', description: 'The €2.99 payment is credited toward a canvas portrait order.' },
          unit_amount: CREDIT_PACK_PRICE_CENTS,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/?generation_credits=success#order-now`,
      cancel_url: `${req.nextUrl.origin}/#order-now`,
      metadata: { purchaseType: 'generation_credits', visitorId: identity.visitorId, creditCount: String(PAID_GENERATION_ROUNDS) },
    });
    return withVisitorCookie(NextResponse.json({ url: session.url }), identity.visitorId, identity.isNew);
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error, 'Failed to create credit checkout') }, { status: 500 });
  }
}
