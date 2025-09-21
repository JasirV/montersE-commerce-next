"use client";
import React, { useState, useCallback } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterForm = ({ setActiveTab }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 

  const [name,setName]= useState("")
  const [email,setEmail]= useState("")
  const [password,setPassword] = useState("")
  const [agreeToTerms,setAgreeToTerms] = useState("")

  // // ✅ Handle input change
  // const handleInputChange = useCallback((e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // }, []);

  // ✅ Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
  const response = await axios.post(
  "http://localhost:9000/api/Auth/register",
  {
    name,
    email,
    password,
  }
);

      if (response.status === 201 || response.status === 200) {
        toast.success("🎉 Registration successful!");
        setActiveTab("login"); // go to login tab
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌ Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 mb-1">
        Create your account
      </h3>
      <p className="text-sm text-gray-600">Join our community today</p>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            name="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your username"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 text-sm transition"
              required
              minLength="8"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Minimum 8 characters with at least one number
          </p>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.value)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            required
          />
          <label className="ml-2 text-xs text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2d5582] hover:bg-[#2d5587] text-white py-2.5 px-4 rounded-lg transition text-sm font-medium shadow-sm hover:shadow-md flex justify-center items-center"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "CREATE ACCOUNT"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or sign up with</span>
        </div>
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 px-4 hover:bg-gray-50 transition-colors text-sm">
          <FcGoogle size={18} />
          <span className="font-medium">Google</span>
        </button>
        <button className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 px-4 hover:bg-gray-50 transition-colors text-sm">
          <FaFacebook size={18} className="text-blue-600" />
          <span className="font-medium">Facebook</span>
        </button>
      </div>

      {/* Switch to login */}
      <p className="text-sm text-gray-600 text-center mt-4">
        Already have an account?{" "}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          onClick={() => setActiveTab("login")}
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default React.memo(RegisterForm);
