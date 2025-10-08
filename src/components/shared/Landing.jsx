"use client"
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay } from "react-icons/fa";

// Import your images - replace these with optimized smaller banner images
import LuxuryWatchCollection from "../../assets/Banners/LuxuryWatchCollection.jpg";
import NewArrivals2025 from "../../assets/Banners/NewArrivals2025.jpg";
import ExclusiveLimited from "../../assets/Banners/ExclusiveLimited.jpg";
import WorldWideShipping from "../../assets/Banners/WorldWideShipping.jpg";

const EcommerceBannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageLoaded, setImageLoaded] = useState({});
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const intervalRef = useRef(null);

  const slides = [
    {
      type: "image",
      content: LuxuryWatchCollection,
      alt: "Luxury Watch Collection 2025",
      title: "2025 COLLECTION",
      subtitle: "Premium Swiss Timepieces",
      description: "Discover advanced craftsmanship and timeless elegance in our latest collection.",
      cta: "Shop Now",
      buttonVariant: "primary",
      textPosition: "left",
      textColor: "text-white",
      overlay: "bg-gradient-to-r from-black/70 to-transparent",
      bgColor: "bg-gray-900"
    },
    {
      type: "image",
      content: NewArrivals2025,
      alt: "New Arrivals Luxury Watches",
      title: "NEW ARRIVALS",
      subtitle: "Spring Summer 2025",
      description: "Fresh designs featuring innovative technology and premium materials.",
      cta: "View Collection",
      buttonVariant: "primary",
      textPosition: "center",
      textColor: "text-white",
      overlay: "bg-gradient-to-b from-black/60 to-transparent",
      bgColor: "bg-blue-900"
    },
    {
      type: "image",
      content: ExclusiveLimited,
      alt: "Limited Edition Luxury Watches",
      title: "LIMITED EDITION",
      subtitle: "Only 50 Pieces Worldwide",
      description: "Exclusive chronograph series with diamond accents. Each piece numbered.",
      cta: "Reserve Now",
      buttonVariant: "outline",
      textPosition: "right",
      textColor: "text-white",
      overlay: "bg-gradient-to-l from-gray-900/70 to-transparent",
      bgColor: "bg-amber-900"
    },
    {
      type: "image",
      content: WorldWideShipping,
      alt: "Free Express Delivery Service",
      title: "FREE EXPRESS DELIVERY",
      subtitle: "Across GCC & Middle East",
      description: "Complimentary 24-hour delivery in UAE. 3-day delivery to neighboring countries.",
      cta: "Learn More",
      buttonVariant: "secondary",
      textPosition: "center",
      textColor: "text-white",
      overlay: "bg-gradient-to-t from-blue-900/50 to-transparent",
      bgColor: "bg-emerald-900"
    }
  ];

  // Track window size for responsive image loading
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate optimal image quality based on screen size
  const getImageQuality = () => {
    if (windowSize.width < 768) return 65; // Mobile
    if (windowSize.width < 1024) return 75; // Tablet
    return 85; // Desktop
  };

  // Calculate optimal image sizes for different devices
  const getImageSizes = () => {
    if (windowSize.width < 640) return "100vw"; // Mobile small
    if (windowSize.width < 768) return "100vw"; // Mobile
    if (windowSize.width < 1024) return "100vw"; // Tablet
    if (windowSize.width < 1280) return "100vw"; // Small desktop
    return "100vw"; // Large desktop
  };

  // Calculate banner height based on screen size
  const getBannerHeight = () => {
    if (windowSize.width < 640) return "40vh"; // Mobile small
    if (windowSize.width < 768) return "45vh"; // Mobile
    if (windowSize.width < 1024) return "55vh"; // Tablet
    if (windowSize.width < 1280) return "65vh"; // Small desktop
    return "70vh"; // Large desktop
  };

  // Slide controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Auto-play with pause on hover and user control
  useEffect(() => {
    if (isAutoPlaying && !isHovering) {
      intervalRef.current = setInterval(nextSlide, 5000);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isAutoPlaying, isHovering]);

  // Handle image load
  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Optimized image component with automatic size reduction
  const OptimizedBannerImage = ({ slide, index }) => {
    const quality = getImageQuality();
    const sizes = getImageSizes();

    return (
      <div className="relative w-full h-full">
        <Image
          src={slide.content}
          alt={slide.alt}
          fill
          className="object-cover transition-opacity duration-500"
          style={{
            opacity: imageLoaded[index] ? 1 : 0
          }}
          onLoad={() => handleImageLoad(index)}
          priority={index === 0}
          quality={quality}
          sizes={sizes}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        
        {/* Loading Placeholder */}
        {!imageLoaded[index] && (
          <div className={`absolute inset-0 animate-pulse ${slide.bgColor}`} />
        )}
      </div>
    );
  };

  // Responsive text content block
  const renderTextBlock = (slide) => (
    <div
      className={`w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 ${slide.textColor}
        ${
          slide.textPosition === "left"
            ? "text-left items-start"
            : slide.textPosition === "right"
            ? "text-right items-end"
            : "text-center items-center"
        } flex flex-col justify-center h-full`}
    >
      <div className="max-w-2xl space-y-2 sm:space-y-3 md:space-y-4">
        {slide.subtitle && (
          <p className="text-xs sm:text-sm md:text-lg text-amber-300 font-light tracking-wider uppercase animate-fadeIn">
            {slide.subtitle}
          </p>
        )}
        
        {slide.title && (
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight animate-fadeInUp">
            {slide.title}
          </h1>
        )}
        
        {slide.description && (
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-md sm:max-w-xl animate-fadeIn delay-200 line-clamp-2 sm:line-clamp-3">
            {slide.description}
          </p>
        )}
        
        {slide.cta && (
          <div className="animate-fadeIn delay-300 pt-2">
            <button
              className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg font-semibold text-xs sm:text-sm md:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[120px] sm:min-w-[140px]
                ${
                  slide.buttonVariant === "primary"
                    ? "bg-amber-600 hover:bg-amber-700 text-white shadow-xl hover:shadow-2xl"
                    : slide.buttonVariant === "secondary"
                    ? "bg-white text-gray-900 hover:bg-gray-100 shadow-xl"
                    : "border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm"
                }`}
            >
              {slide.cta}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const bannerHeight = getBannerHeight();

  return (
    <section 
      className="relative w-full overflow-hidden bg-gray-100"
      style={{ height: bannerHeight }}
    >
      {/* Main Slider Container */}
      <div
        className="relative w-full h-full"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Optimized Background Image */}
            <OptimizedBannerImage slide={slide} index={index} />

            {/* Content Overlay */}
            <div
              className={`absolute inset-0 ${slide.overlay} flex items-center`}
            >
              {renderTextBlock(slide)}
            </div>
          </div>
        ))}

        {/* Navigation Arrows - Responsive */}
        <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 md:px-6 lg:px-8 z-20 pointer-events-none">
          <button
            onClick={prevSlide}
            className="bg-black/30 hover:bg-black/50 p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 pointer-events-auto group"
            aria-label="Previous slide"
          >
            <FaChevronLeft className="text-white text-base sm:text-lg md:text-xl group-hover:text-amber-300 transition-colors" />
          </button>
          <button
            onClick={nextSlide}
            className="bg-black/30 hover:bg-black/50 p-2 sm:p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 active:scale-95 pointer-events-auto group"
            aria-label="Next slide"
          >
            <FaChevronRight className="text-white text-base sm:text-lg md:text-xl group-hover:text-amber-300 transition-colors" />
          </button>
        </div>

        {/* Controls Container - Responsive */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {/* Slide Dots */}
          <div className="flex gap-1 sm:gap-2 md:gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`rounded-full transition-all duration-300 backdrop-blur-sm
                  ${
                    currentSlide === idx
                      ? "bg-amber-400 shadow-lg h-2 sm:h-2 md:h-3 w-4 sm:w-6 md:w-8 lg:w-12"
                      : "bg-white/60 hover:bg-white/80 h-1.5 sm:h-2 md:h-3 w-1.5 sm:w-2 md:w-3"
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <button
            onClick={toggleAutoPlay}
            className="bg-black/30 hover:bg-black/50 p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlaying ? (
              <FaPause className="text-white text-xs sm:text-sm md:text-base" />
            ) : (
              <FaPlay className="text-white text-xs sm:text-sm md:text-base" />
            )}
          </button>

          {/* Slide Counter */}
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-2 sm:px-3 py-0.5 sm:py-1">
            <span className="text-white text-xs sm:text-sm font-medium">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-black/20 z-30">
        <div
          className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
          style={{
            width: isAutoPlaying && !isHovering ? '100%' : '0%',
            animation: isAutoPlaying && !isHovering ? 'progress 5s linear' : 'none'
          }}
        />
      </div>

      {/* Enhanced Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
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
        
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
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
        
        /* Touch-friendly improvements */
        @media (max-width: 768px) {
          * {
            -webkit-tap-highlight-color: transparent;
          }
        }
        
        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Performance optimizations */
        .banner-slider {
          contain: layout style paint;
        }
      `}</style>
    </section>
  );
};

export default EcommerceBannerSlider;