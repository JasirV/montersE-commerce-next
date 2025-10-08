import React, { useState, useEffect } from "react";
import ProfileInformation from "./ProfileInformation";
import ProfileUpdate from "./ProfileUpdate";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {


  

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <p className="text-gray-600 mb-4">Failed to load profile data</p>
          <button
            onClick={fetchUserProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      {isEditing ? (
        <ProfileUpdate
        />
      ) : (
        <ProfileInformation
        />
      )}
    </div>
  );
};

export default ProfilePage;