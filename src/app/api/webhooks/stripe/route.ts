import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

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
    const { size, imageUrl, fullName, address, postalCode, phone } = session.metadata || {};
    const customerEmail = session.customer_details?.email || '';

    // Send email to customer
    await resend.emails.send({
      from: 'PopArt.ee <orders@popart.ee>',
      to: customerEmail,
      subject: 'Your PopArt.ee Order Confirmation',
      html: `
        <h1>Thank you for your order, ${fullName}!</h1>
        <p>We've received your request for a <strong>${size}</strong> digital painting.</p>
        <p>Our team is currently preparing your masterpiece. It will be printed and shipped to your address shortly.</p>
        <div style="border: 1px solid #eee; padding: 15px; border-radius: 10px; margin: 20px 0;">
          <h3>Shipping Details:</h3>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Postal Code:</strong> ${postalCode}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>
        <img src="${imageUrl}" alt="Your Selection" style="max-width: 300px; border-radius: 10px;" />
        <p>Order Total: €${session.amount_total! / 100}</p>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: 'PopArt.ee System <system@popart.ee>',
      to: 'dmitri.ivkin@gmail.com',
      subject: `New Order from ${fullName}`,
      html: `
        <h1>New Order Details</h1>
        <p><strong>Customer Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Size:</strong> ${size}</p>
        <p><strong>Shipping Address:</strong> ${address}, ${postalCode}</p>
        <p><strong>Selected Image:</strong> <a href="${imageUrl}">${imageUrl}</a></p>
        <br/>
        <img src="${imageUrl}" alt="Portrait" style="max-width: 500px;" />
      `,
    });
  }

  return NextResponse.json({ received: true });
}
