"use client";
import React, { useState } from "react";
import { FiTrash2, FiHeart, FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import SupportSection from "@/components/ui/SupportSection";
import Item1 from '../../assets/Watche/rendering-smart-home-device.jpg'
import Item2 from '../../assets/beautiful-rendering-steel-object.jpg'

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Air Wick Sparkling Citrus Freshmatic Auto Spray Kit 2-Piece 250ml",
      price: 33.95,
      originalPrice: 49.20,
      image:Item1,
      quantity: 1,
      inStock: true,
      seller: "noon Grocery"
    }
  ]);

  const [wishlist, setWishlist] = useState([]);
  const [recommendedProducts] = useState([
    {
      id: 1,
      name: "Gaming Monitor 24inch",
      price: 299.95,
      image:Item2
    },
    {
      id: 2,
      name: "UltraWide Monitor",
      price: 399.95,
      image: Item2
    },
    {
      id: 3,
      name: "4K Professional Monitor",
      price: 599.95,
      image:Item2
    },
    {
      id: 4,
      name: "Curved Gaming Monitor",
      price: 449.95,
      image: Item2
    }
  ]);

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const moveToWishlist = (item) => {
    setWishlist([...wishlist, item]);
    removeFromCart(item.id);
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-gray-50 min-h-screen py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Side - Cart Items */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          {/* Header with Cart Icon */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="relative">
              <FiShoppingCart className="text-2xl text-[#1e518e]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold">
              Shopping Cart <span className="text-gray-500 text-base font-normal">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
            </h2>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <FiShoppingCart className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <button 
                onClick={() => addToCart(recommendedProducts[0])}
                className="mt-4 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start border-b pb-4 mb-4 gap-4">
                  {/* Product Info */}
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-green-600 text-xs sm:text-sm mt-1">Get it Tomorrow</p>
                      <p className="text-gray-500 text-xs sm:text-sm">Sold by {item.seller}</p>

                      {/* Offer */}
                      <p className="text-xs text-green-700 mt-2 border border-green-500 px-2 py-1 rounded-md inline-block">
                        Buy 5 Get 10% Cashback - CODE: B5G10
                      </p>

                      {/* Actions */}
                      <div className="flex gap-3 mt-3 flex-wrap">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 /> Remove
                        </button>
                        <button 
                          onClick={() => moveToWishlist(item)}
                          className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm hover:text-red-600 transition-colors"
                        >
                          <FiHeart /> Move to Wishlist
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price & Quantity */}
                  <div className="flex sm:flex-col justify-between items-end sm:items-center w-full sm:w-auto gap-2 sm:gap-0">
                    <div className="text-right sm:text-center">
                      <p className="text-lg font-bold text-gray-800">AED{(item.price * item.quantity).toFixed(2)}</p>
                      {item.originalPrice && (
                        <>
                          <p className="text-sm text-green-600">
                            {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                          </p>
                          <p className="text-xs text-gray-500 line-through">฿{item.originalPrice.toFixed(2)}</p>
                        </>
                      )}
                      <p className="text-xs text-green-600">Free Delivery</p>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-sm hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium min-w-[30px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-sm hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Recommended Section */}
              <div className="mt-6 sm:mt-8">
                <h3 className="font-bold text-lg mb-4">Recommended for you</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-lg p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow relative group"
                    >
                      <div className="relative aspect-square mb-2">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                        <button 
                          onClick={() => {
                            const isInWishlist = wishlist.find(w => w.id === product.id);
                            if (!isInWishlist) {
                              setWishlist([...wishlist, product]);
                            }
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiHeart />
                        </button>
                      </div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                        {product.name}
                      </h4>
                      <p className="text-sm font-bold text-gray-900">฿{product.price.toFixed(2)}</p>
                      <button 
                        onClick={() => addToCart(product)}
                        className="w-full mt-2 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white text-xs sm:text-sm py-2 rounded hover:opacity-90 transition-opacity"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Side - Order Summary */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm h-fit sticky top-4">
          <h3 className="text-lg font-semibold mb-3">Order Summary</h3>

          {/* Coupon */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Coupon Code"
              className="border flex-1 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
              APPLY
            </button>
          </div>

          <button className="w-full border border-gray-300 px-3 py-2 rounded text-blue-600 mb-4 text-sm hover:bg-gray-50 transition-colors">
            View Available Offers
          </button>

          {/* Totals */}
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
              <span>฿{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="text-green-600">FREE</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-gray-800 text-lg mb-4 border-t pt-4">
            <span>Total (Inclusive of VAT)</span>
            <span>฿{subtotal.toFixed(2)}</span>
          </div>

          <Link
           href="/Chekout"
          >
             <button 
            disabled={cartItems.length === 0}
            className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cartItems.length === 0 ? 'CART IS EMPTY' : 'CHECKOUT'}
          </button>
          </Link>
         

          {/* Extra Info */}
          <p className="text-xs sm:text-sm text-yellow-600 mt-3">
            Monthly payment plans from ฿250. <span className="underline cursor-pointer">View more details</span>
          </p>

          <div className="mt-4 space-y-2">
            <p className="text-xs sm:text-sm">
              Earn <span className="font-bold">5% cashback</span> with Mashreq noon Credit Card.{" "}
              <a href="#" className="text-blue-600 underline">
                T&C apply
              </a>
            </p>
            <div className="border rounded-lg p-2 text-xs sm:text-sm">
              <span className="font-bold text-green-600">tabby</span> - Pay in 4
              interest-free payments on orders over ฿100.{" "}
              <a href="#" className="text-blue-600 underline">
                Learn more
              </a>
            </div>
            <div className="border rounded-lg p-2 text-xs sm:text-sm">
              <span className="font-bold text-red-500">tamara</span> - Pay in 4
              interest-free payments on orders over ฿100.{" "}
              <a href="#" className="text-blue-600 underline">
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
      <SupportSection/>
    </div>
  );
};

export default ShoppingCart;