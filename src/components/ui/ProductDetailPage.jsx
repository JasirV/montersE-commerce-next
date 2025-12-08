"use client";
import React, {
  useState,
  useMemo,
  Suspense,
  useEffect,
  useContext,
  useRef,
} from "react";
import {
  FaHeart,
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
  FaHeadset,
  FaUndo,
  FaQuestionCircle,
  FaExchangeAlt,
  FaBoxOpen,
  FaThumbsDown,
  FaBell,
  FaRuler,
  FaPalette,
  FaCalendar,
  FaTag,
  FaCube,
  FaCheck,
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa6";
import { Package } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import newCurrency from "../../assets/newSymbole.png";
import Image from "next/image";

import { addToCart, fetchProduct } from "@/service/productService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import SimilarProduct from "./SimillarProduct";
import { GlobalContext } from "../shared/context/GlobalContext";
import axios from "axios";
import ProductDetails from "./ProductSpecification";
import ShopByCategory from "@/features/product/ShopeByCatgeory";

// Toastify configuration function
const showToast = (message, type = "success") => {
  const backgroundColor = type === "success" ? "#4CAF50" : 
                         type === "error" ? "#F44336" : 
                         type === "info" ? "#2196F3" : 
                         type === "warning" ? "#FF9800" : "#333";
  
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "right",
    backgroundColor: backgroundColor,
    stopOnFocus: true,
    className: "custom-toast",
    style: {
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "14px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
  }).showToast();
};

const ProductDetailPage = () => {
  const { incrementWishlist, decrementWishlist, incrementCart, user } =
    useContext(GlobalContext);
  const router = useRouter();
  const [product, setProducts] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();

  // Wishlist states
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Restock notification states
  const [showRestockInput, setShowRestockInput] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Image zoom states
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);

  // Check if product is sold out
  const isSoldOut = product?.stockQuantity === 0;


    // Add/Remove from wishlist API with login check
  const handleWishlistToggle = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showToast("Please login to add to wishlist", "info");
        router.push("/login");
        return;
      }

      if (!defaultWishlistId) {
        showToast("No default wishlist found", "error");
        return;
      }

      setWishlistLoading(true);

      if (isWishlisted) {
        // Remove from wishlist
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/remove`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: {
              wishlistId: defaultWishlistId,
              productId: product._id || id,
            },
          }
        );
        decrementWishlist();
        setIsWishlisted(false);
        showToast("Removed from wishlist", "success");
      } else {
        // Add to wishlist
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/add`,
          {
            wishlistId: defaultWishlistId,
            productId: product._id || id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        incrementWishlist();
        setIsWishlisted(true);
        showToast("Added to wishlist", "success");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      if (error.response?.status === 401) {
        showToast("Session expired. Please login again.", "error");
        router.push("/login");
      } else {
        showToast("Failed to update wishlist. Please try again.", "error");
      }
    } finally {
      setWishlistLoading(false);
    }
  };


  // Get product data from navigation state or fetch if needed
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchProduct({ id });
        setProducts(data || null);
        setSelectedImage(data?.images?.[0]?.url);
        console.log("Fetched product data:", data);
      } catch (err) {
        setError("Failed to load product details");
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProducts();
    }
  }, [id]);

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  // Memoize images array to prevent unnecessary re-renders
  const images = useMemo(() => product?.images || [], [product]);

  // Thumbnail navigation - Responsive layout
  const getVisibleThumbnails = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 4; // Mobile
      if (window.innerWidth < 1024) return 5; // Tablet
      return 4; // Desktop
    }
    return 4;
  };

  const [visibleThumbnails, setVisibleThumbnails] = useState(getVisibleThumbnails());

  useEffect(() => {
    const handleResize = () => {
      setVisibleThumbnails(getVisibleThumbnails());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxThumbnailIndex = Math.max(0, images.length - visibleThumbnails);

  const handleThumbnailNavigate = (direction) => {
    if (direction === "prev") {
      setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
    } else {
      setThumbnailStartIndex((prev) => Math.min(maxThumbnailIndex, prev + 1));
    }
  };

  const visibleImages = images.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + visibleThumbnails
  );

  // Fetch user's wishlists and check if product is in wishlist
  useEffect(() => {
    const fetchWishlistsAndCheckWishlist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.log("No token found - User not logged in");
          setIsWishlisted(false);
          return;
        }

        setWishlistLoading(true);

        // Fetch wishlists
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlists`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data && res.data.wishlists?.length > 0) {
          const defaultWishlist =
            res.data.wishlists.find((w) => w.isDefault) ||
            res.data.wishlists[0];
          setDefaultWishlistId(defaultWishlist._id || defaultWishlist.id);

          // Check if current product is in any wishlist
          const isProductInWishlist = res.data.wishlists.some((wishlist) =>
            wishlist.products?.some(
              (productItem) =>
                productItem._id === id || productItem.productId === id
            )
          );

          setIsWishlisted(isProductInWishlist);
        } else {
          console.log("No wishlists found or empty response");
          setDefaultWishlistId(null);
          setIsWishlisted(false);
        }
      } catch (error) {
        console.error("Error fetching wishlists:", error);
        setDefaultWishlistId(null);
        setIsWishlisted(false);
      } finally {
        setWishlistLoading(false);
      }
    };

    // Fetch wishlists when component mounts
    if (id) {
      fetchWishlistsAndCheckWishlist();
    }
  }, [id]);

  // Set user email if available
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Image Zoom Functions
  const handleImageClick = (e) => {
    if (window.innerWidth < 768) {
      // On mobile, open zoom modal
      setShowZoomModal(true);
    } else {
      // On desktop, toggle zoom
      if (!isZoomed) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setPosition({ x, y });
        setZoom(2);
        setIsZoomed(true);
      } else {
        resetZoom();
      }
    }
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  const handleWheel = (e) => {
    if (window.innerWidth >= 768) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const newZoom = Math.min(Math.max(zoom + delta, 1), 5);
      setZoom(newZoom);
      setIsZoomed(newZoom > 1);
    }
  };

  const handleTouchStart = (e) => {
    if (window.innerWidth < 768 && showZoomModal) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!touchStart || !showZoomModal) return;
    
    const touchCurrent = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    
    const deltaX = touchStart.x - touchCurrent.x;
    const deltaY = touchStart.y - touchCurrent.y;
    
    setPosition(prev => ({
      x: prev.x - deltaX / 2,
      y: prev.y - deltaY / 2,
    }));
    
    setTouchStart(touchCurrent);
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  // Pinch zoom for mobile
  const handleTouchPinch = (e) => {
    if (e.touches.length === 2 && showZoomModal) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      if (touchStart && touchStart.distance) {
        const scaleChange = distance / touchStart.distance;
        const newZoom = Math.min(Math.max(zoom * scaleChange, 1), 5);
        setZoom(newZoom);
      }
      
      setTouchStart({ distance });
    }
  };

  // Enhanced Handle share button click for mobile
  const handleShareClick = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      navigator
        .share({
          title: product?.name || "Premium Product",
          text: "Check out this amazing product!",
          url: window.location.href,
        })
        .then(() => {
          setShowShareOptions(false);
          showToast("Shared successfully!", "success");
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            setShowShareOptions(!showShareOptions);
          }
        });
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  // Handle social sharing
  const handleSocialShare = (platform) => {
    let shareUrl = "";
    const productUrl = encodeURIComponent(window.location.href);
    const productTitle = encodeURIComponent(
      product?.name || "Premium Product"
    );

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${productTitle}&url=${productUrl}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${productUrl}&description=${productTitle}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${productTitle} ${productUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
    setShowShareOptions(false);
    showToast(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`, "success");
  };

  // Handle image selection
  const handleImageSelect = (image) => {
    setSelectedImage(image.url || image);
    resetZoom();
  };

  // Subscribe to restock notifications
  const handleRestockSubscribe = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showToast("Please login to get restock notifications", "info");
        router.push("/login");
        return;
      }

      if (!email) {
        showToast("Please enter your email address", "error");
        return;
      }

      if (!product?._id) {
        showToast("Product information is missing", "error");
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

      if (
        response.data.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        setIsSubscribed(true);
        setShowRestockInput(false);
        showToast("You'll be notified when this product is back in stock!", "success");
      } else {
        throw new Error("Subscription failed");
      }
    } catch (error) {
      console.error("Restock subscription error:", error);
      let errorMessage = "Failed to subscribe for notifications";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          errorMessage;

        if (error.response.status === 409) {
          errorMessage =
            "You're already subscribed to notifications for this product";
          setIsSubscribed(true);
          showToast(errorMessage, "info");
        } else if (error.response.status === 401) {
          errorMessage = "Please login again";
          showToast(errorMessage, "error");
          router.push("/login");
        } else if (error.response.status === 404) {
          errorMessage = "Product not found";
          showToast(errorMessage, "error");
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
        showToast(errorMessage, "error");
      }

      showToast(errorMessage, "error");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleRestockUnsubscribe = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || !product?._id) return;

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/restock-notifications/unsubscribe`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            productId: product._id,
            email: user?.email || email,
          },
        }
      );

      if (response.data.success || response.status === 200) {
        setIsSubscribed(false);
        showToast("You've been unsubscribed from restock notifications", "success");
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      showToast("Failed to unsubscribe", "error");
    }
  };

  // Add to cart with login check
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showToast("Please login to add items to cart", "info");
        router.push("/login");
        return;
      }

      console.log(id, "id");
      await addToCart(token, id, 1);
      incrementCart();
      // store in localStorage for quick UI update
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ productId: id, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));

      setIsInCart(true);
      showToast("Added to cart successfully!", "success");
    } catch (error) {
      console.error("Add to cart failed:", error);
      showToast("Failed to add to cart. Please try again.", "error");
    }
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  // Buy now with login check
  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showToast("Please login to purchase", "info");
        router.push("/login");
        return;
      }

      if (!isInCart) {
        await addToCart(token, id, 1);
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ productId: id, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        setIsInCart(true);
      }

      router.push(`/checkout?productId=${id}&quantity=1`);
    } catch (error) {
      console.error("Buy now failed:", error);
      showToast("Unable to proceed to checkout. Please try again.", "error");
    }
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!product?.salePrice || !product?.regularPrice) return 0;
    return Math.round(
      ((product.regularPrice - product.salePrice) / product.regularPrice) * 100
    );
  };

  // Format price with commas
  const formatPrice = (price) => {
    if (!price) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Premium Card Style Restock Notification Input Component
  const RestockNotificationInput = () => (
    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-2xl border border-gray-100 mt-4 overflow-hidden transition-all duration-300">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <FaBell className="text-white text-base sm:text-lg" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base sm:text-lg">Restock Alert</h3>
            <p className="text-blue-100 text-xs sm:text-sm">Don't miss out when it's back!</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-6">
        <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">
          We'll instantly notify you at <strong className="text-gray-900">{email || 'your email'}</strong> when 
          <strong className="text-gray-900"> {product?.name}</strong> is available again.
        </p>
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your best email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all duration-200 bg-gray-50"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowRestockInput(false)}
                className="px-3 sm:px-4 py-2 sm:py-3 text-gray-600 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRestockSubscribe}
                disabled={isSubscribing || !email || !/\S+@\S+\.\S+/.test(email)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubscribing ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Subscribing
                  </>
                ) : (
                  <>
                    <FaBell className="text-white text-xs sm:text-sm" />
                    Notify Me
                  </>
                )}
              </button>
            </div>
          </div>
          
          {email && !/\S+@\S+\.\S+/.test(email) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2 text-red-700 text-xs sm:text-sm">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Please enter a valid email address
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1 text-xs">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No spam
            </span>
            <span className="flex items-center gap-1 text-xs">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Instant alert
            </span>
            <span className="flex items-center gap-1 text-xs">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              1-click stop
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Zoom Modal Component
  const ZoomModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-50">
        <button
          onClick={() => {
            setShowZoomModal(false);
            resetZoom();
          }}
          className="text-white text-lg p-2"
        >
          ✕
        </button>
        <div className="text-white text-sm">
          Pinch to zoom • Drag to pan
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(prev => Math.max(1, prev - 0.5))}
            className="text-white p-2 bg-black bg-opacity-50 rounded-full"
          >
            <FaSearchMinus />
          </button>
          <span className="text-white text-sm w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(5, prev + 0.5))}
            className="text-white p-2 bg-black bg-opacity-50 rounded-full"
          >
            <FaSearchPlus />
          </button>
          <button
            onClick={resetZoom}
            className="text-white p-2 bg-black bg-opacity-50 rounded-full"
          >
            <FaCompress />
          </button>
        </div>
      </div>

      {/* Image Container */}
      <div 
        className="flex-1 flex items-center justify-center overflow-hidden touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => {
          handleTouchMove(e);
          handleTouchPinch(e);
        }}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="relative"
          style={{
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
            transition: zoom === 1 ? 'transform 0.3s ease' : 'none',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <Image
            src={selectedImage || product.image || "/placeholder-image.jpg"}
            alt={product?.name || "Product Image"}
            unoptimized
            width={800}
            height={800}
            className="object-contain max-w-full max-h-[80vh]"
            priority
          />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="p-4 bg-black bg-opacity-50 overflow-x-auto">
          <div className="flex gap-2 justify-center min-w-max">
            {images.map((image, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImage(image.url || image);
                  resetZoom();
                }}
                className={`flex-shrink-0 border-2 rounded-lg transition-all duration-200 ${
                  selectedImage === (image.url || image)
                    ? "border-red-500 shadow-lg scale-105"
                    : "border-gray-600 hover:border-red-300"
                }`}
              >
                <Image
                  src={image.url || image}
                  alt={`Thumbnail ${idx + 1}`}
                  unoptimized
                  width={60}
                  height={60}
                  className="w-14 h-14 object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen py-3 sm:py-6 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-3 sm:p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {/* Image Section Skeleton */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full"></div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full"></div>
                </div>
                <div className="w-full h-60 sm:h-80 md:h-[400px] lg:h-[500px] bg-gray-300 rounded-lg"></div>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-300 rounded-md"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Content Section Skeleton */}
              <div className="space-y-4 sm:space-y-6">
                <div className="h-6 sm:h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 sm:h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-8 sm:h-12 bg-gray-300 rounded w-1/3"></div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="h-10 sm:h-12 bg-gray-300 rounded"></div>
                <div className="h-20 sm:h-24 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center py-3 sm:py-6 px-2 sm:px-4">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 text-center">
          <div className="text-red-500 text-4xl sm:text-5xl mb-4">⚠️</div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Product Not Available
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            The product you're looking for is currently unavailable.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {showZoomModal && <ZoomModal />}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-3 sm:py-4 px-2 sm:px-4">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          {/* Product Header */}
          <div className="border-b border-gray-100 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {product.name || "Premium Product"}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs sm:text-sm text-gray-500">{product.brand}</span>
                  {product.model && (
                    <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">• {product.model}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons - Top Right */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-colors ${
                    wishlistLoading ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {wishlistLoading ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                  ) : (
                    <FaHeart
                      size={16}
                      className={
                        isWishlisted
                          ? "text-red-500 fill-red-500"
                          : "text-gray-600"
                      }
                    />
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={handleShareClick}
                    className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <FaShareAlt size={16} className="text-gray-600" />
                  </button>

                  {showShareOptions && (
                    <>
                      {/* Mobile Full Screen Share Options */}
                      <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
                        <div className="bg-white w-full rounded-t-2xl animate-slide-up">
                          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">Share this product</h3>
                            <button 
                              onClick={() => setShowShareOptions(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 p-4">
                            {[
                              { platform: "facebook", icon: FaFacebookF, color: "text-blue-600", label: "Facebook" },
                              { platform: "twitter", icon: FaTwitter, color: "text-blue-400", label: "Twitter" },
                              { platform: "pinterest", icon: FaPinterest, color: "text-red-600", label: "Pinterest" },
                              { platform: "whatsapp", icon: FaWhatsapp, color: "text-green-500", label: "WhatsApp" },
                            ].map((item) => (
                              <button
                                key={item.platform}
                                onClick={() => handleSocialShare(item.platform)}
                                className="flex flex-col items-center gap-2 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                              >
                                <item.icon className={`text-2xl ${item.color}`} />
                                <span className="text-sm font-medium">{item.label}</span>
                              </button>
                            ))}
                          </div>
                          <div className="p-4 border-t border-gray-200">
                            <button
                              onClick={() => setShowShareOptions(false)}
                              className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Share Options */}
                      <div className="hidden sm:block absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl py-3 z-50 border border-gray-200">
                        <div className="flex flex-col">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">
                              Share this product
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2 p-3">
                            <button
                              onClick={() => handleSocialShare("facebook")}
                              className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <FaFacebookF className="text-blue-600 text-lg" />
                              <span>Facebook</span>
                            </button>
                            <button
                              onClick={() => handleSocialShare("twitter")}
                              className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <FaTwitter className="text-blue-400 text-lg" />
                              <span>Twitter</span>
                            </button>
                            <button
                              onClick={() => handleSocialShare("pinterest")}
                              className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <FaPinterest className="text-red-600 text-lg" />
                              <span>Pinterest</span>
                            </button>
                            <button
                              onClick={() => handleSocialShare("whatsapp")}
                              className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <FaWhatsapp className="text-green-500 text-lg" />
                              <span>WhatsApp</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-3 sm:p-4 md:p-6">
            {/* Left Column - Images */}
            <div className="relative">
              {/* Main Image Container with Zoom */}
              <div 
                ref={imageContainerRef}
                className={`relative w-full h-64 sm:h-72 md:h-80 lg:h-[400px] xl:h-[500px] bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-100 cursor-${window.innerWidth >= 768 ? (isZoomed ? 'zoom-out' : 'zoom-in') : 'pointer'}`}
                onClick={handleImageClick}
                onWheel={handleWheel}
                onMouseLeave={resetZoom}
              >
                <div
                  ref={imageRef}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`,
                    transformOrigin: `${position.x}% ${position.y}%`,
                    transition: zoom === 1 ? 'transform 0.3s ease' : 'none',
                  }}
                >
                  <Image
                    src={selectedImage || product.image || "/placeholder-image.jpg"}
                    alt={product.name || "Product Image"}
                    unoptimized
                    width={600}
                    height={600}
                    className="object-contain w-full h-full p-2 select-none"
                    priority
                    draggable="false"
                  />
                </div>

                {/* Zoom Controls for Desktop */}
                {window.innerWidth >= 768 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white bg-opacity-80 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoom(prev => Math.max(1, prev - 0.5));
                        setIsZoomed(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      disabled={zoom <= 1}
                    >
                      <FaSearchMinus className="text-gray-700" size={14} />
                    </button>
                    <span className="text-xs font-medium text-gray-700 min-w-[40px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoom(prev => Math.min(5, prev + 0.5));
                        setIsZoomed(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      disabled={zoom >= 5}
                    >
                      <FaSearchPlus className="text-gray-700" size={14} />
                    </button>
                    {isZoomed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetZoom();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-1"
                      >
                        <FaCompress className="text-gray-700" size={14} />
                      </button>
                    )}
                  </div>
                )}

                {/* Mobile Zoom Hint */}
                {window.innerWidth < 768 && (
                  <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                    Tap to zoom
                  </div>
                )}

                {/* Image Counter */}
                {images.length > 0 && (
                  <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {images.findIndex(
                      (img) => (img.url || img) === selectedImage
                    ) + 1}{" "}
                    / {images.length}
                  </div>
                )}
              </div>

              {/* Enhanced Thumbnails - Responsive */}
              {images.length > 0 && (
                <div className="mt-3 sm:mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-700">
                      More Views
                    </div>
                    {images.length > visibleThumbnails && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>
                          {thumbnailStartIndex + 1}-{Math.min(thumbnailStartIndex + visibleThumbnails, images.length)}
                        </span>
                        <span className="text-gray-400">|</span>
                        <span>Total: {images.length}</span>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    {/* Navigation Arrows */}
                    {images.length > visibleThumbnails && (
                      <>
                        <button
                          onClick={() => handleThumbnailNavigate("prev")}
                          disabled={thumbnailStartIndex === 0}
                          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-8 h-8 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center ${
                            thumbnailStartIndex === 0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <FaChevronLeft size={12} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleThumbnailNavigate("next")}
                          disabled={thumbnailStartIndex >= maxThumbnailIndex}
                          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-8 h-8 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center ${
                            thumbnailStartIndex >= maxThumbnailIndex
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <FaChevronRight size={12} className="text-gray-600" />
                        </button>
                      </>
                    )}

                    {/* Thumbnails Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2 sm:gap-3 px-8 sm:px-0">
                      {visibleImages.map((image, idx) => (
                        <div
                          key={thumbnailStartIndex + idx}
                          className={`relative aspect-square cursor-pointer rounded-lg sm:rounded-xl border-2 transition-all duration-200 overflow-hidden ${
                            selectedImage === (image.url || image)
                              ? "border-red-500 shadow-lg scale-105"
                              : "border-gray-200 hover:border-red-300"
                          }`}
                          onClick={() => handleImageSelect(image)}
                        >
                          <Image
                            src={image.url || image}
                            alt={`Thumbnail ${thumbnailStartIndex + idx + 1}`}
                            unoptimized
                            width={100}
                            height={100}
                            className="object-cover w-full h-full hover:scale-110 transition-transform duration-200"
                          />
                          {/* Active indicator */}
                          {selectedImage === (image.url || image) && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* View All Button for Mobile */}
                    {images.length > visibleThumbnails && window.innerWidth < 768 && (
                      <div className="text-center mt-3">
                        <button
                          onClick={() => {
                            // Scroll to see all thumbnails
                            const thumbnailsContainer = document.querySelector('.thumbnails-container');
                            if (thumbnailsContainer) {
                              thumbnailsContainer.scrollLeft = 0;
                            }
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View all {images.length} images
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* Price Section */}
              <div className={`rounded-lg sm:rounded-xl p-4 sm:p-6 border ${
                isSoldOut 
                  ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200" 
                  : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
              }`}>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${
                      isSoldOut ? "text-gray-600" : "text-gray-900"
                    }`}>
                      <Image
                        src={newCurrency}
                        alt="Currency"
                        width={24}
                        height={24}
                        className="mr-1 sm:mr-2 w-5 h-5 sm:w-7 sm:h-7"
                      />
                      {formatPrice(product.salePrice || product.sellingPrice) || "65,000"}
                    </div>
                    {product.regularPrice &&
                      product.regularPrice > (product.salePrice || product.sellingPrice) && (
                        <>
                          <div className="text-lg sm:text-xl text-gray-500 line-through flex items-center">
                            <Image
                              src={newCurrency}
                              alt="Currency"
                              width={18}
                              height={18}
                              className="mr-1 w-4 h-4 sm:w-5 sm:h-5"
                            />
                            {formatPrice(product.regularPrice)}
                          </div>
                          <span className="bg-green-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                            {calculateDiscount()}% OFF
                          </span>
                        </>
                      )}
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${
                        product.stockQuantity > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                    {product.stockQuantity > 0 && (
                      <span className="text-xs text-gray-500">
                        ({product.stockQuantity} available)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {product.stockQuantity > 0 ? (
                  <>
                    {isInCart ? (
                      <button
                        onClick={handleGoToCart}
                        className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:opacity-90 transition-opacity text-base sm:text-lg shadow-lg"
                      >
                        GO TO CART
                      </button>
                    ) : (
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:opacity-90 transition-opacity text-base sm:text-lg shadow-lg"
                      >
                        ADD TO CART
                      </button>
                    )}
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-orange-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-orange-700 transition-colors text-base sm:text-lg shadow-lg"
                    >
                      BUY NOW
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    {isSubscribed ? (
                      <button
                        onClick={handleRestockUnsubscribe}
                        className="flex-1 bg-green-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:bg-green-700 transition-colors text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 sm:gap-3"
                      >
                        <FaBell className="text-white text-sm sm:text-base" />
                        NOTIFICATIONS ENABLED
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowRestockInput(true)}
                        className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold hover:opacity-90 transition-opacity text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 sm:gap-3"
                      >
                        <FaBell className="text-white text-sm sm:text-base" />
                        NOTIFY WHEN AVAILABLE
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Restock Notification Input */}
              {showRestockInput && !isSubscribed && <RestockNotificationInput />}

              {/* Premium Features */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 py-3 sm:py-4">
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <FaHeadset className="text-blue-600 text-base sm:text-lg lg:text-xl mx-auto mb-1 sm:mb-2" />
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                    ACTIVE LISTEN
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 truncate">24/7 Support</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <FaShieldAlt className="text-blue-600 text-base sm:text-lg lg:text-xl mx-auto mb-1 sm:mb-2" />
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                    SECURE
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 truncate">Premium Service</p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <Package className="text-blue-600 text-base sm:text-lg lg:text-xl mx-auto mb-1 sm:mb-2" />
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                    AUTHENTIC
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    Genuine Product
                  </p>
                </div>
              </div>

              {/* Product Description */}
              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <h2 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-gray-900">
                  Product Description
                </h2>
                <ProductDescription
                  description={product.description}
                  shortDescription={product.shortDescription}
                />
              </div>

              {/* Enhanced Product Specifications */}
              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <ProductDetails product={product} />
              </div>

              {/* Benefits & Policies */}
              <div className="border rounded-lg sm:rounded-xl p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h2 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 text-blue-900">
                  Benefits & Policies
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-blue-100 shadow-sm">
                    <FaShieldAlt className="text-blue-600 text-base sm:text-xl" />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        Secure Payment
                      </span>
                      <p className="text-xs text-gray-600">SSL encrypted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-blue-100 shadow-sm">
                    <FaHeadset className="text-blue-600 text-base sm:text-xl" />
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900">
                        365 Days Help
                      </span>
                      <p className="text-xs text-gray-600">24/7 Support</p>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-blue-900">
                  Return & Warranty Policy
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { icon: FaUndo, text: "Upto 7 Days Returnable" },
                    { icon: FaQuestionCircle, text: "Missing Product" },
                    { icon: FaExchangeAlt, text: "Wrong Product" },
                    { icon: FaBoxOpen, text: "Damaged Product" },
                    { icon: FaThumbsDown, text: "Defective Product" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-blue-100"
                    >
                      <item.icon className="text-blue-600 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <Suspense
        fallback={
          <div className="h-48 sm:h-64 bg-gray-100 mt-6 animate-pulse rounded-lg"></div>
        }
      >
        <SimilarProduct productId={id} />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-48 sm:h-64 bg-gray-100 mt-6 animate-pulse rounded-lg"></div>
        }
      >
        <ShopByCategory/>
      </Suspense>
    </div>
  );
};

const ProductDescription = ({ description, shortDescription }) => {
  const [showAll, setShowAll] = useState(false);

  // Use description if available, otherwise use shortDescription or default content
  let content = description || shortDescription;

  if (!content) {
    return (
      <ul className="space-y-2 sm:space-y-3 text-gray-700">
        <li className="flex items-start gap-2 sm:gap-3">
          <span className="text-blue-500 mt-1 text-xs sm:text-sm">•</span>
          <span className="text-xs sm:text-sm leading-relaxed">
            Premium quality product with authentic craftsmanship
          </span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3">
          <span className="text-blue-500 mt-1 text-xs sm:text-sm">•</span>
          <span className="text-xs sm:text-sm leading-relaxed">
            Made with high-quality materials
          </span>
        </li>
        <li className="flex items-start gap-2 sm:gap-3">
          <span className="text-blue-500 mt-1 text-xs sm:text-sm">•</span>
          <span className="text-xs sm:text-sm leading-relaxed">
            Durable and long-lasting design
          </span>
        </li>
      </ul>
    );
  }

  // Check if content is HTML
  if (content.includes("<") && content.includes(">")) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const listItems = Array.from(doc.querySelectorAll("li"));

    if (listItems.length > 0) {
      const visibleItems = showAll ? listItems : listItems.slice(0, 6);

      return (
        <div className="text-gray-700">
          <ul className="space-y-2 sm:space-y-3">
            {visibleItems.map((li, idx) => (
              <li key={idx} className="flex items-start gap-2 sm:gap-3">
                <span className="text-blue-500 mt-1 text-xs sm:text-sm">•</span>
                <span className="text-xs sm:text-sm leading-relaxed">
                  {li.textContent}
                </span>
              </li>
            ))}
          </ul>

          {listItems.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 text-xs sm:text-sm mt-3 sm:mt-4 hover:underline font-semibold"
            >
              {showAll ? "Show Less" : "Show All Key Features"}
            </button>
          )}
        </div>
      );
    }
  }

  // If it's plain text with line breaks
  const lines = content.split("\n").filter((line) => line.trim());
  const visibleLines = showAll ? lines : lines.slice(0, 6);

  return (
    <div className="text-gray-700">
      <div className="space-y-2 sm:space-y-3">
        {visibleLines.map((line, idx) => (
          <div key={idx} className="flex items-start gap-2 sm:gap-3">
            <span className="text-blue-500 mt-1 text-xs sm:text-sm">•</span>
            <span className="text-xs sm:text-sm leading-relaxed">{line}</span>
          </div>
        ))}
      </div>

      {lines.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 text-xs sm:text-sm mt-3 sm:mt-4 hover:underline font-semibold"
        >
          {showAll ? "Show Less" : "Show All Key Features"}
        </button>
      )}
    </div>
  );
};

// Add custom CSS for animations and responsive styles
const style = `
  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.3s ease-out;
  }
  
  @media (min-width: 640px) {
    .custom-toast {
      font-size: 14px;
      padding: 12px 16px;
      border-radius: 8px;
    }
  }
  
  @media (max-width: 639px) {
    .custom-toast {
      font-size: 13px;
      padding: 10px 14px;
      border-radius: 6px;
      margin: 8px;
      width: calc(100% - 16px);
    }
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  /* Touch-friendly buttons */
  button, 
  a {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Optimize images for mobile */
  @media (max-width: 640px) {
    img {
      max-width: 100%;
      height: auto;
    }
  }
  
  /* Prevent text selection on images */
  .select-none {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  /* Smooth transitions for zoom */
  .transition-transform {
    transition: transform 0.2s ease;
  }
  
  /* Zoom cursor */
  .cursor-zoom-in {
    cursor: zoom-in;
  }
  
  .cursor-zoom-out {
    cursor: zoom-out;
  }
  
  /* Modal animations */
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .modal-enter {
    animation: fade-in 0.2s ease-out;
  }
  
  /* Thumbnail hover effects */
  .thumbnail-hover {
    transition: all 0.2s ease;
  }
  
  .thumbnail-hover:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  /* Touch-friendly scroll */
  .touch-scroll {
    -webkit-overflow-scrolling: touch;
  }
`;

// Add the style to the document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = style;
  document.head.appendChild(styleElement);
}

export default ProductDetailPage;