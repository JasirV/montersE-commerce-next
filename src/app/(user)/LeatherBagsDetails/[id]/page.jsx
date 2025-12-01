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
  FaBell,
  FaRuler,
  FaWeight,
  FaPalette,
  FaCalendar,
  FaTag,
  FaCube,
  FaLayerGroup,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa6";
import { Package, Ruler, Calendar, Tag, Layers } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import newCurrency from "../../../../assets/newSymbole.png";
import Image from "next/image";

import { addToCart, fetchProduct } from "@/service/productService";
import { toast } from "react-toastify";
import SimilarProduct from "../../../../../src/components/ui/SimillarProduct";
import { GlobalContext } from "../../../../components/shared/context/GlobalContext";
import axios from "axios";
import ShopByCategory from "@/features/product/ShopeByCatgeory";

const LeatherBagsDetails = () => {
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
        console.log("Fetched leather bag data:", data);
      } catch (err) {
        setError("Failed to load product details");
        console.error("Error loading leather bag:", err);
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

  // Thumbnail navigation - Side layout specific
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
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
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
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      navigator
        .share({
          title: product?.name || "Premium Leather Bag",
          text: "Check out this beautiful leather bag!",
          url: window.location.href,
        })
        .then(() => {
          setShowShareOptions(false);
        })
        .catch((error) => {
          setShowShareOptions(!showShareOptions);
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
      product?.name || "Premium Leather Bag"
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

      if (!product?._id) {
        toast.error("Product information is missing");
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
        toast.success("You'll be notified when this bag is back in stock!");
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
            "You're already subscribed to notifications for this bag";
          setIsSubscribed(true);
        } else if (error.response.status === 401) {
          errorMessage = "Please login again";
          router.push("/");
        } else if (error.response.status === 404) {
          errorMessage = "Product not found";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      toast.error(errorMessage);
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
        toast.success("You've been unsubscribed from restock notifications");
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      toast.error("Failed to unsubscribe");
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await addToCart(token, id, 1);
      incrementCart();
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

  // Product Specification Component based on ProductSpecification
  const ProductSpecification = () => {
    const [activeTab, setActiveTab] = useState("specifications");

    // Prepare specifications data for leather bags
    const specifications = [
      { label: "Brand", value: product?.brand },
      { label: "Model", value: product?.model },
      { label: "Reference Number", value: product?.referenceNumber },
      { label: "Main Category", value: product?.leatherMainCategory },
      { label: "Subcategory", value: product?.leatherSubCategory },
      { label: "Gender", value: product?.gender },
      { label: "Leather Type", value: product?.leatherMaterial },
      { label: "Interior Material", value: product?.interiorMaterial },
      { label: "Hardware Color", value: product?.hardwareColor },
      { label: "Model Code", value: product?.modelCode },
      { label: "Width", value: product?.leatherSize?.width ? `${product.leatherSize.width} cm` : null },
      { label: "Height", value: product?.leatherSize?.height ? `${product.leatherSize.height} cm` : null },
      { label: "Depth", value: product?.leatherSize?.depth ? `${product.leatherSize.depth} cm` : null },
      { label: "Strap Length", value: product?.strapLength ? `${product.strapLength} cm` : null },
      { label: "Overall Condition", value: product?.condition },
      { label: "Item Condition", value: product?.itemCondition },
      { label: "Production Year", value: product?.productionYear },
      { label: "Year is Approximate", value: product?.approximateYear ? "Yes" : null },
      { label: "Year Unknown", value: product?.unknownYear ? "Yes" : null },
      { label: "Color", value: product?.color },
      { label: "Pattern", value: product?.pattern },
      { label: "Closure Type", value: product?.closureType },
      { label: "Number of Compartments", value: product?.numberOfCompartments },
      { label: "Water Resistant", value: product?.waterResistant ? "Yes" : "No" },
      { label: "Lining Material", value: product?.liningMaterial },
    ].filter(spec => spec.value);

    // Key specs for cards
    const keySpecs = [
      { label: "Brand", value: product?.brand, icon: FaTag },
      { label: "Leather Type", value: product?.leatherMaterial, icon: FaPalette },
      { label: "Condition", value: product?.condition, icon: FaCheck },
      { label: "Dimensions", value: product?.leatherSize ? `${product.leatherSize.width || 'N/A'} x ${product.leatherSize.height || 'N/A'} x ${product.leatherSize.depth || 'N/A'} cm` : null, icon: FaRuler },
      { label: "Year", value: product?.productionYear, icon: FaCalendar },
      { label: "Closure", value: product?.closureType, icon: FaCube },
    ].filter(spec => spec.value);

    return (
      <div className="max-w-5xl mx-auto px-4 pb-10">
        {/* Sticky Tabs for Mobile */}
        <div className="sticky top-0 bg-white z-20 border-b mb-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab("specifications")}
              className={`flex-1 text-center py-3 text-sm font-medium transition ${
                activeTab === "specifications"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
              }`}
            >
              Specifications
            </button>

            <button
              onClick={() => setActiveTab("description")}
              className={`flex-1 text-center py-3 text-sm font-medium transition ${
                activeTab === "description"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500"
              }`}
            >
              Description
            </button>
          </div>
        </div>

        {/* SPECIFICATIONS TAB */}
        {activeTab === "specifications" && (
          <div className="space-y-6">
            {/* Key Specs Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {keySpecs.slice(0, 3).map((spec, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <spec.icon className="text-blue-600" />
                    <h3 className="font-semibold">{spec.label}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-900 font-medium">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Table */}
            <div className="bg-white rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold px-4 py-3 border-b">Complete Specifications</h3>

              <div className="divide-y">
                {specifications.map((spec, i) => (
                  <div key={i} className="px-4 py-3 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{spec.label}</span>
                    <span className="text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DESCRIPTION TAB */}
        {activeTab === "description" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">About this leather bag</h2>

            <ProductDescription
              description={product?.description}
              shortDescription={product?.shortDescription}
              additionalTitle={product?.additionalTitle}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Features */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">Key Features</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {product?.leatherMaterial && <li>• {product.leatherMaterial} leather</li>}
                  {product?.interiorMaterial && <li>• {product.interiorMaterial} interior</li>}
                  {product?.hardwareColor && <li>• {product.hardwareColor} hardware</li>}
                  {product?.strapLength && <li>• {product.strapLength} cm strap length</li>}
                  <li>• Durable construction</li>
                  <li>• Functional compartments</li>
                </ul>
              </div>

              {/* What's Included */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-800">What's Included</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {product?.leatherAccessories ? (
                    <li>• {product.leatherAccessories}</li>
                  ) : (
                    <li>• Original dust bag</li>
                  )}
                  {product?.leatherScopeOfDelivery ? (
                    <li>• {product.leatherScopeOfDelivery}</li>
                  ) : (
                    <li>• Original packaging</li>
                  )}
                  <li>• Authenticity certificate</li>
                  <li>• Care instructions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {keySpecs.slice(0, 4).map((stat, index) => (
            <div key={index}>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Premium Card Style Restock Notification Input Component
  const RestockNotificationInput = () => (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 mt-4 overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
      <div className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white bg-opacity-20 p-2 rounded-lg">
            <FaBell className="text-white text-lg" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Restock Alert</h3>
            <p className="text-blue-100 text-sm">Don't miss out when it's back!</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 bg-gray-50"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowRestockInput(false)}
                className="px-4 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRestockSubscribe}
                disabled={isSubscribing || !email || !/\S+@\S+\.\S+/.test(email)}
                className="px-6 py-3 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubscribing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Subscribing
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
          
          {email && !/\S+@\S+\.\S+/.test(email) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Please enter a valid email address to get notifications
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No spam
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Instant alert
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              1-click stop
            </span>
          </div>
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
              <div className="space-y-4">
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
            This leather bag is currently unavailable.
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
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-4 px-3 sm:px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Product Header */}
          <div className="border-b border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {product.name || "Premium Leather Bag"}
                </h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-sm text-gray-500">{product.brand}</span>
                  {product.model && (
                    <span className="text-sm text-gray-500">• {product.model}</span>
                  )}
                  {product.leatherSubCategory && (
                    <span className="text-sm text-gray-500">• {product.leatherSubCategory}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons - Top Right */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`p-3 rounded-xl border transition-colors ${
                    wishlistLoading ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {wishlistLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                  ) : (
                    <FaHeart
                      size={20}
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
                    className="bg-white p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <FaShareAlt size={18} className="text-gray-600" />
                  </button>

                  {showShareOptions && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-3 z-50 border border-gray-200">
                      <div className="flex flex-col">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-700">
                            Share this bag
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
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6">
            {/* Left Column - Images with Side Thumbnails */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Thumbnails Column - Side Layout */}
              {images.length > 0 && (
                <div className="flex lg:flex-col order-2 lg:order-1 gap-2 lg:gap-3">
                  {/* Navigation Arrows for Vertical Layout */}
                  {images.length > visibleThumbnails && (
                    <>
                      <button
                        onClick={() => handleThumbnailNavigate("prev")}
                        disabled={thumbnailStartIndex === 0}
                        className={`hidden lg:flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-colors mx-auto ${
                          thumbnailStartIndex === 0
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <FaChevronLeft size={14} className="text-gray-600" />
                      </button>

                      {/* Mobile horizontal navigation */}
                      <div className="flex lg:hidden gap-2 w-full justify-center">
                        <button
                          onClick={() => handleThumbnailNavigate("prev")}
                          disabled={thumbnailStartIndex === 0}
                          className={`flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-colors ${
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
                          className={`flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-colors ${
                            thumbnailStartIndex >= maxThumbnailIndex
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <FaChevronRight size={14} className="text-gray-600" />
                        </button>
                      </div>
                    </>
                  )}

                  {/* Thumbnails Container */}
                  <div className="flex lg:flex-col gap-2 lg:gap-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto scrollbar-hide">
                    {visibleImages.map((image, idx) => (
                      <div
                        key={thumbnailStartIndex + idx}
                        className={`flex-shrink-0 cursor-pointer border-2 rounded-lg transition-all duration-200 ${
                          selectedImage === (image.url || image)
                            ? "border-red-500 shadow-lg scale-105"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                        onClick={() => handleImageSelect(image)}
                      >
                        <Image
                          src={image.url || image}
                          alt={`${product.name || "Leather Bag"} thumbnail ${
                            thumbnailStartIndex + idx + 1
                          }`}
                          unoptimized
                          width={80}
                          height={80}
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Bottom Arrow for Vertical Layout */}
                  {images.length > visibleThumbnails && (
                    <button
                      onClick={() => handleThumbnailNavigate("next")}
                      disabled={thumbnailStartIndex >= maxThumbnailIndex}
                      className={`hidden lg:flex items-center justify-center w-8 h-8 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 transition-colors mx-auto ${
                        thumbnailStartIndex >= maxThumbnailIndex
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <FaChevronRight size={14} className="text-gray-600" />
                    </button>
                  )}

                  {/* Thumbnail Counter */}
                  {images.length > 0 && (
                    <div className="hidden lg:block text-center mt-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
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

              {/* Main Image Container */}
              <div className="flex-1 order-1 lg:order-2">
                <div
                  className={`w-full h-72 sm:h-96 lg:h-[500px] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-gray-100`}
                >
                  <Image
                    src={
                      selectedImage || product.image || "/placeholder-image.jpg"
                    }
                    alt={product.name || "Leather Bag Image"}
                    unoptimized
                    width={600}
                    height={600}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>

                {/* Image Counter for Mobile */}
                {images.length > 0 && (
                  <div className="lg:hidden text-center mt-3">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {images.findIndex(
                        (img) => (img.url || img) === selectedImage
                      ) + 1}{" "}
                      / {images.length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Price Section */}
              <div className={`rounded-2xl p-6 border ${
                isSoldOut 
                  ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200" 
                  : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`text-3xl sm:text-4xl font-bold flex items-center ${
                      isSoldOut ? "text-gray-600" : "text-gray-900"
                    }`}>
                      <Image
                        src={newCurrency}
                        alt="Currency"
                        width={28}
                        height={28}
                        className="mr-2"
                      />
                      {formatPrice(product.salePrice || product.sellingPrice) || "65,000"}
                    </div>
                    {product.regularPrice &&
                      product.regularPrice > (product.salePrice || product.sellingPrice) && (
                        <>
                          <div className="text-xl text-gray-500 line-through flex items-center">
                            <Image
                              src={newCurrency}
                              alt="Currency"
                              width={20}
                              height={20}
                              className="mr-1"
                            />
                            {formatPrice(product.regularPrice)}
                          </div>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {calculateDiscount()}% OFF
                          </span>
                        </>
                      )}
                   
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
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
                        className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity text-lg shadow-lg"
                      >
                        GO TO CART
                      </button>
                    ) : (
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity text-lg shadow-lg"
                      >
                        ADD TO CART
                      </button>
                    )}
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 bg-orange-600 text-white py-4 rounded-xl font-semibold hover:bg-orange-700 transition-colors text-lg shadow-lg"
                    >
                      BUY NOW
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    {isSubscribed ? (
                      <button
                        onClick={handleRestockUnsubscribe}
                        className="flex-1 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors text-lg shadow-lg flex items-center justify-center gap-3"
                      >
                        <FaBell className="text-white" />
                        NOTIFICATIONS ENABLED
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowRestockInput(true)}
                        className="flex-1 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity text-lg shadow-lg flex items-center justify-center gap-3"
                      >
                        <FaBell className="text-white" />
                        NOTIFY WHEN AVAILABLE
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Restock Notification Input */}
              {showRestockInput && !isSubscribed && <RestockNotificationInput />}

              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                {product.leatherMaterial && (
                  <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <FaPalette className="text-brown-600 text-2xl mx-auto mb-2" />
                    <h3 className="font-semibold text-sm text-gray-900">
                      LEATHER TYPE
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">{product.leatherMaterial}</p>
                  </div>
                )}
                {product.hardwareColor && (
                  <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <FaPalette className="text-yellow-600 text-2xl mx-auto mb-2" />
                    <h3 className="font-semibold text-sm text-gray-900">
                      HARDWARE
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">{product.hardwareColor}</p>
                  </div>
                )}
                {product.productionYear && (
                  <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <FaCalendar className="text-blue-600 text-2xl mx-auto mb-2" />
                    <h3 className="font-semibold text-sm text-gray-900">
                      YEAR
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">{product.productionYear}</p>
                  </div>
                )}
                <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Package className="text-blue-600 text-2xl mx-auto mb-2" />
                  <h3 className="font-semibold text-sm text-gray-900">
                    AUTHENTIC
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Genuine Product
                  </p>
                </div>
              </div>

              {/* Product Description Summary */}
              <div className="border-t border-gray-200 pt-6">
                <h2 className="font-bold text-xl mb-4 text-gray-900">
                  Overview
                </h2>
                <div className="text-gray-700">
                  <p className="text-sm leading-relaxed">
                    {product.conditionNotes || 
                     "Premium leather bag crafted with exceptional attention to detail. This timeless piece combines luxury craftsmanship with practical functionality for everyday use."}
                  </p>
                </div>
              </div>

              {/* Product Specifications Component */}
              <div className="border-t border-gray-200 pt-6">
                <ProductSpecification />
              </div>

              {/* Benefits & Policies */}
              <div className="border rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h2 className="font-bold text-xl mb-6 text-blue-900">
                  Benefits & Policies
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <FaShieldAlt className="text-blue-600 text-xl" />
                    <div>
                      <span className="text-sm font-semibold text-gray-900">
                        Secure Payment
                      </span>
                      <p className="text-xs text-gray-600">SSL encrypted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <FaHeadset className="text-blue-600 text-xl" />
                    <div>
                      <span className="text-sm font-semibold text-gray-900">
                        365 Days Help
                      </span>
                      <p className="text-xs text-gray-600">24/7 Support</p>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-lg mb-4 text-blue-900">
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
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100"
                    >
                      <item.icon className="text-blue-600 text-base" />
                      <span className="text-sm font-medium text-gray-700">
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
          <div className="h-48 xs:h-56 sm:h-64 bg-gray-100 mt-6 animate-pulse rounded-lg"></div>
        }
      >
        <SimilarProduct productId={id} />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-48 xs:h-56 sm:h-64 bg-gray-100 mt-6 animate-pulse rounded-lg"></div>
        }
      >
        <ShopByCategory />
      </Suspense>
    </div>
  );
};

// ProductDescription Component with improvements for leather bags
const ProductDescription = ({ description, shortDescription, additionalTitle }) => {
  const [showAll, setShowAll] = useState(false);

  let content = description || shortDescription;

  if (!content) {
    return (
      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          This premium leather bag is crafted with exceptional attention to detail, 
          combining luxury craftsmanship with practical functionality for everyday use.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Key Features:</h4>
            <ul className="space-y-2">
              {[
                "Premium quality genuine leather",
                "Handcrafted by skilled artisans",
                "Durable construction with reinforced stitching",
                "High-quality hardware and zippers",
                "Spacious and well-organized interior",
                "Adjustable and comfortable straps"
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Care Instructions:</h4>
            <ul className="space-y-2">
              {[
                "Clean with a soft, dry cloth",
                "Avoid exposure to direct sunlight",
                "Store in a cool, dry place",
                "Use leather conditioner periodically",
                "Keep away from water and moisture"
              ].map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FaCheck className="text-blue-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {additionalTitle && (
          <div className="bg-gray-50 rounded-xl p-4 mt-4">
            <h4 className="font-semibold text-gray-900 mb-2">Additional Information:</h4>
            <p className="text-sm text-gray-700">{additionalTitle}</p>
          </div>
        )}
      </div>
    );
  }

  if (content.includes("<") && content.includes(">")) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const listItems = Array.from(doc.querySelectorAll("li"));
    const paragraphs = Array.from(doc.querySelectorAll("p"));

    if (listItems.length > 0) {
      const visibleItems = showAll ? listItems : listItems.slice(0, 8);

      return (
        <div className="space-y-4">
          {paragraphs.length > 0 && (
            <div className="space-y-3">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed">
                  {p.textContent}
                </p>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
              <ul className="space-y-2">
                {visibleItems.map((li, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{li.textContent}</span>
                  </li>
                ))}
              </ul>
              
              {listItems.length > 8 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-3 inline-flex items-center gap-1"
                >
                  {showAll ? (
                    <>
                      <span>Show Less</span>
                      <FaChevronLeft className="rotate-90" size={12} />
                    </>
                  ) : (
                    <>
                      <span>Show {listItems.length - 8} More Features</span>
                      <FaChevronRight className="rotate-90" size={12} />
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Care Instructions:</h4>
              <ul className="space-y-2">
                {[
                  "Clean with a soft, dry cloth",
                  "Avoid exposure to direct sunlight",
                  "Store in a cool, dry place",
                  "Use leather conditioner periodically"
                ].map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaCheck className="text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }

  const lines = content.split("\n").filter((line) => line.trim());
  const visibleLines = showAll ? lines : lines.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {visibleLines.map((line, idx) => (
          <p key={idx} className="text-gray-700 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      
      {lines.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1"
        >
          {showAll ? (
            <>
              <span>Show Less</span>
              <FaChevronLeft className="rotate-90" size={12} />
            </>
          ) : (
            <>
              <span>Show {lines.length - 8} More Details</span>
              <FaChevronRight className="rotate-90" size={12} />
            </>
          )}
        </button>
      )}
      
      {additionalTitle && (
        <div className="bg-gray-50 rounded-xl p-4 mt-4">
          <h4 className="font-semibold text-gray-900 mb-2">Additional Information:</h4>
          <p className="text-sm text-gray-700">{additionalTitle}</p>
        </div>
      )}
    </div>
  );
};

export default LeatherBagsDetails;