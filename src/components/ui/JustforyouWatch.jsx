import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import axios from "axios";

// Product Skeleton Component
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm animate-pulse hover:shadow-md transition-shadow duration-300 overflow-hidden">
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

// Discount Badge Component
const DiscountBadge = ({ regularPrice, salePrice }) => {
  if (!regularPrice || !salePrice || regularPrice <= salePrice) return null;

  const discount = Math.round(
    ((regularPrice - salePrice) / regularPrice) * 100
  );

  return (
    <div className="absolute top-3 left-3 z-10">
      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
        -{discount}%
      </span>
    </div>
  );
};

// Stock Status Component
const StockStatus = ({ stockQuantity, inStock }) => {
  if (!inStock || stockQuantity === 0) {
    return (
      <div className="mt-2">
        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
          Out of Stock
        </span>
      </div>
    );
  }

  if (stockQuantity <= 10) {
    return (
      <div className="mt-2">
        <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
          Only {stockQuantity} left
        </span>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
        In Stock
      </span>
    </div>
  );
};

// Price Display Component
const PriceDisplay = ({ regularPrice, salePrice }) => {
  const hasDiscount = salePrice && regularPrice && salePrice < regularPrice;

  return (
    <div className="flex flex-col items-center space-y-1 w-full">
      {hasDiscount ? (
        <div className="flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-2 w-full">
          <span className="text-base xs:text-lg font-bold text-[#1e518e] whitespace-nowrap">
            {parseFloat(salePrice).toFixed(1)} AED
          </span>
          <span className="text-xs xs:text-sm line-through text-gray-400 whitespace-nowrap">
            {parseFloat(regularPrice).toFixed(1)} AED
          </span>
        </div>
      ) : (
        <span className="text-base xs:text-lg font-bold text-[#1e518e] whitespace-nowrap">
          {parseFloat(regularPrice || salePrice || 0).toFixed(1)} AED
        </span>
      )}
    </div>
  );
};

const ProductItem = ({ product, isInWishlist, onToggleWishlist }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    onToggleWishlist(product._id);
  };

  // Get the main image URL
  const getMainImage = () => {
    if (product?.images && product.images.length > 0) {
      const mainImage =
        product.images.find((img) => img.type === "main") || product.images[0];
      return mainImage.url;
    }
    return "/placeholder-image.jpg";
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    // Add to cart functionality here
    console.log("Add to cart:", product._id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group cursor-pointer h-full flex flex-col">
      <div className="p-3 xs:p-4 flex flex-col items-center text-center relative flex-1">
        {/* Discount Badge */}
        <DiscountBadge
          regularPrice={product?.regularPrice}
          salePrice={product?.salePrice}
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 group-hover:shadow-xl"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500 text-sm" />
          ) : (
            <FaRegHeart className="text-gray-600 hover:text-red-500 text-sm transition-colors" />
          )}
        </button>

        {/* Product Image */}
        <div className="relative mb-3 xs:mb-4 flex-shrink-0">
          {!imageLoaded && !imageError && (
            <div className="w-[120px] h-[120px] xs:w-[140px] xs:h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] bg-gray-200 rounded-lg animate-pulse" />
          )}
          <Image
            src={imageError ? "/placeholder-image.jpg" : getMainImage()}
            alt={product?.name || "Product image"}
            width={180}
            height={180}
            className={`rounded-lg transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } w-[120px] h-[120px] xs:w-[140px] xs:h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] object-cover group-hover:scale-105 transition-transform duration-300`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />

          {/* Quick Add to Cart Overlay */}
          <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              onClick={handleAddToCart}
              disabled={!product?.inStock || product?.stockQuantity === 0}
              className={`rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 ${
                !product?.inStock || product?.stockQuantity === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white text-[#1e518e] hover:bg-[#1e518e] hover:text-white"
              }`}
            >
              <FiShoppingCart className="text-lg" />
            </button>
          </div>
        </div>

        {/* Product Name */}
        <h3
          className="text-xs xs:text-sm font-semibold text-gray-800 line-clamp-2 leading-tight mb-3 group-hover:text-[#1e518e] transition-colors duration-200 flex-1"
          style={{ minHeight: "2.5rem" }}
        >
          {product?.name}
        </h3>

        {/* Price */}
        <div className="mb-2 w-full">
          <PriceDisplay
            regularPrice={product?.regularPrice}
            salePrice={product?.salePrice}
          />
        </div>

        {/* Stock Status */}
        <StockStatus
          stockQuantity={product?.stockQuantity}
          inStock={product?.inStock}
        />

        {/* Quick Info Badges */}
        <div className="flex flex-wrap justify-center gap-1 mt-2 pt-2 border-t border-gray-100 w-full">
          {product?.condition && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {product.condition}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const JustforyouWatch = () => {
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState({
    newArrivals: [],
    montresTrusted: [],
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "http://localhost:9000/api/home/trusted"
        );

        console.log("Response data.data:", response.data.data);

        if (response.data && response.data.data) {
          setApiData({
            newArrivals: response.data.data.newArrivals || [],
            montresTrusted: response.data.data.montresTrusted || [],
          });
        } else {
          console.warn("Unexpected API response structure:", response.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
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
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-4 xs:py-8 sm:py-12 px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-[1536px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6 xs:mb-8 sm:mb-10">
          <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 xs:mb-3">
            Luxury Timepieces
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-xs xs:text-sm sm:text-base px-2">
            Discover our exquisite collection of premium watches and
            accessories, featuring the finest craftsmanship and timeless
            designs.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 xs:px-4 py-3 rounded-lg mb-6 text-center mx-2">
            <p className="font-semibold text-sm xs:text-base">
              Oops! Something went wrong
            </p>
            <p className="text-xs xs:text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-600 text-white px-3 xs:px-4 py-2 rounded-lg text-xs xs:text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 xs:gap-5 sm:gap-6 lg:gap-8">
          {/* First Section - New Arrivals */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 lg:p-8 shadow-lg w-full lg:w-1/2 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6 pb-3 xs:pb-4 border-b border-gray-200">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                New Arrivals
              </h2>
              <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 xs:px-3 py-1 rounded-full">
                {!loading && apiData.newArrivals.length} Items
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5">
              {loading
                ? skeletonArray
                    .slice(0, 6)
                    .map((_, i) => <ProductSkeleton key={i} />)
                : apiData.newArrivals
                    .slice(0, 6)
                    .map((product) => (
                      <ProductItem
                        key={product._id}
                        product={product}
                        isInWishlist={isInWishlist(product._id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
            </div>
            {!loading && apiData.newArrivals.length === 0 && (
              <div className="text-center py-8 xs:py-10">
                <div className="text-gray-400 text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">
                  ⌚
                </div>
                <p className="text-gray-500 text-base xs:text-lg">
                  No new arrivals at the moment
                </p>
                <p className="text-gray-400 text-xs xs:text-sm mt-1 xs:mt-2">
                  Check back later for new products
                </p>
              </div>
            )}
          </div>

          {/* Second Section - Montres Trusted */}
          <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 lg:p-8 shadow-lg w-full lg:w-1/2 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6 pb-3 xs:pb-4 border-b border-gray-200">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Montres Trusted
              </h2>
              <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 xs:px-3 py-1 rounded-full">
                {!loading && apiData.montresTrusted.length} Items
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5">
              {loading
                ? skeletonArray
                    .slice(0, 6)
                    .map((_, i) => <ProductSkeleton key={i} />)
                : apiData.montresTrusted
                    .slice(0, 6)
                    .map((product) => (
                      <ProductItem
                        key={product._id}
                        product={product}
                        isInWishlist={isInWishlist(product._id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
            </div>
            {!loading && apiData.montresTrusted.length === 0 && (
              <div className="text-center py-8 xs:py-10">
                <div className="text-gray-400 text-4xl xs:text-5xl sm:text-6xl mb-3 xs:mb-4">
                  ⭐
                </div>
                <p className="text-gray-500 text-base xs:text-lg">
                  No trusted products available
                </p>
                <p className="text-gray-400 text-xs xs:text-sm mt-1 xs:mt-2">
                  We're updating our trusted collection
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Counter */}
        {wishlist.size > 0 && (
          <div className="fixed bottom-4 xs:bottom-6 right-4 xs:right-6 bg-gradient-to-r from-[#1e518e] to-[#0061b0] text-white px-4 xs:px-5 py-2 xs:py-3 rounded-full shadow-2xl z-50 flex items-center space-x-2 xs:space-x-3 hover:scale-105 transition-transform duration-200 cursor-pointer">
            <FaHeart className="text-white text-base xs:text-lg" />
            <span className="text-xs xs:text-sm font-bold">
              {wishlist.size}
            </span>
            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 bg-white rounded-full animate-ping"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JustforyouWatch;
