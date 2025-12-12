"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const ShopBrandsMegaMenu = ({ isMobile = false, onItemClick }) => {
  const router = useRouter();
  
  // Updated categories with correct routes
  const categories = [
    { name: "Watches", path: "/watches/Watches", slug: "watches" },
    { name: "Handbags", path: "/leathers/bags", slug: "leathers" },
    { name: "Leather Goods", path: "/leathers/LeatherGoodsAll", slug: "leather-goods" },
    { name: "Accessories", path: "/accessories/Accessories", slug: "accessories" },
  ];

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  const allBrands = [
    "Aigner",
    "Akribos Xxiv",
    "Apogsum",
    "AquaMarin",
    "Aquaswiss",
    "Armin Strom",
    "Audemars Piguet",
    "Balenciaga",
    "Ball",
    "Bernhard H. Mayer",
    "Bertolucci",
    "Blancpain",
    "Borja",
    "Boss By Hugo Boss",
    "Boucheron",
    "Breguet",
    "Carl F. Bucherer",
    "Cartier",
    "Celine",
    "Chanel",
    "Charriol",
    "Chaumet",
    "Chopard",
    "Chronoswiss",
    "Citizen",
    "Concord",
    "Corum",
    "CT Scuderia",
    "De Grisogno",
    "Dior",
    "Dolce & Gabbana",
    "Dubey & Schaldenbrand",
    "Ebel",
    "Edox",
    "Elini",
    "Emporio Armani",
    "Erhard Junghans",
    "Favre Leuba",
    "Fendi",
    "Ferre Milano",
    "Franck Muller",
    "Frederique Constant",
    "Gerald Genta",
    "Gianfranco Ferre",
    "Giorgio Armani",
    "Girard Perregaux",
    "Giuseppe Zanotti",
    "Givenchy",
    "Glam Rock",
    "Goyard",
    "Graham",
    "Grimoldi Milano",
    "Gucci",
    "Harry Winston",
    "Hermes",
    "Hublot",
    "Hysek",
    "Jacob & Co.",
    "Jacques Lemans",
    "Jaeger LeCoultre",
    "Jean Marcel",
    "JeanRichard",
    "Jorg Hysek",
    "Joseph",
    "Junghans",
    "Just Cavalli",
    "Karl Lagerfeld",
    "KC",
    "Korloff",
    "Lancaster",
    "Locman",
    "Longines",
    "Louis Frard",
    "Louis Moine",
    "Louis Vuitton",
    "Marc by Marc Jacobs",
    "Marc Jacobs",
    "Martin Braun",
    "Mauboussin",
    "Maurice Lacroix",
    "Meyers",
    "Michael Kors",
    "MICHAEL Michael Kors",
    "Mido",
    "Montblanc",
    "Montega",
    "Montegrappa",
    "Movado",
    "Navitec",
    "NB Yaeger",
    "Nina Ricci",
    "Nubeo",
    "Officina Del Tempo",
    "Omega",
    "Oris",
    "Panerai",
    "Parmigiani",
    "Patek Philippe",
    "Paul Picot",
    "Perrelet",
    "Philip Stein",
    "Piaget",
    "Pierre Balmain",
    "Porsche Design",
    "Prada",
    "Quinting",
    "Rado",
    "Rolex",
    "Rama Swiss Watch",
    "Raymond Weil",
    "Richard Mille",
    "Robergé",
    "Roberto Cavalli",
    "Rochas",
    "Roger Dubuis",
    "S.T. Dupont",
    "Saint Laurent Paris",
    "Salvatore Ferragamo",
    "Seiko",
    "Swarovski",
    "Swatch",
    "Tag Heuer",
    "Techno Com",
    "Technomarine",
    "Tiffany & Co.",
    "Tissot",
    "Tonino Lamborghini",
    "Trussardi",
    "Tudor",
    "Vacheron Constantin",
    "Valentino",
    "Van Cleef & Arpels",
    "Versace",
    "Yves Saint Laurent",
    "Zenith",
    "Ingersoll",
    "IWC",
    "U-Boat",
    "Ulysse Nardin",
  ];

  const [selectedLetter, setSelectedLetter] = useState(null);

  const filteredBrands = useMemo(() => {
    if (!selectedLetter) return allBrands;

    return allBrands.filter((brand) =>
      brand.toLowerCase().startsWith(selectedLetter.toLowerCase())
    );
  }, [selectedLetter, allBrands]);

  // Function to create URL-friendly brand slug
  const createBrandSlug = (brandName) => {
    return brandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Handle brand click - navigate to brand page
  const handleBrandClick = (brandName) => {
    const brandSlug = createBrandSlug(brandName);
    
    // Navigate to brand watches page
    router.push(`/brand/${brandSlug}`);
    
    // Close the mega menu if onItemClick callback is provided
    if (onItemClick) {
      onItemClick();
    }
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    // Navigate to category page with pagination
    let categoryPath = category.path;
    
    // Add pagination parameter for specific categories
    if (category.slug === "watches") {
      categoryPath += "?page=1&sortBy=newest";
    } else if (category.slug === "leathers" || category.slug === "accessories") {
      categoryPath += "?page=1";
    }
    
    router.push(categoryPath);
    
    // Close the mega menu if onItemClick callback is provided
    if (onItemClick) {
      onItemClick();
    }
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
  };

  // Mobile Version
  if (isMobile) {
    return (
      <div className="bg-white border-t border-gray-200">
        <div className="p-4">
          {/* Categories Section - Improved mobile layout */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-base border-b pb-2">
              Shop By Category
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category, i) => (
                <button
                  key={i}
                  onClick={() => handleCategoryClick(category)}
                  className="text-left p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 text-sm font-medium active:scale-95"
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* A-Z Filter Section */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-base border-b pb-2">
              Browse by Letter
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {letters.map((letter, i) => (
                <button
                  key={i}
                  onClick={() => handleLetterClick(letter)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm font-medium transition-all duration-200 active:scale-95 ${
                    selectedLetter === letter
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                      : "border-gray-300 text-gray-700 hover:bg-amber-500 hover:text-white hover:border-amber-500"
                  }`}
                >
                  {letter}
                </button>
              ))}
              <button
                onClick={() => handleLetterClick("#")}
                className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm transition-all duration-200 active:scale-95 ${
                  selectedLetter === "#"
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "border-gray-300 text-gray-500 hover:bg-amber-500 hover:text-white hover:border-amber-500"
                }`}
              >
                #
              </button>
            </div>

            {selectedLetter && (
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">
                    Brands starting with{" "}
                    <span className="font-semibold text-amber-600">
                      {selectedLetter}
                    </span>
                    <span className="text-gray-400 text-xs ml-2">
                      ({filteredBrands.length})
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors active:scale-95"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Brands List - Improved mobile scrolling */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-base border-b pb-2">
              {selectedLetter
                ? `Brands (${filteredBrands.length})`
                : "All Brands"}
            </h3>
            <div className="max-h-80 overflow-y-auto bg-gray-50 rounded-lg border border-gray-200 p-3">
              {filteredBrands.length > 0 ? (
                <div className="grid grid-cols-1 gap-1.5">
                  {filteredBrands.map((brand, index) => (
                    <button
                      key={index}
                      onClick={() => handleBrandClick(brand)}
                      className="text-left p-3 hover:bg-white hover:text-amber-600 rounded-lg transition-all duration-200 border border-transparent hover:border-amber-200 hover:shadow-sm active:scale-98 text-sm font-medium"
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <div className="mb-2">No brands found starting with</div>
                  <div className="font-semibold text-amber-600 text-base">
                    "{selectedLetter}"
                  </div>
                </div>
              )}
            </div>
          </div>

       
        </div>
      </div>
    );
  }

  // Desktop Version
  return (
    <div className="absolute left-0 lg:left-[380%] transform lg:-translate-x-[50%] top-full mt-2 w-screen lg:w-[90vw] md:w-[80vw] max-w-6xl bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-auto max-h-[80vh] lg:max-h-none overflow-auto">
        {/* LEFT SIDEBAR */}
        <div className="lg:w-[30%] xl:w-[25%] bg-gray-50 p-4 lg:p-5 border-b lg:border-b-0 lg:border-r border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4 lg:mb-5 text-base lg:text-lg">
            Shop By Category
          </h3>
          <ul className="space-y-3 text-gray-700 text-sm lg:text-base">
            {categories.map((category, i) => (
              <li
                key={i}
                className="group cursor-pointer"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="flex items-center p-2 lg:p-3 rounded-lg hover:bg-white hover:text-amber-600 transition-all duration-200 group-hover:shadow-sm border border-transparent group-hover:border-amber-200">
                  <span className="font-medium">{category.name}</span>
                  <svg className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* MAIN SECTION */}
        <div className="lg:w-[70%] xl:w-[75%] p-4 lg:p-5" id="brands-section">
          {/* A-Z Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-5 lg:mb-6">
            {letters.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleLetterClick(letter)}
                className={`w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded-full border text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  selectedLetter === letter
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "border-gray-300 text-gray-700 hover:bg-amber-500 hover:text-white hover:border-amber-500"
                }`}
              >
                {letter}
              </button>
            ))}
            <button
              onClick={() => handleLetterClick("#")}
              className={`w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded-full border text-sm transition-all duration-200 hover:scale-105 ${
                selectedLetter === "#"
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "border-gray-300 text-gray-500 hover:bg-amber-500 hover:text-white hover:border-amber-500"
              }`}
            >
              #
            </button>

            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                className="ml-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {selectedLetter && (
            <div className="mb-4 lg:mb-5 px-1">
              <div className="flex items-center">
                <span className="text-sm lg:text-base text-gray-600">
                  Showing brands starting with{" "}
                  <span className="font-semibold text-amber-600">
                    {selectedLetter}
                  </span>
                  <span className="text-gray-400 text-xs lg:text-sm ml-2">
                    ({filteredBrands.length} brands)
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Brand List */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4 text-sm lg:text-base text-gray-700 max-h-[320px] lg:max-h-[280px] overflow-y-auto pr-3">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand, index) => (
                <button
                  key={index}
                  onClick={() => handleBrandClick(brand)}
                  className="group text-left p-2 lg:p-3 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 border border-transparent hover:border-amber-200 truncate"
                >
                  <span className="font-medium">{brand}</span>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <div className="mb-2">No brands found starting with</div>
                <div className="font-semibold text-amber-600 text-lg">
                  "{selectedLetter}"
                </div>
              </div>
            )}
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default ShopBrandsMegaMenu;