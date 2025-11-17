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
  FaTag
} from "react-icons/fa";

// ⭐ Product Card Component
const ProductCard = ({ product, onAddToCart, onToggleWishlist, isInWishlist, onProductClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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
    
    if (isLeftSwipe && product.images?.length > 1) {
      handleNextImage();
    } else if (isRightSwipe && product.images?.length > 1) {
      handlePrevImage();
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  // Calculate discount percentage
  const discountPercentage = product.salePrice && product.regularPrice
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : 0;

  return (
    <div
      onClick={() => onProductClick(product.productId)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 border cursor-pointer relative flex flex-col h-full w-full"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 flex items-center">
          <FaTag className="mr-1" />
          {discountPercentage}% OFF
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product._id);
        }}
        className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white rounded-full shadow p-2 z-10 hover:scale-110 transition-transform"
        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isInWishlist ? (
          <FaHeart className="text-red-500 text-sm" />
        ) : (
          <FaRegHeart className="text-gray-700 text-sm" />
        )}
      </button>

      {/* Product Image with Carousel */}
      <div 
        className="relative mb-3 sm:mb-4 rounded-xl overflow-hidden w-full"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {!loaded && (
          <div className="w-full aspect-square bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-xl"></div>
        )}
        
        {/* Image Carousel */}
        <div className="relative w-full aspect-square">
          <Image
            src={product?.images?.[currentImageIndex]?.url || "/placeholder.png"}
            alt={product.name}
            width={400}
            height={400}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            priority
          />
          
          {/* Carousel Navigation Arrows (only show if multiple images) */}
          {product.images && product.images.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full p-1 sm:p-2 hover:bg-opacity-80 transition-all"
                aria-label="Previous image"
              >
                <FaChevronLeft size={14} className="sm:w-4" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full p-1 sm:p-2 hover:bg-opacity-80 transition-all"
                aria-label="Next image"
              >
                <FaChevronRight size={14} className="sm:w-4" />
              </button>
            </>
          )}
          
          {/* Image Indicators (dots) */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 left-0 right-0 flex justify-center space-x-1 sm:space-x-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white bg-opacity-50'
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow px-0 sm:px-1 w-full">
        {/* Name */}
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 line-clamp-2 flex-grow leading-tight min-h-[2.5rem] sm:min-h-[3rem]">
          {product.name}
        </h3>

        {/* Rating (if available) */}
        {product.rating && (
          <div className="flex items-center mb-2 sm:mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                if (ratingValue <= Math.floor(product.rating)) {
                  return <FaStar key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
                } else if (ratingValue - 0.5 <= product.rating) {
                  return <FaStarHalfAlt key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
                } else {
                  return <FaStar key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300" />;
                }
              })}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3 sm:mb-4">
          {product.salePrice ? (
            <div className="flex items-center space-x-2">
              <p className="text-lg sm:text-xl font-bold text-gray-900">
                {product.salePrice} AED
              </p>
              <p className="text-xs sm:text-sm text-gray-500 line-through">
                {product.regularPrice} AED
              </p>
            </div>
          ) : (
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              {product.regularPrice} AED
            </p>
          )}
        </div>

        {/* Add To Cart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0] hover:from-[#16467c] hover:to-[#005099] text-white py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold mt-auto transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 min-h-[2.5rem] sm:min-h-[3rem]"
        >
          <FaShoppingCart className="inline-block mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

// ⭐ Main Component
export default function JustForYou() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // 👉 Fetch API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = userId
          ? `https://api.montres.ae/api/recommend/just-for-you/${userId}`
          : `https://api.montres.ae/api/recommend/just-for-you`;

        const res = await axios.get(url);

        setProducts(res.data || []);
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userId]);

  // 👉 Add to cart
  const handleAddToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((p) => p._id === product._id);
      if (exist) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    
    // Show a quick visual feedback
    const button = document.activeElement;
    if (button) {
      button.classList.add('from-green-600', 'to-green-700');
      setTimeout(() => {
        button.classList.remove('from-green-600', 'to-green-700');
        button.classList.add('from-[#1e518e]', 'to-[#0061b0]');
      }, 500);
    }
  };

  // 👉 Wishlist toggle
  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const copy = new Set(prev);
      if (copy.has(productId)) copy.delete(productId);
      else copy.add(productId);
      return copy;
    });
  };

  // 👉 Product details page
  const handleProductClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 px-4 sm:px-6 w-full">
      <div className="text-center mb-8 sm:mb-12 w-full">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Just For You</h2>
        <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed px-2">
          Discover our exclusive collection of premium watches, carefully selected based on your preferences and browsing history.
        </p>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-sm sm:text-base">
          {error}
        </div>
      )}

      {loading ? (
        // Loading Skeleton
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow p-3 sm:p-4 animate-pulse w-full">
                <div className="w-full aspect-square bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl mb-3 sm:mb-4"></div>
                <div className="h-4 sm:h-5 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
                <div className="h-10 sm:h-12 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Products Grid
        <div className="max-w-7xl mx-auto w-full">
          {/* Responsive Grid - Consistent spacing across devices */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={wishlist.has(product._id)}
                onProductClick={handleProductClick}
              />
            ))}
          </div>

          {/* Empty State */}
          {products.length === 0 && !loading && (
            <div className="text-center py-12 sm:py-16 w-full">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">🕒</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500 text-sm sm:text-base">We couldn't find any products matching your preferences.</p>
            </div>
          )}
        </div>
      )}

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => router.push('/cart')}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-gradient-to-r from-[#1e518e] to-[#0061b0] hover:from-[#16467c] hover:to-[#005099] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-2xl flex items-center transition-all duration-300 z-50 transform hover:scale-105 text-sm sm:text-base"
        >
          <div className="relative">
            <FaShoppingCart className="text-lg sm:text-xl mr-2 sm:mr-3" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <span className="font-semibold">View Cart</span>
        </button>
      )}
    </div>
  );
}