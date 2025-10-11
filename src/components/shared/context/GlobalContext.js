"use client";
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Load counts from localStorage first
  useEffect(() => {
    const savedCart = parseInt(localStorage.getItem("cartCount")) || 0;
    const savedWishlist = parseInt(localStorage.getItem("wishlistCount")) || 0;
    setCartCount(savedCart);
    setWishlistCount(savedWishlist);
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const [cartRes, wishRes] = await Promise.all([
          axios.get("http://localhost:9000/api/products/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:9000/api/products/wishlists/getAll", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const cartItems = Array.isArray(cartRes.data) ? cartRes.data : cartRes.data?.cart || [];
        const cartLength = cartItems.length;

        const wishlists = wishRes.data?.wishlists || [];
        const defaultWishlist = wishlists.find((w) => w.isDefault) || wishlists[0];
        const wishlistLength = defaultWishlist?.items?.length || 0;

        setCartCount(cartLength);
        setWishlistCount(wishlistLength);

        // ✅ Save to localStorage for persistence
        localStorage.setItem("cartCount", cartLength);
        localStorage.setItem("wishlistCount", wishlistLength);
      } catch (error) {
        console.error("Error fetching cart/wishlist counts:", error);
      }
    };

    setTimeout(fetchCounts, 300);
  }, []);

  const incrementCart = () => {
    setCartCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem("cartCount", newCount);
      return newCount;
    });
  };

  const decrementCart = () => {
    setCartCount((prev) => {
      const newCount = Math.max(prev - 1, 0);
      localStorage.setItem("cartCount", newCount);
      return newCount;
    });
  };

  const incrementWishlist = () => {
    setWishlistCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem("wishlistCount", newCount);
      return newCount;
    });
  };

  const decrementWishlist = () => {
    setWishlistCount((prev) => {
      const newCount = Math.max(prev - 1, 0);
      localStorage.setItem("wishlistCount", newCount);
      return newCount;
    });
  };

  const clearAll = () => {
    setCartCount(0);
    setWishlistCount(0);
    localStorage.setItem("cartCount", 0);
    localStorage.setItem("wishlistCount", 0);
  };

  return (
    <GlobalContext.Provider
      value={{
        cartCount,
        wishlistCount,
        incrementCart,
        decrementCart,
        incrementWishlist,
        decrementWishlist,
        clearAll,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
