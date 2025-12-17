// app/wishlist/page.jsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FiPlus, FiHeart, FiLoader } from "react-icons/fi";
import CreateWishlistModal from "../../../components/ui/createWishilist";
import { toast } from "react-hot-toast";

export default function WishlistBasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Authentication check - Standard e-commerce approach
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window === "undefined") return;
        
        const storedToken = localStorage.getItem("accessToken");
        
        if (!storedToken) {
          setIsAuthenticated(false);
          // Show immediate feedback for guests (standard e-commerce practice)
          toast.error("Please login to access your wishlists", {
            duration: 3000,
            position: "top-right",
          });
          // Redirect after brief delay for UX
          setTimeout(() => {
            router.push("/login?redirect=/wishlist");
          }, 1500);
          return;
        }
        
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch wishlists for authenticated users
  const fetchWishlists = useCallback(async () => {
    if (!token || !isAuthenticated) return;

    try {
      setLoading(true);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      const wishlists = response.data?.wishlists || [];

      if (wishlists.length > 0) {
        // Redirect to default or first wishlist
        const defaultWishlist = wishlists.find(w => w.isDefault) || wishlists[0];
        router.replace(`/wishlist/${defaultWishlist.id}`);
      } else {
        setLoading(false);
        // Auto-open create modal for users with no wishlists
        setTimeout(() => setOpen(true), 800);
      }
    } catch (error) {
      console.error("Wishlist fetch error:", error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("accessToken");
        setIsAuthenticated(false);
        
        toast.error("Session expired. Please login again.", {
          duration: 3000,
          position: "top-right",
        });
        
        router.push("/login?redirect=/wishlist");
      } else if (error.code === 'ECONNABORTED' || !navigator.onLine) {
        // Network issues
        toast.error("Network error. Please check your connection.", {
          duration: 3000,
          position: "top-right",
        });
        setLoading(false);
      } else {
        // Server errors
        toast.error("Unable to load wishlists. Please try again.", {
          duration: 3000,
          position: "top-right",
        });
        setLoading(false);
      }
    }
  }, [token, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchWishlists();
    }
  }, [isAuthenticated, token, fetchWishlists]);

  // Handle wishlist creation
  const handleWishlistCreated = useCallback((newWishlist) => {
    if (newWishlist?.id) {
      toast.success("Wishlist created successfully!", {
        duration: 3000,
        position: "top-right",
      });
      router.push(`/wishlist/${newWishlist.id}`);
    } else {
      toast.error("Failed to create wishlist. Please try again.", {
        duration: 3000,
        position: "top-right",
      });
    }
  }, [router]);

  // Handle create button click
  const handleCreateClick = useCallback(() => {
    if (!isAuthenticated) {
      toast.error("Please login to create a wishlist", {
        duration: 3000,
        position: "top-right",
      });
      router.push("/login?redirect=/wishlist");
      return;
    }
    setOpen(true);
  }, [isAuthenticated, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#1e518e] border-t-transparent rounded-full animate-spin"></div>
            <FiHeart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#1e518e] text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Loading Wishlists
            </h2>
            <p className="text-gray-600">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show guest state (after auth check but not authenticated)
  if (authChecked && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="max-w-md w-full text-center space-y-8 p-8 bg-white rounded-2xl shadow-lg">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <FiHeart className="text-gray-400 text-4xl" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Sign In Required
            </h1>
            <p className="text-gray-600">
              To view and manage your wishlists, please sign in to your account.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => router.push("/login?redirect=/wishlist")}
              className="w-full py-3 bg-gradient-to-r from-[#1e518e] to-[#0061b0] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md"
            >
              Sign In
            </button>
            
            <button
              onClick={() => router.push("/shop")}
              className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
          
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/register?redirect=/wishlist")}
              className="text-[#1e518e] font-semibold hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Main content for authenticated users with no wishlists
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <header className="pt-12 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-[#1e518e] to-[#0061b0] rounded-full shadow-xl mb-8">
            <FiHeart className="text-white text-5xl" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Wishlists
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Create wishlists to save products you love, share with friends, or plan future purchases.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleCreateClick}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1e518e] to-[#0061b0] text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <FiPlus className="text-xl" />
              Create New Wishlist
            </button>
            
            <button
              onClick={() => router.push("/shop")}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-xl border border-gray-300 shadow-md hover:bg-gray-50 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <FiHeart className="text-[#1e518e] text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Save Products
            </h3>
            <p className="text-gray-600">
              Save items from across our store to revisit later
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1e518e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Share with Friends
            </h3>
            <p className="text-gray-600">
              Create wishlists for special occasions and share with loved ones
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#1e518e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Organize Easily
            </h3>
            <p className="text-gray-600">
              Create multiple wishlists for different needs and occasions
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      <CreateWishlistModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onWishlistCreated={handleWishlistCreated}
      />
    </div>
  );
}