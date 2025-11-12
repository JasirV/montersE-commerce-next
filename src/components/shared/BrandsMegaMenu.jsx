"use client";
import React, { useState, useMemo } from "react";

const ShopBrandsMegaMenu = () => {
  const categories = [
    "Handbags",
    "Jewelry",
    "Pre-Owned Watches",
    "Watches",
    "Leathers",
    "Gold",
    "Accessories",
  ];

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  const allBrands = [
    "A. Lange & Sohne", "Adee Kaye", "Adidas", "Akribos Xxiv", "Alexander",
    "Alfred Sung", "Alpina", "Audemars Piguet", "August Steiner", "Ball",
    "Ballast", "Baume Et Mercier", "Bell And Ross", "Benrus", "Bertha",
    "Blancpain", "Bovet", "Breed", "Breguet", "Breitling", "Brera Orologi",
    
  ];

  const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredBrands = useMemo(() => {
    if (!selectedLetter) return allBrands;
    
    return allBrands.filter(brand => 
      brand.toLowerCase().startsWith(selectedLetter.toLowerCase())
    );
  }, [selectedLetter, allBrands]);

  const handleLetterClick = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  const handleLetterClickWithScroll = (letter) => {
    handleLetterClick(letter);
    
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        const brandsSection = document.getElementById('brands-section');
        if (brandsSection) {
          brandsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="absolute left-0 lg:left-[350%] transform lg:-translate-x-[50%] top-full mt-2 w-screen lg:w-[90vw] md:w-[80vw] max-w-6xl bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-auto max-h-[80vh] lg:max-h-none overflow-auto">
        {/* LEFT SIDEBAR */}
        <div className="lg:w-[30%] xl:w-[25%] bg-gray-50 p-4 lg:p-5 border-b lg:border-b-0 lg:border-r border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 text-base lg:text-lg">
            Brands By Category
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm lg:text-base leading-relaxed">
            {categories.map((item, i) => (
              <li
                key={i}
                className="hover:text-amber-600 transition-colors cursor-pointer py-1 lg:py-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* MAIN SECTION */}
        <div className="lg:w-[70%] xl:w-[75%] p-4 lg:p-5" id="brands-section">
          {/* A-Z Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-1 lg:gap-2 mb-4 lg:mb-5">
            {letters.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleLetterClickWithScroll(letter)}
                className={`w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-full border text-xs lg:text-sm font-medium transition-colors ${
                  selectedLetter === letter
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'border-gray-300 text-gray-700 hover:bg-amber-500 hover:text-white'
                }`}
              >
                {letter}
              </button>
            ))}
            <button 
              onClick={() => handleLetterClickWithScroll('#')}
              className={`w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-full border text-xs lg:text-sm transition-colors ${
                selectedLetter === '#'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'border-gray-300 text-gray-500 hover:bg-amber-500 hover:text-white'
              }`}
            >
              #
            </button>
            
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                className="ml-2 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {selectedLetter && (
            <div className="mb-3 lg:mb-4">
              <span className="text-sm text-gray-600">
                Showing brands starting with:{" "}
                <span className="font-semibold text-amber-600">{selectedLetter}</span>
                <span className="text-gray-500 text-xs ml-2">
                  ({filteredBrands.length} brands)
                </span>
              </span>
            </div>
          )}

          {/* Brand List */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-y-2 lg:gap-x-6 text-sm text-gray-700 max-h-[300px] lg:max-h-[260px] overflow-y-auto pr-2">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <p
                  key={index}
                  className="hover:text-amber-600 cursor-pointer transition-colors truncate py-1 lg:py-0"
                >
                  {brand}
                </p>
              ))
            ) : (
              <div className="col-span-full text-center py-4 text-gray-500">
                No brands found starting with "{selectedLetter}"
              </div>
            )}
          </div>

          {/* Footer link */}
          <div className="mt-4 lg:mt-5 border-t border-gray-200 pt-3">
            <a
              href="#"
              className="text-amber-600 hover:underline font-semibold text-sm lg:text-base"
            >
              View All Watch Brands
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopBrandsMegaMenu;