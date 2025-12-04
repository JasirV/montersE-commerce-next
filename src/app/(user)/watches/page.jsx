"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import { GiWatch, GiNecklace } from "react-icons/gi";
import { TbBrandApple } from "react-icons/tb";
import Link from "next/link";
import Banner from "../../../assets/watch/banner/01.png";
import { motion } from "framer-motion";
import LuxuryWatch from "../../../assets/watch/banner/02.png";
import LuxuryCat from "../../../assets/watch/cat/luxury.png";
import clasci from "../../../assets/watch/cat/clasci.png";
import sports from "../../../assets/watch/cat/sports.png";
import { useRouter } from "next/navigation"
const Page = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const scrollContainerRef = useRef(null);
  const router = useRouter()
  // Parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const banner = document.getElementById("heroSection");
      if (banner) {
        banner.style.backgroundPositionY = `${scrollY * 0.35}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Watch categories
  const watchCategories = [
    {
      id: "Classic",
      name: "Classic Watches",
      icon: <GiWatch className="text-3xl" />,
      image: clasci,
      link: "/watches/classic",
      count: 42,
    },
    {
      id: "luxury",
      name: "Luxury Collection",
      icon: <GiNecklace className="text-3xl" />,
      image: LuxuryCat,
      link: "/watches/luxury",
      count: 28,
    },
    {
      id: "sport",
      name: "Sports Watches",
      icon: <TbBrandApple className="text-3xl" />,
      link: "/watches/sports",
      image: sports,
      count: 35,
    },
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className=" bg-[#fafafa] font-sans">
      {/* Parallax Hero Section */}
      <section className="relative w-full   text-black flex items-center justify-center px-6 md:px-16 overflow-hidden">
        {/* Background subtle gradient */}

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full max-w-7xl">
          {/* Watch Image */}
          <motion.div
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center md:justify-start"
          >
            <img
              src={LuxuryWatch.src}
              alt="Luxury Watch"
              priority
              className="w-[260px] sm:w-[310px] md:w-[430px] lg:w-[500px] drop-shadow-[0_0_35px_rgba(255,255,255,0.12)]"
            />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 1, ease: "easeOut" }}
            className="text-center md:text-left space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight tracking-tight">
              Experience Luxury.
              <br />
              <span className="text-[32px] sm:text-[42px] lg:text-[52px] font-semibold tracking-wide">
                Redefined.
              </span>
            </h1>

            {/* Sub tiny metallic gold line */}
            <div
              className="h-[3px] w-24 mx-auto md:mx-0 rounded-full"
              style={{ backgroundColor: "#C5A253" }} // metallic gold
            ></div>

            <p className="text-base sm:text-lg text-black max-w-xl">
              A symbol of timeless craftsmanship and unmatched precision —
              designed for those who value elegance in every moment.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start mt-4">
              <Link
                href={"/watches/luxury"}
                className="px-8 py-3 rounded-full shadow-sm bg-white text-black font-medium hover:bg-gray-200 transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Section */}
      <div id="categories" className="mt-8 sm:mt20">
        {/* Mobile view */}
        <div className="lg:hidden bg-white border-b border-gray-100">
          <div className="relative w-full">
            <div
              ref={scrollContainerRef}
              className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-6 py-6 justify-items-center"
            >
              {watchCategories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <Link href={category.link}
                    className="group flex flex-col items-center gap-3 focus:outline-none"
                  >
                    <div
                      className={`
                relative w-20 h-20 rounded-2xl overflow-hidden p-1 transition-all duration-300
                ${
                  isActive
                    ? "bg-black shadow-md scale-105"
                    : "bg-transparent border border-gray-200"
                }
              `}
                    >
                      <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={category.image.src}
                          alt={category.name}
                          className={`
                    w-full h-full object-cover transition-transform duration-500
                    ${isActive ? "scale-110" : "group-hover:scale-110"}
                  `}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <span
                        className={`
                  text-xs font-medium tracking-wide transition-colors
                  ${isActive ? "text-black font-bold" : "text-gray-500"}
                `}
                      >
                        {category.name}
                      </span>

                      {isActive && (
                        <span className="mt-1 w-1 h-1 bg-black rounded-full" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Desktop view */}
        <div className="hidden lg:block bg-white border-b border-gray-100">
          <div className="container mx-auto">
            <div className="flex justify-center items-start py-10 gap-8">
              {watchCategories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className="group flex flex-col items-center gap-4 focus:outline-none"
                  >
                    {/* Image Container */}
                    <div
                      className={`
                relative w-32 h-32 rounded-2xl overflow-hidden bg-gray-50
                transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "ring-2 ring-offset-2 ring-black shadow-xl scale-105"
                    : "hover:shadow-lg hover:-translate-y-1"
                }
              `}
                    >
                      <img
                        src={category.image.src}
                        alt={category.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Optional: Dark overlay when not active/hovered to make active pop more */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`
                  text-sm font-semibold tracking-wide uppercase
                  transition-colors duration-300
                  ${
                    isActive
                      ? "text-black"
                      : "text-gray-500 group-hover:text-black"
                  }
                `}
                      >
                        {category.name}
                      </span>

                      {/* Active Indicator Dot */}
                      <span
                        className={`
                  w-1.5 h-1.5 rounded-full bg-black transition-all duration-300
                  ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }
                `}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        id="heroSection"
        className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Parallax-like feel (fixed) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{ backgroundImage: `url(${Banner.src})` }}
        />

        {/* Modern Gradient Overlay: Clearer at top, darker at bottom for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
          {/* Decorative small label */}
          <span className="mb-6 px-4 py-1.5 border border-white/30 rounded-full text-xs font-medium text-white/90 uppercase tracking-[0.2em] backdrop-blur-sm">
            New Arrivals 2026
          </span>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Master the Art <br className="hidden md:block" /> of Time
          </h1>

          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-light opacity-90">
            Discover a curation of precision engineering and timeless
            aesthetics. Elevate your presence with our exclusive collection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={'/watches/luxury'} className="px-10 py-4 bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-gray-100 transition-all transform hover:-translate-y-1">
              Explore Collection
            </Link>
          </div>
        </div>
      </div>

      {/* CTA / Help */}
      <section className="bg-white text-gray-900 py-24 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* 1. Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-medium mb-6 tracking-tight">
              Discover the World of <br /> Luxury Watches with Montres
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-light">
              Exclusive brands and unique timepieces starting from{" "}
              <span className="text-black font-medium">100</span> to{" "}
              <span className="text-black font-medium">100,000</span>
            </p>
            <div className="w-16 h-px bg-black mx-auto mt-8"></div>
          </div>

          {/* 2, 3, 4. Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 border-b border-gray-100 pb-16">
            {/* Feature: Repair */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 mb-6 flex items-center justify-center border border-gray-200 rounded-full group-hover:border-black transition-colors duration-300">
                {/* Tool/Sparkle Icon */}
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3">
                Professional Repair
              </h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Expert technicians using precision tools to restore your
                timepiece’s shine.
              </p>
            </div>

            {/* Feature: Shipping */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 mb-6 flex items-center justify-center border border-gray-200 rounded-full group-hover:border-black transition-colors duration-300">
                {/* Globe Icon */}
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3">
                Worldwide Shipping
              </h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Receive your watch within 7-10 working days — wherever you are.
              </p>
            </div>

            {/* Feature: Authentic */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 mb-6 flex items-center justify-center border border-gray-200 rounded-full group-hover:border-black transition-colors duration-300">
                {/* Shield/Check Icon */}
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3">
                100% Authentic
              </h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm">
                Trusted Quality — Guaranteed by Montre. Includes a 1-Year
                Warranty.
              </p>
            </div>
          </div>

          {/* 5. Newsletter Section */}
          <div className="bg-gray-50 p-8 md:p-16 text-center rounded-sm">
            <span className="text-2xl mb-2 block">✦</span>
            <h3 className="text-2xl md:text-3xl font-serif font-medium mb-4 text-black">
              Join the World of Montres
            </h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Subscribe to our newsletter and be the first to discover exclusive
              watch releases and special offers.
            </p>

            <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 focus:outline-none focus:border-black transition-colors text-sm"
              />
              <button className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
