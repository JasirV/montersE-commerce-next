"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  ChevronDown,
  ArrowRight,
  Star,
} from "lucide-react";

// Make sure these paths match your actual project structure


import Banner from '@/assets/clocks/05.jpg'
import ImageOne from '@/assets/clocks/01 (1).jpg'
import ImageTwo from '@/assets/clocks/01 (3).jpg'
import Link from "next/link";

// --- Animation Helper Component ---
// Wraps content and makes it fade up when it enters the screen
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Page() {
  // 1. We create the ref
  const targetRef = useRef(null);

  // 2. We tell framer-motion to track the scroll of this specific ref
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <main className="bg-neutral-50 selection:bg-[#d4af37] selection:text-white">
      {/* ------------------------------- */}
      {/* 1. HERO SECTION WITH PARALLAX */}
      {/* ------------------------------- */}
      {/* 3. FIX: Attached ref={targetRef} here so the hook can find it */}
      <div
        ref={targetRef}
        className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden bg-black"
      >
        {/* Background Image */}
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: `url(${Banner.src})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
          {/* Text Left */}
          <div className="text-center lg:text-left pt-20 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 border border-[#d4af37]/50 rounded-full text-[#d4af37] text-xs font-medium tracking-[0.2em] uppercase mb-6 backdrop-blur-sm">
                New Collection 2026
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 font-serif">
                Time is the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3eac2]">
                  Ultimate Luxury
                </span>
              </h1>
              <p className="text-gray-300 text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed font-light mb-8">
                Crafted for those who appreciate the weight of history and the
                precision of the future. Elevate your presence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href={'/watches/luxury'}  className="bg-[#d4af37] hover:bg-[#b5952f] text-black px-8 py-4 rounded-sm font-bold tracking-widest text-xs uppercase transition-all">
                  Explore Collection
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 animate-bounce"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown size={20} />
        </motion.div>
      </div>

      {/* ------------------------------- */}
      {/* 2. BRAND TICKER (Atmosphere) */}
      {/* ------------------------------- */}
      <div className="bg-[#d4af37] py-4 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          <span className="text-black font-bold uppercase tracking-widest mx-8">
            Swiss Engineering
          </span>{" "}
          •
          <span className="text-black font-bold uppercase tracking-widest mx-8">
            Lifetime Support
          </span>{" "}
          •
          <span className="text-black font-bold uppercase tracking-widest mx-8">
            Certified Authenticity
          </span>{" "}
          •
          <span className="text-black font-bold uppercase tracking-widest mx-8">
            Global Shipping
          </span>{" "}
          •
          <span className="text-black font-bold uppercase tracking-widest mx-8">
            Swiss Engineering
          </span>{" "}
          •
          <span className="text-black font-bold uppercase tracking-widest mx-8">
            Lifetime Support
          </span>
        </div>
      </div>

      {/* ------------------------------- */}
      {/* 3. ABOUT / HERITAGE */}
      {/* ------------------------------- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Image Grid */}
            <FadeIn className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-12">
                <div className="h-64 w-full bg-neutral-100 rounded-lg overflow-hidden relative">
                  {/* Placeholder for detail shot 1 */}
                  <Image
                    src={ImageOne}
                    alt="Detail"
                    className="object-cover w-full h-full opacity-80 hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="h-48 w-full bg-neutral-900 rounded-lg overflow-hidden relative flex items-center justify-center">
                  <span className="text-[#d4af37] font-serif text-4xl italic">
                    1985
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-48 w-full bg-[#d4af37]/10 rounded-lg overflow-hidden relative flex items-center justify-center">
                  <Clock className="text-[#d4af37] w-12 h-12" />
                </div>
                <div className="h-80 w-full bg-neutral-100 rounded-lg overflow-hidden relative">
                  {/* Placeholder for detail shot 2 */}
                  <Image
                    src={ImageTwo}
                    alt="Detail"
                    className="object-cover w-full h-full scale-150 opacity-80"
                  />
                </div>
              </div>
            </FadeIn>

            {/* Content */}
            <FadeIn delay={0.2}>
              <h4 className="text-[#d4af37] font-bold uppercase tracking-widest text-sm mb-4">
                The Heritage
              </h4>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 font-serif leading-tight">
                Crafting Legacies, <br /> One Second at a Time.
              </h2>
              <p className="text-neutral-600 text-lg leading-relaxed mb-6">
                For over three decades, we have curated the world's most
                exquisite timepieces. We believe a watch is not merely an
                instrument of time, but a testament to human ingenuity and
                style.
              </p>
              <p className="text-neutral-600 text-lg leading-relaxed mb-8">
                From the internal movement to the sapphire crystal finish, every
                piece in our showroom tells a unique story of excellence.
              </p>
              <button className="group flex items-center gap-2 text-black font-semibold uppercase tracking-widest border-b border-black pb-1 hover:text-[#d4af37] hover:border-[#d4af37] transition-all">
                Read Our Story{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 4. FEATURES (Value Props) */}
      {/* ------------------------------- */}
      <section className="py-24 bg-white text-black  ">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Why Connoisseurs Choose Us
            </h2>
            <div className="w-20 h-1 bg-[#d4af37] mx-auto" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <FadeIn
              delay={0.1}
              className=" p-8 rounded-2xl shadow-lg  hover:border-[#d4af37]/50 transition-colors group"
            >
              <div className="w-14 h-14  rounded-full flex items-center justify-center mb-6 text-[#d4af37] group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Authentic</h3>
              <p className="text-neutral-800 leading-relaxed">
                Every timepiece is verified by our in-house horologists. We
                guarantee authenticity and include a comprehensive warranty with
                every purchase.
              </p>
            </FadeIn>

            {/* Feature 2 */}
            <FadeIn
              delay={0.2}
              className=" p-8 rounded-2xl shadow-lg  hover:border-[#d4af37]/50 transition-colors group"
            >
              <div className="w-14 h-14  rounded-full flex items-center justify-center mb-6 text-[#d4af37] group-hover:scale-110 transition-transform">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Servicing</h3>
              <p className="text-neutral-800 leading-relaxed">
                Maintain the value of your investment. Our state-of-the-art
                service center handles polishing, movement calibration, and
                repairs.
              </p>
            </FadeIn>

            {/* Feature 3 */}
            <FadeIn
              delay={0.3}
              className="shadow-lg p-8 rounded-2xl hover:border-[#d4af37]/50 transition-colors group"
            >
              <div className="w-14 h-14  rounded-full flex items-center justify-center mb-6 text-[#d4af37] group-hover:scale-110 transition-transform">
                <Truck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Global Delivery</h3>
              <p className="text-neutral-800 leading-relaxed">
                Fully insured, white-glove shipping to your doorstep. Receive
                your watch within 7-10 working days, wherever you are in the
                world.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 5. PHYSICAL STORE SECTION */}
      {/* ------------------------------- */}
      <section className="relative py-28 bg-white px-6 overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-neutral-50 -skew-x-12 z-0 hidden lg:block" />

        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <FadeIn className="lg:w-1/2 text-center lg:text-left space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-neutral-900">
              Experience Luxury <br />{" "}
              <span className="text-[#d4af37]">In Person</span>
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              Nothing compares to the feeling of a perfect fit. Visit our
              flagship showroom to explore exclusive "Store Only" collections.
              Enjoy a private consultation with espresso or champagne while you
              browse.
            </p>

            <div className="space-y-4 bg-neutral-50 p-8 rounded-2xl border border-neutral-100 inline-block text-left w-full">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#d4af37] mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-neutral-900">
                    Montres Watch, Leather Sell & Repair Store
                  </h4>
                  <p className="text-gray-500">
                     Moza Plaza - 1 Al Khor St - Al Corniche - Deira - Dubai
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="text-[#d4af37] mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-neutral-900">Opening Hours</h4>
                  <p className="text-gray-500">
                    10:00 AM – 9:00 PM (Mon – Sat)
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Image/Map Representation */}
          <FadeIn
            delay={0.3}
            className="lg:w-1/2 w-full h-[500px] relative rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Simulating a Map or Storefront image */}
            <div className="absolute inset-0 bg-neutral-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d110942.72228082338!2d55.21420366975388!3d25.27417092315784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3e5f435ad7cce631%3A0x7bb62949cfd4ba39!2s77FW%2BMJV%20Moza%20Plaza%20-%201%20Al%20Khor%20St%20-%20Deira%20-%20Dubai!3m2!1d25.2741938!2d55.296605199999995!5e1!3m2!1sen!2sae!4v1754506903484!5m2!1sen!2sae"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Montre's Dubai Showroom Location"
                className="rounded-lg"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 6. TESTIMONIALS */}
      {/* ------------------------------- */}
      <section className="py-24 bg-neutral-50 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold">
              Trusted by Collectors
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <FadeIn
                key={i}
                delay={i * 0.1}
                className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 text-[#d4af37] mb-4">
                  {[...Array(5)].map((_, n) => (
                    <Star key={n} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">
                  "An absolutely seamless experience. The team sourced a rare
                  vintage model I had been hunting for years. The condition was
                  immaculate."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-bold text-sm">Rahul K.</p>
                    <p className="text-xs text-gray-400">Verified Buyer</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 7. FAQ (Simple Accordion Style) */}
      {/* ------------------------------- */}
      <section className="py-24 bg-white px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold">
              Frequently Asked Questions
            </h2>
          </FadeIn>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <FadeIn
              delay={0.1}
              className="border border-gray-200 rounded-lg p-6 hover:border-black transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">
                  Do you offer international shipping?
                </h3>
                <ChevronDown className="group-hover:rotate-180 transition-transform" />
              </div>
              <p className="mt-3 text-gray-500 text-sm leading-relaxed hidden group-hover:block animate-fade-in">
                Yes, we ship globally via insured courier services. Shipping is
                free for orders above $500.
              </p>
            </FadeIn>

            {/* FAQ Item 2 */}
            <FadeIn
              delay={0.2}
              className="border border-gray-200 rounded-lg p-6 hover:border-black transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">
                  Are the watches authentic?
                </h3>
                <ChevronDown className="group-hover:rotate-180 transition-transform" />
              </div>
              <p className="mt-3 text-gray-500 text-sm leading-relaxed hidden group-hover:block animate-fade-in">
                Absolutely. Every watch goes through a rigorous inspection
                process by our certified experts.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 8. FOOTER / NEWSLETTER CTA */}
      {/* ------------------------------- */}
      <section className="py-24 bg-white text-black relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 px-6">
          <FadeIn>
            <h3 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              Join the Inner Circle
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Be the first to know about new arrivals, limited edition drops,
              and exclusive events at our showroom.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-6 py-4 rounded-full bg-white/10 border border-black text-white placeholder:text-gray-500 focus:outline-none focus:border-[#d4af37] w-full sm:w-96 backdrop-blur-sm transition-colors"
              />
              <button className="bg-[#d4af37] hover:bg-[#c4a030] text-black px-10 py-4 rounded-full font-bold tracking-wide shadow-lg hover:shadow-[#d4af37]/20 transition-all">
                Subscribe
              </button>
            </div>
            <p className="text-gray-600 text-xs mt-6">
              By subscribing, you agree to our Privacy Policy.
            </p>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
