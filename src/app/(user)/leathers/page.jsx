"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowUpRight,
  ShoppingBag,
  Scissors,
  Feather,
  CheckCircle2,
  ArrowRight,
  MoveRight,
} from "lucide-react";

// --- PLACEHOLDER IMAGES (Replace with your Leather assets) ---
// You mentioned you have 2 categories: Bags and Belts.
import LeatherHeroBox from '@/assets/leather/banner.jpg' // Replace with a leather workshop or texture shot
import bagCat from '@/assets/leather/01 (1).jpg'
import bletcat from '@/assets/leather/01 (1).webp'
import bagpro from '@/assets/leather/01 (1).jpeg'
import beltpro from '@/assets/leather/01 (2).webp'

import BagImage from '@/assets/clocks/01 (1).jpg'   // Replace with your Bag Image
import BeltImage from '@/assets/clocks/01 (3).jpg'  // Replace with your Belt Image
import Link from "next/link";

// --- ANIMATION HELPER ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, delay: delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Page() {
  const containerRef = useRef(null);

  return (
    <main className="bg-[#fcfbf9] text-[#2c2420] selection:bg-[#8c6b4e] selection:text-white overflow-x-hidden">
      
      {/* ------------------------------- */}
      {/* 1. LEATHER HERO SECTION */}
      {/* ------------------------------- */}
      <section className="relative w-full h-[90vh] flex items-end pb-24 px-6 md:px-12 border-b border-[#e5e0d8]">
        <div className="absolute inset-0 z-0">
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512]/90 via-[#1a1512]/40 to-transparent z-10" />
            
            {/* Background Image - ideally a close up of leather texture or a dark workshop */}
            <Image 
                src={LeatherHeroBox} 
                alt="Leather Texture background" 
                fill 
                className="object-cover"
            />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <span className="block text-[#d4af37] font-medium tracking-[0.2em] uppercase mb-4 text-sm">
                        Montres Leatherworks
                    </span>
                    <h1 className="text-6xl md:text-8xl font-serif text-[#fcfbf9] leading-[0.9]">
                        Aged to <br />
                        <span className="italic font-light opacity-90">Perfection.</span>
                    </h1>
                </motion.div>
            </div>
            <div className="lg:col-span-4 text-[#fcfbf9]/80 text-lg font-light leading-relaxed border-l border-[#d4af37]/30 pl-6">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Discover our handcrafted collection of full-grain leather essentials. 
                    Designed to develop a unique patina that tells your story over time.
                </motion.p>
            </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 2. CATEGORY SPLIT (BAGS VS BELTS) */}
      {/* ------------------------------- */}
      <section className="py-24 px-4 bg-[#fcfbf9]">
        <div className="max-w-7xl mx-auto mb-16 text-center">
            <FadeIn>
                <h2 className="text-4xl font-serif text-[#2c2420]">The Collection</h2>
                <div className="w-16 h-[2px] bg-[#8c6b4e] mx-auto mt-4" />
            </FadeIn>
        </div>

        {/* Interactive Split Cards */}
        <div className="max-w-[1600px] mx-auto h-[600px] md:h-[700px] flex flex-col md:flex-row gap-4">
            
            {/* BAGS CATEGORY */}
            <CategoryCard 
                title="Travel & Daily Bags" 
                subtitle="Duffels, Briefcases, and Totes"
                image={bagCat}
                href="/leathers/bags"
                align="left"
            />

            {/* BELTS CATEGORY */}
            <CategoryCard 
                title="Premium Belts" 
                subtitle="Full Grain & Hand-Stitched"
                image={bletcat}
                href="/belts"
                align="right"
            />
            
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 3. MATERIAL PHILOSOPHY */}
      {/* ------------------------------- */}
      <section className="py-24 bg-[#1a1512] text-[#fcfbf9] px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
                <div className="relative">
                    <div className="absolute -top-10 -left-10 text-[12rem] font-serif text-[#d4af37]/5 font-bold leading-none select-none">
                        &quot;
                    </div>
                    <h3 className="text-3xl md:text-5xl font-serif leading-tight relative z-10">
                        Leather is not just a material. It is a <span className="text-[#d4af37] italic">living witness</span> to your journey.
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                            <Feather size={24} />
                        </div>
                        <h4 className="text-xl font-bold">Full Grain Quality</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            We use only the top layer of the hide, retaining natural grain and ensuring maximum durability.
                        </p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                            <Scissors size={24} />
                        </div>
                        <h4 className="text-xl font-bold">Hand-Finished</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Edges are burnished by hand, and stitching is reinforced to withstand decades of use.
                        </p>
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.3} className="relative h-[500px] w-full bg-[#2c2420] rounded-sm overflow-hidden group">
                 {/* Decorative image demonstrating craftsmanship */}
                 <Image 
                    src={LeatherHeroBox} 
                    alt="Craftsmanship" 
                    fill 
                    className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                     <button className="w-20 h-20 rounded-full bg-[#d4af37] text-black flex items-center justify-center hover:scale-110 transition-transform">
                        <ArrowRight size={32} />
                     </button>
                </div>
            </FadeIn>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 4. PRODUCT SHOWCASE (Bento Grid) */}
      {/* ------------------------------- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <h2 className="text-4xl font-serif text-[#2c2420]">New Arrivals</h2>
                <Link href={'/leathers/bags'} className="flex items-center gap-2 text-[#8c6b4e] uppercase tracking-widest text-xs font-bold hover:gap-4 transition-all">
                    View Full Catalogue <MoveRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 h-auto md:h-[800px]">
                {/* Large Featured Item */}
                <FadeIn className="md:col-span-2 md:row-span-2 relative group overflow-hidden bg-[#f4f1ea] rounded-xl">
                    <Image src={bagpro} alt="Signature Weekender" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/60 to-transparent text-white translate-y-4 group-hover:translate-y-0 transition-transform">
                        <h3 className="text-2xl font-serif">The Signature Weekender</h3>
                        <p className="text-sm text-white/80 mt-2 mb-4">Cognac Finish • Brass Hardware</p>
                        <Link href={'/leathers/bags'} className="inline-flex items-center gap-2 text-[#d4af37] text-sm uppercase tracking-wider font-bold">
                            Shop Now <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </FadeIn>

                {/* Small Item 1 */}
                <FadeIn delay={0.1} className="relative group overflow-hidden bg-[#f4f1ea] rounded-xl min-h-[300px]">
                    <Image src={beltpro} alt="Classic Belt" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
                     <div className="absolute bottom-6 left-6 text-white">
                        <h4 className="text-xl font-serif">Classic Dress Belt</h4>
                        {/* <p className="text-[#d4af37]">$120.00</p> */}
                     </div>
                </FadeIn>

                {/* Small Item 2 */}
                <FadeIn delay={0.2} className="relative group overflow-hidden bg-[#f4f1ea] rounded-xl flex items-center justify-center text-center p-8 border border-[#e5e0d8]">
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-[#2c2420] text-white rounded-full flex items-center justify-center">
                            <ShoppingBag />
                        </div>
                        <h3 className="text-xl font-serif text-[#2c2420]">Custom Orders</h3>
                        <p className="text-gray-500 text-sm">
                            Want a specific color or monogram? We offer bespoke services.
                        </p>
                        <Link href={'/leathers/bags'}  className="text-[#8c6b4e] underline decoration-[#8c6b4e] underline-offset-4">Configure Yours</Link>
                    </div>
                </FadeIn>
            </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 5. FOOTER CTA */}
      {/* ------------------------------- */}
      <section className="py-20 bg-[#8c6b4e] text-white text-center px-6">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-serif mb-6">Invest in Longevity</h2>
            <p className="max-w-xl mx-auto text-white/80 text-lg mb-8">
                Our leather goods come with a lifetime warranty on stitching and hardware.
            </p>
            {/* <button className="bg-white text-[#8c6b4e] px-10 py-4 rounded-sm font-bold tracking-widest uppercase hover:bg-[#1a1512] hover:text-white transition-colors duration-300">
                Start Your Journey
            </button> */}
          </FadeIn>
      </section>

    </main>
  );
}

// ----------------------------------------
// SUB-COMPONENT: Expandable Category Card
// ----------------------------------------
const CategoryCard = ({ title, subtitle, image, href, align }) => {
    return (
        <motion.div 
            className="group relative flex-1 min-h-[300px] overflow-hidden rounded-lg cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] hover:flex-[2]"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image 
                    src={image} 
                    alt={title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
            </div>

            {/* Content Content */}
            <div className={`absolute inset-0 p-10 flex flex-col justify-end ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
                
                {/* Decorative Line */}
                <div className={`w-12 h-1 bg-[#d4af37] mb-6 transition-all duration-500 group-hover:w-24`} />
                
                <h3 className="text-3xl md:text-5xl font-serif text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {title}
                </h3>
                
                <p className="text-white/80 text-lg mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                    {subtitle}
                </p>

                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    <span className="uppercase tracking-widest text-xs font-bold">Explore</span>
                    <ArrowRight size={14} />
                </div>
            </div>
        </motion.div>
    )
}