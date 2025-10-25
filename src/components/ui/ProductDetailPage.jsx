"use client";
import React, {
  useState,
  useMemo,
  Suspense,
  useEffect,
  useContext,
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
  FaLink,
  FaListAlt,
  FaBell,
  FaClock,
} from "react-icons/fa";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa6";
import { 
  Watch, 
  Settings, 
  Link2, 
  Package, 
  BarChart3,
  Mail,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import newCurrency from "../../assets/newSymbole.png";
import Image from "next/image";

import { addToCart, fetchProduct } from "@/service/productService";
import { toast } from "react-toastify";
import SimilarProduct from "./SimillarProduct";
import { GlobalContext } from "../shared/context/GlobalContext";
import axios from "axios";

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
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Check if product is sold out
  const isSoldOut = product?.stockQuantity === 0;

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
        setError("Failed to load products");
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

  // Thumbnail navigation
  const visibleThumbnails = 4;
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

        // Correct way to access response data
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

  // Check if user is already subscribed to restock notifications
  useEffect(() => {
    const checkRestockSubscription = async () => {
      if (!user || !product) return;

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/restock-notifications/my-subscriptions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          const isSubscribed = response.data.data.some(
            (subscription) => subscription.productId._id === product._id
          );
          setIsSubscribed(isSubscribed);
        }
      } catch (error) {
        console.error("Error checking restock subscription:", error);
      }
    };

    if (isSoldOut) {
      checkRestockSubscription();
    }
  }, [user, product, isSoldOut]);

  // Add/Remove from wishlist API
  const handleWishlistToggle = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        // Redirect to login or show login modal
        router.push("/");
        return;
      }

      if (!defaultWishlistId) {
        toast.error("No default wishlist found");
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
        console.log("Product removed from wishlist");
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
        console.log("Product added to wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);

      // Show user-friendly error message
      if (error.response?.status === 401) {
        router.push("/");
      } else {
        alert("Failed to update wishlist. Please try again.");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  // Enhanced Handle share button click for mobile
  const handleShareClick = () => {
    // Check if it's a mobile device and if Web Share API is supported
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      // Use native share dialog on mobile
      navigator
        .share({
          title: product?.name || "Hermès Watch",
          text: "Check out this beautiful watch!",
          url: window.location.href,
        })
        .then(() => {
          console.log("Successful share");
          setShowShareOptions(false);
        })
        .catch((error) => {
          console.log("Error sharing:", error);
          // Fallback to custom share options if native share fails
          setShowShareOptions(!showShareOptions);
        });
    } else {
      // Show custom share options on desktop or when native share isn't available
      setShowShareOptions(!showShareOptions);
    }
  };

  // Handle social sharing
  const handleSocialShare = (platform) => {
    let shareUrl = "";
    const productUrl = encodeURIComponent(window.location.href);
    const productTitle = encodeURIComponent(product?.name || "Premium Watch");

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
  };

  // Handle image selection
  const handleImageSelect = (image) => {
    setSelectedImage(image.url || image);
  };

  // Subscribe to restock notifications
  const handleRestockSubscribe = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Please login to get restock notifications");
        router.push("/");
        return;
      }

      if (!email) {
        toast.error("Please enter your email address");
        return;
      }

      setIsSubscribing(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/restock-notifications/subscribe`,
        {
          productId: product._id,
          email: email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setIsSubscribed(true);
        setShowRestockModal(false);
        toast.success("You'll be notified when this product is back in stock!");
      }
    } catch (error) {
      console.error("Restock subscription error:", error);
      const errorMessage = error.response?.data?.message || "Failed to subscribe for notifications";
      toast.error(errorMessage);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log(id, "id");
      await addToCart(token, id, 1);
      incrementCart();
      // store in localStorage for quick UI update
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ productId: id, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));

      setIsInCart(true);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
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
      toast.error("Unable to proceed to checkout. Please try again.");
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

  // Enhanced Product Specifications Component
  const ProductSpecifications = ({ product }) => {
    const watchSpecs = [
      {
        category: "Basic Information",
        icon: <FaListAlt className="text-blue-600 text-xl" />,
        specs: [
          { label: "Brand", value: product.brand || product.brands?.[0] || "N/A" },
          { label: "Model", value: product.model || "N/A" },
          { label: "Reference Number", value: product.referenceNumber || product.RefenceNumber || "N/A" },
          { label: "Serial Number", value: product.serialNumber || "N/A" },
          { label: "SKU", value: product.sku || "N/A" },
        ]
      },
      {
        category: "Watch Details",
        icon: <Watch className="text-green-600 text-xl" />,
        specs: [
          { label: "Watch Type", value: product.watchType || "N/A" },
          { label: "Production Year", value: product.productionYear || product.ProductionYear || "N/A" },
          { label: "Gender", value: product.gender ? product.gender.charAt(0).toUpperCase() + product.gender.slice(1) : "N/A" },
          { label: "Condition", value: product.condition ? product.condition.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "N/A" },
        ]
      },
      {
        category: "Movement & Technical",
        icon: <Settings className="text-purple-600 text-xl" />,
        specs: [
          { label: "Movement", value: product.movement || product.Movement || "N/A" },
          { label: "Case Material", value: product.caseMaterial || "N/A" },
          { label: "Case Diameter Size", value: product.caseSize ? `${product.caseSize} mm` : product.caseSize ? `${product.caseSize} mm` : "N/A" },
          { label: "Dial Color", value: product.dialColor || product.Dial || "N/A" },
        ]
      },
      {
        category: "Strap/Bracelet",
        icon: <Link2 className="text-orange-600 text-xl" />,
        specs: [
          { label: "Strap Material", value: product.strapMaterial || "N/A" },
          { label: "Strap Color", value: product.strapColor || "N/A" },
          { label: "Wrist Size", value: product.strapSize ? `${product.strapSize} cm` : product.strapSize ? `${product.strapSize} cm` : "N/A" },
        ]
      },
      {
        category: "Additional Information",
        icon: <Package className="text-indigo-600 text-xl" />,
        specs: [
          { label: "Scope of Delivery", value: product.scopeOfDelivery || "N/A" },
          { label: "Accessories", value: product.includedAccessories || product.includedAccessories || "N/A" },
          { label: "Category", value: product.category || product.category || "N/A" },
        ]
      }
    ];

    return (
      <div className="mt-8">
        <h2 className="font-bold text-2xl mb-6 text-gray-900 border-b pb-3 flex items-center gap-3">
          <FaListAlt className="text-blue-600 text-2xl" />
          Product Specifications
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {watchSpecs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Category Header */}
              <div className="bg-gradient-to-r from-blue-50 to-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-3">
                  {category.icon}
                  {category.category}
                </h3>
              </div>
              
              {/* Specifications List */}
              <div className="divide-y divide-gray-100">
                {category.specs.map((spec, specIndex) => (
                  <div key={specIndex} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-gray-700 text-sm flex-1">
                        {spec.label}
                      </span>
                      <span className="text-gray-900 text-sm font-semibold text-right flex-1 ml-4">
                        {spec.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Compact Table View for Larger Screens */}
        <div className="mt-8 hidden xl:block">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h3 className="font-bold text-lg text-white flex items-center gap-3">
                <BarChart3 className="text-white text-xl" />
                Complete Technical Specifications
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-0">
              {watchSpecs.flatMap(category => category.specs).map((spec, index) => (
                <div 
                  key={index} 
                  className={`p-4 border-b border-r border-gray-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {spec.label}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {spec.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Out of Stock Banner Component
  const OutOfStockBanner = () => (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-red-100 p-2 rounded-full">
          <FaClock className="text-red-600 text-lg" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-800 text-lg">Out of Stock</h3>
          <p className="text-red-700 text-sm mt-1">
            This product is currently unavailable. Get notified when it's back in stock.
          </p>
        </div>
      </div>
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen py-3 xs:py-4 sm:py-6 px-2 xs:px-3 sm:px-4">
        <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-3 xs:p-4 sm:p-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
              {/* Image Section Skeleton */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                </div>
                <div className="w-full h-72 xs:h-80 sm:h-96 md:h-[500px] bg-gray-300 rounded-lg"></div>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-md"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Content Section Skeleton */}
              <div className="space-y-6">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
                <div className="h-12 bg-gray-300 rounded"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
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
      <div className="bg-gray-100 min-h-screen flex items-center justify-center py-3 xs:py-4 sm:py-6 px-2 xs:px-3 sm:px-4">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Product Not Available
          </h2>
          <p className="text-gray-600 mb-4">
            The product you're looking for is currently unavailable.
          </p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-3 xs:py-4 sm:py-6 px-2 xs:px-3 sm:px-4">
      {/* Add viewport meta tag to control zoom and scaling */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
      />

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-3 xs:p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
        {/* ===== Left Section - Images with Amazon-style Thumbnails ===== */}
        <div className="space-y-4">
          {/* Wishlist & Share Buttons */}
          <div className="flex justify-between items-start">
            <div className="flex gap-2 xs:gap-3">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading || (isSoldOut && !isWishlisted)}
                className={`p-2 xs:p-2.5 rounded-full shadow-md transition-colors border flex items-center justify-center ${
                  wishlistLoading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  isSoldOut && !isWishlisted
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-white border-gray-200 hover:bg-gray-100"
                }`}
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {wishlistLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                ) : (
                  <FaHeart
                    size={18}
                    className={
                      isWishlisted
                        ? "text-red-500 fill-red-500"
                        : isSoldOut && !isWishlisted
                        ? "text-gray-400"
                        : "text-gray-600"
                    }
                  />
                )}
              </button>

              {/* Enhanced Share Button with Mobile & Desktop Responsiveness */}
              <div className="relative">
                <button
                  onClick={handleShareClick}
                  className="bg-white p-2 xs:p-2.5 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-2 xs:gap-1"
                  aria-label="Share product"
                >
                  <FaShareAlt size={18} className="text-gray-600" />
                  {/* Show text on mobile */}
                  <span className="text-sm font-medium text-gray-700 block xs:hidden">
                    Share
                  </span>
                </button>

                {/* Enhanced Dropdown for Share - Mobile Left Side, Desktop Right Side */}
                {showShareOptions && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 xs:w-64 sm:w-64 bg-white rounded-lg shadow-xl py-3 z-50 border border-gray-200">
                    <div className="flex flex-col">
                      {/* Header */}
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-700">
                          Share this product
                        </h3>
                      </div>

                      {/* Native Web Share API for Mobile */}
                      {navigator.share && (
                        <button
                          onClick={() => {
                            navigator
                              .share({
                                title: product?.name || "Premium Watch",
                                text: "Check out this beautiful watch!",
                                url: window.location.href,
                              })
                              .then(() => setShowShareOptions(false))
                              .catch((error) =>
                                console.log("Error sharing:", error)
                              );
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-b border-gray-100 sm:hidden"
                        >
                          <FaShareAlt className="text-blue-500 text-base" />
                          <span>Share via...</span>
                        </button>
                      )}

                      {/* Social Media Options with React Icons */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3">
                        <button
                          onClick={() => handleSocialShare("facebook")}
                          className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                        >
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <FaFacebookF className="text-white text-sm" />
                          </div>
                          <span className="text-xs">Facebook</span>
                        </button>

                        <button
                          onClick={() => handleSocialShare("twitter")}
                          className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                        >
                          <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                            <FaTwitter className="text-white text-sm" />
                          </div>
                          <span className="text-xs">Twitter</span>
                        </button>

                        <button
                          onClick={() => handleSocialShare("pinterest")}
                          className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                        >
                          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                            <FaPinterest className="text-white text-sm" />
                          </div>
                          <span className="text-xs">Pinterest</span>
                        </button>

                        <button
                          onClick={() => handleSocialShare("whatsapp")}
                          className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                        >
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <FaWhatsapp className="text-white text-sm" />
                          </div>
                          <span className="text-xs">WhatsApp</span>
                        </button>
                      </div>

                      {/* Copy Link Option */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success("Link copied to clipboard!");
                          setShowShareOptions(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full text-left border-t border-gray-100"
                      >
                        <FaLink className="text-gray-500 text-base" />
                        <span>Copy Link</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Product Image */}
          <div className={`w-full h-72 xs:h-80 sm:h-96 md:h-[500px] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border ${
            isSoldOut ? "border-red-200 grayscale opacity-90" : "border-gray-200"
          }`}>
            <Image
              src={selectedImage || product.image || "/placeholder-image.jpg"}
              alt={product.name || "Product Image"}
              width={600}
              height={600}
              className={`object-contain w-full h-full ${
                isSoldOut ? "grayscale opacity-80" : ""
              }`}
              priority
            />
            {/* Sold Out Overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-lg">
                  Out of Stock
                </div>
              </div>
            )}
          </div>

          {/* Amazon-style Thumbnail Gallery */}
          {images.length > 0 && (
            <div className="relative">
              {/* Navigation Arrows for Thumbnails */}
              {images.length > visibleThumbnails && (
                <>
                  <button
                    onClick={() => handleThumbnailNavigate("prev")}
                    disabled={thumbnailStartIndex === 0}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors ${
                      thumbnailStartIndex === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <FaChevronLeft size={14} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleThumbnailNavigate("next")}
                    disabled={thumbnailStartIndex >= maxThumbnailIndex}
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors ${
                      thumbnailStartIndex >= maxThumbnailIndex
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <FaChevronRight size={14} className="text-gray-600" />
                  </button>
                </>
              )}

              {/* Thumbnails Container */}
              <div className="flex justify-center gap-2 xs:gap-3 px-8">
                {visibleImages.map((image, idx) => (
                  <div
                    key={thumbnailStartIndex + idx}
                    className={`flex-shrink-0 cursor-pointer border-2 rounded-lg transition-all duration-200 ${
                      selectedImage === (image.url || image)
                        ? "border-red-500 shadow-md scale-105"
                        : "border-gray-300 hover:border-red-300"
                    } ${
                      isSoldOut ? "grayscale opacity-70" : ""
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    <Image
                      src={image.url || image}
                      alt={`${product.name || "Product"} thumbnail ${
                        thumbnailStartIndex + idx + 1
                      }`}
                      width={80}
                      height={80}
                      className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>

              {/* Thumbnail Indicator */}
              {images.length > visibleThumbnails && (
                <div className="text-center mt-2">
                  <span className="text-xs text-gray-500">
                    {thumbnailStartIndex + 1}-
                    {Math.min(
                      thumbnailStartIndex + visibleThumbnails,
                      images.length
                    )}{" "}
                    of {images.length}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Image Counter */}
          {images.length > 0 && (
            <div className="text-center">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {images.findIndex((img) => (img.url || img) === selectedImage) +
                  1}{" "}
                / {images.length}
              </span>
            </div>
          )}
        </div>

        {/* ===== Right Section - Details ===== */}
        <div className="space-y-6">
          {/* Out of Stock Banner */}
          {isSoldOut && <OutOfStockBanner />}

          {/* Product Title */}
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {product.name || "Premium Watch"}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-full">
              <span className="font-semibold">{product.rating || "4.6"}</span>
              <span>★</span>
            </div>
            <span className="text-gray-600 text-sm">
              ({product.reviewCount || 8} Reviews)
            </span>
            <span className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
              View all reviews
            </span>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 flex items-center">
                <Image
                  src={newCurrency}
                  alt="Currency"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                {formatPrice(product.salePrice) || "65,000"}
              </div>
              {product.regularPrice &&
                product.regularPrice > product.salePrice && (
                  <>
                    <div className="text-lg text-gray-500 line-through flex items-center">
                      <Image
                        src={newCurrency}
                        alt="Currency"
                        width={18}
                        height={18}
                        className="mr-1"
                      />
                      {formatPrice(product.regularPrice)}
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                      {calculateDiscount()}% OFF
                    </span>
                  </>
                )}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                product.stockQuantity > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
            {product.stockQuantity > 0 && (
              <span className="text-xs text-gray-500">
                ({product.stockQuantity} items available)
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {product.stockQuantity > 0 ? (
              <>
                {isInCart ? (
                  <button
                    onClick={handleGoToCart}
                    className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-base shadow-md"
                  >
                    GO TO CART
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-base shadow-md"
                  >
                    ADD TO CART
                  </button>
                )}
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-base shadow-md"
                >
                  BUY NOW
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {isSubscribed ? (
                  <button
                    disabled
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold cursor-not-allowed text-base shadow-md flex items-center justify-center gap-2"
                  >
                    <FaBell className="text-white" />
                    NOTIFICATIONS ENABLED
                  </button>
                ) : (
                  <button
                    onClick={() => setShowRestockModal(true)}
                    className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity text-base shadow-md flex items-center justify-center gap-2"
                  >
                    <FaBell className="text-white" />
                    NOTIFY WHEN AVAILABLE
                  </button>
                )}
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed text-base shadow-md"
                >
                  OUT OF STOCK
                </button>
              </div>
            )}
          </div>

          {/* About Product */}
          <div>
            <h2 className="font-semibold text-lg mb-3">About This Product</h2>
            <ProductDescription
              description={product.description}
              shortDescription={product.shortDescription}
            />
          </div>

          {/* Enhanced Product Specifications */}
          <ProductSpecifications product={product} />

          {/* Benefits & Return/Warranty Policy */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <h2 className="font-semibold text-lg mb-4 text-blue-900">
              Benefits & Policies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                <FaShieldAlt className="text-blue-600 text-lg" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                <FaHeadset className="text-blue-600 text-lg" />
                <span className="text-sm font-medium">365 Days Help Desk</span>
              </div>
            </div>

            <h3 className="font-semibold text-base mb-3 text-blue-900">
              Return & Warranty Policy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: FaUndo, text: "Upto 7 Days Returnable" },
                { icon: FaQuestionCircle, text: "Missing Product" },
                { icon: FaExchangeAlt, text: "Wrong Product" },
                { icon: FaBoxOpen, text: "Damaged Product" },
                { icon: FaThumbsDown, text: "Defective Product" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2">
                  <item.icon className="text-blue-600 text-base" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Restock Notification Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <FaBell className="text-blue-600 text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Get Restock Notification
              </h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              We'll send you an email when <strong>{product.name}</strong> is
              back in stock.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
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
                  disabled={isSubscribing || !email}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white rounded-md hover:from-[#1a447a] hover:to-[#005099] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubscribing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <FaBell className="text-white" />
                      Notify Me
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section with lazy loading */}
      <Suspense
        fallback={
          <div className="h-48 xs:h-56 sm:h-64 bg-gray-100 mt-6 animate-pulse rounded-lg"></div>
        }
      >
        <SimilarProduct productId={id} />
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
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-gray-400 mt-1">•</span>
          Premium quality watch with authentic craftsmanship
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400 mt-1">•</span>
          Imported movement for precise timekeeping
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400 mt-1">•</span>
          Water resistant design
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
          <ul className="space-y-2">
            {visibleItems.map((li, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span className="text-sm leading-relaxed">
                  {li.textContent}
                </span>
              </li>
            ))}
          </ul>

          {listItems.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 text-sm mt-3 hover:underline font-medium"
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
      <div className="space-y-2">
        {visibleLines.map((line, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            <span className="text-sm leading-relaxed">{line}</span>
          </div>
        ))}
      </div>

      {lines.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 text-sm mt-3 hover:underline font-medium"
        >
          {showAll ? "Show Less" : "Show All Key Features"}
        </button>
      )}
    </div>
  );
};

export default ProductDetailPage;