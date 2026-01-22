import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We've received your art selection and our team is getting it ready for printing.
          You'll receive a confirmation email shortly.
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
