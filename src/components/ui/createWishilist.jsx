import React, { useState } from "react";

const CreateWishlistModal = ({ isOpen, onClose }) => {
  const [wishlistName, setWishlistName] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Create New Wishlist
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-5">
          <input
            type="text"
            placeholder="Enter wishlist name"
            value={wishlistName}
            onChange={(e) => setWishlistName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={() => setIsDefault(!isDefault)}
              className="mr-2 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">
              Use this as default wishlist
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3">
          <button
            onClick={() => {
              console.log("Created:", wishlistName, "Default:", isDefault);
              onClose();
            }}
            className="w-full py-2 rounded-md text-white font-medium bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:opacity-90 transition"
          >
            CREATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateWishlistModal;
