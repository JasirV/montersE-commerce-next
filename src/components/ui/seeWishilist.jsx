"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiX, FiLink, FiMail, FiGlobe, FiLock } from "react-icons/fi";

const SeWishilistModal = ({ isOpen, onClose, wishlist }) => {
  if (!isOpen) return null;

  const isPublic = wishlist?.isPublic || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md rounded-2xl shadow-lg bg-white text-gray-800"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Share Wishlist
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Privacy Status */}
        <div className="px-4 pt-4">
          <p className="text-sm text-gray-600">
            {isPublic 
              ? 'Your list privacy status is set to "Public"'
              : 'Your list privacy will be changed to "Public"'
            }
          </p>
        </div>

        {/* Wishlist Card */}
        <div className="m-4 p-4 rounded-lg bg-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {wishlist?.name || "Wishlist"}
            </h3>
            <p className="text-sm text-gray-600">
              {wishlist?.items?.length || 0} items
            </p>
          </div>
          {isPublic ? (
            <FiGlobe size={20} className="text-green-500" />
          ) : (
            <FiLock size={20} className="text-gray-500" />
          )}
        </div>

        {/* Share Options */}
        <div className="px-4 pb-2">
          <p className="text-sm text-gray-600 mb-3">
            {isPublic 
              ? "Your wishlist is publicly accessible. Share it with others using the options below."
              : "To share this wishlist, you need to make it public first."
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 px-4 pb-6">
          {isPublic ? (
            <>
              <button className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                <FiLink size={18} />
                <span className="text-sm font-medium">Copy link</span>
              </button>
              <button className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
                <FiMail size={18} />
                <span className="text-sm font-medium">Email</span>
              </button>
            </>
          ) : (
            <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white hover:from-[#1e518e]/90 hover:to-[#0061b0ee]/90 transition">
              <FiGlobe size={18} />
              <span className="text-sm font-medium">Make Public to Share</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SeWishilistModal;