"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiX, FiLink, FiMail } from "react-icons/fi";
import { FaGlobe } from "react-icons/fa";

const CreateWishlistModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
            Want others to see your wishlist?
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Privacy Status */}
        <p className="px-4 pt-2 text-sm text-gray-600">
          Your list privacy status is set to{" "}
          <span className="font-medium text-gray-800">"Public"</span>
        </p>

        {/* Wishlist Card */}
        <div className="m-4 p-4 rounded-lg bg-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">farhan</h3>
            <p className="text-sm text-gray-600">2 items</p>
          </div>
          <FaGlobe size={20} className="text-gray-700" />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 px-4 pb-6">
          <button className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            <FiLink size={18} />
            <span className="text-sm font-medium">Copy link</span>
          </button>
          <button className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
            <FiMail size={18} />
            <span className="text-sm font-medium">Email</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateWishlistModal;
