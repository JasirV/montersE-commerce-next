"use client";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import {
  FiHeart,
  FiBell,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useCurrency } from "@/app/CurrencyContext";
import { GlobalContext } from "@/components/shared/context/GlobalContext";

// Mobile Optimized Wishlist Icon
const WishlistIcon = ({
  isWishlisted,
  onClick,
  className = "",
  isSoldOut = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-2 left-2 rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 z-30 ${
        isSoldOut
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : isWishlisted
          ? "bg-white text-red-500 hover:text-red-600"
          : "bg-white text-gray-600 hover:text-red-500"
      } ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      disabled={isSoldOut && !isWishlisted}
    >
      <FiHeart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
    </button>
  );
};

// Mobile Optimized Product Badge
const ProductBadge = ({ badge }) => {
  if (!badge) return null;

  return (
    <div className="absolute top-2 right-2 z-30">
      <span className="inline-block bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full">
        {badge}
      </span>
    </div>
  );
};

// Mobile Optimized Rating
const RatingDisplay = ({ rating, isSoldOut = false }) => {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(rating)
                ? isSoldOut
                  ? "text-gray-300"
                  : "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span
        className={`text-xs ${isSoldOut ? "text-gray-400" : "text-gray-600"}`}
      >
        ({rating})
      </span>
    </div>
  );
};

// Mobile Optimized Price Display
const PriceDisplay = ({ price, mrp, discount, isSoldOut = false }) => {
  const { currency, rate } = useCurrency();

  const formatPrice = (value) => {
    if (!value) return null;
    const converted = (
      parseFloat(value.toString().replace(/,/g, "")) * rate
    ).toFixed(2);
    return converted;
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 flex-wrap">
        {price ? (
          <span
            className={`text-lg font-bold ${
              isSoldOut ? "text-gray-500" : "text-[#1a1a1a]"
            }`}
          >
            {currency}
            {formatPrice(price)}
          </span>
        ) : (
          <span
            className={`text-sm ${
              isSoldOut ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Price not available
          </span>
        )}

        {mrp && (
          <span
            className={`text-sm line-through ${
              isSoldOut ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {currency}
            {formatPrice(mrp)}
          </span>
        )}
      </div>

      {discount && !isSoldOut && (
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
            {discount}% off
          </span>
          {mrp && price && (
            <span className="text-xs text-gray-500">
              You save {currency}
              {formatPrice(parseFloat(mrp) - parseFloat(price))}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Mobile Optimized Image Slider - No Auto Play
const ImageSlider = ({ images, productName, isSoldOut, onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Minimum swipe distance for mobile
  const minSwipeDistance = 30;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePrev = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  if (!images || images.length === 0) {
    return (
      <div
        className={`relative w-full pb-[100%] flex items-center justify-center cursor-pointer ${
          isSoldOut ? "bg-gray-50" : "bg-gray-100"
        }`}
        onClick={onImageClick}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-sm ${
              isSoldOut ? "text-gray-400" : "text-gray-400"
            }`}
          >
            No Image
          </span>
        </div>
        {isSoldOut && (
          <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center z-20">
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600 tracking-wide">
                SOLD OUT
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full pb-[100%] overflow-hidden cursor-pointer group ${
        isSoldOut ? "bg-gray-50" : "bg-gray-50"
      }`}
      onClick={onImageClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Slider Container */}
      <div
        className="absolute top-0 left-0 w-full h-full flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {images.map((img, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <Image
              src={img}
              alt={`${productName} - Image ${index + 1}`}
              fill
              className={`object-cover object-center transition-all duration-300 ${
                isSoldOut ? "filter brightness-105 opacity-90" : ""
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
      {isSoldOut && (
        <div className="absolute inset-0 bg-white/35 flex items-center justify-center z-20">
          <span className="text-red-700 text-[16px] font-medium tracking-wide">
            SOLD OUT
          </span>
        </div>
      )}

      {/* Navigation Arrows - Show only on hover for both desktop and mobile */}
      {images.length > 1 && !isSoldOut && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all duration-200 z-20 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Previous image"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 transition-all duration-200 z-20 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Next image"
          >
            <FiChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dot Indicators - Always visible */}
      {images.length > 1 && !isSoldOut && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white bg-opacity-50 hover:bg-opacity-70"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  // EARLY VALIDATION - Check if product data is valid
  if (!product || (!product.id && !product._id)) {
    console.warn("Invalid product data received:", product);
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-4 text-center h-full flex items-center justify-center">
        <div className="text-gray-400 text-sm">Product unavailable</div>
      </div>
    );
  }

  // Get product ID from either id or _id field
  const productId = product.id || product._id;
  
  const { decrementWishlist, incrementWishlist, user } =
    useContext(GlobalContext);
  const router = useRouter();
  const { currency, rate } = useCurrency();
  const [isWishlisted, setIsWishlisted] = useState(
    product.isWishlisted || false
  );
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Prepare images array
  const images = useCallback(() => {
    if (product?.images?.length > 0) {
      return product.images.map((img) => img.url || img);
    }
    return ["/placeholder-image.jpg"];
  }, [product?.images]);

  // Check if product is sold out
  const isSoldOut = product.stockQuantity === 0;

  // Calculate discount percentage
  const discountPercentage =
    product.regularPrice && product.salePrice
      ? Math.round(
          ((product.regularPrice - product.salePrice) / product.regularPrice) *
            100
        )
      : null;

  // Check if product is a bag (category check)
  const isBagCategory = () => {
    // Check multiple ways a product might be categorized as a bag
    if (product.leatherMainCategory?.toLowerCase().includes('bag')) return true;
    if (product.subCategory?.toLowerCase().includes('bag')) return true;
    if (product.category?.toLowerCase().includes('leather')) return true;
    if (product.material?.toLowerCase().includes('leather')) return true;
    if (product.name?.toLowerCase().includes('bag')) return true;
    
    return false;
  };

  // Fetch user's wishlists
  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found");
          return;
        }

        setIsLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/wishlists`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data && res.data.wishlists?.length > 0) {
          const defaultWishlist =
            res.data.wishlists.find((w) => w.isDefault) ||
            res.data.wishlists[0];
          setDefaultWishlistId(defaultWishlist.id || defaultWishlist._id);
        } else {
          console.log("No wishlists found or empty response");
          setDefaultWishlistId(null);
        }
      } catch (error) {
        console.error("Error fetching wishlists:", error);
        setDefaultWishlistId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlists();
  }, []);

  // Set user email if available
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Handle click on product card
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

    if (isBagCategory()) {
      // Route to LeatherBagsDetails for bags
      router.push(`/LeatherBagsDetails/${productId}`);
    } else {
      // Route to regular ProductDetailPage for other products
      router.push(`/ProductDetailPage/${productId}`);
    }
  };

  // Handle view details button click
  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!productId) {
      Toastify({
        text: "Cannot view details - product information is incomplete",
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
    
    handleProductClick();
  };

  // Subscribe to restock notifications
  const handleRestockSubscribe = async () => {
    // Check if product ID exists
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

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Toastify({
          text: "Please login to get restock notifications",
          duration: 4000,
          gravity: "bottom",
          position: "center",
          close: true,
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
        }).showToast();
        return;
      }

      if (!email) {
        Toastify({
          text: "Please enter your email address",
          duration: 4000,
          gravity: "bottom",
          position: "center",
          close: true,
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
        }).showToast();
        return;
      }

      setIsSubscribing(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/restock-notifications/subscribe`,
        {
          productId: productId,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setShowRestockModal(false);
        Toastify({
          text:
            response.data.message ||
            "Successfully subscribed for restock notifications!",
          duration: 4000,
          gravity: "bottom",
          position: "center",
          close: true,
          style: {
            background: "linear-gradient(to right, #059669, #047857)",
          },
        }).showToast();
      } else {
        throw new Error(response.data.message || "Subscription failed");
      }
    } catch (error) {
      console.error("Restock subscription error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to subscribe for notifications";

      Toastify({
        text: errorMessage,
        duration: 4000,
        gravity: "bottom",
        position: "center",
        close: true,
        style: {
          background: "linear-gradient(to right, #dc2626, #b91c1c)",
        },
      }).showToast();
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle restock notification button click
  const handleRestockNotify = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if product ID exists
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
    
    setShowRestockModal(true);
  };

  // Toggle Wishlist
  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if product ID exists
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

    if (isSoldOut && !isWishlisted) {
      Toastify({
        text: "Cannot add sold out product to wishlist",
        duration: 4000,
        gravity: "bottom",
        position: "center",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Toastify({
          text: "Please login to manage wishlist",
          duration: 4000,
          gravity: "bottom",
          position: "center",
          close: true,
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
        }).showToast();
        return;
      }

      if (!defaultWishlistId) {
        Toastify({
          text: "No wishlist available",
          duration: 4000,
          gravity: "bottom",
          position: "center",
          close: true,
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
        }).showToast();
        return;
      }

      setIsLoading(true);

      if (isWishlisted) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/remove`,
          {
            data: {
              wishlistId: defaultWishlistId,
              productId: productId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        decrementWishlist();

        if (response.status === 200) {
          setIsWishlisted(false);
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/wishlist/add`,
          {
            wishlistId: defaultWishlistId,
            productId: productId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        incrementWishlist();
        if (response.status === 200) {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.log("Error toggling wishlist:", error);
      Toastify({
        text: "Failed to update wishlist",
        duration: 3000,
        gravity: "bottom",
        position: "center",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative border border-gray-100 w-full h-full flex flex-col ${
          isSoldOut ? "opacity-90 bg-gray-50" : ""
        }`}
      >
        {/* Sponsored Badge */}
        {product.sponsored && (
          <div
            className={`absolute top-0 left-0 z-30 text-white text-xs px-2 py-1 rounded-br-xl ${
              isSoldOut ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            Sponsored
          </div>
        )}

        {/* Image Container - Fixed 1:1 Aspect Ratio */}
        <div className="relative flex-shrink-0">
          <ImageSlider
            images={images()}
            productName={product.name || "Product"}
            isSoldOut={isSoldOut}
            onImageClick={handleProductClick}
          />

          {/* Wishlist Icon */}
          <WishlistIcon
            isWishlisted={isWishlisted}
            onClick={handleToggleWishlist}
            isSoldOut={isSoldOut}
            className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
          />

          {/* Product Badge - Hidden for sold out items */}
          {!isSoldOut && product.badge && (
            <ProductBadge badge={product.badge} />
          )}
        </div>

        {/* Content Area - Flexible */}
        <div
          className="flex-1 p-4 cursor-pointer flex flex-col justify-between"
          onClick={handleProductClick}
        >
          <div className="flex-1">
            {/* Brand */}
            {product.brand && (
              <div
                className={`text-xs font-medium uppercase tracking-wide mb-1 line-clamp-1 ${
                  isSoldOut ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {product.brand}
              </div>
            )}

            {/* Product Name */}
            <h3
              className={`text-sm font-semibold line-clamp-2 min-h-[2.5rem] mb-2 leading-tight ${
                isSoldOut ? "text-gray-500" : "text-[#1a1a1a]"
              }`}
            >
              {product.name || "Unnamed Product"}
            </h3>

            {/* Rating */}
            <RatingDisplay rating={product.rating} isSoldOut={isSoldOut} />

            {/* Price */}
            <PriceDisplay
              price={product.salePrice}
              mrp={product.regularPrice}
              discount={discountPercentage}
              isSoldOut={isSoldOut}
            />

            {/* Assured Badge */}
            {!isSoldOut && product.assured && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-1 rounded">
                  💬 Assured
                </span>
              </div>
            )}

            {/* Bank Offer */}
            {!isSoldOut && product.bankOffer && (
              <div className="mt-2 text-xs text-green-600 font-medium line-clamp-1">
                {product.bankOffer}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Buttons - Fixed Height */}
        <div className="flex-shrink-0 px-4 pb-4">
          <div className="flex gap-2">
            {isSoldOut ? (
              <button
                onClick={handleRestockNotify}
                className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
              >
                <FiBell className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Notify Me</span>
              </button>
            ) : (
              <button
                onClick={handleViewDetails}
                className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-2.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                disabled={isLoading}
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Optimized Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4 md:items-center">
          <div className="bg-white rounded-t-2xl rounded-b-none w-full max-w-md mx-auto shadow-2xl md:rounded-2xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                Get Restock Notification
              </h3>
              <p className="text-gray-600 mb-4 text-sm text-center">
                We'll notify you when{" "}
                <strong className="text-blue-600">{product.name || "this product"}</strong> is
                back in stock.
              </p>

              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-sm"
                disabled={isSubscribing}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRestockModal(false)}
                  className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 font-medium text-sm"
                  disabled={isSubscribing}
                >
                  Cancel
                </button>

                <button
                  onClick={handleRestockSubscribe}
                  disabled={isSubscribing}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 font-medium text-sm"
                >
                  {isSubscribing ? "Subscribing..." : "Notify Me"}
                </button>
              </div>
            </div>

            {/* Safe area for mobile */}
            <div className="h-2 bg-transparent md:hidden"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;