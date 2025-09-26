import React from "react";
import { FaUser, FaEdit, FaPhone, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

const ProfileInformation = ({ userData, onEdit }) => {
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
            {userData.profilePicture ? (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUser className="text-xl sm:text-3xl text-gray-400" />
            )}
          </div>
          
          {/* User Info */}
          <div className="text-center sm:text-left flex-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-1">{userData.name}</h3>
            <div className="flex items-center justify-center sm:justify-start text-gray-600 mb-2">
              <FaEnvelope className="text-sm mr-2" />
              <p className="text-sm sm:text-base break-all">{userData.email}</p>
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
              <p className="font-medium text-gray-900">{userData.phone}</p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="bg-green-100 p-2 rounded-full mt-1">
              <FaMapMarkerAlt className="text-green-600 text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-medium">Address</p>
              <p className="font-medium text-gray-900">{userData.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section for Mobile */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200 sm:hidden">
        <h5 className="font-medium text-blue-900 mb-2">Quick Actions</h5>
        <p className="text-sm text-blue-700 mb-3">
          Update your information to keep your account secure and personalized.
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

export default ProfileInformation;