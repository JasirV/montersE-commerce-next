"use client";

import Image from "next/image";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaHeart, FaShoppingCart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import axios from "axios";
import { GlobalContext } from "../shared/context/GlobalContext";
import Dummy1 from "../../assets/Accessory Deals.jpg";
import newCurrency from "../../assets/newSymbole.png";

// Single product card component
const ProductCard = ({ product }) => {
  const router = useRouter();
  const { decrementWishlist, incrementWishlist, incrementCart } = useContext(GlobalContext);
  const [isWishlisted, setIsWishlisted] = useState([]);
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is in wishlist
  const checkIsWishlisted = (productId) => {
    return isWishlisted.includes(productId);
  };

  // Fetch user's wishlists and check wishlist status
  const fetchWishlists = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        return;
      }

      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlists`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.wishlists?.length > 0) {
        const defaultWishlist =
          res.data.wishlists.find((w) => w.isDefault) || res.data.wishlists[0];
        setDefaultWishlistId(defaultWishlist._id || defaultWishlist.id);

        const allWishlistProductIds = res.data.wishlists.flatMap(
          (wishlist) =>
            wishlist.products?.map((product) => product._id || product) || []
        );

        setIsWishlisted(allWishlistProductIds);
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

  // Add/Remove from wishlist
  const toggleWishlist = async (product) => {
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

      const productId = product._id || product.productId?._id;
      if (!productId) {
        return;
      }

      const alreadyWishlisted = checkIsWishlisted(productId);

      if (alreadyWishlisted) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      Toastify({
        text: "Failed to update wishlist. Please try again.",
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

  const addToWishlist = async (product) => {
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

      const productId = product._id || product.productId?._id;

      if (!productId) {
        console.error("Product ID not found");
        return;
      }

      if (checkIsWishlisted(productId)) {
        Toastify({
          text: "Product is already in your wishlist.",
          duration: 3000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(to right, #2193b0, #6dd5ed)",
          },
        }).showToast();
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/add`,
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
        setIsWishlisted((prev) => [...prev, productId]);
        Toastify({
          text: "added to wishlist",
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
        text: "Failed to add to wishlist. Please try again.",
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

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            wishlistId: defaultWishlistId,
            productId: productId,
          },
        }
      );

      decrementWishlist();
      if (response.status === 200) {
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
        text: "Failed to remove from wishlist. Please try again.",
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

  const addToCart = async (product) => {
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

      const productId = product._id || product.productId?._id;
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      incrementCart();

      if (response.status === 200) {
        Toastify({
          text: " added to cart",
          duration: 3000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      } else {
        Toastify({
          text: "Failed to add to cart. Try again!",
          duration: 4000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
        }).showToast();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleProductClick = (product) => {
    const productId = product._id || product.productId?._id;
    if (productId) {
      router.push(`/ProductDetailPage/${productId}`);
    }
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  const productId = product._id || product.productId?._id;
  const isProductWishlisted = checkIsWishlisted(productId);

  const formatPrice = (price) => {
    return (
      <div className="flex items-center">
        <Image
          src={newCurrency}
          alt="Currency"
          className="w-4 h-4 mr-1.5"
        />
        <span className="text-xl font-bold text-gray-900">
          {price?.toLocaleString() || "0"}
        </span>
      </div>
    );
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 mx-2 my-2 flex-shrink-0 w-full max-w-[280px] sm:w-[280px]">
      {/* Product Image Container */}
      <div className="relative h-52 bg-gray-50 cursor-pointer">
        <div onClick={() => handleProductClick(product)} className="w-full h-full">
          <Image
            src={product.images?.[0]?.url || Dummy1}
            alt={product.name}
            unoptimized
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = Dummy1;
            }}
          />
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group/wishlist ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={
            isProductWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <FaHeart
            className={`text-sm transition-colors ${
              isProductWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-600 group-hover/wishlist:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 sm:p-5">
        <h3 
          onClick={() => handleProductClick(product)}
          className="text-gray-800 font-semibold text-[15px] mb-3 line-clamp-2 leading-tight min-h-[2.8rem] cursor-pointer hover:text-blue-600 transition-colors"
        >
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-4">
          {formatPrice(product.salePrice)}
          {product.regularPrice && product.regularPrice > product.salePrice && (
            <span className="text-sm text-gray-500 line-through ml-1">
              {formatPrice(product.regularPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#0061b0ee] hover:to-[#1e518e] text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg active:scale-95 group/cart"
        >
          <FaShoppingCart className="text-sm group-hover/cart:scale-110 transition-transform" />
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
  error
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
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [products]);

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gray-50/80 py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Loading {title.toLowerCase()}...
            </p>
          </div>
          <div className="flex gap-4 sm:gap-6 overflow-hidden justify-center sm:justify-start">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-4 sm:p-5 animate-pulse flex-shrink-0 w-[45%] sm:w-[280px]"
              >
                <div className="h-40 sm:h-52 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
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
      <div className="bg-gray-50/80 py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 text-base sm:text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="bg-gray-50/80 py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 text-base sm:text-lg">
            No {title.toLowerCase()} found at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/80 py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            {description}
          </p>
        </div>

        {/* Products Container with Scroll Arrows */}
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 -translate-x-1/2 hover:scale-110 hidden sm:block"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-700 text-base sm:text-lg" />
            </button>
          )}

          {/* Scrollable Products */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 sm:pb-6 scrollbar-hide scroll-smooth px-2 sm:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 translate-x-1/2 hover:scale-110 hidden sm:block"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-gray-700 text-base sm:text-lg" />
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
        console.log("No product ID provided for similar products");
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
          }
        );

        if (response.data.success) {
          const products = response.data.products || response.data.similarProducts || [];
          console.log("Similar products found:", products.length);
          setSimilarProducts(products);
        } else {
          console.log("Similar products API returned success: false");
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
        console.log("No product ID provided for you may also like products");
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
          }
        );

        if (response.data.success) {
          const products = response.data.products || response.data.youMayAlsoLike || [];
          console.log("You May Also Like products found:", products.length);
          setYouMayAlsoLikeProducts(products);
        } else {
          console.log("You May Also Like API returned success: false");
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
        description="Discover more premium products that match your exquisite style and preferences"
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