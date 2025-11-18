"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import accessoriesImage from "../../assets/Leather Sale.jpg";

const AccessoriesMegaMenu = ({ data, isMobile = false }) => {
  const categories = [
    "Pens",
    "Cufflinks",
    "Bracelets",
    "Scarves",
    "Umbrellas",
    "Wallets",
    "Belts",
    "Briefcases",
  ];

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const allBrands = [
    "Montblanc",
    "Parker",
    "Cross",
    "Tiffany & Co.",
    "Cartier",
    "Bulgari",
    "Hermès",
    "Gucci",
    "Louis Vuitton",
    "Prada",
    "Salvatore Ferragamo",
    "Dunhill",
    "Swaine Adeney Brigg",
    "Fox Umbrellas",
    "Tumi",
    "Samsonite",
    "Rimowa",
    "Bottega Veneta",
  ];

  const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredBrands = useMemo(() => {
    if (!selectedLetter) return allBrands;

    return allBrands.filter((brand) =>
      brand.toLowerCase().startsWith(selectedLetter.toLowerCase())
    );
  }, [selectedLetter, allBrands]);

  const handleLetterClick = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  const handleLetterClickWithScroll = (letter) => {
    handleLetterClick(letter);

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        const brandsSection = document.getElementById("brands-section");
        if (brandsSection) {
          brandsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  // ---------- MOBILE VIEW ----------
  if (isMobile) {
    return (
      <div className="pl-4 pb-4 space-y-4">
        {/* Categories */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">
            Accessories By Type
          </h4>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index}>
                <Link
                  href={`/accessories/${category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="text-gray-600 hover:text-amber-600 block py-1 text-sm"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* A-Z Buttons for Mobile */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Browse Brands</h4>
          <div className="flex flex-wrap gap-1 mb-3">
            {letters.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleLetterClickWithScroll(letter)}
                className={`w-6 h-6 flex items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                  selectedLetter === letter
                    ? "bg-amber-500 text-white border-amber-500"
                    : "border-gray-300 text-gray-700 hover:bg-amber-500 hover:text-white"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Brand List for Mobile */}
          <div className="max-h-[200px] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              {filteredBrands.map((brand, index) => (
                <Link
                  key={index}
                  href={`/brands/${brand.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-amber-600 cursor-pointer transition-colors truncate py-1"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Shop All Accessories Button - Mobile */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="text-center">
            <h4 className="font-bold text-amber-800 text-lg mb-2">
              Explore Our Accessories Collection
            </h4>
            <p className="text-amber-700 text-sm mb-3">
              Discover premium accessories for every style
            </p>
            <Link
              href="/accessories"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors inline-block w-full"
            >
              Shop All Accessories
            </Link>
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Featured</h4>
          <div className="space-y-3">
            {data.featuredProducts?.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-amber-600 text-sm font-semibold flex items-center">
                    <Image
                      src={newCurrency}
                      alt="AED"
                      width={14}
                      height={14}
                      className="inline-block mr-1"
                    />
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Promotion */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">
            {data?.promotion?.title}
          </h4>
          <p className="text-xs text-gray-600 mb-2">
            {data?.promotion?.description}
          </p>
          <Link
            href="/accessories"
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded text-sm w-full transition-colors block text-center"
          >
            {data?.promotion?.cta}
          </Link>
        </div>
      </div>
    );
  }

  // ---------- DESKTOP VIEW ----------
  return (
    <div className="absolute left-0 lg:right-[350%] transform lg:-translate-x-[50%] top-full mt-2 w-screen lg:w-[90vw] md:w-[80vw] max-w-6xl bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-auto max-h-[80vh] lg:max-h-none overflow-auto">
        {/* LEFT SIDEBAR - Categories */}
        <div className="lg:w-[20%] bg-gray-50 p-5 border-b lg:border-b-0 lg:border-r border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 text-base lg:text-lg">
            Accessories By Type
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm lg:text-base leading-relaxed">
            {categories.map((category, index) => (
              <li key={index}>
                <Link
                  href={`/accessories/${category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="hover:text-amber-600 transition-colors cursor-pointer py-1 lg:py-0 block"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>

          {/* Shop All Accessories Button - Desktop Sidebar */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Link
              href="/accessories"
              className="bg-amber-500 hover:bg-amber-600 text-white text-center py-2 px-4 rounded-lg font-semibold text-sm transition-colors w-full block"
            >
              Shop All Accessories
            </Link>
          </div>
        </div>

        {/* MAIN SECTION - Brands & Filtering */}
        <div className="lg:w-[55%] p-5" id="brands-section">
          {/* A-Z Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-1 lg:gap-2 mb-4 lg:mb-5">
            {letters.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleLetterClickWithScroll(letter)}
                className={`w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-full border text-xs lg:text-sm font-medium transition-colors ${
                  selectedLetter === letter
                    ? "bg-amber-500 text-white border-amber-500"
                    : "border-gray-300 text-gray-700 hover:bg-amber-500 hover:text-white"
                }`}
              >
                {letter}
              </button>
            ))}

            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                className="ml-2 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Selected letter indicator */}
          {selectedLetter && (
            <div className="mb-3 lg:mb-4">
              <span className="text-sm text-gray-600">
                Showing brands starting with:{" "}
                <span className="font-semibold text-amber-600">
                  {selectedLetter}
                </span>
                <span className="text-gray-500 text-xs ml-2">
                  ({filteredBrands.length} brands)
                </span>
              </span>
            </div>
          )}

          {/* Brand List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-y-2 lg:gap-x-6 text-sm text-gray-700 max-h-[200px] lg:max-h-[180px] overflow-y-auto pr-2 mb-4">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <Link
                  key={index}
                  href={`/brands/${brand.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-amber-600 cursor-pointer transition-colors truncate py-1 lg:py-0"
                >
                  {brand}
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-4 text-gray-500">
                No brands found starting with "{selectedLetter}"
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR - Big Accessories Image & Promotion */}
        <div className="lg:w-[25%] bg-gradient-to-b from-gray-50 to-white p-5 border-t lg:border-t-0 lg:border-l border-gray-200">
          {/* Big Accessories Image */}
          <div className="mb-6">
            <div className="relative group overflow-hidden rounded-lg">
              <Image
                src={accessoriesImage || "/api/placeholder/300/400"}
                alt="Luxury Accessories Collection"
                width={300}
                height={400}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h4 className="font-bold text-lg mb-1">Premium Collection</h4>
                  <p className="text-sm opacity-90">Luxury Accessories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessoriesMegaMenu;
