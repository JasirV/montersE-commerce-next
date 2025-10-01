"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiLock,
  FiShare2,
  FiMoreHorizontal,
  FiPlus,
  FiTrash2,
  FiChevronLeft,
  FiGrid,
  FiList,
  FiStar,
  FiGlobe,
  FiUser,
  FiShoppingCart,
  FiEye,
} from "react-icons/fi";
import Image from "next/image";
import watch from "../../assets/Watche/elegant-watch-with-silver-golden-chain-isolated.jpg";
import CreateWishlistModal from "../ui/createWishilist";
import SeWishilistModal from "../ui/seeWishilist";
import axios from "axios";



const ShoppingWishlist = () => {
  const [activeWishlist, setActiveWishlist] = useState(null);
  const [wishlistData, setWishlistData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showWishlistSidebar, setShowWishlistSidebar] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [open, setOpen] = useState(false);
  const [WishilistOpn, setWishilistOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem("token");
    console.log(storedToken, "storedToken");

    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    const fetchWishlists = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "http://localhost:9000/api/products/wishlists",
          {
            headers: {
              Authorization: `Bearer ${token}`, // add token directly here
            },
          }
        );

        console.log(response, "my response");

        const wishlists = response.data.wishlists || [];
        setWishlistData(wishlists);

        if (wishlists.length > 0) {
          const defaultWishlist =
            wishlists.find((w) => w.isDefault) || wishlists[0];
          setActiveWishlist(defaultWishlist);
        } else {
          setActiveWishlist(null);
        }
      } catch (err) {
        console.error("Error fetching wishlists:", err);
        setError(err.response?.data?.message || "Failed to load wishlists");
        setWishlistData([]);
        setActiveWishlist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlists();
  }, [token]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // API Functions
  const handleDeleteItem = async (wishlistId, itemId) => {
   
  };

  const handleMakeDefault = async () => {
  
  };

  const handleTogglePublicSharing = async () => {
   
  };

  const handleEmptyWishlist = async () => {
 
  };



const handleDeleteWishlist = async (wishlistId) => {
  try {
    // Make DELETE request to backend
    const response = await axios.delete(
      `http://localhost:9000/api/products/wishlists/${wishlistId}`, // replace with your actual endpoint
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if you are using token auth
        },
      }
    );

    console.log(response,"delete");
    

    // Optionally, update frontend state after deletion
    if (response.status === 200) {
      console.log(response.data.message); // "Wishlist deleted successfully"
      
      // Assuming you have wishlistData state
      setWishlistData(response.data.wishlists);
    }
  } catch (error) {
    console.error("Error deleting wishlist:", error);
    alert(error.response?.data?.message || "Failed to delete wishlist");
  }
};


  // Handle wishlist creation success
  const handleWishlistCreated = () => {
    fetchWishlists();
    setOpen(false);
  };

  const activeList = activeWishlist || wishlistData[0] || { items: [] };

  // More Options Dropdown Component
  const MoreOptionsDropdown = () => (
    <div
      ref={dropdownRef}
      className={`absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-200 ${
        moreDropdownOpen
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="p-2">
        {/* Make this default wishlist */}
        <button
          onClick={handleMakeDefault}
          disabled={activeList?.isDefault}
          className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
            activeList?.isDefault
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiStar className="mr-3 text-gray-500" size={16} />
          <span>Make this default wishlist</span>
        </button>

        {/* Enable/Disable Public Sharing */}
        <button
          onClick={handleTogglePublicSharing}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <FiGlobe className="mr-3 text-gray-500" size={16} />
          <span>
            {activeList?.isPublic ? "Disable" : "Enable"} Public Sharing
          </span>
        </button>

        {/* Empty Wishlist */}
        <button
          onClick={handleEmptyWishlist}
          disabled={!activeList?.items || activeList.items.length === 0}
          className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
            !activeList?.items || activeList.items.length === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FiTrash2 className="mr-3" size={16} />
          <span>Empty Wishlist</span>
        </button>

        {/* Delete Wishlist */}
        <button
          onClick={handleDeleteWishlist}
          disabled={activeList?.isDefault || wishlistData.length <= 1}
          className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
            activeList?.isDefault || wishlistData.length <= 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-red-600 hover:bg-red-50"
          }`}
        >
          <FiTrash2 className="mr-3" size={16} />
          <span>Delete Wishlist</span>
        </button>
      </div>
    </div>
  );

  // Mobile wishlist selector
  const MobileWishlistSelector = () => (
    <div className="lg:hidden mb-4">
      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWishlistSidebar(true)}
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <span className="capitalize">
              {activeList?.name || "No wishlists"}
            </span>
            {activeList?.isDefault && (
              <span className="text-xs bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-2 py-1 rounded">
                Default
              </span>
            )}
            {activeList?.isPublic && (
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                Public
              </span>
            )}
          </button>
        </div>
        <FiChevronLeft className="transform rotate-270" />
      </div>

      {/* Wishlist Sidebar Modal */}
      {showWishlistSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Wishlists</h2>
                <button
                  onClick={() => setShowWishlistSidebar(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FiChevronLeft size={20} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              {wishlistData.map((list) => (
                <div
                  key={list.id}
                  onClick={() => {
                    setActiveWishlist(list);
                    setShowWishlistSidebar(false);
                  }}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    activeWishlist?.id === list.id
                      ? "border-[#1e518e] bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium capitalize text-gray-800">
                      {list.name}
                    </h3>
                    <div className="flex gap-1">
                      {list.isDefault && (
                        <span className="text-xs bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                      {list.isPublic && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    {list.items && list.items.length > 0
                      ? `${list.items.length} items`
                      : "No items"}
                    <FiLock className="ml-2" size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col w-full p-3 sm:p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 lg:pb-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e518e] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading wishlists...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && wishlistData.length === 0) {
    return (
      <div className="flex flex-col w-full p-3 sm:p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 lg:pb-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-2">Error</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchWishlists}
              className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-3 sm:p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 lg:pb-6">
      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-700 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Wishlist
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded-lg font-medium text-sm md:text-base w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FiPlus size={18} />
          CREATE NEW WISHLIST
        </button>
        <CreateWishlistModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onWishlistCreated={handleWishlistCreated}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Left Side - Wishlists (Desktop only) */}
        <div className="hidden lg:block lg:w-1/4">
          <div className="flex flex-col gap-2">
            {wishlistData.map((list, index) => (
              <div
                key={list.id || index} // fallback to index if id is missing
                onClick={() => setActiveWishlist(list)}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  activeWishlist?.id === list.id
                    ? "border-[#1e518e] bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium capitalize text-gray-800">
                    {list.name}
                  </h3>
                  <div className="flex gap-1">
                    {list.isDefault && (
                      <span className="text-xs bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                    {list.isPublic && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                        Public
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  {list.items && list.items.length > 0
                    ? `${list.items.length} items`
                    : "No items"}
                  <FiLock className="ml-2" size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Active Wishlist */}
        <div className="lg:w-3/4">
          {/* Mobile Wishlist Selector */}
          <MobileWishlistSelector />

          {/* Wishlist Header */}
          {activeList && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 p-4 bg-white rounded-lg shadow-sm relative">
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-semibold capitalize text-gray-800 lg:block hidden">
                  {activeList.name}
                </h2>
                <div className="flex gap-1">
                  {activeList.isDefault && (
                    <span className="text-xs bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                  {activeList.isPublic && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                      Public
                    </span>
                  )}
                </div>
              </div>

              {/* View Mode Toggle */}
              {activeList.items && activeList.items.length > 0 && (
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <FiGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <FiList size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button
                  className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none justify-center hover:bg-gray-50 transition-colors"
                  onClick={() => setWishilistOpen(true)}
                >
                  <FiShare2 size={16} />{" "}
                  <span className="hidden xs:inline">Share</span>
                </button>
                <SeWishilistModal
                  isOpen={WishilistOpn}
                  onClose={() => setWishilistOpen(false)}
                />

                {/* More Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                    className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none justify-center hover:bg-gray-50 transition-colors"
                  >
                    <FiMoreHorizontal size={16} />{" "}
                    <span className="hidden xs:inline">More</span>
                  </button>

                  {/* Dropdown Menu */}
                  <MoreOptionsDropdown />
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Items */}
          {activeList && activeList.items && activeList.items.length > 0 ? (
            <div
              className={`
              ${
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                  : "flex flex-col gap-3"
              }
            `}
            >
              {activeList.items.map((item) => (
                <div
                  key={item.id}
                  className={`
                    border border-gray-200 rounded-lg bg-white group relative transition-all duration-200
                    ${
                      viewMode === "grid"
                        ? "p-3 hover:shadow-lg"
                        : "flex gap-3 p-3 hover:shadow-md"
                    }
                  `}
                >
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteItem(activeList.id, item.id)}
                    className={`
                      absolute bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10
                      ${
                        viewMode === "grid"
                          ? "-top-2 -right-2"
                          : "-top-1 -right-1"
                      }
                    `}
                    title="Remove item"
                  >
                    <FiTrash2 size={12} />
                  </button>

                  {/* Image Container */}
                  <div
                    className={`
                    relative mb-3
                    ${
                      viewMode === "grid"
                        ? "w-full h-28 sm:h-32 md:h-36"
                        : "w-20 h-20 flex-shrink-0 mb-0"
                    }
                  `}
                  >
                    <Image
                      src={item.image || watch}
                      alt={item.name}
                      fill
                      className="object-contain rounded-lg"
                      sizes={
                        viewMode === "grid"
                          ? "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          : "80px"
                      }
                    />
                  </div>

                  {/* Product Info */}
                  <div className={viewMode === "list" ? "flex-1 min-w-0" : ""}>
                    <h3
                      className={`
                      font-medium line-clamp-2 text-gray-800
                      ${
                        viewMode === "grid"
                          ? "text-xs sm:text-sm min-h-[2.5rem] mb-2"
                          : "text-sm mb-1"
                      }
                    `}
                    >
                      {item.name}
                    </h3>

                    <div className="flex items-center text-yellow-500 text-xs mb-1">
                      ⭐ {item.rating || "4.5"}
                      <span className="ml-1 text-gray-500">
                        ({item.reviews || "0"})
                      </span>
                    </div>

                    <p
                      className={`
                      font-semibold text-gray-900
                      ${
                        viewMode === "grid" ? "text-base md:text-lg" : "text-lg"
                      }
                    `}
                    >
                      AED{item.price || "0.00"}
                    </p>

                    {/* Action Buttons */}
                    <div
                      className={`
                      flex gap-2
                      ${viewMode === "grid" ? "mt-3" : "mt-2"}
                    `}
                    >
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`
                          bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-2 rounded font-medium hover:from-[#1e518e]/90 hover:to-[#0061b0ee]/90 transition-all duration-200 shadow hover:shadow-md
                          ${
                            viewMode === "grid"
                              ? "flex-1 text-xs"
                              : "px-3 text-sm"
                          }
                        `}
                      >
                        Add to Cart
                      </button>

                      <button
                        onClick={() => handleViewProduct(item)}
                        className={`border border-gray-300 text-gray-700 py-2 rounded font-medium hover:bg-gray-50 transition-colors ${
                          viewMode === "grid"
                            ? "flex-1 text-xs"
                            : "px-3 text-sm"
                        }`}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <div className="text-gray-400 mb-3">
                <FiLock size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">
                No items yet
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Start adding items to your wishlist
              </p>
              <button className="mt-4 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                Browse Products
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-2xl z-40">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center text-xs text-[#1e518e] font-medium">
            <div className="w-10 h-10 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="mt-1">Wishlists</span>
          </button>

          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center text-xs text-gray-600"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow">
              <FiPlus size={18} className="text-gray-600" />
            </div>
            <span className="mt-1">New</span>
          </button>

          <button
            className="flex flex-col items-center text-xs text-gray-600"
            onClick={() => setWishilistOpen(true)}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow">
              <FiShare2 size={16} className="text-gray-600" />
            </div>
            <span className="mt-1">Share</span>
          </button>
          <SeWishilistModal
            isOpen={WishilistOpn}
            onClose={() => setWishilistOpen(false)}
          />

          {/* Mobile More Button */}
          <div className="relative">
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="flex flex-col items-center text-xs text-gray-600"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow">
                <FiMoreHorizontal size={16} className="text-gray-600" />
              </div>
              <span className="mt-1">More</span>
            </button>

            {/* Mobile Dropdown - Positioned above the navigation */}
            {moreDropdownOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="p-2">
                  <button
                    onClick={handleMakeDefault}
                    disabled={activeList?.isDefault}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                      activeList?.isDefault
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FiStar className="mr-3 text-gray-500" size={16} />
                    <span>Make this default wishlist</span>
                  </button>

                  <button
                    onClick={handleTogglePublicSharing}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <FiGlobe className="mr-3 text-gray-500" size={16} />
                    <span>
                      {activeList?.isPublic ? "Disable" : "Enable"} Public
                      Sharing
                    </span>
                  </button>

                  <button
                    onClick={handleEmptyWishlist}
                    disabled={
                      !activeList?.items || activeList.items.length === 0
                    }
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                      !activeList?.items || activeList.items.length === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FiTrash2 className="mr-3" size={16} />
                    <span>Empty Wishlist</span>
                  </button>

                  <button
                    onClick={handleDeleteWishlist}
                    disabled={activeList?.isDefault || wishlistData.length <= 1}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                      activeList?.isDefault || wishlistData.length <= 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                  >
                    <FiTrash2 className="mr-3" size={16} />
                    <span>Delete Wishlist</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingWishlist;
