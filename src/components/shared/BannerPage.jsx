"use client";
import React from "react";
import Slider from "react-slick";
import LuxuryWatchCollection from "../../assets/Banners/LuxuryWatchCollection.jpg";
import NewArrivals2025 from "../../assets/Banners/NewArrivals2025.jpg";
import ExclusiveLimited from "../../assets/Banners/ExclusiveLimited.jpg";
import WorldWideShipping from "../../assets/Banners/WorldWideShipping.jpg";
import BestDeal from "../../assets/Banners/Best Deal Today.png";
import Link from "next/link";




 const handleBannerClick = (banner) => {
  if (banner.link?.startsWith("#")) {
    const sectionId = banner.link.replace("#", "");

    // If already on homepage
    if (window.location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Redirect to home page with hash
      window.location.href = `/#${sectionId}`;
    }

    return;
  }

  // For normal links (external or internal pages)
  window.location.href = banner.link;
};

const banners = [
  {
    image: LuxuryWatchCollection,
    // alt: "Luxury Watch Collection",
    // title: "LUXURY COLLECTION",
    // subtitle: "Timeless Elegance",
    // description:
    //   "Discover our premium luxury watches with exquisite craftsmanship.",
    // ctaText: "Shop Now",
  },
  {
    image: NewArrivals2025,
    link:'#watch-form'
    // alt: "New Arrivals 2025",
    // title: "NEW ARRIVALS",
    // subtitle: "2025 Collection",
    // description: "Stay ahead with the latest trends in luxury watches.",
    // ctaText: "Explore"
  },
  {
    image: ExclusiveLimited,
    link: "/watches",
    // alt: "Limited Edition Luxury Watches",
    // title: "LIMITED EDITION",
    // subtitle: "Only 50 Pieces Worldwide",
    // description: "Exclusive chronograph series with diamond accents. Each piece numbered.",
    // ctaText: "View Collection"
  },
  {
    image: WorldWideShipping,
    // alt: "Worldwide Shipping",
    // title: "WORLDWIDE SHIPPING",
    // subtitle: "Fast & Secure",
    // description: "We deliver your luxury watches to over 100 countries safely.",
    // ctaText: "Learn More",
  },
  {
    image: BestDeal,
    // alt: "Worldwide Shipping",
    // title: "WORLDWIDE SHIPPING",
    // subtitle: "Fast & Secure",
    // description: "We deliver your luxury watches to over 100 countries safely.",
    // ctaText: "Learn More",
  },
];

const BannerPage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: true,
    adaptiveHeight: true,
    fade: true,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    customPaging: (i) => (
      <div className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-300"></div>
    ),
  };

  return (
    <div className="w-full relative overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="relative w-full" >
            {/* Optimized Image Container */}
            <div
    onClick={() => handleBannerClick(banner)}
    className="cursor-pointer"
  >
            <div className="relative w-full aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5]">
              <img
                src={banner.image.src}
                alt={banner.alt}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />

              {/* Gradient Overlay for better text readability */}
              {/* <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div> */}

              {/* Content Container */}
              <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32 text-white">
                <div className="max-w-lg space-y-3 sm:space-y-4">
                  {/* Title with responsive sizing */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-wide">
                    {banner.title}
                  </h2>

                  {/* Subtitle with responsive sizing */}
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-200">
                    {banner.subtitle}
                  </h3>

                  {/* Description with responsive sizing */}
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed max-w-md">
                    {banner.description}
                  </p>

                  {/* Call to Action Button */}
                  {banner.ctaText && (
                    <button className="mt-4 sm:mt-6 px-6 sm:px-8 py-2 sm:py-3 bg-white text-black font-semibold text-sm sm:text-base rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      {banner.ctaText}
                    </button>
                  )}
                </div>
              </div>
            </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerPage;
