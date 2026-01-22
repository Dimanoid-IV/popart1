import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Extract metadata
    const { size, imageUrl } = session.metadata || {};
    const customerEmail = session.customer_details?.email || '';

    // Send email to customer
    await resend.emails.send({
      from: 'PopArt.ee <orders@popart.ee>',
      to: customerEmail,
      subject: 'Your PopArt.ee Order Confirmation',
      html: `
        <h1>Thank you for your order!</h1>
        <p>We've received your request for a <strong>${size}</strong> digital painting.</p>
        <p>Our team is currently preparing your masterpiece. You will receive the high-resolution file soon.</p>
        <img src="${imageUrl}" alt="Your Selection" style="max-width: 300px; border-radius: 10px;" />
        <p>Order Total: €${session.amount_total! / 100}</p>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: 'PopArt.ee System <system@popart.ee>',
      to: 'info@popart.ee',
      subject: 'New Order Received!',
      html: `
        <h1>New Order for ${size}</h1>
        <p>Customer: ${customerEmail}</p>
        <p>Image URL: <a href="${imageUrl}">${imageUrl}</a></p>
      `,
    });
  }

  return NextResponse.json({ received: true });
}
