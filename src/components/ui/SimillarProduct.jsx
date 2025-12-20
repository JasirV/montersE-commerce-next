"use client";

import Image from "next/image";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import axios from "axios";
import { GlobalContext } from "../shared/context/GlobalContext";
import Dummy1 from "../../assets/Accessory Deals.jpg";
import { useCurrency } from "@/app/CurrencyContext";

// Optimized ProductCard component without memoization
const ProductCard = ({ product }) => {
  const router = useRouter();
  const { decrementWishlist, incrementWishlist, incrementCart } =
    useContext(GlobalContext);
  const [isWishlisted, setIsWishlisted] = useState([]);
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Currency Context
  const { currency, convertPrice, getCurrencySymbol } = useCurrency();

  const productId = product._id || product.productId?._id;
  const isProductWishlisted = isWishlisted.includes(productId);

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

  // Product category checks
  const isBagCategory = () => {
    const p = product;
    if (p.leatherMainCategory?.toLowerCase().includes("bag")) return true;
    if (p.subCategory?.toLowerCase().includes("bag")) return true;
    if (p.category?.toLowerCase().includes("bag")) return true;
    if (p.material?.toLowerCase().includes("leather")) return true;
    if (p.name?.toLowerCase().includes("bag")) return true;
    return false;
  };

  const isAccessoriesCategory = () => {
    const category = product.category?.toLowerCase();
    const subCategory = product.subCategory?.toLowerCase();
    const main = product.leatherMainCategory?.toLowerCase();

    if (category === "accessories") return true;
    if (subCategory === "accessories") return true;
    if (main === "accessories") return true;
    return false;
  };

  const fetchWishlists = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlists`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data?.wishlists?.length > 0) {
        const defaultWishlist =
          res.data.wishlists.find((w) => w.isDefault) || res.data.wishlists[0];
        setDefaultWishlistId(defaultWishlist._id || defaultWishlist.id);

        const allWishlistProductIds = res.data.wishlists.flatMap(
          (wishlist) =>
            wishlist.products?.map((product) => product._id || product) || []
        );
        setIsWishlisted(allWishlistProductIds);
      }
    } catch (error) {
      console.error("Error fetching wishlists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = () => {
    if (!productId) {
      Toastify({
        text: "Product information is incomplete",
        duration: 3000,
        gravity: "bottom",
        position: "center",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
      return;
    }

    // Priority routing based on category
    if (isBagCategory()) {
      router.push(`/LeatherBagsDetails/${productId}`);
    } else if (isAccessoriesCategory()) {
      router.push(`/AccessoriesDeatils/${productId}`);
    } else {
      router.push(`/ProductDetailPage/${productId}`);
    }
  };

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Toastify({
          text: "Please log in first to add to wishlist",
          duration: 4000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
        }).showToast();
        return;
      }

      if (!productId) return;

      if (isProductWishlisted) {
        // Remove from wishlist
        try {
          const response = await axios.delete(
            `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/remove`,
            {
              headers: { Authorization: `Bearer ${token}` },
              data: {
                wishlistId: defaultWishlistId,
                productId: productId,
              },
            }
          );

          if (response.status === 200) {
            decrementWishlist();
            setIsWishlisted((prev) => prev.filter((id) => id !== productId));
            Toastify({
              text: "Removed from wishlist",
              duration: 3000,
              gravity: "top",
              position: "right",
              close: true,
              style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
              },
            }).showToast();
          }
        } catch (error) {
          Toastify({
            text: "Failed to remove from wishlist",
            duration: 4000,
            gravity: "top",
            position: "right",
            close: true,
            style: {
              background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            },
          }).showToast();
        }
      } else {
        // Add to wishlist
        if (!defaultWishlistId) {
          Toastify({
            text: "No wishlist found. Please create a wishlist first.",
            duration: 4000,
            gravity: "top",
            position: "right",
            close: true,
            style: {
              background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            },
          }).showToast();
          return;
        }

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/add`,
            {
              wishlistId: defaultWishlistId,
              productId: productId,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 200) {
            incrementWishlist();
            setIsWishlisted((prev) => [...prev, productId]);
            Toastify({
              text: "Added to wishlist",
              duration: 3000,
              gravity: "top",
              position: "right",
              close: true,
              style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
              },
            }).showToast();
          }
        } catch (error) {
          Toastify({
            text: "Failed to add to wishlist",
            duration: 4000,
            gravity: "top",
            position: "right",
            close: true,
            style: {
              background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            },
          }).showToast();
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Toastify({
          text: "Please log in to add items to your cart",
          duration: 4000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
        }).showToast();
        return;
      }

      if (!productId) {
        Toastify({
          text: "Invalid product data",
          duration: 4000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
        }).showToast();
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/cart/add`,
        {
          productId: productId,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        incrementCart();
        Toastify({
          text: "Added to cart",
          duration: 3000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Toastify({
        text: "Failed to add to cart",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 mx-1 my-1 flex-shrink-0 w-[calc(50%-8px)] sm:w-[280px] sm:mx-2 sm:my-2">
      {/* Product Image Container */}
      <div className="relative h-40 sm:h-52 bg-gray-50 cursor-pointer">
        <div
          onClick={handleProductClick}
          className="w-full h-full"
        >
          <Image
            src={product.images?.[0]?.url || Dummy1}
            alt={product.name || "Product image"}
            fill
            sizes="(max-width: 640px) 50vw, 280px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            unoptimized
            onError={(e) => {
              e.target.src = Dummy1.src;
            }}
          />
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          disabled={isLoading}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group/wishlist ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={
            isProductWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <FaHeart
            className={`text-xs sm:text-sm transition-colors ${
              isProductWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-600 group-hover/wishlist:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-5">
        <h3
          onClick={handleProductClick}
          className="text-gray-800 font-semibold text-sm sm:text-[15px] mb-2 sm:mb-3 line-clamp-2 leading-tight min-h-[2.8rem] cursor-pointer hover:text-blue-600 transition-colors"
        >
          {product.name}
        </h3>

        {/* Price Section - FIXED with proper formatting */}
        <div className="flex items-baseline gap-1 sm:gap-2 mb-3 sm:mb-4">
          {product.salePrice ? (
            <>
              <p className="text-base sm:text-lg font-bold text-gray-900">
                {getSalePrice()}
              </p>
              {product.regularPrice && product.regularPrice > product.salePrice && (
                <p className="text-xs sm:text-sm text-gray-500 line-through">
                  {getRegularPrice()}
                </p>
              )}
            </>
          ) : (
            <p className="text-base sm:text-lg font-bold text-gray-900">
              {getRegularPrice()}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={addToCart}
          className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#0061b0ee] hover:to-[#1e518e] text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 hover:shadow-lg active:scale-95 group/cart"
        >
          <FaShoppingCart className="text-xs sm:text-sm group-hover/cart:scale-110 transition-transform" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

// Scrollable Products Container Component
const ScrollableProductsContainer = ({
  title,
  description,
  products,
  loading,
  error,
}) => {
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 200 : 300;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 200 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    
    const handleScroll = () => {
      checkScrollButtons();
      // Throttle scroll events for performance
      if (container) {
        container.requestAnimationFrame = container.requestAnimationFrame || setTimeout;
        container.requestAnimationFrame(checkScrollButtons);
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      // Check on resize
      window.addEventListener("resize", checkScrollButtons, { passive: true });
      
      return () => {
        container.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [products]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gray-50/80 py-6 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              {title}
            </h2>
            <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Loading {title.toLowerCase()}...
            </p>
          </div>
          <div className="flex gap-2 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide px-2 sm:px-0">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-3 sm:p-5 animate-pulse flex-shrink-0 w-[calc(50%-4px)] sm:w-[280px]"
              >
                <div className="h-32 sm:h-52 bg-gray-200 rounded-lg mb-3 sm:mb-4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1.5 sm:mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2 sm:mb-3"></div>
                <div className="h-7 sm:h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-50/80 py-6 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-lg mb-4 sm:mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no products
  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-50/80 py-6 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-lg">
            No {title.toLowerCase()} found at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/80 py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-2 sm:px-0">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            {title}
          </h2>
          <p className="text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
        </p>
        </div>

        {/* Products Container with Scroll Arrows */}
        <div className="relative">
          {/* Left Arrow - Mobile optimized */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 -translate-x-1/2 hover:scale-110 sm:block"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-700 text-sm sm:text-base" />
            </button>
          )}

          {/* Scrollable Products */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-2 sm:gap-6 pb-4 sm:pb-6 scrollbar-hide scroll-smooth px-1 sm:px-0"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {products.map((product, index) => (
              <ProductCard key={product._id ?? index} product={product} />
            ))}
          </div>

          {/* Right Arrow - Mobile optimized */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 translate-x-1/2 hover:scale-110 sm:block"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-gray-700 text-sm sm:text-base" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Similar Products Component
const SimilarProduct = ({ productId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [youMayAlsoLikeProducts, setYouMayAlsoLikeProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [youMayAlsoLikeLoading, setYouMayAlsoLikeLoading] = useState(true);
  const [similarError, setSimilarError] = useState(null);
  const [youMayAlsoLikeError, setYouMayAlsoLikeError] = useState(null);

  // Fetch similar products
  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!productId) {
        setSimilarLoading(false);
        return;
      }

      try {
        setSimilarLoading(true);
        setSimilarError(null);

        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/${productId}/similar`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (response.data?.success) {
          const products =
            response.data.products || response.data.similarProducts || [];
          setSimilarProducts(products);
        } else {
          setSimilarProducts([]);
        }
      } catch (err) {
        console.error("Error fetching similar products:", err);
        setSimilarError("Failed to load similar products");
        setSimilarProducts([]);
      } finally {
        setSimilarLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [productId]);

  // Fetch "You May Also Like" products
  useEffect(() => {
    const fetchYouMayAlsoLikeProducts = async () => {
      if (!productId) {
        setYouMayAlsoLikeLoading(false);
        return;
      }

      try {
        setYouMayAlsoLikeLoading(true);
        setYouMayAlsoLikeError(null);

        const token = localStorage.getItem("accessToken");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/${productId}/you-may-also-like`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        if (response.data?.success) {
          const products =
            response.data.products || response.data.youMayAlsoLike || [];
          setYouMayAlsoLikeProducts(products);
        } else {
          setYouMayAlsoLikeProducts([]);
        }
      } catch (err) {
        console.error("Error fetching you may also like products:", err);
        setYouMayAlsoLikeError("Failed to load recommended products");
        setYouMayAlsoLikeProducts([]);
      } finally {
        setYouMayAlsoLikeLoading(false);
      }
    };

    fetchYouMayAlsoLikeProducts();
  }, [productId]);

  return (
    <>
      {/* Similar Products Section */}
      <ScrollableProductsContainer
        title="Similar Products"
        description="Discover more premium products that match your style"
        products={similarProducts}
        loading={similarLoading}
        error={similarError}
      />

      {/* You May Also Like Section */}
      <ScrollableProductsContainer
        title="You May Also Like"
        description="Explore these carefully selected products that complement your taste"
        products={youMayAlsoLikeProducts}
        loading={youMayAlsoLikeLoading}
        error={youMayAlsoLikeError}
      />
    </>
  );
};

export default SimilarProduct;