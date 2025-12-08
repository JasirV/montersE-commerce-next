"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaSpinner,
} from "react-icons/fa";

// ⭐ Enhanced Product Card Component
const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onProductClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const imageContainerRef = useRef(null);

  // Process images - main image first, then cover images
  const processedImages = React.useMemo(() => {
    if (!product.images || !Array.isArray(product.images)) return [];

    const mainImage = product.images.find((img) => img.type === "main");
    const coverImages = product.images.filter((img) => img.type === "cover");

    // Return main image first, then cover images
    return mainImage ? [mainImage, ...coverImages] : product.images;
  }, [product.images]);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && processedImages.length > 1) {
      handleNextImage();
    } else if (isRightSwipe && processedImages.length > 1) {
      handlePrevImage();
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? processedImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === processedImages.length - 1 ? 0 : prev + 1
    );
  };

  // Auto-rotate images on hover
  useEffect(() => {
    let interval;
    if (isHovered && processedImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === processedImages.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, processedImages.length]);

  // Handle add to cart with loading state
  const handleAddToCartClick = async (e, product) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    await onAddToCart(product);
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  // Calculate discount percentage
  const discountPercentage =
    product.salePrice && product.regularPrice
      ? Math.round(
          ((product.regularPrice - product.salePrice) / product.regularPrice) *
            100
        )
      : 0;

  // Calculate average rating with fallback
  const averageRating = product.rating || product.averageRating || 0;
  const reviewCount = product.reviewCount || product.ratingCount || 0;

  // Get product ID for navigation - fixed this part
  const getProductId = () => {
    return product.productId || product._id;
  };

  return (
    <div
      onClick={() => onProductClick(getProductId())}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-3 sm:p-4 transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer relative flex flex-col h-full w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge with animation */}
      {discountPercentage > 0 && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
          <FaTag className="mr-1 text-xs" />
          {discountPercentage}% OFF
        </div>
      )}

      {/* Wishlist Button with enhanced animation */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(getProductId());
        }}
        className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white rounded-full shadow-lg p-2 z-10 transform transition-all duration-300 hover:scale-110 group-hover:scale-110"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? (
          <FaHeart className="text-red-500 text-sm animate-pulse" />
        ) : (
          <FaRegHeart className="text-gray-600 text-sm group-hover:text-red-400 transition-colors" />
        )}
      </button>

      {/* Product Image with Enhanced Carousel */}
      <div
        ref={imageContainerRef}
        className="relative mb-3 sm:mb-4 rounded-xl overflow-hidden w-full bg-gray-50"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {!loaded && (
          <div className="w-full aspect-square bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl flex items-center justify-center">
            <FaSpinner className="text-gray-400 animate-spin" />
          </div>
        )}

        {/* Image Carousel */}
        <div className="relative w-full aspect-square">
          <Image
            src={processedImages[currentImageIndex]?.url || "/placeholder.png"}
            alt={processedImages[currentImageIndex]?.alt || product.name}
            width={400}
            height={400}
            className={`w-full h-full object-cover transition-all duration-500 ${
              loaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            priority={currentImageIndex === 0}
          />

          {/* Enhanced Carousel Navigation Arrows - Show on hover only */}
          {processedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 ${
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                } hover:scale-110 backdrop-blur-sm z-20`}
                aria-label="Previous image"
              >
                <FaChevronLeft size={14} className="sm:w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all duration-300 ${
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                } hover:scale-110 backdrop-blur-sm z-20`}
                aria-label="Next image"
              >
                <FaChevronRight size={14} className="sm:w-4" />
              </button>
            </>
          )}

          {/* Enhanced Image Indicators (dots) */}
          {processedImages.length > 1 && (
            <div
              className={`absolute bottom-3 left-0 right-0 flex justify-center space-x-1 transition-all duration-300 z-10 ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-70 -translate-y-1"
              }`}
            >
              {processedImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-white scale-125 shadow-sm"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Quick View Overlay */}
          <div
            className={`absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-xl flex items-center justify-center ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-white bg-black/70 px-3 py-1 rounded-full text-xs font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Quick View
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow px-0 sm:px-1 w-full">
        {/* Name with better typography */}
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 flex-grow leading-tight min-h-[2.5rem] sm:min-h-[3rem] group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Enhanced Rating with review count */}
        {(averageRating > 0 || reviewCount > 0) && (
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                if (ratingValue <= Math.floor(averageRating)) {
                  return (
                    <FaStar key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  );
                } else if (ratingValue - 0.5 <= averageRating) {
                  return (
                    <FaStarHalfAlt
                      key={i}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                    />
                  );
                } else {
                  return (
                    <FaStar
                      key={i}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300"
                    />
                  );
                }
              })}
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {averageRating.toFixed(1)}
              {reviewCount > 0 && ` (${reviewCount})`}
            </span>
          </div>
        )}

        {/* Enhanced Price Section */}
        <div className="mb-3 sm:mb-4">
          {product.salePrice ? (
            <div className="flex items-baseline space-x-2">
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {product.salePrice} AED
              </p>
              <p className="text-sm text-gray-500 line-through">
                {product.regularPrice} AED
              </p>
            </div>
          ) : (
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {product.regularPrice} AED
            </p>
          )}
        </div>

        {/* Enhanced Add To Cart Button */}
        <button
          onClick={(e) => handleAddToCartClick(e, product)}
          disabled={isAddingToCart}
          className={`w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0] hover:from-[#16467c] hover:to-[#005099] text-white py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold mt-auto transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 min-h-[2.5rem] sm:min-h-[3rem] group/cart ${
            isAddingToCart
              ? "from-green-600 to-green-700 cursor-not-allowed"
              : "hover:shadow-xl"
          }`}
        >
          {isAddingToCart ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Adding...
            </>
          ) : (
            <>
              <FaShoppingCart className="inline-block mr-2 transition-transform group-hover/cart:scale-110" />
              Add to Cart
            </>
          )}
        </button>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

// ⭐ Enhanced Main Component
export default function JustForYou() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(10);

  const [userId, setUserId] = useState(null);

  // 👉 Fix: Safe localStorage access
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId);
    }
  }, []);

// 👉 Fetch API
useEffect(() => {
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const BASE_URL = process.env.NEXT_PUBLIC_BASEURL;

      const url = userId
        ? `${BASE_URL}/recommend/just-for-you/${userId}`
        : `${BASE_URL}/recommend/just-for-you`;

      const res = await axios.get(url);

      // Process products to ensure images are properly formatted
      const processedProducts = (res.data || []).map((product) => ({
        ...product,
        images: Array.isArray(product.images) ? product.images : [],
        productId: product._id || product.id, // handles both
      }));

      console.log("processedProducts", processedProducts);

      setProducts(processedProducts);
      setLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setError("Failed to load products. Please try again later.");
      setLoading(false);
    }
  };

  fetchProducts();
}, [userId]);

  // 👉 Enhanced Add to cart with animation
  const handleAddToCart = async (product) => {
    return new Promise((resolve) => {
      setCart((prev) => {
        const exist = prev.find((p) => p._id === product._id);
        if (exist) {
          return prev.map((p) =>
            p._id === product._id ? { ...p, qty: p.qty + 1 } : p
          );
        }
        return [...prev, { ...product, qty: 1 }];
      });

      // Create floating cart animation
      const button = document.activeElement;
      if (button) {
        button.classList.add("animate-pulse");
        setTimeout(() => {
          button.classList.remove("animate-pulse");
        }, 600);
      }

      resolve();
    });
  };

  // 👉 Wishlist toggle with feedback
  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const copy = new Set(prev);
      if (copy.has(productId)) {
        copy.delete(productId);
      } else {
        copy.add(productId);
      }
      return copy;
    });
  };

  const handleProductClick = (_id) => {
    router.push(`/ProductDetailPage/${_id}`);
  };

  // 👉 Load more products
  const loadMoreProducts = () => {
    setVisibleProducts((prev) => prev + 10);
  };

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  const displayedProducts = products.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < products.length;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-16 px-4 sm:px-6 w-full">
      {/* Enhanced Header Section */}
      <div className="text-center mb-12 sm:mb-16 w-full max-w-6xl mx-auto">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mr-4"></div>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Personalized Selection
          </span>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent ml-4"></div>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
          Curated Just For You
        </h2>

        <p className="text-gray-600 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed px-2 font-light">
          Discover watches that match your unique style and preferences,
          carefully selected based on your browsing history and tastes.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm">!</span>
            </div>
            <span className="font-semibold">Unable to Load Products</span>
          </div>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-7xl mx-auto w-full">
        {loading ? (
          // Enhanced Loading Skeleton
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow p-4 animate-pulse"
              >
                <div className="w-full aspect-square bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-4 flex items-center justify-center">
                  <FaSpinner className="text-gray-400 animate-spin" />
                </div>
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {displayedProducts.map((product) => (
                <ProductCard
                  key={product._id || product.productId}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isInWishlist={wishlist.has(product._id || product.productId)}
                  onProductClick={handleProductClick}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreProducts && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={loadMoreProducts}
                  className="bg-white border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center group"
                >
                  Load More Products
                  <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Enhanced Empty State */}
            {products.length === 0 && !loading && (
              <div className="text-center py-16 sm:py-24 w-full">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🕒</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
                  No Personalized Recommendations Yet
                </h3>
                <p className="text-gray-500 text-base max-w-md mx-auto mb-6">
                  Continue browsing our collection to help us understand your
                  preferences better.
                </p>
                <button
                  onClick={() => router.push("/products")}
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0] hover:from-[#16467c] hover:to-[#005099] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                >
                  Browse All Products
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => router.push("/cart")}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#1e518e] to-[#0061b0] hover:from-[#16467c] hover:to-[#005099] text-white px-5 py-4 rounded-full shadow-2xl flex items-center transition-all duration-300 z-50 transform hover:scale-105 group"
        >
          <div className="relative mr-3">
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          </div>
          <span className="font-semibold">View Cart</span>
          <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaChevronRight className="text-sm" />
          </div>
        </button>
      )}
    </div>
  );
}
