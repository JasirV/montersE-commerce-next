import { FaUpload, FaChevronDown } from "react-icons/fa";
import React, { useState } from "react";
import watchBanner from "../../assets/person-doing-their-delicate-job.jpg";
import Image from "next/image";
import Link from "next/link";

export default function WatchService() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    manufactureYear: "",
    watchType: "",
  });

  const serviceOptions = [
    "Battery Replacement",
    "Movement Service",
    "Crystal Replacement",
    "Band Adjustment",
    "Water Resistance Testing",
    "Cleaning & Polishing",
    "Dial Repair",
    "Vintage Restoration",
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const selectService = (service) => {
    setSelectedService(service);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log({
      ...formData,
      selectedService,
      selectedImage: selectedImage ? "Image uploaded" : "No image",
    });
    alert("Service booked successfully!");
  };

  return (
    <div className="w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-3 xs:px-4 sm:px-6 py-8 xs:py-10 sm:py-12">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch rounded-2xl overflow-hidden shadow-2xl">
        {/* Left: Banner Image */}
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

        {/* Mobile Banner */}
        <div className="block md:hidden relative h-48 w-full rounded-t-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent z-10"></div>
          <Image
            src={watchBanner}
            alt="Watch Banner"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 z-20 text-white">
            <h1 className="text-xl font-bold">Precision Watch Care</h1>
            <p className="text-blue-100 text-sm">
              Expert craftsmanship for your timepieces
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white p-4 xs:p-5 sm:p-6 md:p-8 flex flex-col justify-center rounded-b-xl md:rounded-none">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-center mb-5 sm:mb-7 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] bg-clip-text text-transparent">
            EXPERT WATCH REPAIR SERVICES
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div className="mb-4 sm:mb-5">
              <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                PRODUCT NAME
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter productName"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                required
              />
            </div>

            {/* Manufacture Year + Watch Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                  MANUFACTURE YEAR
                </label>
                <input
                  type="number"
                  name="manufactureYear"
                  value={formData.manufactureYear}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Year"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                  WATCH TYPE
                </label>
                <select
                  name="watchType"
                  value={formData.watchType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
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

            {/* Type of Services */}
            <div className="mb-4 sm:mb-5 relative">
              <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                TYPE OF SERVICES
              </label>
              <div
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer flex justify-between items-center transition-all duration-200"
                onClick={toggleDropdown}
              >
                <span className="truncate">
                  {selectedService || "Select Service"}
                </span>
                <FaChevronDown
                  className={`transition-transform flex-shrink-0 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {serviceOptions.map((service) => (
                    <div
                      key={service}
                      className={`px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm sm:text-base transition-colors duration-150 ${
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
            <div className="mb-6 sm:mb-7">
              <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                UPLOAD WATCH IMAGE
              </label>
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
                <label className="flex-1 flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base">
                  <FaUpload className="mr-2 text-blue-600" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {selectedImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Selected Image:</p>
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

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#1a4680] hover:to-[#00559dee] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              BOOK SERVICE
            </button>
          </form>

          <p className="text-center text-gray-500 text-xs mt-5">
            By booking a service, you agree to our{" "}
            <Link 
              href="/terms-and-conditions" 
              className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
            >
              terms and conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}