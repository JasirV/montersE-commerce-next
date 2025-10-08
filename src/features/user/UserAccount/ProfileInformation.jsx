import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaPhone, FaMapMarkerAlt, FaEnvelope, FaGlobe, FaSpinner } from "react-icons/fa";

const ProfileInformation = ({ userData, onEdit, isLoading = false }) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    profilePicture: ""
  });

  // Transform backend data to frontend format
  useEffect(() => {
    if (userData) {
      const defaultAddress = userData.addresses?.find(addr => addr.isDefault) || userData.addresses?.[0];
      
      setProfileData({
        name: userData.name || "Not provided",
        email: userData.email || "Not provided",
        phone: userData.phone || "Not provided",
        country: userData.country || "AE",
        address: defaultAddress ? formatAddress(defaultAddress) : "No address added",
        profilePicture: userData.profilePicture || ""
      });
    }
  }, [userData]);

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "No address added";
    
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.area,
      address.city,
      address.country
    ].filter(part => part && part.trim() !== "");
    
    return parts.join(", ");
  };

  // Get country name from code
  const getCountryName = (countryCode) => {
    const countries = {
      'AE': 'United Arab Emirates',
      'SA': 'Saudi Arabia',
      'KW': 'Kuwait',
      'QA': 'Qatar',
      'BH': 'Bahrain',
      'OM': 'Oman',
      'US': 'United States',
      'UK': 'United Kingdom',
      'CA': 'Canada'
      // Add more countries as needed
    };
    return countries[countryCode] || countryCode;
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-center py-8">
          <FaSpinner className="animate-spin text-2xl text-blue-600 mr-3" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Profile Information</h2>
        <button
          onClick={onEdit}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 w-full sm:w-auto"
        >
          <FaEdit className="text-sm" />
          <span className="text-sm sm:text-base">Edit Profile</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Profile Picture */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
            {profileData.profilePicture ? (
              <img
                src={profileData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-xl sm:text-3xl text-gray-400" />
            )}
          </div>
          
          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-1">{profileData.name}</h3>
            <div className="flex items-center justify-center sm:justify-start text-gray-600 mb-2">
              <FaEnvelope className="text-sm mr-2" />
              <p className="text-sm sm:text-base break-all">{profileData.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-md font-medium mb-4 flex items-center">
          <FaUser className="mr-2 text-blue-600" />
          Contact Information
        </h4>
        
        <div className="space-y-4">
          {/* Phone Number */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-full mt-1">
              <FaPhone className="text-blue-600 text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-medium">Phone Number</p>
              <p className="font-medium text-gray-900">{profileData.phone}</p>
            </div>
          </div>

          {/* Country */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-purple-100 p-2 rounded-full mt-1">
              <FaGlobe className="text-purple-600 text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-medium">Country</p>
              <p className="font-medium text-gray-900">{getCountryName(profileData.country)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Shipping region: {getShippingRegionLabel(profileData.country)}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full mt-1">
              <FaMapMarkerAlt className="text-green-600 text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-medium">Primary Address</p>
              <p className="font-medium text-gray-900">{profileData.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information Card */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h5 className="font-medium text-blue-900 mb-2 flex items-center">
          <FaMapMarkerAlt className="mr-2" />
          Shipping Information
        </h5>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <strong>Region:</strong> {getShippingRegionLabel(profileData.country)}
          </p>
          <p>
            <strong>Free Shipping:</strong> {getShippingThreshold(profileData.country)} AED+
          </p>
          <p>
            <strong>Standard Shipping:</strong> {getShippingFee(profileData.country)} AED
          </p>
        </div>
      </div>

      {/* Quick Actions for Mobile */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 sm:hidden">
        <h5 className="font-medium text-blue-900 mb-2">Quick Actions</h5>
        <p className="text-sm text-blue-700 mb-3">
          Update your information to ensure accurate shipping calculations.
        </p>
        <button
          onClick={onEdit}
          className="w-full bg-white border border-blue-300 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors duration-200"
        >
          Update Profile Now
        </button>
      </div>
    </div>
  );
};

// Helper functions (you can move these to a separate utils file)
const getShippingRegionLabel = (countryCode) => {
  if (countryCode === 'AE') return 'UAE Local';
  if (['SA', 'KW', 'QA', 'BH', 'OM'].includes(countryCode)) return 'GCC Countries';
  return 'Worldwide';
};

const getShippingThreshold = (countryCode) => {
  if (countryCode === 'AE') return 500;
  if (['SA', 'KW', 'QA', 'BH', 'OM'].includes(countryCode)) return 1000;
  return 1500;
};

const getShippingFee = (countryCode) => {
  if (countryCode === 'AE') return 30;
  if (['SA', 'KW', 'QA', 'BH', 'OM'].includes(countryCode)) return 100;
  return 150;
};

export default ProfileInformation;