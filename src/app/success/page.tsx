import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';
import Stripe from 'stripe';
import PurchaseAnalytics from '@/components/analytics/PurchaseAnalytics';
import { verifiedPurchase } from '@/lib/purchase-analytics.mjs';
import { cookies } from 'next/headers';
import { VISITOR_COOKIE } from '@/lib/generation-credit-store';

export const metadata: Metadata = {
  title: 'Order Successful',
  alternates: { canonical: null },
  robots: { index: false, follow: false },
};

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  const visitorId = (await cookies()).get(VISITOR_COOKIE)?.value;
  let purchase = null;
  // This read does not fulfill an order: the existing webhook remains authoritative.
  if (visitorId && typeof sessionId === 'string' && sessionId.length <= 255 && /^cs_(?:test_|live_)?[a-zA-Z0-9]+$/.test(sessionId) && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { timeout: 5000, maxNetworkRetries: 0 });
      purchase = verifiedPurchase(await stripe.checkout.sessions.retrieve(sessionId), visitorId);
    } catch { /* An analytics failure must not hide the confirmation page. */ }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <PurchaseAnalytics purchase={purchase} />
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We&apos;ve received your art selection and our team is getting it ready for printing.
          You&apos;ll receive a confirmation email shortly.
        </p>
        <div className="space-y-4">
          <Link 
            href="/" 
            className="block w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            Back to Home
          </Link>
          <p className="text-sm text-gray-400 italic">
            Get notified about new orders faster than anyone else!
          </p>
        </div>
      </div>
    </div>
  );
}
