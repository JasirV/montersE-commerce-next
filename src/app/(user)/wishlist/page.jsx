// app/wishlist/page.jsx
"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FiPlus, FiHeart } from "react-icons/fi";
import CreateWishlistModal from "../../../components/ui/createWishilist";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export default function WishlistBasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [open, setOpen] = useState(false);



useEffect(() => {
  if (typeof window === "undefined") return; // Ensure client
  if (window.__toastShown) return; // 👈 guard against duplicate
  window.__toastShown = true;

  const storedToken = localStorage.getItem("accessToken");
  if (storedToken) {
    setToken(storedToken);
  } else {
    Toastify({
      text: "Please login to access wishlists",
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      style: {
        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
      },
    }).showToast();
    router.push("/");
  }
}, []);


  useEffect(() => {
    if (!token) return;

    const checkWishlists = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const wishlists = response.data.wishlists || [];

        if (wishlists.length > 0) {
          // Redirect to first/default wishlist
          const defaultWishlist =
            wishlists.find((w) => w.isDefault) || wishlists[0];
          router.replace(`/wishlist/${defaultWishlist.id}`);
        } else {
          setLoading(false);
          // Auto-open modal for new customers after a short delay
          setTimeout(() => setOpen(true), 1000);
        }
      } catch (error) {
        console.error("Error fetching wishlists:", error);
        Toastify({
          text: "Failed to load wishlists. Please try again.",
          duration: 3000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
          },
        }).showToast();
        setLoading(false);
      }
    };

    checkWishlists();
  }, [token, router]);

  const handleWishlistCreated = (newWishlist) => {
    if (newWishlist && newWishlist.id) {
      Toastify({
        text: "Wishlist created successfully!",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      // Navigate immediately to the new wishlist page
      router.push(`/wishlist/${newWishlist.id}`);
    } else {
      console.error("Invalid wishlist data:", newWishlist);
      Toastify({
        text: "Failed to create wishlist. Please try again.",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff416c, #ff4b2b)",
        },
      }).showToast();
    }
  };

  const handleCreateClick = () => {
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e518e] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="text-center py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiHeart size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your Wishlists
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-8">
            Create your first wishlist to start saving and organizing your
            favorite products
          </p>

          <button
            onClick={handleCreateClick}
            className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 mx-auto"
          >
            <FiPlus size={24} />
            Create Your First Wishlist
          </button>
        </div>
      </div>

      {/* Create Wishlist Modal */}
      <CreateWishlistModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onWishlistCreated={handleWishlistCreated}
      />
    </div>
  );
}