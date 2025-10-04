import Image from "next/image";
import React, { Suspense } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Dummy1 from "../../assets/Omega Seamaster.jpg";
import newCurrency from "../../assets/newSymbole.png";

// Product data
const productsData = [
  {
    id: 1,
    name: "Hermès Kelly Red Watch 20mm",
    price: "4000.0",
    originalPrice: "4800.0",
    image: Dummy1,
    badge: "Bestseller",
    discount: 17,
  },
  {
    id: 2,
    name: "Hermès Kelly Gold Watch 22mm",
    price: "4200.0",
    originalPrice: "5000.0",
    image: Dummy1,
    badge: "Popular",
    discount: 16,
  },
  {
    id: 3,
    name: "Hermès Kelly Silver Watch 20mm",
    price: "3800.0",
    originalPrice: "4500.0",
    image: Dummy1,
    badge: "Limited",
    discount: 15,
  },
  {
    id: 4,
    name: "Hermès Kelly Rose Gold Watch 18mm",
    price: "4500.0",
    originalPrice: "5200.0",
    image: Dummy1,
    badge: "New",
    discount: 13,
  },
];

// Single product card component
const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 mx-2 my-2">
      {/* Product Image Container */}
      <div className="relative h-52 bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Single Badge */}
        <div className="absolute top-3 left-3">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-sm ${
              product.badge === "Bestseller"
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : product.badge === "Popular"
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : product.badge === "Limited"
                ? "bg-gradient-to-r from-orange-500 to-orange-600"
                : "bg-gradient-to-r from-green-500 to-green-600"
            }`}
          >
            {product.badge}
          </div>
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-3 right-12 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
            -{product.discount}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group/wishlist"
          aria-label="Add to wishlist"
        >
          <FaHeart className="text-gray-600 group-hover/wishlist:text-red-500 text-sm transition-colors" />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="text-gray-800 font-semibold text-[15px] mb-3 line-clamp-2 leading-tight min-h-[2.8rem]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-3">
          <div className="flex items-center">
            <Image
              src={newCurrency}
              alt="Currency"
              className="w-4 h-4 mr-1.5"
            />
            <span className="text-xl font-bold text-gray-900">
              {product.price}
            </span>
          </div>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-1">
              {product.originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#0061b0ee] hover:to-[#1e518e] text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg active:scale-95 group/cart">
          <FaShoppingCart className="text-sm group-hover/cart:scale-110 transition-transform" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

const SimilarProduct = () => {
  return (
    <div className="bg-gray-50/80 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Similar Products
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover more premium products that match your exquisite style and preferences
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300">
            View More Products
            <svg
              className="ml-3 w-5 h-5 transition-transform group-hover:translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Services Section Fallback */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto mt-12 bg-white rounded-xl shadow-sm p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center"
                >
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
                </div>
              ))}
            </div>
          </div>
        }
      >
       
      </Suspense>
    </div>
  );
};

export default SimilarProduct;