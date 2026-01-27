import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

// GET endpoint to check configuration
export async function GET() {
  const config = {
    hasResendKey: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev (default)',
    resendKeyLength: process.env.RESEND_API_KEY?.length || 0,
  };
  
  return NextResponse.json({
    message: 'Email configuration check',
    config,
    instructions: !config.hasResendKey 
      ? 'Please set RESEND_API_KEY in your .env.local file'
      : 'Configuration looks good! Use POST to send test email.',
  });
}

// Test endpoint to verify email sending works
// Access: POST /api/test-email
export async function POST(req: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { 
        error: 'RESEND_API_KEY is not configured',
        instructions: 'Please create a .env.local file in the project root with: RESEND_API_KEY=re_your_key_here',
      },
      { status: 500 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { email } = await req.json();
    const testEmail = email || 'dmitri.ivkin@gmail.com';

    // Test admin email
    const adminResult = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: 'dmitri.ivkin@gmail.com',
      subject: 'Test Email from PopArt.ee',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify that Resend is working correctly.</p>
        <p>If you received this, email sending is configured properly!</p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
    });

    // Test customer email (if email provided)
    let customerResult = null;
    if (email && email !== 'dmitri.ivkin@gmail.com') {
      customerResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: testEmail,
        subject: 'Test Email from PopArt.ee',
        html: `
          <h1>Test Email</h1>
          <p>This is a test email to verify that Resend is working correctly.</p>
          <p>If you received this, email sending is configured properly!</p>
          <p>Time: ${new Date().toISOString()}</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      adminEmail: adminResult,
      customerEmail: customerResult,
      message: 'Test emails sent successfully. Check your inbox!',
    });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      {
        error: 'Failed to send test email',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
