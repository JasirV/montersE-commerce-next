"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaFire,
  FaUserTag,
} from "react-icons/fa";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import toast from "react-hot-toast";
import { useCurrency } from "@/app/CurrencyContext";

// ⭐ Enhanced Product Card Component with Authentication Handling
const ProductCard = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onProductClick,
  sectionType = "brand-new",
  showConditionBadge = true,
  isAuthenticated = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [localWishlistState, setLocalWishlistState] = useState(false);
  const imageContainerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Currency Context
  const { currency, convertPrice, getCurrencySymbol } = useCurrency();

  // Initialize local wishlist state
  useEffect(() => {
    setLocalWishlistState(isInWishlist);
  }, [isInWishlist]);

  // Format price with thousands separators and proper decimals
  const formatPrice = (price) => {
    try {
      // Convert to number if it's not already
      const priceNumber = typeof price === 'number' ? price : parseFloat(price);
      
      // Check if it's a valid number
      if (isNaN(priceNumber)) {
        return "0.00";
      }
      
      // Format with 2 decimal places and thousands separators
      return priceNumber.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch (error) {
      console.error("Error formatting price:", error);
      return "0.00";
    }
  };

  // Format price with currency symbol and proper spacing
  const formatPriceWithCurrency = (price) => {
    const formattedPrice = formatPrice(price);
    const symbol = getCurrencySymbol();
    
    // Return formatted price with currency symbol and proper spacing
    // Different currencies have different formatting conventions
    switch (currency) {
      case 'USD':
      case 'CAD':
      case 'AUD':
      case 'NZD':
      case 'SGD':
      case 'HKD':
        // Prefix with symbol: $1,234.00
        return `${symbol}${formattedPrice}`;
      
      case 'EUR':
      case 'GBP':
        // Prefix with symbol: €1,234.00 or £1,234.00
        return `${symbol}${formattedPrice}`;
      
      case 'JPY':
        // No decimals, with symbol: ¥1,234
        const jpyPrice = parseFloat(price).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return `${symbol}${jpyPrice}`;
      
      case 'INR':
        // Indian numbering system with symbol: ₹1,234.00
        const inrPrice = parseFloat(price).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return `${symbol}${inrPrice}`;
      
      case 'AED':
      case 'SAR':
      case 'QAR':
        // Arabic currencies: 1,234.00 AED
        return `${formattedPrice} ${symbol}`;
      
      default:
        // Default: symbol before number
        return `${symbol}${formattedPrice}`;
    }
  };

  // Get formatted sale price
  const getSalePrice = () => {
    try {
      if (!product.salePrice) return null;
      const convertedPrice = convertPrice(product.salePrice);
      return formatPriceWithCurrency(convertedPrice);
    } catch (error) {
      console.error("Error formatting sale price:", error);
      return formatPriceWithCurrency(0);
    }
  };

  // Get formatted regular price
  const getRegularPrice = () => {
    try {
      const price = product.regularPrice || product.price || 0;
      const convertedPrice = convertPrice(price);
      return formatPriceWithCurrency(convertedPrice);
    } catch (error) {
      console.error("Error formatting regular price:", error);
      return formatPriceWithCurrency(0);
    }
  };

  // Calculate and format savings amount
  const getSavingsAmount = () => {
    try {
      if (product.salePrice && product.regularPrice) {
        const regularPrice = parseFloat(product.regularPrice) || 0;
        const salePrice = parseFloat(product.salePrice) || 0;
        if (regularPrice > salePrice) {
          const savings = regularPrice - salePrice;
          const convertedSavings = convertPrice(savings);
          return formatPrice(convertedSavings);
        }
      }
      return "0.00";
    } catch (error) {
      console.error("Error calculating savings:", error);
      return "0.00";
    }
  };

  // Process images
  const processedImages = React.useMemo(() => {
    if (!product.images || !Array.isArray(product.images)) return [];
    const mainImage = product.images.find((img) => img.type === "main");
    const coverImages = product.images.filter((img) => img.type === "cover");
    return mainImage ? [mainImage, ...coverImages] : product.images;
  }, [product.images]);

  const minSwipeDistance = 30;

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
    if (isHovered && processedImages.length > 1 && window.innerWidth > 768) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === processedImages.length - 1 ? 0 : prev + 1
        );
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isHovered, processedImages.length]);

  // Handle add to cart
  const handleAddToCartClick = async (e, product) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    await onAddToCart(product);
    setTimeout(() => setIsAddingToCart(false), 600);
  };

  // Handle wishlist toggle with proper authentication check - FIXED
  const handleWishlistClick = async (e) => {
    e.stopPropagation();

    // Check authentication FIRST
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    if (!token) {
      // Show warning toast for guest users
      Toastify({
        text: "Please log in to add to favorites",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ff7a5c)",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
        close: true,
        stopOnFocus: true,
      }).showToast();

      // Redirect to login page with current path as redirect URL
      router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
      return; // Stop execution here for guest users
    }

    // If authenticated, proceed with toggling wishlist
    setIsWishlistLoading(true);

    // Optimistic UI update - only for authenticated users
    const newWishlistState = !localWishlistState;
    setLocalWishlistState(newWishlistState);

    try {
      await onToggleWishlist(product.productId || product._id);
      toast.success(
        newWishlistState ? "Added to favorites!" : "Removed from favorites",
        {
          duration: 2000,
          position: "bottom-center",
          style: {
            background: newWishlistState ? "#10b981" : "#ef4444",
            color: "white",
            borderRadius: "8px",
          },
        }
      );
    } catch (error) {
      // Revert on error
      setLocalWishlistState(!newWishlistState);
      toast.error("Failed to update favorites", {
        duration: 3000,
        position: "bottom-center",
      });
      console.error("Wishlist toggle failed:", error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Calculate discount percentage
  const discountPercentage =
    product.salePrice && product.regularPrice
      ? Math.round(
          ((product.regularPrice - product.salePrice) / product.regularPrice) *
            100
        )
      : 0;

  // Handle rating
  const getRatingData = () => {
    const rating = product.rating || product.averageRating || 0;
    const reviewCount = product.reviewCount || product.ratingCount || 0;
    const numericRating = Number(rating) || 0;
    const numericReviewCount = Number(reviewCount) || 0;

    return {
      rating: numericRating,
      reviewCount: numericReviewCount,
      ratingText: numericRating > 0 ? numericRating.toFixed(1) : "0.0",
    };
  };

  const { rating, reviewCount, ratingText } = getRatingData();

  // Get product ID for navigation
  const getProductId = () => {
    return product.productId || product._id;
  };

  // Determine which badge to show
  const getConditionBadge = () => {
    if (!showConditionBadge) return null;
    const condition = (product.condition || "").toLowerCase();

    if (sectionType === "brand-new") {
      return {
        text: "Brand New",
        className: "bg-green-500 text-white",
      };
    }

    if (condition.includes("used") || condition.includes("pre-owned")) {
      return {
        text: "Pre-Owned",
        className: "bg-amber-500 text-white",
      };
    } else if (condition.includes("like-new")) {
      return {
        text: "Like New",
        className: "bg-blue-500 text-white",
      };
    } else if (condition.includes("brand") || condition.includes("new")) {
      return {
        text: "Brand New",
        className: "bg-green-500 text-white",
      };
    }

    return null;
  };

  const conditionBadge = getConditionBadge();

  return (
    <div
      onClick={() => onProductClick(getProductId())}
      className="group bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg p-2 sm:p-3 transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer relative flex flex-col h-full w-full overflow-hidden"
      onMouseEnter={() => window.innerWidth > 768 && setIsHovered(true)}
      onMouseLeave={() => window.innerWidth > 768 && setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onProductClick(getProductId())}
    >
      {/* Condition Badge */}
      {conditionBadge && (
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${conditionBadge.className}`}
          >
            <span className="hidden sm:inline">{conditionBadge.icon} </span>
            {conditionBadge.text}
          </span>
        </div>
      )}

      <button
        onClick={handleWishlistClick}
        disabled={isWishlistLoading}
        aria-label={
          isAuthenticated
            ? localWishlistState
              ? "Remove from wishlist"
              : "Add to wishlist"
            : "Login to add to wishlist"
        }
        title={
          !isAuthenticated
            ? "Please login to add to favorites"
            : localWishlistState
            ? "Remove from favorites"
            : "Add to favorites"
        }
        className="
          absolute top-2 right-2 z-10
          rounded-full p-2
          bg-white/90 backdrop-blur-sm
          shadow-sm
          transform transition-all duration-200
          hover:bg-white hover:shadow-md
          active:scale-95
          cursor-pointer hover:cursor-pointer
          disabled:opacity-70 disabled:cursor-not-allowed
        "
      >
        {isWishlistLoading ? (
          <FaSpinner className="text-gray-600 text-sm animate-spin pointer-events-none" />
        ) : isAuthenticated && localWishlistState ? (
          <FaHeart className="text-red-500 text-sm pointer-events-none" />
        ) : (
          <FaRegHeart
            className={`text-sm transition-colors pointer-events-none ${
              isAuthenticated
                ? "text-gray-600 group-hover:text-red-400"
                : "text-gray-400 group-hover:text-gray-500"
            }`}
          />
        )}
      </button>
      {/* Product Image with Enhanced Carousel */}
      <div
        ref={imageContainerRef}
        className="relative mb-1.5 sm:mb-3 rounded-lg overflow-hidden w-full bg-gray-50 aspect-square"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {!loaded && (
          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg flex items-center justify-center">
            <FaSpinner className="text-gray-400 animate-spin text-xs sm:text-sm" />
          </div>
        )}

        {/* Image Carousel */}
        <div className="relative w-full h-full">
          <Image
            src={processedImages[currentImageIndex]?.url || "/placeholder.png"}
            alt={processedImages[currentImageIndex]?.alt || product.name}
            width={400}
            unoptimized
            height={400}
            className={`w-full h-full object-cover transition-all duration-300 ${
              loaded ? "opacity-100 group-hover:scale-105" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            priority={currentImageIndex === 0}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Enhanced Carousel Navigation Arrows */}
          {processedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className={`absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 sm:p-2 shadow transition-all duration-200 cursor-pointer ${
                  isHovered || window.innerWidth <= 768
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90"
                } active:scale-95 backdrop-blur-sm z-20 hover:shadow-md`}
                aria-label="Previous image"
              >
                <FaChevronLeft size={10} className="sm:w-3 sm:h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className={`absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 sm:p-2 shadow transition-all duration-200 cursor-pointer ${
                  isHovered || window.innerWidth <= 768
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90"
                } active:scale-95 backdrop-blur-sm z-20 hover:shadow-md`}
                aria-label="Next image"
              >
                <FaChevronRight size={10} className="sm:w-3 sm:h-3" />
              </button>
            </>
          )}

          {/* Enhanced Image Indicators */}
          {processedImages.length > 1 && (
            <div
              className={`absolute bottom-1.5 sm:bottom-2 left-0 right-0 flex justify-center space-x-1 transition-all duration-200 z-10 ${
                isHovered || window.innerWidth <= 768
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
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    index === currentImageIndex
                      ? "bg-white scale-125 shadow-sm"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow px-1 w-full">
        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-1.5 line-clamp-2 flex-grow leading-tight min-h-[2.2rem] sm:min-h-[2.5rem] group-hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        {(rating > 0 || reviewCount > 0) && (
          <div className="flex items-center mb-1.5 sm:mb-2">
            <div className="flex text-yellow-400 mr-1 sm:mr-1.5">
              {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                if (ratingValue <= Math.floor(rating)) {
                  return (
                    <FaStar key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  );
                } else if (ratingValue - 0.5 <= rating) {
                  return (
                    <FaStarHalfAlt
                      key={i}
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                    />
                  );
                } else {
                  return (
                    <FaStar
                      key={i}
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-300"
                    />
                  );
                }
              })}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-600 font-medium">
              {ratingText}
              {reviewCount > 0 && ` (${reviewCount})`}
            </span>
          </div>
        )}

        {/* Price Section - FIXED with proper formatting */}
        <div className="mb-1.5 sm:mb-2">
          {product.salePrice ? (
            <div className="flex items-baseline space-x-1 sm:space-x-1.5">
              <p className="text-xs sm:text-sm font-bold text-gray-900">
                {getSalePrice()}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 line-through">
                {getRegularPrice()}
              </p>
            </div>
          ) : (
            <p className="text-xs sm:text-sm font-bold text-gray-900">
              {getRegularPrice()}
            </p>
          )}
        </div>

        {/* Add To Cart Button */}
        <button
          onClick={(e) => handleAddToCartClick(e, product)}
          disabled={isAddingToCart}
          className={`w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0] hover:from-[#16467c] hover:to-[#005099] text-white py-1.5 sm:py-2 rounded-lg sm:rounded-lg text-[10px] sm:text-xs font-semibold mt-auto transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow active:scale-95 min-h-[1.75rem] sm:min-h-[2rem] group/cart cursor-pointer ${
            isAddingToCart
              ? "from-green-600 to-green-700 cursor-not-allowed"
              : ""
          }`}
        >
          {isAddingToCart ? (
            <>
              <FaSpinner className="animate-spin mr-1 text-xs sm:text-xs" />
              Adding...
            </>
          ) : (
            <>
              <FaShoppingCart className="inline-block mr-1 text-[10px] sm:text-xs transition-transform group-hover/cart:scale-110" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ⭐ Section Header Component
const SectionHeader = ({ title, subtitle, icon: Icon }) => {
  return (
    <div className="text-center mb-4 sm:mb-8 w-full px-2">
      {/* Subtitle */}
      <div className="inline-flex items-center justify-center mb-2 sm:mb-3">
        <div className="w-6 sm:w-10 h-0.5 bg-gray-300 mr-2 sm:mr-3"></div>
        <span className="text-gray-600 font-medium text-[10px] sm:text-xs uppercase tracking-wider flex items-center">
          {Icon && <Icon className="mr-1 sm:mr-1.5 text-gray-600" />}
          {subtitle}
        </span>
        <div className="w-6 sm:w-10 h-0.5 bg-gray-300 ml-2 sm:ml-3"></div>
      </div>

      {/* Main Title - BLACK COLOR */}
      <h2 className="text-base sm:text-2xl font-bold text-black mb-1.5 sm:mb-3">
        {title}
      </h2>
    </div>
  );
};

// ⭐ Main Component with Both Sections
export default function EnhancedProductSections() {
  const router = useRouter();
  const [justForYouProducts, setJustForYouProducts] = useState([]);
  const [brandNewProducts, setBrandNewProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState([]);
  const [loadingJustForYou, setLoadingJustForYou] = useState(true);
  const [loadingBrandNew, setLoadingBrandNew] = useState(true);
  const [errorJustForYou, setErrorJustForYou] = useState(null);
  const [errorBrandNew, setErrorBrandNew] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showBrandNewSection, setShowBrandNewSection] = useState(false);

  // ✅ Currency Context
  const { currency, convertPrice, getCurrencySymbol } = useCurrency();

  // 👉 Check authentication status
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");

      setUserId(storedUserId);
      setIsAuthenticated(!!storedUserId && !!token);
    }
  }, []);

  // 👉 Fetch Brand New Products
  useEffect(() => {
    const fetchBrandNewProducts = async () => {
      try {
        setLoadingBrandNew(true);
        setErrorBrandNew(null);

        const BASE_URL = process.env.NEXT_PUBLIC_BASEURL;
        const endpoints = [
          `${BASE_URL}/products?sort=newest&limit=20`,
          `${BASE_URL}/products`,
        ];

        let apiData = [];

        for (const endpoint of endpoints) {
          try {
            const res = await axios.get(endpoint);
            let extractedData = [];

            if (Array.isArray(res.data)) {
              extractedData = res.data;
            } else if (res.data && Array.isArray(res.data.products)) {
              extractedData = res.data.products;
            } else if (res.data && Array.isArray(res.data.data)) {
              extractedData = res.data.data;
            } else if (res.data && typeof res.data === "object") {
              const values = Object.values(res.data);
              for (const value of values) {
                if (Array.isArray(value)) {
                  extractedData = value;
                  break;
                }
              }
            }

            if (extractedData.length > 0) {
              apiData = extractedData;
              break;
            }
          } catch (err) {
            console.warn("Failed to fetch from:", endpoint, err.message);
          }
        }

        const processedProducts = (apiData || [])
          .filter((product) => {
            const condition = (product.condition || "").toLowerCase();
            return condition.includes("brand") || condition.includes("new");
          })
          .map((product, index) => ({
            ...product,
            images: Array.isArray(product.images) ? product.images : [],
            productId: product._id || product.id || `new-${index}`,
            rating: Number(product.rating || product.averageRating || 0),
            reviewCount: Number(
              product.reviewCount || product.ratingCount || 0
            ),
            condition: "brand-new",
          }));

        if (processedProducts.length > 0) {
          setBrandNewProducts(processedProducts);
          setShowBrandNewSection(true);
        } else {
          setBrandNewProducts([]);
          setShowBrandNewSection(false);
        }

        setLoadingBrandNew(false);
      } catch (error) {
        console.error("Brand New Products Error:", error);
        setErrorBrandNew("Failed to load brand new items.");
        setLoadingBrandNew(false);
        setShowBrandNewSection(false);
      }
    };

    fetchBrandNewProducts();
  }, []);

  // 👉 Fetch Just For You Products
  useEffect(() => {
    const fetchJustForYouProducts = async () => {
      try {
        setLoadingJustForYou(true);
        setErrorJustForYou(null);

        const BASE_URL = process.env.NEXT_PUBLIC_BASEURL;
        const url = userId
          ? `${BASE_URL}/recommend/just-for-you/${userId}`
          : `${BASE_URL}/recommend/just-for-you`;

        const res = await axios.get(url);
        let productsData = [];

        if (Array.isArray(res.data)) {
          productsData = res.data;
        } else if (res.data && Array.isArray(res.data.products)) {
          productsData = res.data.products;
        } else if (res.data && Array.isArray(res.data.data)) {
          productsData = res.data.data;
        } else if (res.data && typeof res.data === "object") {
          const values = Object.values(res.data);
          for (const value of values) {
            if (Array.isArray(value)) {
              productsData = value;
              break;
            }
          }
        }

        const processedProducts = (productsData || []).map((product) => ({
          ...product,
          images: Array.isArray(product.images) ? product.images : [],
          productId: product._id || product.id,
          rating: Number(product.rating || product.averageRating || 0),
          reviewCount: Number(product.reviewCount || product.ratingCount || 0),
          condition: product.condition || "brand-new",
        }));

        setJustForYouProducts(processedProducts);
        setLoadingJustForYou(false);
      } catch (error) {
        console.error("Just For You API Error:", error);
        setErrorJustForYou("Failed to load personalized recommendations.");
        setLoadingJustForYou(false);
      }
    };

    fetchJustForYouProducts();
  }, [userId]);

  // 👉 Enhanced Add to cart
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

      const button = document.activeElement;
      if (button) {
        button.classList.add("animate-pulse");
        setTimeout(() => {
          button.classList.remove("animate-pulse");
        }, 600);
      }

      toast.success("Added to cart!", {
        duration: 2000,
        position: "bottom-center",
      });
      resolve();
    });
  };

  // 👉 Wishlist toggle (only for authenticated users)
  const handleToggleWishlist = async (productId) => {
    // This function should only be called for authenticated users
    // Guest users are handled in the ProductCard component

    try {
      // API call to toggle wishlist
      const BASE_URL = process.env.NEXT_PUBLIC_BASEURL;
      const response = await axios.post(
        `${BASE_URL}/wishlist/toggle`,
        {
          userId,
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("accessToken") ||
              localStorage.getItem("token")
            }`,
          },
        }
      );

      // Update local state based on API response
      setWishlist((prev) => {
        const copy = new Set(prev);
        if (response.data.isInWishlist) {
          copy.add(productId);
        } else {
          copy.delete(productId);
        }
        return copy;
      });

      return response.data;
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      throw error;
    }
  };

  const handleProductClick = (_id) => {
    router.push(`/ProductDetailPage/${_id}`);
  };

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-3 sm:py-8 px-2 sm:px-4 w-full min-h-screen">
      {/* BRAND NEW ITEMS SECTION */}
      {showBrandNewSection && brandNewProducts.length > 0 && (
        <div className="max-w-7xl mx-auto w-full mb-6 sm:mb-12">
          <SectionHeader
            title="Brand New Arrivals"
            subtitle="Latest Collections"
            icon={FaFire}
          />

          {/* Error State */}
          {errorBrandNew && (
            <div className="mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-center">
              <div className="flex items-center justify-center mb-1 sm:mb-1.5">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center mr-1 sm:mr-1.5">
                  <span className="text-white text-[10px] sm:text-xs">!</span>
                </div>
                <span className="font-semibold text-xs sm:text-sm">
                  Unable to Load
                </span>
              </div>
              <p className="text-[10px] sm:text-xs">{errorBrandNew}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] sm:text-xs transition-colors active:scale-95 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Brand New Products Grid */}
          {loadingBrandNew ? (
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-1.5 sm:p-2 animate-pulse"
                >
                  <div className="w-full aspect-square bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-1.5 sm:mb-2"></div>
                  <div className="h-2.5 bg-gray-200 rounded mb-1.5"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4 mb-1.5"></div>
                  <div className="h-7 sm:h-8 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {brandNewProducts.length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {brandNewProducts.map((product) => (
                    <ProductCard
                      key={product._id || product.productId}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isInWishlist={wishlist.has(
                        product._id || product.productId
                      )}
                      onProductClick={handleProductClick}
                      sectionType="brand-new"
                      showConditionBadge={true}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* JUST FOR YOU SECTION */}
      <div className="max-w-7xl mx-auto w-full">
        <SectionHeader
          title="Curated Just For You"
          subtitle="Personalized Selection"
          icon={FaUserTag}
        />

        {/* Section Info - Mixed Conditions */}
        <div className="text-center mb-3 sm:mb-5">
          <div className="inline-flex flex-wrap justify-center gap-1 sm:gap-2 mb-2">
            <span className="px-2 py-0.5 sm:py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] sm:text-xs text-blue-700 font-medium">
              <span className="hidden sm:inline"></span>Like New
            </span>
            <span className="px-2 py-0.5 sm:py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] sm:text-xs text-amber-700 font-medium">
              <span className="hidden sm:inline"></span>Pre-Owned
            </span>
            <span className="px-2 py-0.5 sm:py-1 bg-green-50 border border-green-200 rounded-full text-[10px] sm:text-xs text-green-700 font-medium">
              <span className="hidden sm:inline"></span>Brand New
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 px-2">
            {!isAuthenticated && (
              <span className="text-amber-600 font-medium">
                ⓘ Login to save favorites •
              </span>
            )}{" "}
            Personalized recommendations based on your preferences
          </p>
        </div>

        {/* Error State */}
        {errorJustForYou && (
          <div className="mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl text-red-700 text-center">
            <div className="flex items-center justify-center mb-1 sm:mb-1.5">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full flex items-center justify-center mr-1 sm:mr-1.5">
                <span className="text-white text-[10px] sm:text-xs">!</span>
              </div>
              <span className="font-semibold text-xs sm:text-sm">
                Unable to Load
              </span>
            </div>
            <p className="text-[10px] sm:text-xs">{errorJustForYou}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-1.5 sm:mt-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[10px] sm:text-xs transition-colors active:scale-95 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Just For You Products Grid */}
        {loadingJustForYou ? (
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-1.5 sm:p-2 animate-pulse"
              >
                <div className="w-full aspect-square bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-1.5 sm:mb-2 flex items-center justify-center">
                  <FaSpinner className="text-gray-400 animate-spin text-xs" />
                </div>
                <div className="h-2.5 bg-gray-200 rounded mb-1.5"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4 mb-1.5"></div>
                <div className="h-7 sm:h-8 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {justForYouProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {justForYouProducts.map((product) => (
                  <ProductCard
                    key={product._id || product.productId}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isInWishlist={wishlist.has(
                      product._id || product.productId
                    )}
                    onProductClick={handleProductClick}
                    sectionType="just-for-you"
                    showConditionBadge={true}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 w-full">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FaUserTag className="text-lg sm:text-2xl text-blue-500" />
                </div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-1.5 sm:mb-2">
                  No Recommendations Yet
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm max-w-xs mx-auto mb-3 sm:mb-4 px-2">
                  Browse more products to get personalized recommendations.
                  {!isAuthenticated && (
                    <span className="block mt-1 text-amber-600 font-medium">
                      Login to save your favorites!
                    </span>
                  )}
                </p>
                <button
                  onClick={() => router.push("/products")}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 hover:shadow active:scale-95 text-xs sm:text-sm cursor-pointer"
                >
                  Browse Products
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
          className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 bg-gradient-to-r from-[#1e518e] to-[#0061b0] hover:from-[#16467c] hover:to-[#005099] text-white p-2 sm:p-3 rounded-full shadow-lg flex items-center transition-all duration-200 z-50 active:scale-95 cursor-pointer"
          aria-label={`View cart with ${cartCount} items`}
        >
          <div className="relative">
            <FaShoppingCart className="text-sm sm:text-lg" />
            <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-red-500 text-white text-[8px] sm:text-[10px] rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center animate-pulse">
              {cartCount}
            </span>
          </div>
          <span className="ml-1 font-semibold text-[10px] sm:text-xs hidden sm:inline">
            Cart
          </span>
        </button>
      )}
    </div>
  );
}