// context/WishlistContext.js
"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get user from both session and localStorage
  const getUser = useCallback(() => {
    if (session?.user) {
      return { ...session.user, source: "session" };
    }
    
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? { ...JSON.parse(storedUser), source: "localStorage" } : null;
      } catch (error) {
        console.error('Error reading user from localStorage:', error);
        return null;
      }
    }
    
    return null;
  }, [session]);

  const user = getUser();

  // Fetch wishlist count
  const fetchWishlistCount = useCallback(async () => {
    if (!user) {
      setWishlistCount(0);
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setWishlistCount(0);
        return;
      }

      const res = await axios.get(
        'http://localhost:9000/api/products/wishlists/getAll',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.wishlists) {
        const total = res.data.wishlists.reduce(
          (sum, w) => sum + (w.items?.length || 0),
          0
        );
        setWishlistCount(total);
        
        // Store all wishlist items for other components to use
        const allItems = res.data.wishlists.flatMap(w => w.items || []);
        setWishlistItems(allItems);
        
        console.log('Wishlist count updated:', total);
      } else {
        setWishlistCount(0);
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
      setWishlistCount(0);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch default wishlist ID
  const fetchDefaultWishlist = useCallback(async () => {
    if (!user) {
      setDefaultWishlistId(null);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setDefaultWishlistId(null);
        return;
      }

      const res = await axios.get(
        'http://localhost:9000/api/products/wishlists',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.wishlists?.length > 0) {
        const defaultWishlist =
          res.data.wishlists.find((w) => w.isDefault) ||
          res.data.wishlists[0];
        setDefaultWishlistId(defaultWishlist.id);
      } else {
        setDefaultWishlistId(null);
      }
    } catch (error) {
      console.error('Error fetching wishlists:', error);
      setDefaultWishlistId(null);
    }
  }, [user]);

  // Add item to wishlist
  const addToWishlist = useCallback(async (productId, wishlistId = null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const targetWishlistId = wishlistId || defaultWishlistId;
      if (!targetWishlistId) throw new Error('No wishlist available');

      await axios.post(
        `http://localhost:9000/api/products/wishlist/add`,
       {
            wishlistId: defaultWishlistId,
            productId
          },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh counts after adding
      await refreshWishlist();
      
      return { success: true };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    }
  }, [defaultWishlistId]);

  // Remove item from wishlist
  const removeFromWishlist = useCallback(async (itemId, wishlistId = null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const targetWishlistId = wishlistId || defaultWishlistId;
      if (!targetWishlistId) throw new Error('No wishlist available');

      await axios.delete(
        `http://localhost:9000/api/products/wishlist/remove`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh counts after removal
      await refreshWishlist();
      
      return { success: true };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    }
  }, [defaultWishlistId]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.productId === productId || item.product?.id === productId);
  }, [wishlistItems]);

  // Refresh all wishlist data
  const refreshWishlist = useCallback(async () => {
    await fetchWishlistCount();
    await fetchDefaultWishlist();
  }, [fetchWishlistCount, fetchDefaultWishlist]);

  // Initial data fetch and setup
  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist,user]);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      console.log('Auth change detected in WishlistContext');
      refreshWishlist();
    };

    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [refreshWishlist]);

  // Provide context value
  const value = {
    wishlistCount,
    defaultWishlistId,
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist,
    fetchWishlistCount,
    fetchDefaultWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};