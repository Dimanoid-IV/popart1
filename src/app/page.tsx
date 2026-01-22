"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderFlow from "@/components/OrderFlow";
import Image from "next/image";
import { CheckCircle, Zap, Palette, Heart } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

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
                {t.hero.title1} <br />
                <span className="text-indigo-600 drop-shadow-sm">{t.hero.title2}</span>
              </h1>
              <p className="text-2xl text-gray-700 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                {t.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a 
                  href="#order-now" 
                  className="bg-indigo-600 text-white px-12 py-5 rounded-full font-bold text-xl shadow-2xl hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                >
                  {t.hero.ctaPrimary}
                </a>
                <a 
                  href="#how-it-works" 
                  className="bg-white/80 backdrop-blur-sm text-gray-900 border-2 border-gray-200 px-12 py-5 rounded-full font-bold text-xl hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-lg"
                >
                  {t.hero.ctaSecondary}
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
              <h2 className="text-3xl md:text-5xl font-bold mb-4 italic">{t.features.sectionTitle}</h2>
              <p className="text-gray-500">{t.features.sectionDesc}</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                { icon: <Zap className="w-8 h-8 text-yellow-500" />, title: t.features.feature1.title, desc: t.features.feature1.desc },
                { icon: <Palette className="w-8 h-8 text-indigo-500" />, title: t.features.feature2.title, desc: t.features.feature2.desc },
                { icon: <Heart className="w-8 h-8 text-red-500" />, title: t.features.feature3.title, desc: t.features.feature3.desc }
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

        {/* Pricing Section with Sofa */}
        <section id="pricing" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 italic">{t.nav.pricing}</h2>
            
            <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
              {/* Sofa Background */}
              <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[16/10]">
                <Image 
                  src="/divan.png" 
                  alt="Living room setup" 
                  fill 
                  className="object-cover"
                />
                
                {/* Portraits on the wall */}
                <div className="absolute top-[5%] left-0 w-full h-[55%] flex items-end justify-center gap-4 md:gap-12 px-4">
                  {[
                    { size: '45x30', price: '45', scale: 0.5 },
                    { size: '60x40', price: '55', scale: 0.67 },
                    { size: '80x54', price: '68', scale: 0.89 },
                    { size: '90x60', price: '75', scale: 1.0 },
                  ].map((p, i) => (
                    <div 
                      key={p.size} 
                      className="flex flex-col items-center group transition-all hover:-translate-y-2"
                      style={{ 
                        width: `${p.scale * 20}%`,
                        minWidth: '60px'
                      }}
                    >
                      <div 
                        className="relative w-full aspect-[2/3] bg-gray-200 border-[3px] md:border-[6px] border-white shadow-2xl rounded-sm overflow-hidden mb-2"
                      >
                        <Image 
                          src={`/pic${i + 1}${i + 1}.JPG`}
                          alt={p.size}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-lg border border-gray-100">
                        <p className="text-[8px] md:text-xs font-bold text-gray-900 whitespace-nowrap">{p.size} cm</p>
                        <p className="text-[8px] md:text-xs font-black text-indigo-600">€{p.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Order Flow Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">{t.order.sectionTitle}</h2>
              <p className="text-gray-500 italic">{t.order.sectionDesc}</p>
            </div>
            <OrderFlow />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

