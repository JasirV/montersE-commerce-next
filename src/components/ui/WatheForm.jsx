"use client";
import { FaUpload, FaChevronDown } from "react-icons/fa";
import React, { useState } from "react";
import watchBanner from "../../assets/person-doing-their-delicate-job.jpg";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";

export default function WatchService() {
  const [selectedImage, setSelectedImage] = useState(null); // preview (base64)
  const [imageFile, setImageFile] = useState(null); // actual file
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [productName, setProductName] = useState("");
  const [manufactureYear, setManufactureYear] = useState("");
  const [watchType, setWatchType] = useState("");
  const [selectedService, setSelectedService] = useState("");

const serviceOptions = [
  "Battery Replacement",
  "Movement Service",
  "Crystal Replacement",
  "Band Adjustment",
  "Water Resistance Testing",
  "Cleaning & Polishing",
  "Dial Repair",
  "Vintage Restoration",
  "General Service",
  "Authentication"
];


  const watchTypes = [
    "Automatic",
    "Quartz",
    "Mechanical",
    "Chronograph",
    "Diver",
    "Pilot",
    "Dress",
    "Smartwatch",
    "Other",
  ];

  // 📌 Preview image
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file); // save actual file
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result); // save base64
      reader.readAsDataURL(file);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectService = (service) => {
    setSelectedService(service);
    setIsDropdownOpen(false);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("manufactureYear", manufactureYear);
    formData.append("watchType", watchType);
    formData.append("selectedService", selectedService);

    if (imageFile) {
      formData.append("image", imageFile); // key must match multer ("image")
    }

    const response = await axios.post(
      "http://localhost:7000/api/createBooking",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.data.success) {
      toast.success("Service booked successfully!");
      setProductName("");
      setManufactureYear("");
      setWatchType("");
      setSelectedService("");
      setSelectedImage(null);
      setImageFile(null);
    }
  } catch (error) {
    console.error("❌ Error booking service:", error);
    toast.error("Something went wrong ");
  }
};


  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-3 xs:px-4 sm:px-6 py-8 xs:py-10 sm:py-12">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch rounded-2xl overflow-hidden shadow-2xl">
        {/* Left: Banner */}
        <div className="hidden md:block relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent z-10"></div>
          <Image
            src={watchBanner}
            alt="Watch Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute bottom-6 left-6 z-20 text-white">
            <h1 className="text-3xl font-bold mb-2">Precision Watch Care</h1>
            <p className="text-blue-100 max-w-md">
              Expert craftsmanship for your timepieces with decades of
              experience in luxury watch servicing.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white p-6 flex flex-col justify-center rounded-b-xl md:rounded-none">
          <h2 className="text-2xl font-bold text-center mb-7 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] bg-clip-text text-transparent">
            EXPERT WATCH REPAIR SERVICES
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                PRODUCT NAME
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            {/* Manufacture Year + Watch Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  MANUFACTURE YEAR
                </label>
                <input
                  type="number"
                  value={manufactureYear}
                  onChange={(e) => setManufactureYear(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Year"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  WATCH TYPE
                </label>
                <select
                  value={watchType}
                  onChange={(e) => setWatchType(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select Type</option>
                  {watchTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Services */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 mb-2 font-medium">
                TYPE OF SERVICES
              </label>
              <div
                className="w-full px-4 py-3 border rounded-xl cursor-pointer flex justify-between items-center"
                onClick={toggleDropdown}
              >
                <span>{selectedService || "Select Service"}</span>
                <FaChevronDown
                  className={`${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </div>
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {serviceOptions.map((service) => (
                    <div
                      key={service}
                      className={`px-4 py-3 hover:bg-blue-50 cursor-pointer ${
                        selectedService === service
                          ? "bg-blue-100 font-medium"
                          : ""
                      }`}
                      onClick={() => selectService(service)}
                    >
                      {service}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                UPLOAD WATCH IMAGE
              </label>
              <label className="flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                <FaUpload className="mr-2 text-blue-600" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {selectedImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="relative h-48 w-full max-w-xs mx-auto border rounded-xl overflow-hidden">
                    <Image
                      src={selectedImage}
                      alt="Watch preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              BOOK SERVICE
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-5">
            By booking a service, you agree to our{" "}
            <Link
              href="/terms-and-conditions"
              className="text-blue-600 underline"
            >
              terms and conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
