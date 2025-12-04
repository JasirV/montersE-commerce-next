"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  Gem,
  CreditCard,
  PenTool,
  Umbrella,
  Wallet,
  MoveUpRight,
  Wind,
  Layers,
  ArrowUpRight,
} from "lucide-react";

// --- PLACEHOLDER IMAGES (Replace with your Accessory assets) ---
// Note: For the Mosaic grid, you will need images of varying aspect ratios
import HeroBanner from "@/assets/leather/banner.jpg"; // Use a flatlay of multiple accessories
import WalletImg from "@/assets/leather/01 (1).jpg";
import PenImg from "@/assets/clocks/01 (3).jpg";
import ScarfImg from "@/assets/leather/01 (1).jpeg";
import CufflinkImg from "@/assets/clocks/01 (1).jpg";
import BraceletImg from "@/assets/leather/01 (2).webp";
import UmbrellaImg from "@/assets/clocks/05.jpg";
import CardHolderImg from "@/assets/leather/01 (1).webp";

// --- DATA: CATEGORIES CONFIGURATION ---
const categories = [
  {
    id: "wallets",
    name: "Wallets",
    href: "/accessories/wallets",
    image: WalletImg,
    icon: Wallet,
    // Grid spanning classes for the mosaic layout
    className: "md:col-span-2 md:row-span-2",
  },
  {
    id: "pens",
    name: "Writing Instruments",
    href: "/accessories/pens",
    image: PenImg,
    icon: PenTool,
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: "cufflinks",
    name: "Cufflinks",
    href: "/accessories/cufflinks",
    image: CufflinkImg,
    icon: Gem,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "bracelets",
    name: "Bracelets",
    href: "/accessories/bracelets",
    image: BraceletImg,
    icon: Layers,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "scarfs",
    name: "Scarfs",
    href: "/accessories/scarfs",
    image: ScarfImg,
    icon: Wind,
    className: "md:col-span-2 md:row-span-1",
  },
  {
    id: "cards",
    name: "Card Holders",
    href: "/accessories/cards",
    image: CardHolderImg,
    icon: CreditCard,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "umbrellas",
    name: "Umbrellas",
    href: "/accessories/umbrellas",
    image: UmbrellaImg,
    icon: Umbrella,
    className: "md:col-span-1 md:row-span-1",
  },
];
 const quickLinks = [
    { 
      id: 0, 
      name: "Cufflinks", 
      link: "/accessories/cufflinks", 
      image: CufflinkImg, // Use your imported image variable
      desc: "Subtle sophistication." 
    },
    { 
      id: 1, 
      name: "Scarfs", 
      link: "/accessories/scarfs", 
      image: ScarfImg, 
      desc: "Silk & Cashmere blends." 
    },
    { 
      id: 2, 
      name: "Card Holders", 
      link: "/accessories/cards", 
      image: CardHolderImg, 
      desc: "Slim profile carry." 
    },
    { 
      id: 3, 
      name: "Bracelets", 
      link: "/accessories/bracelets", 
      image: BraceletImg, 
      desc: "Hand-braided accents." 
    },
  ];

// --- ANIMATION HELPER ---
const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function AccessoriesPage() {
  const targetRef = useRef(null);
   const [activeItem, setActiveItem] = useState(0);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <main className="bg-neutral-50 min-h-screen text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* ------------------------------- */}
      {/* 1. MINIMALIST HERO */}
      {/* ------------------------------- */}
      <section
        ref={targetRef}
        className="relative w-full h-[60vh] md:h-[80vh] flex flex-col justify-center items-center overflow-hidden bg-neutral-900 text-white"
      >
        <motion.div style={{ y }} className="absolute inset-0 z-0 opacity-40">
          <Image
            src={HeroBanner}
            alt="Accessories Flatlay"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-serif tracking-tight mb-2">
              The Finishing{" "}
              <span className="text-neutral-400 italic">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 font-light max-w-xl mx-auto leading-relaxed">
              Elevate the everyday with our curated selection of fine
              accessories. Small details, significant impact.
            </p>
          </motion.div>
        </div>

        {/* Scroll Pill */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"
          />
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 2. THE MOSAIC GRID (Categories) */}
      {/* ------------------------------- */}
      <section className="py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
        <FadeIn className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-neutral-200 pb-6">
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-widest">
              Collections
            </h2>
            <p className="text-neutral-500 mt-2">
              Explore our 7 signature categories
            </p>
          </div>
          <div className="hidden md:block text-xs font-mono text-neutral-400">
            EST. 2025 • GENUINE MATERIALS
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] md:auto-rows-[350px] gap-4">
          {categories.map((cat, index) => (
            <MosaicCard key={cat.id} category={cat} index={index} />
          ))}
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 3. FEATURED SPOTLIGHT (Pens/Intellect) */}
      {/* ------------------------------- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <FadeIn className="md:w-1/2 space-y-8 order-2 md:order-1">
              <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-400">
                <PenTool size={16} />
                <span>Spotlight</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif leading-none">
                The Art of <br />
                <span className="text-neutral-500 italic">Correspondence</span>
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                In a digital world, the act of writing becomes a deliberate
                gesture of class. Our collection of fountain and ballpoint pens
                are weighted to perfection, turning signatures into statements.
              </p>
              <Link
                href="/accessories/pens"
                className="inline-flex items-center gap-3 text-neutral-900 font-bold border-b-2 border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-all"
              >
                View Writing Instruments <ArrowRight size={18} />
              </Link>
            </FadeIn>

            <FadeIn className="md:w-1/2 h-[500px] relative order-1 md:order-2">
              <div className="absolute inset-0 bg-neutral-100 rounded-lg overflow-hidden">
                <Image
                  src={PenImg}
                  alt="Luxury Pen Detail"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl rounded-sm max-w-[200px] hidden md:block">
                <p className="font-serif text-2xl italic">
                  "The pen is the tongue of the mind."
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ------------------------------- */}
      {/* 4. FAST SHOP (Horizontal Scroll) */}
      {/* ------------------------------- */}
      <section className="py-24 bg-neutral-900 text-white overflow-hidden">
        <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
          <div>
            <span className="text-neutral-500 uppercase tracking-widest text-xs font-bold mb-2 block">
              Quick Shop
            </span>
            <h3 className="text-3xl font-serif">The Essentials</h3>
          </div>
          <Link
            href="/accessories/wallets"
            className="hidden md:flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            View All Categories <ArrowRight size={16} />
          </Link>
        </div>

        {/* The Accordion Container */}
        <div className="max-w-[1600px] mx-auto px-6 h-auto md:h-[500px] flex flex-col md:flex-row gap-2">
          {quickLinks.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              onHoverStart={() => setActiveItem(index)}
              onClick={() => setActiveItem(index)}
              className={`relative overflow-hidden cursor-pointer rounded-lg md:rounded-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                ${
                  activeItem === index
                    ? "h-[300px] md:h-full md:flex-[3]"
                    : "h-[80px] md:h-full md:flex-1"
                }
              `}
            >
              {/* Background Image (Darkened) */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className={`object-cover transition-transform duration-1000 ${
                    activeItem === index
                      ? "scale-100 opacity-60"
                      : "scale-125 opacity-30 grayscale"
                  }`}
                />
                <div className="absolute inset-0 bg-neutral-900/40 mix-blend-multiply" />
              </div>

              {/* Content Wrapper */}
              <Link
                href={item.link}
                className="absolute inset-0 z-10 flex flex-col justify-between p-6 md:p-8"
              >
                {/* Top: Icons / Number */}
                <div className="flex justify-between items-start">
                  <span
                    className={`text-xs font-mono border rounded-full w-8 h-8 flex items-center justify-center transition-colors ${
                      activeItem === index
                        ? "border-white text-white"
                        : "border-white/20 text-white/20"
                    }`}
                  >
                    0{index + 1}
                  </span>

                  {/* Show Arrow only when active */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeItem === index ? 1 : 0 }}
                    className="bg-white text-black p-2 rounded-full"
                  >
                    <ArrowUpRight size={20} />
                  </motion.div>
                </div>

                {/* Bottom: Text Info */}
                <div>
                  {/* Vertical Text (Desktop Inactive State) */}
                  <div
                    className={`hidden md:block absolute bottom-8 left-8 origin-bottom-left -rotate-90 whitespace-nowrap transition-opacity duration-300 ${
                      activeItem === index ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <h3 className="text-2xl font-serif text-white/50 tracking-wider">
                      {item.name}
                    </h3>
                  </div>

                  {/* Normal Text (Active State or Mobile) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: activeItem === index ? 1 : 0,
                      y: activeItem === index ? 0 : 20,
                    }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    <h3 className="text-3xl md:text-4xl font-serif mb-2">
                      {item.name}
                    </h3>
                    <p className="text-neutral-300 text-sm md:text-base max-w-xs">
                      {item.desc}
                    </p>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

// ----------------------------------------
// SUB-COMPONENT: Mosaic Grid Card
// ----------------------------------------
const MosaicCard = ({ category, index }) => {
  return (
    <Link
      href={category.href}
      className={`relative group overflow-hidden bg-neutral-200 ${category.className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="w-full h-full relative"
      >
        {/* Image */}
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Text Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end">
          <div>
            <div className="mb-2 text-white/70 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <category.icon size={20} />
            </div>
            <h3 className="text-white text-xl md:text-2xl font-serif font-medium">
              {category.name}
            </h3>
          </div>

          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
            <MoveUpRight size={18} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
