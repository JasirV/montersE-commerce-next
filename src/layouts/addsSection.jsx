import React from "react";
import WatchClassic from "../assets/classic.jpg"; // Classic watch
import WatchLuxury from "../assets/pexels-pixabay-364822.jpg";  // Luxury watch
import Image from "next/image";

const WatchImages = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-[1536px] mx-auto px-4 md:px-8 lg:px-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Explore Our Collection
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* CLASSIC WATCH SECTION */}
          <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="relative w-full h-72 mb-6">
              <Image
                src={WatchClassic}
                alt="Classic Watch"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Classic Collection
            </h3>
            <p className="text-gray-600 mb-4">
              Timeless elegance and precision craftsmanship for the sophisticated taste.
            </p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300">
              Shop Classic
            </button>
          </div>

          {/* LUXURY WATCH SECTION */}
          <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 relative">
            <div className="relative w-full h-72 mb-6">
              <Image
                src={WatchLuxury}
                alt="Luxury Watch"
                className="w-full h-full object-contain rounded-xl"
              />
              {/* Floating gold elements for luxury feel */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-yellow-400 rounded-full opacity-50 blur-xl animate-pulse"></div>
              <div className="absolute bottom-8 right-8 w-16 h-16 bg-yellow-500 rounded-full opacity-40 blur-2xl animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Luxury Collection
            </h3>
            <p className="text-gray-600 mb-4">
              Premium materials and exquisite design for the ultimate luxury experience.
            </p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300">
              Shop Luxury
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatchImages;
