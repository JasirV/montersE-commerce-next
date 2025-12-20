"use client";

import { FaUpload, FaChevronDown } from "react-icons/fa";
import React, { useState } from "react";
import watchBanner from "../../assets/person-doing-their-delicate-job.jpg";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useRouter, usePathname } from "next/navigation";

export default function WatchService() {
  const router = useRouter();
  const pathname = usePathname();

  /* ================= STATES ================= */
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [countryCode, setCountryCode] = useState("+971");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [productName, setProductName] = useState("");
  const [manufactureYear, setManufactureYear] = useState("");
  const [watchType, setWatchType] = useState("");
  const [selectedService, setSelectedService] = useState("");

  /* ================= OPTIONS ================= */
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

  /* ================= IMAGE ================= */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!token) {
      Toastify({
        text: "Please log in to book a service.",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: { background: "#ff5f6d" },
      }).showToast();

      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("customerName", customerName);
      formData.append("countryCode", countryCode);
      formData.append("phoneNumber", phoneNumber);
      formData.append("productName", productName);
      formData.append("manufactureYear", manufactureYear);
      formData.append("watchType", watchType);
      formData.append("selectedService", selectedService);

      if (imageFile) formData.append("image", imageFile);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/createBooking`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        Toastify({
          text: "Service booked successfully",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "#00b09b" },
        }).showToast();

        setCustomerName("");
        setPhoneNumber("");
        setProductName("");
        setManufactureYear("");
        setWatchType("");
        setSelectedService("");
        setSelectedImage(null);
        setImageFile(null);
      }
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Something went wrong",
        duration: 4000,
        gravity: "top",
        position: "right",
        style: { background: "#ff5f6d" },
      }).showToast();
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-lg grid md:grid-cols-2 overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden md:block relative">
          <Image
            src={watchBanner}
            alt="Watch Service"
            fill
            className="object-cover"
          />
        </div>

        {/* FORM */}
        <div className="px-8 md:px-12 py-8">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-8
            bg-gradient-to-r from-[#1e518e] to-[#0061b0ee]
            bg-clip-text text-transparent"
          >
            Watch Service Booking
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 text-base">

            {/* CUSTOMER */}
            <input
              className="w-full border rounded-2xl px-5 py-3.5"
              placeholder="Full Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />

            <div className="flex gap-4">
              <select
                className="border rounded-2xl px-4 py-3.5 w-32"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
              >
                <option value="+971">+971</option>
                <option value="+966">+966</option>
                <option value="+91">+91</option>
              </select>

              <input
                type="tel"
                className="flex-1 border rounded-2xl px-5 py-3.5"
                placeholder="Mobile Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            {/* WATCH */}
            <input
              className="w-full border rounded-2xl px-5 py-3.5"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />

            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Manufacture Year"
                className="border rounded-2xl px-5 py-3.5 w-1/2"
                value={manufactureYear}
                onChange={(e) => setManufactureYear(e.target.value)}
              />

              <select
                className="border rounded-2xl px-5 py-3.5 w-1/2"
                value={watchType}
                onChange={(e) => setWatchType(e.target.value)}
              >
                <option value="">Watch Type</option>
                {watchTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* SERVICE */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="border px-5 py-3.5 rounded-2xl flex justify-between items-center cursor-pointer"
            >
              {selectedService || "Select Service"}
              <FaChevronDown />
            </div>

            {isDropdownOpen && (
              <div className="border rounded-2xl max-h-48 overflow-y-auto">
                {serviceOptions.map((s) => (
                  <div
                    key={s}
                    onClick={() => {
                      setSelectedService(s);
                      setIsDropdownOpen(false);
                    }}
                    className="px-5 py-3 hover:bg-blue-50 cursor-pointer"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}

            {/* IMAGE */}
            <label className="border rounded-2xl px-5 py-3.5 flex items-center justify-center gap-3 cursor-pointer">
              <FaUpload />
              Upload Watch Image
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </label>

            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Preview"
                width={200}
                height={200}
                className="mx-auto rounded-2xl"
              />
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-semibold text-white text-lg
              bg-gradient-to-r from-[#1e518e] to-[#0061b0ee]
              hover:opacity-90 transition"
            >
              BOOK SERVICE
            </button>

            <p className="text-sm text-center">
              By booking you agree to our{" "}
              <Link
                href="/servicesTermsCondition"
                className="text-blue-600 underline"
              >
                terms & conditions
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
