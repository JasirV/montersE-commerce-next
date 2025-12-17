"use client";
import React, { useState, useCallback } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaCheck, FaSpinner, FaStore, FaShieldAlt, FaGift, FaTruck } from "react-icons/fa";
import { TbShoppingBagCheck } from "react-icons/tb";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [hoverStates, setHoverStates] = useState({
    google: false,
    facebook: false,
    submit: false,
    login: false,
    terms: false,
    privacy: false
  });

  const handleHover = (button, isHovering) => {
    setHoverStates(prev => ({ ...prev, [button]: isHovering }));
  };

  const handleGoogleLogin = () => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BASEURL || "http://localhost:9000/api";
    const callback = `${window.location.origin}/auth/success`;
    window.location.href = `${base}/auth/google?redirect_uri=${encodeURIComponent(callback)}`;
  };

  const handleFacebookLogin = () => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    window.location.href = `${base}/auth/facebook`;
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const getStrengthColor = () => {
    if (passwordStrength >= 75) return "bg-green-500";
    if (passwordStrength >= 50) return "bg-yellow-500";
    if (passwordStrength >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const getStrengthText = () => {
    if (passwordStrength >= 75) return "Strong";
    if (passwordStrength >= 50) return "Good";
    if (passwordStrength >= 25) return "Fair";
    return "Weak";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      Toastify({
        text: "Please agree to the Terms of Service and Privacy Policy",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(135deg, #1e518e 0%, #0061b0ee 100%)",
          borderRadius: "10px",
          fontWeight: "500",
          boxShadow: "0 4px 15px rgba(0, 97, 176, 0.3)"
        },
      }).showToast();
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/Auth/register`,
        {
          name,
          email,
          password,
        }
      );

      if (response.status === 201 || response.status === 200) {
        const userData = {
          id: response.data.userId || Date.now(),
          name: name,
          email: email
        };
        
        localStorage.setItem("user", JSON.stringify(userData));

        Toastify({
          text: "🎉 Registration successful! Redirecting to login...",
          duration: 3000,
          gravity: "top",
          position: "right",
          close: true,
          style: {
            background: "linear-gradient(135deg, #1e518e 0%, #0061b0ee 100%)",
            borderRadius: "10px",
            fontWeight: "500",
            boxShadow: "0 4px 15px rgba(0, 97, 176, 0.3)"
          },
        }).showToast();
        
        // Redirect to login page
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      Toastify({
        text: error.response?.data?.message || "Registration failed! Please try again.",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          borderRadius: "10px",
          fontWeight: "500",
        },
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-100 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Side - Brand/Info Section */}
        <div className="lg:w-1/2 hidden lg:flex flex-col justify-center p-8">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105">
                <FaStore className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">montres</h1>
                <p className="text-sm text-gray-600 mt-1">Premium E-commerce Experience</p>
              </div>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-8">
              Join{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1e518e] to-[#0061b0ee]">
                montres
              </span>{" "}
              Today
            </h2>
            
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Create your account and unlock exclusive benefits, personalized shopping experiences, and member-only perks.
            </p>
            
            <div className="space-y-7">
              <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 rounded-lg">
                  <FaGift className="text-2xl text-[#1e518e]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Welcome Bonus</h4>
                  <p className="text-gray-600 mt-1">Get 15% off your first order</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 rounded-lg">
                  <TbShoppingBagCheck className="text-2xl text-[#1e518e]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Fast Checkout</h4>
                  <p className="text-gray-600 mt-1">Save payment methods for quick purchases</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 rounded-lg">
                  <FaTruck className="text-xl text-[#1e518e]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Free Shipping</h4>
                  <p className="text-gray-600 mt-1">Free delivery on orders over $50</p>
                </div>
              </div>

              <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 rounded-lg">
                  <FaShieldAlt className="text-xl text-[#1e518e]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Secure Account</h4>
                  <p className="text-gray-600 mt-1">256-bit encryption protects your data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="lg:w-1/2">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100/50">
            
            {/* Mobile Brand Header */}
            <div className="lg:hidden p-7 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee]">
              <div className="flex items-center justify-center gap-4">
                <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <FaStore className="text-2xl text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white">montres</h1>
              </div>
              <p className="text-center text-white/90 mt-3 text-sm font-medium">
                Create your premium shopping account
              </p>
            </div>

            <div className="p-8 lg:p-10">
              <div className="text-center lg:text-left mb-9">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-[#1e518e] to-[#0061b0ee] rounded-full"></div>
                  <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                </div>
                <p className="text-gray-600 mt-2 text-base">
                  Join thousands of happy shoppers today
                </p>
              </div>

              <form className="space-y-7" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                    <FaUser className="text-[#1e518e]" />
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1e518e]/20 to-[#0061b0ee]/20 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-300"></div>
                    <input
                      name="username"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="relative w-full px-5 py-3.5 pl-12 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-[#1e518e]/30 focus:border-[#1e518e] bg-white/60 transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1e518e] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                    <FaEnvelope className="text-[#1e518e]" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1e518e]/20 to-[#0061b0ee]/20 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-300"></div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="relative w-full px-5 py-3.5 pl-12 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-[#1e518e]/30 focus:border-[#1e518e] bg-white/60 transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1e518e] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                    <FaLock className="text-[#1e518e]" />
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1e518e]/20 to-[#0061b0ee]/20 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-300"></div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Create a strong password"
                      className="relative w-full px-5 py-3.5 pl-12 pr-12 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-[#1e518e]/30 focus:border-[#1e518e] bg-white/60 transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      required
                      minLength="8"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1e518e] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1e518e] transition-colors duration-200 p-1"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">Password strength:</span>
                        <span className={`font-semibold ${
                          passwordStrength >= 75 ? 'text-green-600' :
                          passwordStrength >= 50 ? 'text-yellow-600' :
                          passwordStrength >= 25 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {getStrengthText()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${getStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Password Requirements */}
                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-medium text-gray-700">Password must contain:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          password.length >= 8 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {password.length >= 8 ? <FaCheck size={10} /> : <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />}
                        </div>
                        <span className={`text-xs ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          /[A-Z]/.test(password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {/[A-Z]/.test(password) ? <FaCheck size={10} /> : <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />}
                        </div>
                        <span className={`text-xs ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                          One uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          /[a-z]/.test(password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {/[a-z]/.test(password) ? <FaCheck size={10} /> : <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />}
                        </div>
                        <span className={`text-xs ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                          One lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          /[0-9]/.test(password) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {/[0-9]/.test(password) ? <FaCheck size={10} /> : <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />}
                        </div>
                        <span className={`text-xs ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                          One number
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start p-4 bg-gradient-to-r from-blue-50/30 to-transparent rounded-xl">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-5 w-5 text-[#1e518e] focus:ring-[#1e518e]/30 border-gray-300 rounded cursor-pointer transition-colors duration-200 mt-1"
                    required
                  />
                  <label className="ml-3 text-sm text-gray-700 cursor-pointer select-none">
                    I agree to the{" "}
                    <button
                      type="button"
                      onMouseEnter={() => handleHover('terms', true)}
                      onMouseLeave={() => handleHover('terms', false)}
                      className={`font-medium transition-all duration-200 ${
                        hoverStates.terms 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#1e518e] to-[#0061b0ee]' 
                          : 'text-[#1e518e]'
                      }`}
                      onClick={() => router.push("/terms")}
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onMouseEnter={() => handleHover('privacy', true)}
                      onMouseLeave={() => handleHover('privacy', false)}
                      className={`font-medium transition-all duration-200 ${
                        hoverStates.privacy 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#1e518e] to-[#0061b0ee]' 
                          : 'text-[#1e518e]'
                      }`}
                      onClick={() => router.push("/privacy")}
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !agreeToTerms}
                  onMouseEnter={() => handleHover('submit', true)}
                  onMouseLeave={() => handleHover('submit', false)}
                  className={`relative w-full py-4 px-6 rounded-xl transition-all duration-300 text-base font-bold shadow-lg overflow-hidden group ${
                    loading || !agreeToTerms ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02]'
                  }`}
                  style={{
                    background: hoverStates.submit && agreeToTerms && !loading
                      ? 'linear-gradient(135deg, #1a497c 0%, #0055a0 100%)'
                      : 'linear-gradient(135deg, #1e518e 0%, #0061b0ee 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  {loading ? (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                      <FaSpinner className="animate-spin" />
                      CREATING ACCOUNT...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                      CREATE ACCOUNT
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
              </form>

              <div className="relative my-9">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/60"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500 font-medium">Or sign up with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  onMouseEnter={() => handleHover('google', true)}
                  onMouseLeave={() => handleHover('google', false)}
                  className="flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3.5 px-4 hover:shadow-lg transition-all duration-300 text-sm font-medium w-full group hover:border-gray-300"
                  style={{
                    backgroundColor: hoverStates.google ? '#f8fafc' : 'white',
                    transform: hoverStates.google ? 'translateY(-2px)' : 'none'
                  }}
                >
                  <FcGoogle size={22} />
                  <span>Continue with Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  onMouseEnter={() => handleHover('facebook', true)}
                  onMouseLeave={() => handleHover('facebook', false)}
                  className="flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3.5 px-4 hover:shadow-lg transition-all duration-300 text-sm font-medium w-full group hover:border-gray-300"
                  style={{
                    backgroundColor: hoverStates.facebook ? '#f8fafc' : 'white',
                    transform: hoverStates.facebook ? 'translateY(-2px)' : 'none'
                  }}
                >
                  <FaFacebook size={22} className="text-blue-600" />
                  <span>Continue with Facebook</span>
                </button>
              </div>

              <p className="text-center text-gray-600 text-sm mt-9 pt-6 border-t border-gray-100">
                Already have an account?{" "}
                <button
                  type="button"
                  onMouseEnter={() => handleHover('login', true)}
                  onMouseLeave={() => handleHover('login', false)}
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#1e518e]/90 hover:to-[#0061b0ee]/90 transition-all duration-200"
                  onClick={() => router.push("/login")}
                  style={{
                    textShadow: hoverStates.login ? '0px 2px 8px rgba(30, 81, 142, 0.2)' : 'none'
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
          
          {/* Security Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#1e518e]/5 to-[#0061b0ee]/5 px-5 py-3 rounded-full">
              <div className="p-1.5 bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 rounded-lg">
                <FaShieldAlt className="text-sm text-[#1e518e]" />
              </div>
              <p className="text-xs text-gray-600 font-medium">
                <span className="text-[#1e518e] font-bold">Secure registration</span> • Your information is protected with 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;