"use client";
import React from "react";
import { FiMail, FiInfo } from "react-icons/fi";

const SupportSection = () => {
  return (
    <div className="bg-gray-200 py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Side */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-xl font-bold text-gray-800">
            We're Always Here To Help
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Reach out to us through any of these support channels
          </p>
        </div>

        {/* Right Side - Support Options */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {/* Help Center */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600">
              <FiInfo size={20} />
            </span>
            <div>
              <p className="text-xs uppercase text-gray-400 font-medium">
                Help Center
              </p>
              <p className="text-gray-700 font-semibold break-words">
                help.montres.ae
              </p>
            </div>
          </div>

          {/* Email Support */}
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600">
              <FiMail size={20} />
            </span>
            <div>
              <p className="text-xs uppercase text-gray-400 font-medium">
                Email Support
              </p>
              <p className="text-gray-700 font-semibold break-words">
                care@montres.ae
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
