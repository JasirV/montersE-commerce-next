import React, { useState } from "react";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import wathc2 from '../../assets/wathc image.jpg'
import Wathc3 from '../../assets/Leather Wallet.jpg'
// Dummy products data
const dummyProductsGrid1 = [
  { 
    _id: 1, 
    name: "Hermès Kelly Red Watch 20mm Premium Edition", 
    price: "4000.0 AED", 
    images:wathc2,
    rating: 4.5,
    reviews: 24
  },
  { 
    _id: 2, 
    name: "Rolex Submariner Black", 
    price: "8500.0 AED", 
    images:wathc2,
    rating: 4.8,
    reviews: 156
  },
  { 
    _id: 3, 
    name: "Omega Seamaster Blue", 
    price: "6200.0 AED", 
    images: wathc2,
    rating: 4.3,
    reviews: 89
  },
  { 
    _id: 4, 
    name: "Tag Heuer Carrera", 
    price: "5800.0 AED", 
    images:wathc2,
    rating: 4.6,
    reviews: 67
  },
  { 
    _id: 5, 
    name: "Cartier Tank Solo", 
    price: "7200.0 AED", 
    images:wathc2,
    rating: 4.7,
    reviews: 112
  },
  { 
    _id: 6, 
    name: "Breitling Navitimer", 
    price: "9100.0 AED", 
    images:wathc2,
    rating: 4.4,
    reviews: 78
  },
];

const dummyProductsGrid2 = [
  { 
    _id: 7, 
    name: "Montres Trusted Classic Gold", 
    price: "3500.0 AED", 
    images: Wathc3,
    rating: 4.2,
    reviews: 45
  },
  { 
    _id: 8, 
    name: "Montres Trusted Silver Edition", 
    price: "3200.0 AED", 
    images: Wathc3,
    rating: 4.5,
    reviews: 67
  },
  { 
    _id: 9, 
    name: "Montres Trusted Chronograph", 
    price: "4100.0 AED", 
    images:Wathc3,
    rating: 4.1,
    reviews: 34
  },
  { 
    _id: 10, 
    name: "Montres Trusted Luxury", 
    price: "4800.0 AED", 
    images:Wathc3,
    rating: 4.7,
    reviews: 92
  },
  { 
    _id: 11, 
    name: "Montres Trusted Sports", 
    price: "3900.0 AED", 
    images:Wathc3,
    rating: 4.3,
    reviews: 56
  },
  { 
    _id: 12, 
    name: "Montres Trusted Executive", 
    price: "5200.0 AED", 
    images:Wathc3,
    rating: 4.6,
    reviews: 78
  },
];

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm animate-pulse hover:shadow-md transition-shadow duration-300">
    <div className="p-3 xs:p-4 flex flex-col items-center text-center relative">
      <div className="rounded-lg mb-2 xs:mb-3 w-[120px] h-[120px] xs:w-[140px] xs:h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] bg-gray-200" />
      {/* Wishlist skeleton */}
      <div className="absolute top-4 right-4 w-6 h-6 bg-gray-200 rounded-full" />
      {/* Rating skeleton */}
      <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
    </div>
  </div>
);

// Star Rating Component
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <span key={i} className="text-yellow-400 text-xs">★</span>
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <span key={i} className="text-yellow-400 text-xs">½</span>
      );
    } else {
      stars.push(
        <span key={i} className="text-gray-300 text-xs">★</span>
      );
    }
  }

  return <div className="flex space-x-0.5">{stars}</div>;
};

const ProductItem = ({ product, isInWishlist, onToggleWishlist }) => {
  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    onToggleWishlist(product._id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="p-3 xs:p-4 flex flex-col items-center text-center relative">
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all duration-200 hover:scale-110"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500 text-sm" />
          ) : (
            <FaRegHeart className="text-gray-600 hover:text-red-500 text-sm" />
          )}
        </button>

        {/* Product Image */}
        <Image
          src={product?.images}
          alt="emty"
          width={180}
          height={180}
          className="rounded-lg mb-2 xs:mb-3 w-[120px] h-[120px] xs:w-[140px] xs:h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] object-contain"
          loading="lazy"
        />

        {/* Rating */}
        <div className="flex items-center justify-center space-x-1 mb-2">
          <StarRating rating={product?.rating || 0} />
          <span className="text-xs text-gray-500">({product?.reviews || 0})</span>
        </div>

        {/* Product Name */}
        <h3
          className="text-xs xs:text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-2"
          style={{ minHeight: "2.5rem" }}
        >
          {product?.name}
        </h3>

        {/* Price */}
        <p className="text-sm xs:text-base font-bold text-[#1e518e] mt-auto">
          {product?.price}
        </p>
      </div>
    </div>
  );
};

const JustforyouWatch = ({ 
  productsGrid1Data = [], 
  productsGrid2Data = [], 
  loading = false,
  useDummyData = false 
}) => {
  const [wishlist, setWishlist] = useState(new Set());
  
  // Use dummy data if prop is true or if no data provided
  const grid1Products = useDummyData || productsGrid1Data.length === 0 ? dummyProductsGrid1 : productsGrid1Data;
  const grid2Products = useDummyData || productsGrid2Data.length === 0 ? dummyProductsGrid2 : productsGrid2Data;

  const handleToggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const isInWishlist = (productId) => wishlist.has(productId);

  const skeletonArray = Array(6).fill(null);

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-6 xs:py-8 sm:py-12 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-[1536px] mx-auto">
      

        <div className="flex flex-col lg:flex-row gap-5 xs:gap-6 sm:gap-8">
          
          {/* First Section - New Arrivals */}
          <div className="bg-white rounded-xl p-4 xs:p-5 sm:p-6 shadow-md w-full lg:w-1/2 border border-gray-200">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-4 xs:mb-5 pb-3 border-b border-gray-200 text-gray-800">
              New Arrivals
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4 sm:gap-5">
              {loading
                ? skeletonArray.slice(0, 3).map((_, i) => <ProductSkeleton key={i} />)
                : grid1Products.slice(0, 6).map((product) => (
                    <ProductItem 
                      key={product._id} 
                      product={product}
                      isInWishlist={isInWishlist(product._id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
            </div>
          </div>

          {/* Second Section - Montres Trusted */}
          <div className="bg-white rounded-xl p-4 xs:p-5 sm:p-6 shadow-md w-full lg:w-1/2 border border-gray-200">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-4 xs:mb-5 pb-3 border-b border-gray-200 text-gray-800">
              Montres Trusted
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4 sm:gap-5">
              {loading
                ? skeletonArray.slice(0, 3).map((_, i) => <ProductSkeleton key={i} />)
                : grid2Products.slice(0, 6).map((product) => (
                    <ProductItem 
                      key={product._id} 
                      product={product}
                      isInWishlist={isInWishlist(product._id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
            </div>
          </div>

        </div>

        {/* Wishlist Counter */}
        {wishlist.size > 0 && (
          <div className="fixed bottom-6 right-6 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-2">
            <FaHeart className="text-white" />
            <span className="text-sm font-semibold">{wishlist.size}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default JustforyouWatch;