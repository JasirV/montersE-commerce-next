"use client";
import React, { useState, useMemo, lazy, Suspense, useEffect } from "react";
import { FaPlayCircle, FaHeart, FaShareAlt } from "react-icons/fa";
import {
  FaShieldAlt,
  FaHeadset,
  FaUndo,
  FaQuestionCircle,
  FaExchangeAlt,
  FaBoxOpen,
  FaThumbsDown,
} from "react-icons/fa";
import { useParams } from "next/navigation";

// Lazy load components
const ReviewsRatings = lazy(() => import("./ReviewsRatings"));
// import advertiseVideo from "../../assets/6811913-hd_1920_1080_25fps (1).mp4";
import Image from "next/image";
import { fetchProduct } from "@/service/productService";

const ProductDetailPage = () => {
  // const location = useLocation();
  const [product, setProducts] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
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

  const [showVideo, setShowVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0]?.url || defaultImage
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Memoize images array to prevent unnecessary re-renders
  const images = useMemo(() => product?.images || [], [product]);

  if (!product || Object.keys(product).length === 0) {
    return (
      <div className="text-center mt-10 text-red-500">
        Product not found. Please go back and try again.
      </div>
    );
  }

  // Toggle wishlist
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // API call for wishlist can go here
  };

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
  const renderShortDescription = (text) => {
  if (!text) return null;
  return (
    <ul className="list-disc ml-4 xs:ml-5 text-xs xs:text-sm text-gray-700 space-y-1">
      {text.split("\n").map((line, idx) =>
        line.trim() ? (
          <li key={idx} className="text-xs xs:text-sm text-gray-700">
            {line.trim()}
          </li>
        ) : null
      )}
    </ul>
  );
};



  return (
    <div className="bg-gray-100 min-h-screen py-3 xs:py-4 sm:py-6 px-2 xs:px-3 sm:px-4">
      {/* Add viewport meta tag to control zoom and scaling */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
      />

      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-3 xs:p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 sm:gap-6 md:gap-8">
        {/* ===== Left Section - Images with Magnify ===== */}
        <div>
          <div className="relative">
            {/* Wishlist & Share Buttons */}
            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
              <button
                onClick={handleWishlistToggle}
                className="bg-white p-1.5 xs:p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <FaHeart
                  size={16}
                  className={isWishlisted ? "text-red-500" : "text-gray-600"}
                />
              </button>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={handleShareClick}
                  className="bg-white p-1.5 xs:p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  aria-label="Share product"
                >
                  <FaShareAlt size={16} className="text-gray-600" />
                </button>

                {/* Dropdown for Share */}
                {showShareOptions && (
                  <div className="absolute right-0 mt-2 w-40 xs:w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <button
                      onClick={() => handleSocialShare("facebook")}
                      className="block px-3 xs:px-4 py-2 text-xs xs:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Share on Facebook
                    </button>
                    <button
                      onClick={() => handleSocialShare("twitter")}
                      className="block px-3 xs:px-4 py-2 text-xs xs:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Share on Twitter
                    </button>
                    <button
                      onClick={() => handleSocialShare("pinterest")}
                      className="block px-3 xs:px-4 py-2 text-xs xs:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Share on Pinterest
                    </button>
                    <button
                      onClick={() => handleSocialShare("whatsapp")}
                      className="block px-3 xs:px-4 py-2 text-xs xs:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Share on WhatsApp
                    </button>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(window.location.href)
                      }
                      className="block px-3 xs:px-4 py-2 text-xs xs:text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Product Image */}
            <div className="w-full h-64 xs:h-72 sm:h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={selectedImage || defaultImage}
                alt={product.title || "Product Image"}
                width={500}
                height={500}
                className="object-contain"
              />
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex flex-wrap gap-2 xs:gap-3 mt-3 xs:mt-4">
            {images.map((image, idx) => (
              <Image
                key={idx}
                src={image.url || image}
                alt={`${product.title || "Product"} thumbnail ${idx + 1}`}
                onClick={() => handleImageSelect(image)}
                loading="lazy"
                width={64}
                height={64}
                className={`w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 object-cover rounded-md border cursor-pointer ${
                  selectedImage === (image.url || image)
                    ? "border-red-500 border-2"
                    : "border-gray-300 hover:border-red-300"
                }`}
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            ))}

            {/* Video Thumbnail */}
            {/* <div
              onClick={() => setShowVideo(true)}
              className="relative w-14 h-14 xs:w-16 xs:h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border cursor-pointer hover:border-red-500"
            >
              <Image
                src={selectedImage}
                alt="watch-video"
                className="object-cover"
                loading="lazy"
                fill
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <FaPlayCircle size={20} className="text-white" />
              </div>
            </div> */}
          </div>
        </div>

        {/* ===== Right Section - Details ===== */}
        <div>
          {/* Product Title */}
          <h1 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-2">
            {product.name ||
              "Hermès Kelly Red Watch 20mm – Classic Imported Watch Model For Men"}
          </h1>

          {/* Ratings */}
          <div className="flex items-center gap-2 mb-3 xs:mb-4">
            <span className="bg-green-600 text-white text-xs xs:text-sm px-2 py-1 rounded">
              {product.rating || "4.6"} ★
            </span>
            <span className="text-gray-600 text-xs xs:text-sm">
              ({product.reviewCount || 8} Reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-xl xs:text-2xl sm:text-3xl font-bold text-red-600 mb-1 xs:mb-2">
            {product.salePrice || "₹65,000"}
          </div>
          <p className="text-gray-500 text-sm xs:text-base mb-3 xs:mb-4">
            <span className="line-through">
              {product.regularPrice || "600.00 AED"}
            </span>
            <span className="text-green-600 ml-2">28% OFF</span>
          </p>

          {/* Offers Section */}
          <div className="border rounded-lg p-3 xs:p-4 mb-3 xs:mb-4 bg-green-50">
            <h2 className="font-semibold text-sm xs:text-base mb-2">
              Offers And Coupons
            </h2>
            <ul className="list-disc ml-4 xs:ml-5 text-xs xs:text-sm text-gray-700 space-y-1">
              <li>
                Pay Online & Get EXTRA 2.5% OFF on BELL Inverter Welding
                Machines
              </li>
              <li>Get GST Invoice And Save Up To 18% on Business Purchases</li>
              <li>
                On Min. Purchase Of Rs. 3000 Across Banks And Rs. 4500 For Bajaj
                Finserv
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6">
            <button className="flex-1 bg-blue-900 text-white py-2 xs:py-3 rounded-lg font-semibold hover:bg-blue-800 text-sm xs:text-base">
              ADD TO CART
            </button>
            <button className="flex-1 bg-red-600 text-white py-2 xs:py-3 rounded-lg font-semibold hover:bg-red-500 text-sm xs:text-base">
              BUY NOW
            </button>
          </div>

          {/* Delivery Details */}
          <div className="mb-4 xs:mb-5 sm:mb-6">
            <h2 className="font-semibold text-sm xs:text-base mb-2">
              Delivery Details
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Your Pincode"
                className="flex-1 border rounded-lg px-3 py-2 outline-none focus:border-red-500 text-sm xs:text-base"
              />
              <button className="bg-blue-900 text-white px-3 xs:px-4 rounded-lg hover:bg-blue-800 text-sm xs:text-base">
                Check
              </button>
            </div>
          </div>

          {/* About Product */}
          <div className="mb-4 xs:mb-5 sm:mb-6">
            <h2 className="font-semibold text-sm xs:text-base mb-2">
              About This Product
            </h2>
            {/* {product.shortDescription ? (
              <div
                className="text-xs xs:text-sm text-gray-700 space-y-1"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }} // this inside have ul tage iwant the same styling
              />
            ) : (
              <ul className="list-disc ml-4 xs:ml-5 text-xs xs:text-sm text-gray-700 space-y-1">
                <li>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </li>
                <li>
                  Phasellus dolor dolor, dapibus in urna a, malesuada fermentum
                  ex.
                </li>
                <li>
                  Morbi tempor libero sit amet lectus faucibus, nec fringilla
                  ligula finibus.
                </li>
              </ul>
            )}

            <button className="text-red-600 text-xs xs:text-sm mt-1 xs:mt-2 hover:underline">
              Show All Key Features
            </button> */}
            <ProductShortDescription shortDescription={product.shortDescription}/>
          </div>

          {/* Product Specifications */}
          <div className="mb-4 xs:mb-5 sm:mb-6">
            <h2 className="font-semibold text-sm xs:text-base mb-2">
              Product Specifications
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs xs:text-sm border">
                <tbody>
                  <tr className="border">
                    <td className="p-2 font-medium">Brand/Model</td>
                    <td className="p-2">{product.meta.Brands || "Hermès"}</td>
                  </tr>
                  <tr className="border">
                    <td className="p-2 font-medium">Reference No</td>
                    <td className="p-2">{product.sku||"Round"}</td>
                  </tr>
                  <tr className="border">
                    <td className="p-2 font-medium">Case Diameter</td>
                    <td className="p-2">{product.pieces || "1"}</td>
                  </tr>
                  <tr className="border">
                    <td className="p-2 font-medium">Movement</td>
                    <td className="p-2">45 MM</td>
                  </tr>
                  <tr className="border">
                    <td className="p-2 font-medium">Dial</td>
                    <td className="p-2">Leather</td>
                  </tr>
                  <tr className="border">
                    <td className="p-2 font-medium">Wrist Size</td>
                    <td className="p-2">Leather</td>
                  </tr>
                  <tr className="border">
                    <td className="p-2 font-medium">Accessories</td>
                    <td className="p-2">Leather</td>
                  </tr>
                  <tr className="border">
                    <td className="p-2 font-medium">Condition</td>
                    <td className="p-2">Leather</td>
                  </tr>
                  <tr className="border">
                    <td className="p-2 font-medium">Production Year</td>
                    <td className="p-2">Leather</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Product Video Preview */}
          <div className="mb-4 xs:mb-5 sm:mb-6">
            <h2 className="font-semibold text-sm xs:text-base mb-2">
              Product Videos
            </h2>
            <div
              onClick={() => setShowVideo(true)}
              className="relative rounded-lg overflow-hidden border cursor-pointer"
            >
              <Image
                src={selectedImage}
                alt="product video"
                className="w-full h-40 object-cover"
                loading="lazy"
                fill
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <FaPlayCircle size={28} className="text-white" />
              </div>
            </div>
          </div>

          {/* Benefits & Return/Warranty Policy */}
          <div className="border rounded-lg p-3 xs:p-4 mb-4 xs:mb-5 sm:mb-6">
            <h2 className="font-semibold text-sm xs:text-base mb-3 xs:mb-4">
              Benefits
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4 mb-3 xs:mb-4">
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-blue-600 text-sm xs:text-base" />
                <span className="text-xs xs:text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <FaHeadset className="text-blue-600 text-sm xs:text-base" />
                <span className="text-xs xs:text-sm">365 Days Help Desk</span>
              </div>
            </div>

            <h2 className="font-semibold text-sm xs:text-base mb-3 xs:mb-4">
              Return & Warranty Policy
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
              <div className="flex items-center gap-2">
                <FaUndo className="text-blue-600 text-sm xs:text-base" />
                <span className="text-xs xs:text-sm">
                  Upto 7 Days Returnable
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaQuestionCircle className="text-blue-600 text-sm xs:text-base" />
                <span className="text-xs xs:text-sm">Missing Product</span>
              </div>
              <div className="flex items-center gap-2">
                <FaExchangeAlt className="text-blue-600 text-sm xs:text-base" />
                <span className="text-xs xs:text-sm">Wrong Product</span>
              </div>
              <div className="flex items-center gap-2">
                <FaBoxOpen className="text-blue-600 text-sm xs:text-base" />
                <span className="text-xs xs:text-sm">Damaged Product</span>
              </div>
              <div className="flex items-center gap-2">
                <FaThumbsDown className="text-blue-600 text-sm xs:text-base" />
                <span className="text-xs xs:text-sm">Defective Product</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section with lazy loading */}
      <Suspense
        fallback={
          <div className="h-48 xs:h-56 sm:h-64 bg-gray-100 mt-4 xs:mt-5 sm:mt-6 animate-pulse rounded-lg"></div>
        }
      >
        <ReviewsRatings productId={id} />
      </Suspense>

      {/* Video Modal */}
      {/* {showVideo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 xs:p-3 sm:p-4">
          <div className="bg-white rounded-lg shadow-lg w-full xs:w-11/12 md:w-3/4 lg:w-1/2 relative">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-8 xs:-top-10 right-0 xs:right-2 bg-red-600 text-white p-1 xs:p-2 rounded text-xs xs:text-sm"
            >
              Close X
            </button>
            <video controls autoPlay className="w-full rounded-lg">
              <source src={advertiseVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )} */}
    </div>
  );
};




const ProductShortDescription = ({ shortDescription }) => {
  const [showAll, setShowAll] = useState(false);

  if (!shortDescription) {
    // fallback content if no description
    return (
      <ul className="list-disc ml-4 xs:ml-5 text-xs xs:text-sm text-gray-700 space-y-1">
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
        <li>Phasellus dolor dolor, dapibus in urna a, malesuada fermentum ex.</li>
        <li>Morbi tempor libero sit amet lectus faucibus, nec fringilla ligula finibus.</li>
      </ul>
    );
  }

  // Convert the HTML string into DOM nodes to style <li> properly
  const parser = new DOMParser();
  const doc = parser.parseFromString(shortDescription, "text/html");
  const listItems = Array.from(doc.querySelectorAll("li"));

  // Limit initially to 6 items
  const visibleItems = showAll ? listItems : listItems.slice(0, 6);

  return (
    <div className="text-xs xs:text-sm text-gray-700 space-y-1">
      <ul className="list-disc ml-4 xs:ml-5 space-y-1">
        {visibleItems.map((li, idx) => (
          <li key={idx} className="text-xs xs:text-sm text-gray-700">
            {li.textContent}
          </li>
        ))}
      </ul>

      {listItems.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-red-600 text-xs xs:text-sm mt-1 xs:mt-2 hover:underline"
        >
          {showAll ? "Show Less" : "Show All Key Features"}
        </button>
      )}
    </div>
  );
};
export default ProductDetailPage;


