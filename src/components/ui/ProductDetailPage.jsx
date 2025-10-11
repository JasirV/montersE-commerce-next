"use client";
import React, { useState, useMemo,  Suspense, useEffect ,useContext} from "react";
import { FaHeart, FaShareAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  FaShieldAlt,
  FaHeadset,
  FaUndo,
  FaQuestionCircle,
  FaExchangeAlt,
  FaBoxOpen,
  FaThumbsDown,
} from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import newCurrency from "../../assets/newSymbole.png";
import Image from "next/image";
import ReviewsRating from "./ReviewsRatings";
import { addToCart, fetchProduct } from "@/service/productService";
import { toast } from "react-toastify";
import SimilarProduct from "./SimillarProduct";
import api from "@/api/axiosIntespter";
import { GlobalContext } from "../shared/context/GlobalContext";

const ProductDetailPage = () => {
    const { incrementWishlist,decrementWishlist,incrementCart } = useContext(GlobalContext);
  const router = useRouter();
  const [product, setProducts] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();

  // Wishlist states
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Get product data from navigation state or fetch if needed
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const { data } = await fetchProduct({ id });
        setProducts(data || {});
        setSelectedImage(data?.images?.[0]?.url || defaultImage);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [id]);

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0].url || defaultImage);
    } else {
      setSelectedImage(defaultImage);
    }
  }, [product]);

  // Default image if none provided
  const defaultImage = "https://via.placeholder.com/500x500?text=Product+Image";

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0]?.url || defaultImage
  );
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

  // Memoize images array to prevent unnecessary re-renders
  const images = useMemo(() => product?.images || [], [product]);

  // Thumbnail navigation
  const visibleThumbnails = 4;
  const maxThumbnailIndex = Math.max(0, images.length - visibleThumbnails);

  const handleThumbnailNavigate = (direction) => {
    if (direction === 'prev') {
      setThumbnailStartIndex(prev => Math.max(0, prev - 1));
    } else {
      setThumbnailStartIndex(prev => Math.min(maxThumbnailIndex, prev + 1));
    }
  };

  const visibleImages = images.slice(thumbnailStartIndex, thumbnailStartIndex + visibleThumbnails);

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
        const res = await api.get(
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
          const isProductInWishlist = res.data.wishlists.some(wishlist => 
            wishlist.products?.some(productItem => 
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
        await api.delete(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/remove`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            
            data: {
              wishlistId: defaultWishlistId,
              productId: product._id || id,
            },
            
          }
        );
       decrementWishlist()
        setIsWishlisted(false);
        console.log("Product removed from wishlist");
      } else {
        // Add to wishlist
        await api.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/add`,
          {
            wishlistId: defaultWishlistId,
            productId: product._id || id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        incrementWishlist()
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

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="text-center mt-10 text-red-500">
        Product not found. Please go back and try again.
      </div>
    );
  }

  // Handle share button click
  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
    if (navigator.share) {
      navigator
        .share({
          title: product.title || "Hermès Watch",
          text: "Check out this beautiful Hermès watch!",
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    }
  };

  // Handle social sharing
  const handleSocialShare = (platform) => {
    let shareUrl = "";
    const productUrl = encodeURIComponent(window.location.href);
    const productTitle = encodeURIComponent(product.title || "Hermès Watch");

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

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // assume JWT is saved
      console.log(id, "id");
      await addToCart(token, id, 1);
      incrementCart()
      // store in localStorage for quick UI update
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ productId: id, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));

      setIsInCart(true);
    } catch (error) {
      console.error("Add to cart failed:", error);
      // alert("Failed to add to cart. Please try again.");
    }
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };
  
const handleBuyNow = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // JWT token
    if (!token) {
      router.push("/login"); // redirect to login if user not logged in
      return;
    }

    // Add to cart if not already in cart
    if (!isInCart) {
      await addToCart(token, id, 1);

      // Update localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push({ productId: id, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      setIsInCart(true);
    }

    // Redirect to checkout with product id and quantity in query params
    router.push(`/checkout?productId=${id}&quantity=1`);
  } catch (error) {
    console.error("Buy now failed:", error);
    toast.error("Unable to proceed to checkout. Please try again.");
  }
};


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
            <div className="flex gap-2">
              <button
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-200 ${
                  wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
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
                    className={isWishlisted ? "text-red-500 fill-red-500" : "text-gray-600"}
                  />
                )}
              </button>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={handleShareClick}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
                  aria-label="Share product"
                >
                  <FaShareAlt size={18} className="text-gray-600" />
                </button>

                {/* Dropdown for Share */}
                {showShareOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <button
                      onClick={() => handleSocialShare("facebook")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleSocialShare("twitter")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleSocialShare("pinterest")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Share on Pinterest
                    </button>
                    <button
                      onClick={() => handleSocialShare("whatsapp")}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Share on WhatsApp
                    </button>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.href)
                      }
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Product Image */}
          <div className="w-full h-72 xs:h-80 sm:h-96 md:h-[500px] bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200">
            <Image
              src={selectedImage || defaultImage}
              alt={product.title || "Product Image"}
              width={600}
              height={600}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          {/* Amazon-style Thumbnail Gallery */}
          <div className="relative">
            {/* Navigation Arrows for Thumbnails */}
            {images.length > visibleThumbnails && (
              <>
                <button
                  onClick={() => handleThumbnailNavigate('prev')}
                  disabled={thumbnailStartIndex === 0}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors ${
                    thumbnailStartIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <FaChevronLeft size={14} className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleThumbnailNavigate('next')}
                  disabled={thumbnailStartIndex >= maxThumbnailIndex}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors ${
                    thumbnailStartIndex >= maxThumbnailIndex ? 'opacity-50 cursor-not-allowed' : ''
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
                      ? 'border-red-500 shadow-md scale-105'
                      : 'border-gray-300 hover:border-red-300'
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <Image
                    src={image.url || image}
                    alt={`${product.title || "Product"} thumbnail ${thumbnailStartIndex + idx + 1}`}
                    width={80}
                    height={80}
                    className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Thumbnail Indicator */}
            {images.length > visibleThumbnails && (
              <div className="text-center mt-2">
                <span className="text-xs text-gray-500">
                  {thumbnailStartIndex + 1}-{Math.min(thumbnailStartIndex + visibleThumbnails, images.length)} of {images.length}
                </span>
              </div>
            )}
          </div>

          {/* Image Counter */}
          <div className="text-center">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {images.findIndex(img => (img.url || img) === selectedImage) + 1} / {images.length}
            </span>
          </div>
        </div>

        {/* ===== Right Section - Details ===== */}
        <div className="space-y-6">
          {/* Product Title */}
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            {product.name ||
              "Hermès Kelly Red Watch 20mm – Classic Imported Watch Model For Men"}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-3">
              <div className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 flex items-center">
                <Image
                  src={newCurrency}
                  alt="Currency"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                {product.salePrice || "65,000"}
              </div>
              <div className="text-lg text-gray-500 line-through flex items-center">
                <Image
                  src={newCurrency}
                  alt="Currency"
                  width={18}
                  height={18}
                  className="mr-1"
                />
                {product.regularPrice || "90,000"}
              </div>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                28% OFF
              </span>
            </div>
          </div>

         

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
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
          </div>

          {/* Delivery Details */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h2 className="font-semibold text-base mb-3">Delivery Details</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Your Pincode"
                className="flex-1 border rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-base border-gray-300"
                maxLength={6}
              />
              <button className="bg-blue-900 text-white px-6 rounded-lg hover:bg-blue-800 text-base font-medium whitespace-nowrap">
                Check
              </button>
            </div>
            <p className="text-sm text-green-600 mt-2">
              ✓ Free delivery available for this location
            </p>
          </div>

          {/* About Product */}
          <div>
            <h2 className="font-semibold text-lg mb-3">About This Product</h2>
            <ProductShortDescription
              shortDescription={product.shortDescription}
            />
          </div>

          {/* Product Specifications */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Product Specifications</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: "Brand/Model", value: product.meta?.Brands || "Hermès" },
                    { label: "Reference No", value: product.sku || "Round" },
                    { label: "Case Diameter", value: product.pieces || "1" },
                    { label: "Movement", value: "45 MM" },
                    { label: "Dial", value: "Leather" },
                    { label: "Wrist Size", value: "Leather" },
                    { label: "Accessories", value: "Leather" },
                    { label: "Condition", value: "Leather" },
                    { label: "Production Year", value: "Leather" },
                  ].map((item, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="p-3 font-medium bg-gray-50 w-1/3">{item.label}</td>
                      <td className="p-3">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Benefits & Return/Warranty Policy */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <h2 className="font-semibold text-lg mb-4 text-blue-900">Benefits & Policies</h2>
            
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

            <h3 className="font-semibold text-base mb-3 text-blue-900">Return & Warranty Policy</h3>
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

      {/* Reviews Section with lazy loading */}
      <Suspense
        fallback={
          <div className="h-48 xs:h-56 sm:h-64 bg-gray-100 mt-6 animate-pulse rounded-lg"></div>
        }
      >
        <ReviewsRating productId={id} />
        <SimilarProduct productId={id} />
      </Suspense>
    </div>
  );
};

const ProductShortDescription = ({ shortDescription }) => {
  const [showAll, setShowAll] = useState(false);

  if (!shortDescription) {
    return (
      <ul className="space-y-2 text-gray-700">
        <li className="flex items-start gap-2">
          <span className="text-gray-400 mt-1">•</span>
          Premium quality Hermès watch with authentic craftsmanship
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400 mt-1">•</span>
          Imported Swiss movement for precise timekeeping
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400 mt-1">•</span>
          Water resistant up to 50 meters
        </li>
      </ul>
    );
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(shortDescription, "text/html");
  const listItems = Array.from(doc.querySelectorAll("li"));
  const visibleItems = showAll ? listItems : listItems.slice(0, 6);

  return (
    <div className="text-gray-700">
      <ul className="space-y-2">
        {visibleItems.map((li, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="text-gray-400 mt-1">•</span>
            <span className="text-sm leading-relaxed">{li.textContent}</span>
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
};

export default ProductDetailPage;