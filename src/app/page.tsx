import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderFlow from "@/components/OrderFlow";
import Image from "next/image";
import { CheckCircle, Zap, Palette, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
          {/* Background Gallery */}
          <div className="absolute inset-0 z-0 flex items-center overflow-hidden opacity-50 hover:opacity-100 transition-opacity duration-700">
            <div className="animate-marquee flex gap-8 py-10">
              {/* Double the set for seamless loop */}
              {[...Array(2)].map((_, groupIndex) => (
                <div key={groupIndex} className="flex gap-8">
                  {['/pic1.jpg', '/pic2.jpg', '/pic3.jpg', '/pic4.jpg'].map((src, i) => (
                    <div key={`${groupIndex}-${i}`} className="relative w-[300px] h-[450px] rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 transform rotate-2">
                      <Image 
                        src={src} 
                        alt={`Art example ${i + 1}`} 
                        fill 
                        sizes="300px"
                        className="object-cover"
                        priority={groupIndex === 0 && i === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pointer-events-none">
            <div className="text-center max-w-4xl mx-auto pointer-events-auto">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 mb-8 leading-[1]">
                Your Photos. <br />
                <span className="text-indigo-600 drop-shadow-sm">Pure Art.</span>
              </h1>
              <p className="text-2xl text-gray-700 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                Turn your favorite memories into professional digital painting portraits. 
                Choose a size, upload your photo, and let our AI create something magical.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a 
                  href="#order-now" 
                  className="bg-indigo-600 text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                >
                  Create My Portrait
                </a>
                <a 
                  href="#how-it-works" 
                  className="bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 px-12 py-5 rounded-full font-bold text-xl hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-lg"
                >
                  How it Works
                </a>
              </div>
            </div>
          </div>

          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>
        </section>

        {/* Features Section */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 italic">Artistic Perfection in 3 Steps</h2>
              <p className="text-gray-500">Fast, easy, and absolutely stunning results every time.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: "Instant Magic", desc: "Our Nana Banana AI processes your photo in seconds, keeping every detail while adding artistic flair." },
                { icon: <Palette className="w-8 h-8 text-indigo-500" />, title: "Digital Painting", desc: "No filters here. Each portrait is transformed into a digital painting style with artistic backgrounds." },
                { icon: <Heart className="w-8 h-8 text-red-500" />, title: "Premium Quality", desc: "Printed on high-quality museum-grade canvas that lasts a lifetime. Perfect for home or as a gift." }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 transition-hover hover:shadow-lg">
                  <div className="mb-6 p-4 bg-white rounded-full shadow-sm">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3 italic underline">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Flow Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Start Your Transformation</h2>
              <p className="text-gray-500 italic">Select your size and upload your photo to begin.</p>
            </div>
            <OrderFlow />
          </div>
        </section>

        {/* Trust/Social Proof */}
        <section className="py-20 border-t border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-12 items-center opacity-50 grayscale">
              <span className="text-2xl font-black">CANVAS.PRO</span>
              <span className="text-2xl font-black">ART.EE</span>
              <span className="text-2xl font-black">TALLINN.PRINT</span>
              <span className="text-2xl font-black">NANA.BANANA</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

