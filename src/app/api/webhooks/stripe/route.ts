import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia' as any,
  });

  // Check if Resend API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

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
    const customerEmail = session.customer_details?.email || session.customer_email || '';

    console.log('Processing checkout.session.completed event:', {
      customerEmail,
      fullName,
      size,
      imageUrl,
    });

    // Validate required data
    if (!customerEmail) {
      console.error('Customer email is missing');
    }
    if (!imageUrl) {
      console.error('Image URL is missing from metadata');
    }

    // Send email to customer
    if (customerEmail) {
      try {
        const customerEmailResult = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev', // Use verified domain or Resend default
          to: customerEmail,
          subject: 'Your PopArt.ee Order Confirmation',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee; }
                .image-container { text-align: center; margin: 20px 0; }
                .image-container img { max-width: 300px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank you for your order, ${fullName || 'Valued Customer'}!</h1>
                </div>
                <div class="content">
                  <p>We've received your request for a <strong>${size || 'custom size'}</strong> digital painting.</p>
                  <p>Our team is currently preparing your masterpiece. It will be printed and shipped to your address shortly.</p>
                  
                  <div class="details">
                    <h3 style="margin-top: 0;">Shipping Details:</h3>
                    <p><strong>Address:</strong> ${address || 'Not provided'}</p>
                    <p><strong>Postal Code:</strong> ${postalCode || 'Not provided'}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                  </div>
                  
                  ${imageUrl ? `
                    <div class="image-container">
                      <p><strong>Your Selected Portrait:</strong></p>
                      <img src="${imageUrl}" alt="Your Selection" />
                    </div>
                  ` : ''}
                  
                  <div class="details">
                    <p style="font-size: 18px; margin: 0;"><strong>Order Total: €${(session.amount_total! / 100).toFixed(2)}</strong></p>
                  </div>
                  
                  <p>We'll notify you once your order is ready for shipment!</p>
                </div>
                <div class="footer">
                  <p>PopArt.ee - Transforming memories into art</p>
                  <p>If you have any questions, please contact us at info@popart.ee</p>
                </div>
              </div>
            </body>
            </html>
          `,
        });
        console.log('Customer email sent successfully:', customerEmailResult);
      } catch (error: any) {
        console.error('Failed to send customer email:', error);
        // Don't fail the webhook if customer email fails
      }
    }

    // Send notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'popartee@gmail.com';
      const adminEmailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: adminEmail,
        subject: `New Order from ${fullName || 'Unknown Customer'}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 800px; margin: 0 auto; padding: 20px; }
              .header { background: #667eea; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
              .order-details h2 { margin-top: 0; color: #667eea; }
              .order-details p { margin: 10px 0; }
              .image-container { text-align: center; margin: 30px 0; }
              .image-container img { max-width: 500px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 2px solid #667eea; }
              .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎨 New Order Received!</h1>
              </div>
              <div class="content">
                <div class="order-details">
                  <h2>Customer Information</h2>
                  <p><strong>Name:</strong> ${fullName || 'Not provided'}</p>
                  <p><strong>Email:</strong> ${customerEmail || 'Not provided'}</p>
                  <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                </div>
                
                <div class="order-details">
                  <h2>Order Details</h2>
                  <p><strong>Size:</strong> ${size || 'Not specified'}</p>
                  <p><strong>Price:</strong> €${(session.amount_total! / 100).toFixed(2)}</p>
                  <p><strong>Order ID:</strong> ${session.id}</p>
                </div>
                
                <div class="order-details">
                  <h2>Shipping Address</h2>
                  <p><strong>Address:</strong> ${address || 'Not provided'}</p>
                  <p><strong>Postal Code:</strong> ${postalCode || 'Not provided'}</p>
                </div>
                
                ${imageUrl ? `
                  <div class="image-container">
                    <h2>Selected Portrait</h2>
                    <p><a href="${imageUrl}" target="_blank">View full size image</a></p>
                    <img src="${imageUrl}" alt="Portrait" />
                  </div>
                ` : '<div class="highlight"><strong>⚠️ Warning:</strong> Image URL is missing from order metadata!</div>'}
                
                <div class="highlight">
                  <p><strong>Action Required:</strong> Process this order and prepare the canvas print for shipping.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      console.log('Admin email sent successfully:', adminEmailResult);
    } catch (error: any) {
      console.error('Failed to send admin email:', error);
      // Return error so Stripe can retry
      return NextResponse.json(
        { error: `Failed to send admin email: ${error.message}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
