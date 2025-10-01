"use client"
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Import your images - replace these with optimized smaller banner images
import LuxuryWatchCollection from "../../assets/Banners/LuxuryWatchCollection.jpg";
import NewArrivals2025 from "../../assets/Banners/NewArrivals2025.jpg";
import ExclusiveLimited from "../../assets/Banners/ExclusiveLimited.jpg";
import WorldWideShipping from "../../assets/Banners/WorldWideShipping.jpg";

const EcommerceBannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef(null);
  const videoRef = useRef(null);

  const slides = [
    {
      type: "image",
      content: LuxuryWatchCollection,
      alt: "Montres Luxury Watches 2025 Collection",
      title: "MONTRES 2025 COLLECTION",
      subtitle: "Exclusive Launch",
      description: "Discover our premium Swiss timepieces with advanced craftsmanship and timeless elegance.",
      cta: "Explore Collection",
      buttonVariant: "primary",
      textPosition: "left",
      textColor: "text-white",
      overlay: "bg-gradient-to-r from-black/60 to-transparent",
      theme: "luxury"
    },
    {
      type: "image",
      content: NewArrivals2025,
      alt: "Montres New Arrivals Luxury Watches",
      title: "NEW ARRIVALS",
      subtitle: "Spring Summer 2025",
      description: "Fresh designs featuring innovative technology and premium materials.",
      cta: "View New Pieces",
      buttonVariant: "primary",
      textPosition: "left",
      textColor: "text-white",
      overlay: "bg-gradient-to-l from-black/60 to-transparent",
      theme: "new"
    },
    {
      type: "image",
      content: ExclusiveLimited,
      alt: "Montres Limited Edition Luxury Watches",
      title: "LIMITED EDITION",
      subtitle: "Only 50 Pieces Worldwide",
      description: "Exclusive chronograph series with diamond accents. Each piece numbered.",
      cta: "Reserve Now",
      buttonVariant: "outline",
      textPosition: "left",
      textColor: "text-white",
      overlay: "bg-gradient-to-r from-gray-900/70 to-transparent",
      theme: "exclusive"
    },
    {
      type: "image",
      content: WorldWideShipping,
      alt: "Montres GCC Fast Shipping Service",
      title: "FREE EXPRESS DELIVERY",
      subtitle: "Across GCC & Middle East",
      description: "Complimentary 24-hour delivery in UAE. 3-day delivery to neighboring countries.",
      cta: "Learn More",
      buttonVariant: "secondary",
      textPosition: "center",
      textColor: "text-white",
      overlay: "bg-gradient-to-t from-blue-900/40 to-transparent",
      theme: "shipping"
    }
  ];

  // Slide controls
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  // Auto-play with pause on hover
  useEffect(() => {
    if (!isHovering) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isHovering]);

  // Restart video on slide change
  useEffect(() => {
    if (slides[currentSlide].type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentSlide]);

  // Mobile-optimized text content block
  const renderTextBlock = (slide) => (
    <div
      className={`w-full px-3 sm:px-4 md:px-6 ${slide.textColor} animate-fadeInUp
        ${
          slide.textPosition === "left"
            ? "text-left"
            : slide.textPosition === "right"
            ? "text-right"
            : "text-center"
        }`}
    >
      {slide.subtitle && (
        <p className="text-xs xs:text-sm sm:text-base text-amber-300 font-light mb-1 xs:mb-2 tracking-wider uppercase">
          {slide.subtitle}
        </p>
      )}
      {slide.title && (
        <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 xs:mb-3 leading-tight">
          {slide.title}
        </h2>
      )}
      {slide.description && (
        <p className="text-xs xs:text-sm sm:text-base mb-3 xs:mb-4 leading-relaxed max-w-xs xs:max-w-sm sm:max-w-md mx-auto line-clamp-2 xs:line-clamp-3">
          {slide.description}
        </p>
      )}
      {slide.cta && (
        <button
          className={`px-4 xs:px-5 py-2 xs:py-2.5 rounded-lg font-semibold transition-all duration-300 text-xs xs:text-sm transform hover:scale-105 active:scale-95
            ${
              slide.buttonVariant === "primary"
                ? "bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl"
                : slide.buttonVariant === "secondary"
                ? "border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm"
                : "border-2 border-white text-white hover:bg-white hover:text-gray-900"
            }`}
        >
          {slide.cta}
        </button>
      )}
    </div>
  );

  return (
    <>
      <section
        className="relative w-full h-[35vh] xs:h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] overflow-hidden bg-gray-100"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-20" : "opacity-0 z-10"
            }`}
          >
            {slide.type === "image" ? (
              <Image
                src={slide.content}
                alt={slide.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
                quality={75}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={slide.content} type="video/mp4" />
              </video>
            )}

            {/* Mobile-optimized Overlay + Text */}
            <div
              className={`absolute inset-0 ${slide.overlay} flex items-center 
                ${
                  slide.textPosition === "left"
                    ? "justify-start pl-3 xs:pl-4 sm:pl-6 md:pl-8 lg:pl-12"
                    : slide.textPosition === "right"
                    ? "justify-end pr-3 xs:pr-4 sm:pr-6 md:pr-8 lg:pr-12"
                    : "justify-center text-center"
                }`}
            >
              {renderTextBlock(slide)}
            </div>
          </div>
        ))}

        {/* Mobile-optimized Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-1 xs:px-2 sm:px-3 md:px-4 z-30 pointer-events-none">
          <button
            onClick={prevSlide}
            className="bg-black/40 hover:bg-black/60 p-1.5 xs:p-2 sm:p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 pointer-events-auto touch-manipulation"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="text-white text-sm xs:text-base sm:text-lg" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-black/40 hover:bg-black/60 p-1.5 xs:p-2 sm:p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 pointer-events-auto touch-manipulation"
            aria-label="Next slide"
          >
            <FaChevronRight className="text-white text-sm xs:text-base sm:text-lg" />
          </button>
        </div>

        {/* Mobile-optimized Dots Indicator */}
        <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 xs:gap-1.5 sm:gap-2 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-1.5 xs:h-2 w-1.5 xs:w-2 rounded-full transition-all duration-300 backdrop-blur-sm touch-manipulation
                ${
                  currentSlide === idx
                    ? "bg-amber-400 w-4 xs:w-6 sm:w-8 shadow-lg"
                    : "bg-white/60 hover:bg-white/80"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Mobile-optimized Slide Counter */}
        <div className="absolute bottom-2 xs:bottom-3 right-2 xs:right-3 sm:right-4 z-30 bg-black/40 backdrop-blur-sm rounded-full px-2 xs:px-2.5 py-0.5 xs:py-1">
          <span className="text-white text-xs xs:text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </section>

      {/* Enhanced Mobile Animation Styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Line clamp utilities for text truncation */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Touch manipulation for better mobile performance */
        .touch-manipulation {
          touch-action: manipulation;
        }
        
        /* Mobile-first responsive enhancements */
        @media (max-width: 375px) {
          .banner-section {
            height: 35vh !important;
          }
        }
        
        @media (max-width: 320px) {
          .banner-section {
            height: 32vh !important;
          }
        }
        
        /* Prevent text selection on mobile */
        .banner-section * {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Improved loading states */
        .banner-section img {
          transition: opacity 0.3s ease;
        }
        
        .banner-section img[data-loading="true"] {
          opacity: 0;
        }
        
        .banner-section img[data-loading="false"] {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default EcommerceBannerSlider;