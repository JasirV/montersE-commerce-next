"use client";
import React, {
  useState,
  useMemo,
  Suspense,
  useEffect,
  useContext,
  useRef,
  useCallback,
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
  FaSearchPlus,
  FaSearchMinus,
  FaCompress,
  FaHome,
  FaAngleRight,
  FaTimes,
} from "react-icons/fa";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa6";
import { Package } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import newCurrency from "../../../../assets/newSymbole.png";
import Image from "next/image";

import { addToCart, fetchProduct } from "@/service/productService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import SimilarProduct from "../../../../../src/components/ui/SimillarProduct";
import { GlobalContext } from "../../../../../src/components/shared/context/GlobalContext";
import axios from "axios";
import ShopByCategory from "@/features/product/ShopeByCatgeory";

// Toastify configuration function
const showToast = (message, type = "success") => {
  const backgroundColor =
    type === "success"
      ? "#4CAF50"
      : type === "error"
      ? "#F44336"
      : type === "info"
      ? "#2196F3"
      : type === "warning"
      ? "#FF9800"
      : "#333";

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

// ===========================
// ProductSpecifications Component (Separated from main component)
// ===========================
const ProductSpecifications = ({ product, activeTab, setActiveTab }) => {
  if (!product) return null;

  // Prepare Specification Data
  const specifications = [
    { label: "Brand", value: product.brand },
    { label: "Model", value: product.model },
    { label: "SKU", value: product.sku },
    { label: "Category", value: product.accessoryCategory || product.category },
    {
      label: "Subcategory",
      value: product.accessorySubCategory || product.subCategory,
    },
    { label: "Gender", value: product.gender },
    {
      label: "Material",
      value: product.accessoryMaterial?.join(", ") || product.material,
    },
    {
      label: "Color",
      value: product.accessoryColor?.join(", ") || product.color,
    },
    { label: "Condition", value: product.condition },
    { label: "Item Condition", value: product.itemCondition },
    { label: "Production Year", value: product.productionYear },
    {
      label: "Approximate Year",
      value: product.approximateYear ? "Yes" : null,
    },
    { label: "Year Unknown", value: product.unknownYear ? "Yes" : null },
    { label: "Serial Number", value: product.serialNumber },
    { label: "Reference Number", value: product.referenceNumber },
    {
      label: "What's Included",
      value:
        product.accessoryScopeOfDelivery?.join(", ") || product.scopeOfDelivery,
    },
    {
      label: "Delivery Includes",
      value: product.accessoryDelivery?.join(", ") || product.delivery,
    },
    { label: "Length", value: product.length },
    { label: "Width", value: product.width },
    { label: "Height", value: product.height },
    { label: "Weight", value: product.weight },
    { label: "Origin", value: product.origin },
    { label: "Warranty", value: product.warranty },
    { label: "Warranty Period", value: product.warrantyPeriod },
  ].filter(
    (spec) =>
      spec.value &&
      spec.value !== "" &&
      spec.value !== null &&
      spec.value !== undefined
  );

  const keyDetails = [
    { label: "Brand", value: product.brand },
    { label: "Model", value: product.model },
    { label: "SKU", value: product.sku },
  ].filter((spec) => spec.value);

  const conditionDetails = [
    { label: "Condition", value: product.condition },
    { label: "Item Condition", value: product.itemCondition },
    { label: "Production Year", value: product.productionYear },
    { label: "Gender", value: product.gender },
  ].filter((spec) => spec.value);

  const materialDetails = [
    { label: "Material", value: product.accessoryMaterial?.join(", ") },
    { label: "Color", value: product.accessoryColor?.join(", ") },
    { label: "Category", value: product.accessoryCategory },
    { label: "Subcategory", value: product.accessorySubCategory },
  ].filter((spec) => spec.value);

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12">
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
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Key Details */}
            {keyDetails.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Key Details</h3>
                <ul className="space-y-2 text-sm">
                  {keyDetails.map((item, i) => (
                    <li key={i}>
                      <span className="text-gray-600">{item.label}:</span>{" "}
                      <span className="text-gray-900">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Condition Details */}
            {conditionDetails.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Condition & Info</h3>
                <ul className="space-y-2 text-sm">
                  {conditionDetails.map((item, i) => (
                    <li key={i}>
                      <span className="text-gray-600">{item.label}:</span>{" "}
                      <span className="text-gray-900">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Material & Category */}
            {materialDetails.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold mb-3">Material & Category</h3>
                <ul className="space-y-2 text-sm">
                  {materialDetails.map((item, i) => (
                    <li key={i}>
                      <span className="text-gray-600">{item.label}:</span>{" "}
                      <span className="text-gray-900">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Complete Specifications Table */}
          {specifications.length > 0 && (
            <div className="bg-white rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold px-4 py-3 border-b">
                Complete Specifications
              </h3>

              <div className="divide-y">
                {specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 grid grid-cols-2 gap-2 text-sm"
                  >
                    <span className="font-medium text-gray-700">
                      {spec.label}
                    </span>
                    <span className="text-gray-900 text-right break-words">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DESCRIPTION TAB */}
      {activeTab === "description" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">About this product</h2>

          {product.description ? (
            <p className="text-gray-700 leading-relaxed text-sm">
              {product.description}
            </p>
          ) : (
            <p className="text-gray-500 text-sm">No description available</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Features */}
            {(product.accessoryMaterial ||
              product.accessoryColor ||
              product.accessoryCategory ||
              product.accessorySubCategory) && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">Features</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {product.accessoryMaterial && (
                    <li>• Material: {product.accessoryMaterial?.join(", ")}</li>
                  )}
                  {product.accessoryColor && (
                    <li>• Color: {product.accessoryColor?.join(", ")}</li>
                  )}
                  {product.accessoryCategory && (
                    <li>• Category: {product.accessoryCategory}</li>
                  )}
                  {product.accessorySubCategory && (
                    <li>• Subcategory: {product.accessorySubCategory}</li>
                  )}
                </ul>
              </div>
            )}

            {/* Condition */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-800">
                Condition Details
              </h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {product.itemCondition && <li>• {product.itemCondition}</li>}
                <li>• Authentic Product</li>
                <li>• Fast Delivery</li>
                <li>• Quality Checked</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-lg font-bold">{product.condition || "N/A"}</p>
          <p className="text-xs text-gray-500">Condition</p>
        </div>
        <div>
          <p className="text-lg font-bold">{product.gender || "Unisex"}</p>
          <p className="text-xs text-gray-500">Gender</p>
        </div>
        <div>
          <p className="text-lg font-bold">{product.stockQuantity || 0}</p>
          <p className="text-xs text-gray-500">Stock</p>
        </div>
        <div>
          <p className="text-lg font-bold">{product.productionYear || "—"}</p>
          <p className="text-xs text-gray-500">Year</p>
        </div>
      </div>
    </div>
  );
};

// ===========================
// RestockNotification Component (Separated from main component)
// ===========================
const RestockNotification = ({
  product,
  selectedImage,
  email,
  setEmail,
  isSubscribing,
  isSubscribed,
  handleRestockSubscribe,
  handleRestockUnsubscribe,
  setShowRestockInput,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price) => {
    if (!price) return "0";
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div
      className={`restock-notification ${
        isExpanded ? "expanded" : "collapsed"
      }`}
    >
      {/* Collapsed State */}
      {!isExpanded && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg">
                <FaBell className="text-white text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Get restocked first!
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  We'll notify you when it's back
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm"
            >
              Notify Me
            </button>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                  <FaBell className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg sm:text-xl">
                    Restock Alert
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Don't miss out when it's back!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Product Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 relative rounded-md overflow-hidden">
                <Image
                  src={
                    selectedImage || product.image || "/placeholder-image.jpg"
                  }
                  alt={product.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-red-500 font-bold text-sm">
                    ${formatPrice(product.salePrice || product.sellingPrice)}
                  </span>
                  {product.regularPrice >
                    (product.salePrice || product.sellingPrice) && (
                    <span className="text-gray-500 text-xs line-through">
                      ${formatPrice(product.regularPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-base"
                    autoFocus
                  />
                </div>
                {email && !/\S+@\S+\.\S+/.test(email) && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Please enter a valid email address
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                  <svg
                    className="w-4 h-4 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No spam</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                  <svg
                    className="w-4 h-4 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Instant alert</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                  <svg
                    className="w-4 h-4 text-green-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>1-click stop</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setShowRestockInput(false);
                  }}
                  className="flex-1 px-4 py-3 text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestockSubscribe}
                  disabled={
                    isSubscribing || !email || !/\S+@\S+\.\S+/.test(email)
                  }
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <FaBell className="text-white" />
                      Notify When Available
                    </>
                  )}
                </button>
              </div>

              {/* Terms */}
              <p className="text-center text-xs text-gray-500 pt-2">
                By subscribing, you agree to our{" "}
                <button className="text-blue-600 hover:underline">
                  Privacy Policy
                </button>{" "}
                and{" "}
                <button className="text-blue-600 hover:underline">Terms</button>
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .restock-notification {
          transition: all 0.3s ease;
        }

        .restock-notification.expanded {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .restock-notification.collapsed {
          margin-top: 0.5rem;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// ===========================
// ZoomModal Component (Separated from main component)
// ===========================
const ZoomModal = ({
  showZoomModal,
  setShowZoomModal,
  selectedImage,
  product,
  images,
  zoom,
  setZoom,
  position,
  setPosition,
  handleTouchStart,
  handleTouchMove,
  handleTouchPinch,
  handleTouchEnd,
  resetZoom,
  handleImageSelect,
}) => {
  if (!showZoomModal) return null;

  return (
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
        <div className="text-white text-sm">Pinch to zoom • Drag to pan</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((prev) => Math.max(1, prev - 0.5))}
            className="text-white p-2 bg-black bg-opacity-50 rounded-full"
          >
            <FaSearchMinus />
          </button>
          <span className="text-white text-sm w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(5, prev + 0.5))}
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
            transition: zoom === 1 ? "transform 0.3s ease" : "none",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <Image
            src={selectedImage || product.image || "/placeholder-image.jpg"}
            alt={product?.name || "Accessory Image"}
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
                  handleImageSelect(image);
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
};

// ===========================
// Breadcrumb Component (Separated from main component)
// ===========================
const Breadcrumb = ({ product, router }) => {
  const generateBreadcrumbs = () => {
    if (!product) return [];

    const crumbs = [];

    // Home (always first)
    crumbs.push({
      name: "Home",
      path: "/",
      icon: <FaHome className="text-sm" />,
    });

    // Option 1: Through Brand (If brand is available and meaningful)
    if (product.brand && product.brand.trim().length > 0) {
      crumbs.push({
        name: product.brand,
        path: `/brand/${encodeURIComponent(
          product.brand.toLowerCase().replace(/\s+/g, "-")
        )}`,
        type: "brand",
      });
    }

    // Option 2: Through Category Hierarchy (Fallback if no brand)
    if (!product.brand || product.brand.trim().length === 0) {
      // Main Category - Use accessoryCategory if available
      if (product.accessoryCategory || product.category) {
        crumbs.push({
          name: product.accessoryCategory || product.category,
          path: `/category/${(product.accessoryCategory || product.category)
            ?.toLowerCase()
            .replace(/\s+/g, "-")}`,
          type: "category",
        });
      }

      // Subcategory
      if (product.accessorySubCategory || product.subCategory) {
        crumbs.push({
          name: product.accessorySubCategory || product.subCategory,
          path: `/category/${(product.accessoryCategory || product.category)
            ?.toLowerCase()
            .replace(/\s+/g, "-")}/${(
            product.accessorySubCategory || product.subCategory
          )
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          type: "subcategory",
        });
      }
    }

    // Current Product (last, non-clickable)
    crumbs.push({
      name: product.name || "Accessory",
      path: null,
      isCurrent: true,
      type: "product",
    });

    return crumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="mb-4 sm:mb-6" aria-label="Breadcrumb">
      <div className="flex items-center flex-wrap gap-1 sm:gap-2">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {crumb.path ? (
              <button
                onClick={() => router.push(crumb.path)}
                className="group inline-flex items-center gap-1 sm:gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                {crumb.icon && (
                  <span className="text-gray-500 group-hover:text-blue-600 transition-colors">
                    {crumb.icon}
                  </span>
                )}
                <span className="font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">
                  {crumb.name}
                </span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-1 sm:gap-2">
                <span className="text-sm text-gray-400">
                  <FaAngleRight />
                </span>
                <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                  {crumb.name}
                </span>
              </div>
            )}

            {index < breadcrumbs.length - 1 && crumb.path && (
              <span className="text-gray-400 mx-1">
                <FaAngleRight className="text-xs" />
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

// ===========================
// Main Component
// ===========================
const AccessoriesDetails = () => {
  const { incrementWishlist, decrementWishlist, incrementCart, user } =
    useContext(GlobalContext);
  const router = useRouter();
  const { id } = useParams();

  const [product, setProducts] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [error, setError] = useState(null);

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

  // Tab state for specifications/description
  const [activeTab, setActiveTab] = useState("specifications");

  // Image states
  const [selectedImage, setSelectedImage] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const [visibleThumbnails, setVisibleThumbnails] = useState(4);

  // Check if product is sold out
  const isSoldOut = product?.stockQuantity === 0;

  // Memoize images array to prevent unnecessary re-renders
  const images = useMemo(() => product?.images || [], [product]);

  // Get visible thumbnails count based on screen size
  const getVisibleThumbnails = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 4; // Mobile
      if (window.innerWidth < 1024) return 5; // Tablet
      return 4; // Desktop
    }
    return 4;
  }, []);

  const maxThumbnailIndex = Math.max(0, images.length - visibleThumbnails);

  const handleThumbnailNavigate = useCallback(
    (direction) => {
      if (direction === "prev") {
        setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
      } else {
        setThumbnailStartIndex((prev) => Math.min(maxThumbnailIndex, prev + 1));
      }
    },
    [maxThumbnailIndex]
  );

  const visibleImages = images.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + visibleThumbnails
  );

  // Fetch product data
  useEffect(() => {
    const loadProducts = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchProduct({ id });
        setProducts(data || null);
        if (data?.images?.[0]?.url) {
          setSelectedImage(data.images[0].url);
        }
      } catch (err) {
        setError("Failed to load accessory details");
        console.error("Error loading accessory:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id]);

  // Set selected image when product loads
  useEffect(() => {
    if (product?.images?.[0]?.url) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  // Set user email if available
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  // Fetch wishlists and check if product is in wishlist
  useEffect(() => {
    const fetchWishlistsAndCheckWishlist = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token || !id) {
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

    if (id) {
      fetchWishlistsAndCheckWishlist();
    }
  }, [id]);

  // Handle window resize for thumbnails
  useEffect(() => {
    const handleResize = () => {
      setVisibleThumbnails(getVisibleThumbnails());
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getVisibleThumbnails]);

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

    setPosition((prev) => ({
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
    if (typeof navigator === "undefined") return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      navigator
        .share({
          title: product?.name || "Premium Accessory",
          text: "Check out this amazing accessory!",
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
      product?.name || "Premium Accessory"
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
    showToast(
      `Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      "success"
    );
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
        showToast("Accessory information is missing", "error");
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
        showToast(
          "You'll be notified when this accessory is back in stock!",
          "success"
        );
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
            "You're already subscribed to notifications for this accessory";
          setIsSubscribed(true);
          showToast(errorMessage, "info");
        } else if (error.response.status === 401) {
          errorMessage = "Please login again";
          showToast(errorMessage, "error");
          router.push("/login");
        } else if (error.response.status === 404) {
          errorMessage = "Accessory not found";
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
        showToast(
          "You've been unsubscribed from restock notifications",
          "success"
        );
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
            Accessory Not Available
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            The accessory you're looking for is currently unavailable.
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
      <ZoomModal
        showZoomModal={showZoomModal}
        setShowZoomModal={setShowZoomModal}
        selectedImage={selectedImage}
        product={product}
        images={images}
        zoom={zoom}
        setZoom={setZoom}
        position={position}
        setPosition={setPosition}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchPinch={handleTouchPinch}
        handleTouchEnd={handleTouchEnd}
        resetZoom={resetZoom}
        handleImageSelect={handleImageSelect}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-3 sm:py-4 px-2 sm:px-4">
        {/* Enhanced Breadcrumb Navigation */}
        <Breadcrumb product={product} router={router} />

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
          {/* Product Header */}
          <div className="border-b border-gray-100 p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                  {product.name || "Premium Accessory"}
                </h1>
              </div>

              {/* Action Buttons - Top Right */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-colors ${
                    wishlistLoading ? "opacity-50 cursor-not-allowed" : ""
                  } ${"bg-white border-gray-200 hover:bg-gray-50"}`}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
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
                    aria-label="Share product"
                  >
                    <FaShareAlt size={16} className="text-gray-600" />
                  </button>

                  {showShareOptions && (
                    <>
                      {/* Mobile Full Screen Share Options */}
                      <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
                        <div className="bg-white w-full rounded-t-2xl animate-slide-up">
                          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">
                              Share this accessory
                            </h3>
                            <button
                              onClick={() => setShowShareOptions(false)}
                              className="text-gray-500 hover:text-gray-700"
                              aria-label="Close share menu"
                            >
                              ✕
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 p-4">
                            {[
                              {
                                platform: "facebook",
                                icon: FaFacebookF,
                                color: "text-blue-600",
                                label: "Facebook",
                              },
                              {
                                platform: "twitter",
                                icon: FaTwitter,
                                color: "text-blue-400",
                                label: "Twitter",
                              },
                              {
                                platform: "pinterest",
                                icon: FaPinterest,
                                color: "text-red-600",
                                label: "Pinterest",
                              },
                              {
                                platform: "whatsapp",
                                icon: FaWhatsapp,
                                color: "text-green-500",
                                label: "WhatsApp",
                              },
                            ].map((item) => (
                              <button
                                key={item.platform}
                                onClick={() => handleSocialShare(item.platform)}
                                className="flex flex-col items-center gap-2 p-4 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                aria-label={`Share on ${item.label}`}
                              >
                                <item.icon
                                  className={`text-2xl ${item.color}`}
                                />
                                <span className="text-sm font-medium">
                                  {item.label}
                                </span>
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
                              Share this accessory
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-2 p-3">
                            <button
                              onClick={() => handleSocialShare("facebook")}
                              className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              aria-label="Share on Facebook"
                            >
                              <FaFacebookF className="text-blue-600 text-lg" />
                              <span>Facebook</span>
                            </button>
                            <button
                              onClick={() => handleSocialShare("twitter")}
                              className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              aria-label="Share on Twitter"
                            >
                              <FaTwitter className="text-blue-400 text-lg" />
                              <span>Twitter</span>
                            </button>
                            <button
                              onClick={() => handleSocialShare("pinterest")}
                              className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              aria-label="Share on Pinterest"
                            >
                              <FaPinterest className="text-red-600 text-lg" />
                              <span>Pinterest</span>
                            </button>
                            <button
                              onClick={() => handleSocialShare("whatsapp")}
                              className="flex flex-col items-center gap-2 p-3 text-xs text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              aria-label="Share on WhatsApp"
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
                className={`relative w-full h-64 sm:h-72 md:h-80 lg:h-[400px] xl:h-[500px] bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-100 cursor-${
                  typeof window !== "undefined" && window.innerWidth >= 768
                    ? isZoomed
                      ? "zoom-out"
                      : "zoom-in"
                    : "pointer"
                }`}
                onClick={handleImageClick}
                onWheel={handleWheel}
                onMouseLeave={resetZoom}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleImageClick(e);
                  }
                }}
                aria-label="Product image, click to zoom"
              >
                <div
                  ref={imageRef}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `scale(${zoom}) translate(${position.x}%, ${position.y}%)`,
                    transformOrigin: `${position.x}% ${position.y}%`,
                    transition: zoom === 1 ? "transform 0.3s ease" : "none",
                  }}
                >
                  <Image
                    src={
                      selectedImage || product.image || "/placeholder-image.jpg"
                    }
                    alt={product.name || "Accessory Image"}
                    width={600}
                    height={600}
                    className="object-contain w-full h-full p-2 select-none"
                    priority
                    draggable="false"
                  />
                </div>

                {/* Zoom Controls for Desktop */}
                {typeof window !== "undefined" && window.innerWidth >= 768 && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white bg-opacity-80 backdrop-blur-sm rounded-full p-2 shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoom((prev) => Math.max(1, prev - 0.5));
                        setIsZoomed(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      disabled={zoom <= 1}
                      aria-label="Zoom out"
                    >
                      <FaSearchMinus className="text-gray-700" size={14} />
                    </button>
                    <span className="text-xs font-medium text-gray-700 min-w-[40px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoom((prev) => Math.min(5, prev + 0.5));
                        setIsZoomed(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      disabled={zoom >= 5}
                      aria-label="Zoom in"
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
                        aria-label="Reset zoom"
                      >
                        <FaCompress className="text-gray-700" size={14} />
                      </button>
                    )}
                  </div>
                )}

                {/* Mobile Zoom Hint */}
                {typeof window !== "undefined" && window.innerWidth < 768 && (
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
                          {thumbnailStartIndex + 1}-
                          {Math.min(
                            thumbnailStartIndex + visibleThumbnails,
                            images.length
                          )}
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
                          aria-label="Previous thumbnails"
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
                          aria-label="Next thumbnails"
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
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleImageSelect(image);
                            }
                          }}
                          aria-label={`View image ${
                            thumbnailStartIndex + idx + 1
                          }`}
                        >
                          <Image
                            src={image.url || image}
                            alt={`Thumbnail ${thumbnailStartIndex + idx + 1}`}
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
                    {images.length > visibleThumbnails &&
                      typeof window !== "undefined" &&
                      window.innerWidth < 768 && (
                        <div className="text-center mt-3">
                          <button
                            onClick={() => {
                              // Scroll to see all thumbnails
                              const thumbnailsContainer =
                                document.querySelector(".thumbnails-container");
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
              <div
                className={`rounded-lg sm:rounded-xl p-4 sm:p-6 border ${
                  isSoldOut
                    ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
                }`}
              >
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div
                      className={`text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center ${
                        isSoldOut ? "text-gray-600" : "text-gray-900"
                      }`}
                    >
                      <Image
                        src={newCurrency}
                        alt="Currency"
                        width={24}
                        height={24}
                        className="mr-1 sm:mr-2 w-5 h-5 sm:w-7 sm:h-7"
                      />
                      {formatPrice(product.salePrice || product.sellingPrice) ||
                        "65,000"}
                    </div>
                    {product.regularPrice &&
                      product.regularPrice >
                        (product.salePrice || product.sellingPrice) && (
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

              {/* Enhanced Restock Notification Component */}
              {(showRestockInput || product.stockQuantity === 0) &&
                !isSubscribed && (
                  <RestockNotification
                    product={product}
                    selectedImage={selectedImage}
                    email={email}
                    setEmail={setEmail}
                    isSubscribing={isSubscribing}
                    isSubscribed={isSubscribed}
                    handleRestockSubscribe={handleRestockSubscribe}
                    handleRestockUnsubscribe={handleRestockUnsubscribe}
                    setShowRestockInput={setShowRestockInput}
                  />
                )}

              {/* Premium Features */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 py-3 sm:py-4">
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <FaHeadset className="text-blue-600 text-base sm:text-lg lg:text-xl mx-auto mb-1 sm:mb-2" />
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                    ACTIVE LISTEN
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    24/7 Support
                  </p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <FaShieldAlt className="text-blue-600 text-base sm:text-lg lg:text-xl mx-auto mb-1 sm:mb-2" />
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                    SECURE
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    Premium Service
                  </p>
                </div>
                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                  <Package className="text-blue-600 text-base sm:text-lg lg:text-xl mx-auto mb-1 sm:mb-2" />
                  <h3 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                    AUTHENTIC
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 truncate">
                    Genuine Accessory
                  </p>
                </div>
              </div>

              {/* Product Description - Now moved to tabs */}
              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <ProductSpecifications
                  product={product}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
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
        <ShopByCategory />
      </Suspense>
    </div>
  );
};

// Add styles component
const Styles = () => {
  useEffect(() => {
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
      
      /* Enhanced mobile-friendly styles */
      @media (max-width: 640px) {
        /* Better touch targets */
        button, 
        .clickable {
          min-height: 44px;
          min-width: 44px;
        }
        
        /* Improved spacing for mobile */
        .mobile-padding {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        
        /* Better text readability */
        .mobile-text {
          font-size: 14px;
          line-height: 1.5;
        }
        
        /* Modal improvements */
        .mobile-modal {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          border-radius: 20px 20px 0 0;
        }
        
        /* Input improvements */
        input, 
        textarea {
          font-size: 16px !important; /* Prevents zoom on iOS */
        }
        
        /* Tab improvements for mobile */
        .sticky-tabs {
          position: sticky;
          top: 0;
          z-index: 20;
          background: white;
        }
      }
      
      /* Breadcrumb improvements */
      .breadcrumb-item {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      /* Restock notification specific styles */
      .restock-notification {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .restock-notification .expanded {
        max-height: 500px;
        opacity: 1;
      }
      
      .restock-notification .collapsed {
        max-height: 100px;
        opacity: 1;
      }
      
      /* Better focus states for accessibility */
      button:focus-visible,
      a:focus-visible,
      input:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      
      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* Hide scrollbar but keep functionality */
      .scrollbar-none {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      
      .scrollbar-none::-webkit-scrollbar {
        display: none;
      }
      
      /* Specification card styles */
      .spec-card {
        transition: all 0.3s ease;
      }
      
      .spec-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }
      
      /* Tab underline animation */
      .tab-underline {
        transition: all 0.3s ease;
      }
      
      /* Responsive table styles */
      @media (max-width: 640px) {
        .responsive-table-row {
          flex-direction: column;
          align-items: flex-start;
          padding: 0.75rem 0;
        }
        
        .responsive-table-row span:first-child {
          margin-bottom: 0.25rem;
        }
      }
    `;

    const styleElement = document.createElement("style");
    styleElement.textContent = style;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return null;
};

// Wrap the main component with Styles
const AccessoriesDetailsWithStyles = () => (
  <>
    <Styles />
    <AccessoriesDetails />
  </>
);

export default AccessoriesDetailsWithStyles;
