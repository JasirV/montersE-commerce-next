"use client";

import Image from "next/image";
import React, { useState } from "react";
import AboutHero from '../../assets/About hereo.jpg';

export default function About() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Watch Sales",
      desc: "Original luxury timepieces handpicked for style and value.",
      icon: "💎"
    },
    { 
      title: "Authentication", 
      desc: "Expert verification and provenance checks.",
      icon: "🔍"
    },
    { 
      title: "Repairs", 
      desc: "Full service: polishing, batteries, mechanical care.",
      icon: "🛠️"
    },
    { 
      title: "Accessories", 
      desc: "Straps, boxes and premium add-ons.",
      icon: "🎁"
    },
  ];

  return (
    <main className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Enhanced HERO Section */}
      <section className="relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
          {/* Fixed Image component for better optimization */}
          <div className="absolute inset-0">
            <Image
              src={AboutHero}
              alt="Montres Luxury Watches"
              fill
              className="object-cover object-center transform scale-105"
              priority
              quality={90}
              placeholder="blur"
            />
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gold rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium">Luxury Watches Dubai</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Montres
                  <span className="block text-2xl sm:text-3xl text-gold mt-2">مونتريس</span>
                </h1>
                
                <p className="text-xl sm:text-2xl opacity-90 max-w-xl leading-relaxed">
                  Your destination for luxury watches and genuine leather repair in Dubai. Experience craftsmanship,
                  authenticity checks and premium aftercare.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#services"
                  className="inline-flex items-center justify-center bg-gold text-black font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                >
                  Explore Services
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 group"
                >
                  Visit Our Store
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">↗</span>
                </a>
              </div>
            </div>

            {/* Enhanced decorative cards - Mobile version */}
            <div className="lg:hidden grid grid-cols-2 gap-4 mt-8">
              {[
                {
                  title: "Authenticity",
                  desc: "Expert authentication",
                },
                {
                  title: "Repairs & Care",
                  desc: "Professional servicing",
                },
                {
                  title: "Accessories",
                  desc: "Luxury add-ons",
                },
                {
                  title: "Buy & Sell",
                  desc: "Curated selection",
                },
              ].map((card, index) => (
                <div
                  key={card.title}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                >
                  <h3 className="font-bold text-sm text-gray-900">{card.title}</h3>
                  <p className="mt-1 text-xs text-gray-600">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Enhanced decorative cards - Desktop */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    title: "Authenticity",
                    desc: "Expert authentication to guarantee genuine pieces.",
                    delay: "100"
                  },
                  {
                    title: "Repairs & Care",
                    desc: "Polishing, battery change, service & more.",
                    delay: "200"
                  },
                  {
                    title: "Accessories",
                    desc: "Straps, boxes and luxury add-ons.",
                    delay: "300"
                  },
                  {
                    title: "Buy & Sell",
                    desc: "Curated selection of classic and modern watches.",
                    delay: "400"
                  },
                ].map((card, index) => (
                  <div
                    key={card.title}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    style={{ animationDelay: `${card.delay}ms` }}
                  >
                    <h3 className="font-bold text-lg text-gray-900">{card.title}</h3>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Enhanced ABOUT DETAILS - Bilingual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* English Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">About Montres</h2>
              <div className="w-20 h-1 bg-gold rounded-full"></div>
            </div>
            
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to "Montres," your ultimate destination for luxury watches in Dubai. We offer a curated
              selection of classic and modern watches, along with comprehensive services to meet all your horological needs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[
                {
                  icon: "💎",
                  title: "Luxury Watch Sales",
                  desc: "Curated originals and limited editions from renowned brands."
                },
                {
                  icon: "🔍",
                  title: "Authentication",
                  desc: "Expert verification ensuring every piece is 100% genuine."
                },
                {
                  icon: "🛠️",
                  title: "Comprehensive Maintenance",
                  desc: "Professional polishing, battery replacement, and servicing."
                },
                {
                  icon: "🎁",
                  title: "Premium Accessories",
                  desc: "Elegant straps, boxes, and luxury add-ons to complement your style."
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <a
                href="/contact-us"
                className="inline-flex items-center justify-center bg-gray-900 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base"
              >
                Contact Us Today
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:border-gray-400 transition-all duration-300 text-sm sm:text-base"
              >
                View All Services
              </a>
            </div>
          </div>

          {/* Arabic Section */}
          <div dir="rtl" className="space-y-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-100">
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Montres - مونتريس</h2>
              <div className="w-20 h-1 bg-gold rounded-full ml-auto"></div>
            </div>
            
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              مرحبًا بكم في "مونتريس"، وجهتكم المثالية لعالم الساعات الفاخرة في دبي. نقدم مجموعة مختارة من
              الساعات الكلاسيكية والعصرية، بالإضافة إلى خدمات شاملة تلبي جميع احتياجاتكم في عالم الساعات.
            </p>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">خدماتنا تشمل:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gold rounded-full flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">بيع الساعات الفاخرة الأصلية</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gold rounded-full flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">فحص وضمان أصالة الساعات</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gold rounded-full flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">الصيانة الشاملة والتلميع المتخصص</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-gold rounded-full flex-shrink-0"></span>
                  <span className="text-sm sm:text-base">إكسسوارات فاخرة لإكمال الأناقة</span>
                </li>
              </ul>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 border-t border-gray-200 pt-4 mt-4">
              زورونا في معرضنا لتجربة فريدة تجمع بين الحرفية المتقولة والأناقة الرفيعة.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced SERVICES CARDS */}
      <section id="services" className="bg-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              From sales to service — everything a collector or owner needs for their luxury timepieces.
            </p>
            <div className="w-20 h-1 bg-gold rounded-full mx-auto mt-4 sm:mt-6"></div>
          </div>

          {/* Mobile Carousel */}
          <div className="lg:hidden">
            <div className="relative">
              <div className="overflow-x-auto snap-x snap-mandatory scrollbar-hide flex gap-4 pb-6 -mx-4 px-4">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[280px] sm:w-80 snap-center bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{service.icon}</div>
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 group"
              >
                <div className="text-4xl lg:text-5xl mb-4 lg:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3 lg:mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced STATS Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
            {[
              { number: "1,200+", label: "Happy Customers", suffix: "" },
              { number: "15+", label: "Years Experience", suffix: "" },
              { number: "500+", label: "Watches Serviced", suffix: "" },
            ].map((stat, index) => (
              <div key={index} className="space-y-3 sm:space-y-4">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 animate-count-up">
                  {stat.number}
                </div>
                <div className="text-lg sm:text-xl text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12 sm:mt-16 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Ready to Experience Montres?
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                Visit our store in Dubai and discover the world of luxury watches and premium care services.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                id="contact"
                href="/shop"
                className="inline-flex items-center justify-center bg-gold text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group text-sm sm:text-base"
              >
                Visit Our Store
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:border-gray-400 transition-all duration-300 text-sm sm:text-base"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes count-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-count-up {
          animation: count-up 0.8s ease-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .bg-gold {
          background-color: #D4AF37;
        }

        .text-gold {
          color: #D4AF37;
        }
      `}</style>
    </main>
  );
}