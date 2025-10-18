"use client";
import React from "react";

const ShippingTermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">Shipping Fee Terms & Conditions</h2>
        
        <ul className="text-gray-700 space-y-2">
          <li>
            <strong>Local (UAE):</strong> Free if order  500 AED, otherwise 30 AED
          </li>
          <li>
            <strong>GCC:</strong> Free if order  1,000 AED, otherwise 100 AED
          </li>
          <li>
            <strong>Worldwide:</strong> Free if order  1,500 AED, otherwise 150 AED
          </li>
        </ul>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShippingTermsModal;
