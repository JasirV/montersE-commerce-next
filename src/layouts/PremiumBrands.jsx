import React from "react";

const PremiumBrands = () => {
  const premiumBrands = [
    { id: 1, name: "Rolex" },
    { id: 2, name: "Omega" },
    { id: 3, name: "Audemars Piguet" },
    { id: 4, name: "Richard Mille" },
    { id: 5, name: "Patek Philippe" },
    { id: 6, name: "Cartier" },
    { id: 7, name: "Hublot" },
    { id: 8, name: "Bulgari" },
    { id: 9, name: "Orsi" },
    { id: 10, name: "Ebel" },
    { id: 11, name: "Fendi" },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Premium Watch Brands
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            Discover our curated collection of the world's most prestigious watchmakers
          </p>
        </div>

        {/* Brands Grid - Updated for 11 brands */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {premiumBrands.map((brand) => (
            <div
              key={brand.id}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 lg:p-6 flex items-center justify-center transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer min-h-[100px] sm:min-h-[120px] lg:min-h-[140px]"
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-50 to-gray-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Brand name with elegant styling */}
              <div className="relative z-10 text-center w-full">
                <h3 className="text-base sm:text-lg lg:text-xl font-light text-gray-800 group-hover:text-gray-900 transition-colors duration-300 tracking-wide px-2">
                  {brand.name}
                </h3>
                
                {/* Subtle underline effect on hover */}
                <div className="w-0 group-hover:w-10 sm:group-hover:w-12 lg:group-hover:w-14 h-0.5 bg-gradient-to-r from-[#1e518e] to-[#0061b0] mx-auto mt-2 sm:mt-3 transition-all duration-500" />
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#1e518e]/10 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Optional: Add a subtle divider or additional text if needed */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-gray-500 text-sm sm:text-base italic">
            Crafting timeless excellence since generations
          </p>
        </div>
      </div>
    </section>
  );
};

export default PremiumBrands;