"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { FiHeart, FiClock, FiBell, FiStar } from "react-icons/fi";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useCurrency } from "@/app/CurrencyContext";
import { GlobalContext } from "@/components/shared/context/GlobalContext";

// Wishlist icon component
const WishlistIcon = ({
  isWishlisted,
  onClick,
  className = "",
  isSoldOut = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-2 left-2 rounded-full p-1.5 shadow-md hover:shadow-lg transition-all duration-200 ${
        isSoldOut
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : isWishlisted
          ? "bg-white text-red-500 hover:text-red-600"
          : "bg-white text-gray-600 hover:text-red-500"
      } ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      disabled={isSoldOut && !isWishlisted}
    >
      <FiHeart
        className={`w-3 h-3 ${isWishlisted ? "fill-current" : ""}`}
      />
    </button>
  );
};

// Product Badge component
const ProductBadge = ({ badge }) => {
  if (!badge) return null;

  return (
    <div className="absolute top-2 right-2">
      <span className="inline-block bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full">
        {badge}
      </span>
    </div>
  );
};

// Rating component
const RatingDisplay = ({ rating }) => {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1 mt-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(rating)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-600">({rating})</span>
    </div>
  );
};

// Price display component
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
      <div className="flex items-center gap-2">
        {price ? (
          <span className="text-lg font-bold text-[#1a1a1a]">
            {currency}
            {formatPrice(price)}
          </span>
        ) : (
          <span className="text-sm text-gray-500">Price not available</span>
        )}

        {mrp && (
          <span className="text-sm text-gray-500 line-through">
            {currency}
            {formatPrice(mrp)}
          </span>
        )}
      </div>
      
      {discount && (
        <div className="flex items-center gap-2 mt-1">
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

// Stock status indicator
const StockStatus = ({ isSoldOut, stockQuantity }) => {
  if (isSoldOut) {
    return (
      <div className="flex items-center justify-center gap-1 mt-2 px-3 py-1.5 bg-red-50 rounded-lg border border-red-200">
        <FiClock className="w-3 h-3 text-red-500" />
        <span className="text-xs text-red-600 font-medium">Out of Stock</span>
      </div>
    );
  }

  if (stockQuantity && stockQuantity < 10) {
    return (
      <div className="flex items-center justify-center gap-1 mt-2 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-200">
        <span className="text-xs text-orange-600 font-medium">
          Only {stockQuantity} left!
        </span>
      </div>
    );
  }

  return null;
};

const ProductCard = ({ product }) => {
  const { decrementWishlist, incrementWishlist, user } =
    useContext(GlobalContext);
  const imageUrl = product?.images?.[0]?.url;
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

  // Check if product is sold out
  const isSoldOut = product.stockQuantity === 0;

  // Calculate discount percentage
  const discountPercentage = product.regularPrice && product.salePrice 
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : null;

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
          setDefaultWishlistId(defaultWishlist._id || defaultWishlist.id);
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

  // Handle click on product card (image, name, price, etc.)
  const handleProductClick = () => {
    console.log("Navigating to product:", product);
    router.push(`/ProductDetailPage/${product._id}`);
  };

  // Handle view details button click
  const handleViewDetails = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleProductClick();
  };

  // Subscribe to restock notifications
  const handleRestockSubscribe = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Toastify({
          text: "Please login to get restock notifications",
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

      if (!email) {
        Toastify({
          text: "Please enter your email address",
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

      setIsSubscribing(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/restock-notifications/subscribe`,
        {
          productId: product._id,
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
          gravity: "top",
          position: "right",
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
        gravity: "top",
        position: "right",
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
    setShowRestockModal(true);
  };

  // Toggle Wishlist (Add/Remove)
  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSoldOut && !isWishlisted) {
      Toastify({
        text: "Cannot add sold out product to wishlist",
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
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Toastify({
          text: "Please login to manage wishlist",
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

      if (!defaultWishlistId) {
        Toastify({
          text: "No wishlist available",
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

      setIsLoading(true);

      if (isWishlisted) {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/remove`,
          {
            data: {
              wishlistId: defaultWishlistId,
              productId: product._id,
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
            productId: product._id,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300 transform hover:-translate-y-1 relative border border-gray-100 ${
          isSoldOut ? "opacity-80" : ""
        }`}
      >
        {/* Sponsored Badge */}
        {product.sponsored && (
          <div className="absolute top-0 left-0 z-10 bg-blue-600 text-white text-xs px-2 py-1 rounded-br-lg">
            Sponsored
          </div>
        )}

        {/* Clickable Image Container */}
        <div
          className="relative w-full pb-[100%] overflow-hidden cursor-pointer bg-gray-50"
          onClick={handleProductClick}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={product?.name || "Product image"}
              unoptimized
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
              className={`absolute top-0 left-0 w-full h-full object-cover object-center transition duration-500 ${
                isSoldOut ? "grayscale opacity-70" : "group-hover:scale-105"
              }`}
              priority={false}
            />
          )}

          {/* Wishlist Icon */}
          <WishlistIcon
            isWishlisted={isWishlisted}
            onClick={handleToggleWishlist}
            isSoldOut={isSoldOut}
            className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
          />

          {/* Show regular badge only if product is not sold out and has a badge */}
          {!isSoldOut && product.badge && (
            <ProductBadge badge={product.badge} />
          )}
        </div>

        {/* Clickable Content Area */}
        <div
          className="p-4 cursor-pointer"
          onClick={handleProductClick}
        >
          {/* Brand Name */}
          {product.brand && (
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {product.brand}
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-[#1a1a1a] line-clamp-2 min-h-[2.5rem] mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <RatingDisplay rating={product.rating} />

          {/* Price Display */}
          <PriceDisplay
            price={product.salePrice}
            mrp={product.regularPrice}
            discount={discountPercentage}
            isSoldOut={isSoldOut}
          />

          {/* Assured Badge */}
          {product.assured && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-0.5 rounded">
                💬 Assured
              </span>
            </div>
          )}

          {/* Stock Status */}
          <StockStatus
            isSoldOut={isSoldOut}
            stockQuantity={product.stockQuantity}
          />

          {/* Bank Offer */}
          {product.bankOffer && (
            <div className="mt-2 text-xs text-green-600 font-medium">
              {product.bankOffer}
            </div>
          )}
        </div>

        {/* Buttons Section - Not clickable for navigation */}
        <div className="px-4 pb-4">
          <div className="flex gap-2">
            {isSoldOut ? (
              <button
                onClick={handleRestockNotify}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded text-sm transition-colors duration-200 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center gap-1"
                aria-label={`Notify when ${product.name} is back in stock`}
              >
                <FiBell className="w-4 h-4" />
                Notify Me
              </button>
            ) : (
              <button
                onClick={handleViewDetails}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded text-sm transition-colors duration-200 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`View details for ${product.name}`}
                disabled={isLoading}
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Restock Notification Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Get Restock Notification
            </h3>
            <p className="text-gray-600 mb-4">
              We'll send you an email when <strong>{product.name}</strong> is
              back in stock.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubscribing}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRestockModal(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isSubscribing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestockSubscribe}
                  disabled={isSubscribing}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? "Subscribing..." : "Notify Me"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;