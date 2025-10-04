"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import newCurrency from "../../assets/newSymbole.png";
import { useCurrency } from "@/app/CurrencyContext";

// Wishlist icon component with filled and outline states
const WishlistIcon = ({ isWishlisted, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-1 xs:top-2 sm:top-3 left-1 xs:left-2 sm:left-3 bg-white rounded-full p-1.5 xs:p-2 shadow-md hover:shadow-lg transition-all duration-200 ${
        isWishlisted
          ? "text-red-500 hover:text-red-600"
          : "text-gray-600 hover:text-red-500"
      } ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <FiHeart
        className={`w-3 h-3 xs:w-4 xs:h-4 ${
          isWishlisted ? "fill-current" : ""
        }`}
      />
    </button>
  );
};

// Badge component
const ProductBadge = ({ badge }) => {
  return (
    <div className="absolute top-1 xs:top-2 sm:top-3 right-1 xs:right-2 sm:right-3 bg-gradient-to-r from-[#b58e5f] to-[#8b6b4a] text-white text-[8px] xs:text-[10px] tracking-wide font-semibold px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-0.5 sm:py-1 rounded-full shadow-sm sm:shadow-md">
      {badge}
    </div>
  );
};

// Price display component
const PriceDisplay = ({ price, mrp }) => {
  const { currency, rate } = useCurrency();

  const formatPrice = (value) => {
    if (!value) return null;
    const converted = (
      parseFloat(value.toString().replace(/,/g, "")) * rate
    ).toFixed(2);
    return converted;
  };

  return (
    <div className="mt-1 xs:mt-1.5 sm:mt-2 flex justify-between items-center">
      {price ? (
        <span className="text-xs xs:text-sm md:text-base font-bold text-[#1a1a1a] flex items-center gap-1">
          <Image
            src={newCurrency}
            alt={currency}
            width={14}
            height={14}
            className="inline-block"
          />
          {formatPrice(price)}
          {currency}
        </span>
      ) : (
        <span className="text-xs text-gray-500">Price not available</span>
      )}

      {mrp && (
        <span className="text-[10px] xs:text-xs text-gray-500 line-through flex items-center gap-1">
          <Image
            src={newCurrency}
            alt={currency}
            width={12}
            height={12}
            className="inline-block"
          />
          {formatPrice(mrp)}
        </span>
      )}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const imageUrl = product?.images?.[0]?.url;
  const router = useRouter();
  const { currency, rate } = useCurrency();
  const [isWishlisted, setIsWishlisted] = useState(
    product.isWishlisted || false
  );
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's wishlists
  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        setIsLoading(true);
        const res = await axios.get(
          "http://localhost:9000/api/products/wishlists",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Correct way to access response data
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

    // Fetch wishlists when component mounts
    fetchWishlists();
  }, []);

  const handleViewDetails = () => {
    console.log("Navigating to product:", product);
    router.push(`/ProductDetailPage/${product._id}`);
  };

  // Toggle Wishlist (Add/Remove)
  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to manage wishlist");
        return;
      }

      if (!defaultWishlistId) {
        toast.error("No wishlist available");
        return;
      }

      setIsLoading(true);

      if (isWishlisted) {
        // ✅ Remove from wishlist API call
        const response = await axios.delete(
          "http://localhost:9000/api/products/wishlist/remove",
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

        if (response.status === 200) {
          setIsWishlisted(false);
          // toast.success("Removed from wishlist!");
        }
      } else {
        // ✅ Add to wishlist API call
        const response = await axios.post(
          "http://localhost:9000/api/products/wishlist/add",
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

        if (response.status === 200) {
          setIsWishlisted(true);
          toast.success("Added to wishlist!");
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="group bg-white rounded-md sm:rounded-lg overflow-hidden shadow-sm sm:shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5 xs:hover:-translate-y-1 relative">
      <div className="relative w-full pb-[100%] sm:pb-[90%] md:pb-[85%] lg:pb-[80%] xl:pb-[76%] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product?.name || "Product image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute top-0 left-0 w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            priority={false}
          />
        ) : (
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeJQeJyzgAzTEVqXiGe90RGBFhfp_4RcJJMQ&s"
            alt="No image available"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute top-0 left-0 w-full h-full object-cover object-center"
            priority={false}
          />
        )}

        {/* Wishlist Icon */}
        <WishlistIcon
          isWishlisted={isWishlisted}
          onClick={handleToggleWishlist}
          className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
        />

        {product.badge && <ProductBadge badge={product.badge} />}
      </div>

      <div className="p-2 xs:p-3 sm:p-3 md:p-4">
        <h3 className="text-xs xs:text-sm md:text-base font-semibold text-[#1a1a1a] mt-0.5 xs:mt-1 line-clamp-2 min-h-[2.5rem] xs:min-h-[3rem]">
          {product.name}
        </h3>

        <PriceDisplay price={product.salePrice} mrp={product.regularPrice} />

        <div className="flex gap-2 mt-2 xs:mt-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 text-white bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] py-1.5 xs:py-2 rounded text-xs xs:text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b6b4a] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`View details for ${product.name}`}
            disabled={isLoading}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
