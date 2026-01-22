"use client";

import { useState, useRef } from 'react';
import { Upload, Check, Loader2, ArrowRight, ImageIcon } from 'lucide-react';

const SIZES = [
  { label: '45x30 cm', price: 45 },
  { label: '60x40 cm', price: 55 },
  { label: '80x54 cm', price: 68 },
  { label: '90x60 cm', price: 75 },
];

type Step = 'upload' | 'size' | 'processing' | 'selection' | 'checkout';

export default function OrderFlow() {
  const [step, setStep] = useState<Step>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [aiResults, setAiResults] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setStep('size');
      };
      reader.readAsDataURL(file);
    }
  };

  const startProcessing = async () => {
    if (!selectedImage) return;
    
    setStep('processing');
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selectedImage }),
      });
      
      const data = await response.json();
      
      if (data.results) {
        setAiResults(data.results);
        setStep('selection');
      } else {
        throw new Error(data.error || 'Failed to generate');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong with AI processing. Please try again.');
      setStep('size');
    } finally {
      setIsProcessing(false);
    }
  };

  const [email, setEmail] = useState('');

  const handleCheckout = async () => {
    if (!email || selectedResult === null) {
      alert('Please enter your email.');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          size: selectedSize.label,
          price: selectedSize.price,
          email,
          imageUrl: aiResults[selectedResult],
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error: any) {
      console.error(error);
      alert('Checkout failed: ' + error.message);
    }
  };

  return (
    <div id="order-now" className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8">
        {['Upload', 'Size', 'Process', 'Select', 'Pay'].map((label, i) => {
          const currentStepIndex = ['upload', 'size', 'processing', 'selection', 'checkout'].indexOf(step);
          const isActive = i <= currentStepIndex;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < currentStepIndex ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] mt-2 uppercase tracking-wider font-semibold ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="text-center py-12">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-indigo-500 transition-colors cursor-pointer group"
          >
            <Upload className="w-16 h-16 mx-auto text-gray-400 group-hover:text-indigo-500 transition-colors mb-4" />
            <h3 className="text-xl font-bold mb-2">Upload your photo</h3>
            <p className="text-gray-500 mb-6 text-sm">High resolution photos work best (JPG, PNG)</p>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-transform hover:scale-105">
              Choose File
            </button>
            <p className="text-xs text-gray-400 mt-4 italic">Get your custom masterpiece in minutes!</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload} 
            />
          </div>
        </div>
      )}

      {/* Step: Size */}
      {step === 'size' && (
        <div className="py-6">
          <h3 className="text-2xl font-bold mb-6 text-center">Choose Canvas Size</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {SIZES.map((size) => (
              <div 
                key={size.label}
                onClick={() => setSelectedSize(size)}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all flex justify-between items-center ${selectedSize.label === size.label ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
              >
                <div>
                  <div className="font-bold text-lg">{size.label}</div>
                  <div className="text-gray-500 text-sm italic">Premium Canvas</div>
                </div>
                <div className="text-2xl font-black text-indigo-600">€{size.price}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <button onClick={() => setStep('upload')} className="text-gray-500 font-semibold hover:text-gray-700 underline">Back</button>
            <button 
              onClick={startProcessing}
              className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg transition-all"
            >
              Process with AI <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Processing */}
      {step === 'processing' && (
        <div className="text-center py-20">
          <Loader2 className="w-20 h-20 animate-spin mx-auto text-indigo-600 mb-6" />
          <h3 className="text-2xl font-bold mb-2">Nana Banana is working...</h3>
          <p className="text-gray-500 italic">Creating your digital masterpieces with different artistic backgrounds.</p>
          <div className="mt-8 flex justify-center gap-2">
             <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
             <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
             <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      )}

      {/* Step: Selection */}
      {step === 'selection' && (
        <div className="py-6">
          <h3 className="text-2xl font-bold mb-2 text-center">Select Your Result</h3>
          <p className="text-gray-500 text-center mb-8">Pick the one you love the most!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
            {aiResults.map((url, i) => (
              <div 
                key={i}
                onClick={() => setSelectedResult(i)}
                className={`relative group rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${selectedResult === i ? 'border-indigo-600 ring-4 ring-indigo-200' : 'border-transparent hover:border-indigo-300'}`}
              >
                <img src={url} alt={`Result ${i + 1}`} className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 shadow-lg">
                  {selectedResult === i ? <Check className="w-6 h-6 text-indigo-600" /> : <div className="w-6 h-6" />}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button 
              disabled={selectedResult === null}
              onClick={() => setStep('checkout')}
              className="bg-indigo-600 disabled:bg-gray-300 text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Step: Checkout */}
      {step === 'checkout' && (
        <div className="py-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 italic underline">Your Order Summary</h3>
              <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600 font-medium">Product</span>
                  <span className="font-bold">Digital Painting Portrait</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600 font-medium">Size</span>
                  <span className="font-bold">{selectedSize.label}</span>
                </div>
                <div className="flex justify-between items-center text-xl">
                  <span className="text-gray-900 font-black">Total Price</span>
                  <span className="font-black text-indigo-600">€{selectedSize.price}</span>
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-500 leading-relaxed italic">
                Get notified about your order status faster than anyone else! We will send the final file to your email immediately after printing.
              </p>
            </div>
            
            <div className="flex flex-col justify-center">
              <h4 className="text-xl font-bold mb-6">Contact Information</h4>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
              />
              <button 
                onClick={handleCheckout}
                className="bg-indigo-600 text-white w-full py-5 rounded-xl font-black text-xl shadow-2xl hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Pay with Stripe
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">Secure payment via Stripe. No credit card details stored.</p>
            </div>
          </div>
          <button onClick={() => setStep('selection')} className="mt-8 text-gray-500 font-semibold hover:text-gray-700 underline">Back to Selection</button>
        </div>
      )}
    </div>
  );
}
