import React from "react";
import Rolex from "../assets/PremimumBrands/rolex-logo-editorial-illustration-free-vector.jpg";
import Omega from "../assets/PremimumBrands/b6047a0809e6575a92443a6924e60eae.jpg";
import AudemarsPiguet from "../assets/PremimumBrands/bbdc6dc34c14f4427a5d1fe1475cd453.jpg";
import RichedMillen from "../assets/PremimumBrands/5782919d7dcd53a67171c3b81640633b.jpg";
import PatekPhilippe from "../assets/PremimumBrands/1-7f05a788.png";
import Cartier from "../assets/PremimumBrands/cartier-logo-png_seeklogo-26665.png";
import Image from "next/image";

const PremiumBrands = () => {
  const premiumBrands = [
    { id: 1, logo: Rolex, alt: "Rolex" },
    { id: 2, logo: Omega, alt: "Omega" },
    { id: 3, logo: AudemarsPiguet, alt: "Audemars Piguet" },
    { id: 4, logo: RichedMillen, alt: "Richard Mille" },
    { id: 5, logo: PatekPhilippe, alt: "Patek Philippe" },
    { id: 6, logo: Cartier, alt: "Cartier" },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Premium Watch Brands
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Discover our curated collection of the world's most prestigious watchmakers
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {premiumBrands.map((brand) => (
            <div
              key={brand.id}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 p-4 sm:p-6 flex items-center justify-center transform hover:-translate-y-1"
            >
              <div className="relative w-full h-16 sm:h-20 md:h-24">
                <Image
                  src={brand.logo}
                  alt={brand.alt}
                  fill
                  className="object-contain p-2 transition-all duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100px, (max-width: 768px) 120px, 150px"
                />
              </div>
              
              {/* Brand name overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 rounded-xl flex items-end justify-center p-3 transition-opacity duration-300">
                <span className="text-white text-xs sm:text-sm font-medium text-center">
                  {brand.alt}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10 sm:mt-14">
          <button className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#1a4680] hover:to-[#00559dee] text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base">
            Explore All Brands
          </button>
        </div>
      </div>
    </section>
  );
};

export default PremiumBrands;