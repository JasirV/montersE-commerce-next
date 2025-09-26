"use client";
import React, { useState, useEffect } from "react";
import { FiLock, FiShare2, FiMoreHorizontal, FiPlus, FiTrash2, FiChevronLeft, FiGrid, FiList } from "react-icons/fi";
import Image from "next/image";
import watch from '../../assets/bag-hanging-from-furniture-item-indoors.jpg'
import SupportSection from "./SupportSection";
import CreateWishlistModal from "../ui/createWishilist";
import SeWishilistModal from '../ui/seeWishilist'

// Sample data
const wishlists = [
  {
    id: 1,
    name: "farhan",
    items: [
      {
        id: 101,
        name: "Apple Watch Ultra 3 GPS + Cellular 49mm Black Titanium Case",
        price: "3,199",
        rating: 5.0,
        reviews: 2,
        image: watch,
      },
      {
        id: 102,
        name: "Apple iPhone 17 Pro 256 GB Cosmic Orange 5G",
        price: "5,049",
        rating: 4.4,
        reviews: 49,
        image: watch,
      },
      {
        id: 103,
        name: "MacBook Pro 16-inch M3 Max",
        price: "7,299",
        rating: 4.8,
        reviews: 32,
        image: watch,
      },
      {
        id: 104,
        name: "AirPods Pro 3rd Generation",
        price: "1,299",
        rating: 4.7,
        reviews: 128,
        image: watch,
      },
      {
        id: 105,
        name: "iPad Pro 12.9-inch M2",
        price: "4,299",
        rating: 4.9,
        reviews: 67,
        image: watch,
      },
      {
        id: 106,
        name: "Samsung Galaxy S24 Ultra",
        price: "4,899",
        rating: 4.6,
        reviews: 89,
        image: watch,
      },
    ],
    isDefault: true,
  },
  { 
    id: 2, 
    name: "Muhammad", 
    items: [], 
    isDefault: false 
  },
  { 
    id: 3, 
    name: "Birthday", 
    items: [], 
    isDefault: false 
  },
];

const ShoppingWishlist = () => {
  const [activeWishlist, setActiveWishlist] = useState(wishlists[0]);
  const [wishlistData, setWishlistData] = useState(wishlists);
  const [isMobile, setIsMobile] = useState(false);
  const [showWishlistSidebar, setShowWishlistSidebar] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [open, setOpen] = useState(false);
  const [WishilistOpn,setWishilistOpen]= useState(false)

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDeleteItem = (wishlistId, itemId) => {
    setWishlistData(prevData => 
      prevData.map(wishlist => 
        wishlist.id === wishlistId 
          ? {
              ...wishlist,
              items: wishlist.items.filter(item => item.id !== itemId)
            }
          : wishlist
      )
    );
  };

  const activeList = wishlistData.find(list => list.id === activeWishlist.id) || wishlistData[0];

  // Mobile wishlist selector
  const MobileWishlistSelector = () => (
    <div className="lg:hidden mb-4">
      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowWishlistSidebar(true)}
            className="flex items-center gap-2 text-gray-700 font-medium"
          >
            <span className="capitalize">{activeList.name}</span>
            {activeList.isDefault && (
              <span className="text-xs bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-2 py-1 rounded">
                Default
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
                    activeWishlist.id === list.id
                      ? "border-[#1e518e] bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium capitalize text-gray-800">
                      {list.name}
                    </h3>
                    {list.isDefault && (
                      <span className="text-xs bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    {list.items.length > 0
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

  return (
    <div className="flex flex-col w-full p-3 sm:p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Wishlist</h1>
        <button
         onClick={() => setOpen(true)}
         className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded-lg font-medium text-sm md:text-base w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
          <FiPlus size={18} />
          CREATE NEW WISHLIST
        </button>
        <CreateWishlistModal isOpen={open} onClose={() => setOpen(false)}/>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Left Side - Wishlists (Desktop only) */}
        <div className="hidden lg:block lg:w-1/4">
          <div className="flex flex-col gap-2">
            {wishlistData.map((list) => (
              <div
                key={list.id}
                onClick={() => setActiveWishlist(list)}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  activeWishlist.id === list.id
                    ? "border-[#1e518e] bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium capitalize text-gray-800">
                    {list.name}
                  </h3>
                  {list.isDefault && (
                    <span className="text-xs bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  {list.items.length > 0
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-semibold capitalize text-gray-800 lg:block hidden">
                {activeList.name}
              </h2>
              {activeList.isDefault && (
                <span className="text-xs bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
            
            {/* View Mode Toggle - Mobile */}
            {isMobile && activeList.items.length > 0 && (
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <FiGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <FiList size={16} />
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <button className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none justify-center hover:bg-gray-50 transition-colors"  onClick={() => setWishilistOpen(true)}>
                <FiShare2 size={16} /> <span className="hidden xs:inline">Share</span>
              </button>
               <SeWishilistModal isOpen={WishilistOpn} onClose={() => setWishilistOpen(false)}/>
              <button className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-lg text-sm flex-1 sm:flex-none justify-center hover:bg-gray-50 transition-colors">
                <FiMoreHorizontal size={16} /> <span className="hidden xs:inline">More</span>
              </button>
            </div>
          </div>

          {/* Wishlist Items */}
          {activeList.items.length > 0 ? (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4' 
                : 'flex flex-col gap-3'
              }
            `}>
              {activeList.items.map((item) => (
                <div
                  key={item.id}
                  className={`
                    border border-gray-200 rounded-lg bg-white group relative transition-all duration-200
                    ${viewMode === 'grid' 
                      ? 'p-3 hover:shadow-lg' 
                      : 'flex gap-3 p-3 hover:shadow-md'
                    }
                  `}
                >
                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteItem(activeList.id, item.id)}
                    className={`
                      absolute bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10
                      ${viewMode === 'grid' 
                        ? '-top-2 -right-2' 
                        : '-top-1 -right-1'
                      }
                    `}
                    title="Remove item"
                  >
                    <FiTrash2 size={12} />
                  </button>
                  
                  {/* Image Container */}
                  <div className={`
                    relative mb-3
                    ${viewMode === 'grid' 
                      ? 'w-full h-28 sm:h-32 md:h-36' 
                      : 'w-20 h-20 flex-shrink-0 mb-0'
                    }
                  `}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain rounded-lg"
                      sizes={viewMode === 'grid' ? "(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw" : "80px"}
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className={viewMode === 'list' ? 'flex-1 min-w-0' : ''}>
                    <h3 className={`
                      font-medium line-clamp-2 text-gray-800
                      ${viewMode === 'grid' 
                        ? 'text-xs sm:text-sm min-h-[2.5rem] mb-2' 
                        : 'text-sm mb-1'
                      }
                    `}>
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center text-yellow-500 text-xs mb-1">
                      ⭐ {item.rating} 
                      <span className="ml-1 text-gray-500">({item.reviews})</span>
                    </div>
                    
                    <p className={`
                      font-semibold text-gray-900
                      ${viewMode === 'grid' ? 'text-base md:text-lg' : 'text-lg'}
                    `}>
                      AED{item.price}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className={`
                      flex gap-2
                      ${viewMode === 'grid' ? 'mt-3' : 'mt-2'}
                    `}>
                      <button className={`
                        bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-2 rounded font-medium hover:from-[#1e518e]/90 hover:to-[#0061b0ee]/90 transition-all duration-200 shadow hover:shadow-md
                        ${viewMode === 'grid' ? 'flex-1 text-xs' : 'px-3 text-sm'}
                      `}>
                        Add to Cart
                      </button>
                      
                      {viewMode === 'list' && (
                        <button className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                          View
                        </button>
                      )}
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
              <h3 className="text-lg font-medium text-gray-700">No items yet</h3>
              <p className="text-gray-500 text-sm mt-1">Start adding items to your wishlist</p>
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
          
          <button className="flex flex-col items-center text-xs text-gray-600">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow">
              <FiPlus size={18} className="text-gray-600" />
            </div>
            <span className="mt-1">New</span>
          </button>
          
          <button className="flex flex-col items-center text-xs text-gray-600"  onClick={() => setWishilistOpen(true)}>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow">
              <FiShare2 size={16} className="text-gray-600" />
            </div>
            <span  className="mt-1">Share</span>
          </button>
          <SeWishilistModal isOpen={WishilistOpn} onClose={() => setWishilistOpen(false)}/>
          <button className="flex flex-col items-center text-xs text-gray-600">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow">
              <FiGrid size={16} className="text-gray-600" />
            </div>
            <span className="mt-1">View</span>
          </button>
        </div>
      </div>
      
      <SupportSection/>
    </div>
  );
};

export default ShoppingWishlist;