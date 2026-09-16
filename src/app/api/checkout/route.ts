import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getErrorMessage } from '@/lib/errors';
import { randomUUID } from 'node:crypto';
import { getVisitorIdentity, releaseOrderDeposit, reserveOrderDeposit } from '@/lib/generation-credit-store';
import { getCanvasPriceCents } from '@/lib/canvas-pricing.mjs';
import { getPortrait } from '@/lib/portrait-store';
import { requireOwnedPortrait } from '@/lib/portrait-preview.mjs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  let depositReservation: { visitorId: string; reservationId: string } | null = null;

  try {
    const { size, email, portraitId, shippingInfo } = await req.json();
    const identity = await getVisitorIdentity();
    const portrait = requireOwnedPortrait(await getPortrait(portraitId), identity.visitorId);
    const imageUrl = portrait.originalUrl;
    const previewUrl = `${req.nextUrl.origin}/api/portraits/${portraitId}/preview`;
    const reservationId = randomUUID();
    const originalAmount = getCanvasPriceCents(size);
    const discountCents = await reserveOrderDeposit(identity.visitorId, reservationId, originalAmount);
    if (discountCents > 0) depositReservation = { visitorId: identity.visitorId, reservationId };

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `PopArt Portrait - ${size}`,
              images: [previewUrl],
              description: 'Custom digital painting portrait on premium canvas.',
            },
            unit_amount: Math.max(50, originalAmount - discountCents),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: depositReservation
        ? `${req.nextUrl.origin}/api/checkout/cancel?reservation=${reservationId}`
        : `${req.nextUrl.origin}/#order-now`,
      customer_email: email,
      metadata: {
        size,
        imageUrl,
        previewUrl,
        fullName: shippingInfo.fullName,
        address: shippingInfo.address,
        postalCode: shippingInfo.postalCode,
        phone: shippingInfo.phone,
        visitorId: identity.visitorId,
        depositReservationId: depositReservation ? reservationId : '',
        depositDiscountCents: String(discountCents),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    if (depositReservation) {
      try { await releaseOrderDeposit(depositReservation.visitorId, depositReservation.reservationId); } catch (releaseError) { console.error('Deposit release failed:', releaseError); }
    }
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to create checkout session') },
      { status: 500 }
    );
  }
}
