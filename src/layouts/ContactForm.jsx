"use client"
import React, { useState } from "react";
import axios from "axios";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa";
import { HiLocationMarker, HiPhone, HiMail, HiChat } from "react-icons/hi";
import { FiSend, FiUpload } from "react-icons/fi";

const EcommerceContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "AE",
    companyName: "",
    subject: "",
    message: "",
    attachment: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (e.target.type === "file") {
      setFormData((prev) => ({ ...prev, attachment: files[0] }));
      setFileName(files[0] ? files[0].name : "");
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Validate Form Fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.subject) newErrors.subject = "Please select a subject";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  // ✅ Handle Form Submit (Connect to API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // ✅ API call to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/contact/submit`,
        formDataToSend,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong! Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Reset form
  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      country: "AE",
      companyName: "",
      subject: "",
      message: "",
      attachment: null,
    });
    setFileName("");
    setErrors({});
  };

  // Social media links
  const socialLinks = [
    {
      icon: FaLinkedinIn,
      url: "https://www.linkedin.com/company/montres-trading",
      color: "hover:bg-blue-600",
    },
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/montres.ae/",
      color: "hover:bg-pink-600",
    },
    {
      icon: FaFacebookF,
      url: "https://www.facebook.com/Montres.ae",
      color: "hover:bg-blue-700",
    },
    {
      icon: FaTiktok,
      url: "https://www.tiktok.com/@montres.ae",
      color: "hover:bg-black",
    },
    {
      icon: FaWhatsapp,
      url: "https://wa.me/97142671124",
      color: "hover:bg-green-600",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-[#1e518e] to-[#0061b0ee]">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Thank You for Your Message!
          </h2>
          <p className="text-gray-600 mb-4">
            We've received your inquiry and will get back to you within 24 hours.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">
              Your reference ID:{" "}
              <span className="font-mono text-[#0061b0]">
                INV-{Math.random().toString(36).substr(2, 6).toUpperCase()}
              </span>
            </p>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="w-full py-3 bg-[#0061b0] text-white rounded-lg hover:bg-[#1e518e] transition-colors flex items-center justify-center"
          >
            <FiSend className="mr-2" />
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#fefefe] to-[#f1f1f1ee]">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Contact Info Section */}
          <div className="bg-gradient-to-br from-[#466e9f] to-[#4e7fa7ee] text-white p-6 md:p-8 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-blue-100 text-sm md:text-base">
                We'd love to hear from you! Fill out the form, and our team will get back to you within 24 hours.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <HiChat className="mr-2" /> Quick Contact
                </h3>
                <div className="space-y-3 text-blue-100">
                  <a 
                    href="https://wa.me/97142671124" 
                    className="flex items-center hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="mr-2 text-lg" />
                    +971 4267 1124
                  </a>
                  <a 
                    href="tel:+97142671124" 
                    className="flex items-center hover:text-white transition-colors"
                  >
                    <HiPhone className="mr-2 text-lg" />
                    +971 4267 1124
                  </a>
                  <a 
                    href="mailto:sales@montres.ae" 
                    className="flex items-center hover:text-white transition-colors"
                  >
                    <HiMail className="mr-2 text-lg" />
                    sales@montres.ae
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <HiLocationMarker className="mr-2" /> Our Office
                </h3>
                <p className="text-blue-100 text-sm md:text-base">
                  Montres Watch, Leather Sell & Repair Store, Moza Plaza - 1 Al Khor St - Deira - Dubai
                </p>
                <div className="mt-3 bg-white p-1 rounded-lg">
                  <div className="h-32 md:h-40 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Google Maps Embed</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 md:p-3 bg-blue-500/20 text-white rounded-full transition-all duration-300 transform hover:scale-110 ${social.color}`}
                    aria-label={`Follow us on ${social.icon.name}`}
                  >
                    <social.icon className="text-sm md:text-base" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="p-6 md:p-8 lg:p-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Get In Touch
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Have questions? We're here to help.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0061b0] ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0061b0] ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+971 XX XXX XXXX"
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0061b0] ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0061b0]"
                  />
                </div>
              </div>

              {/* Country & Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0061b0]"
                  >
                    <option value="AE">United Arab Emirates</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="KW">Kuwait</option>
                    <option value="QA">Qatar</option>
                    <option value="BH">Bahrain</option>
                    <option value="OM">Oman</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject / Inquiry Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0061b0] ${
                      errors.subject ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select an option</option>
                    <option value="Product Information">Product Information</option>
                    <option value="Order Support">Order Support</option>
                    <option value="Return Request">Return Request</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Partnership Inquiry">Partnership Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="How can we help you?"
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0061b0] ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                ></textarea>
                {errors.message && (
                  <p className="text-sm text-red-500 mt-1">{errors.message}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attach File (Optional)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, JPG, PNG (MAX. 5MB)
                      </p>
                      {fileName && (
                        <p className="text-xs text-green-600 mt-2">
                          Selected: {fileName}
                        </p>
                      )}
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0061b0] text-white py-3 rounded-lg hover:bg-[#1e518e] transition-colors flex items-center justify-center disabled:opacity-75 font-medium"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Privacy Note */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg text-center text-sm text-gray-600">
              We respect your privacy. Your information will only be used to respond to your inquiry.
              <a href="/privacy-policy" className="text-[#0061b0] underline ml-1 hover:text-[#1e518e]">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceContactForm;