"use client"
import React, { useState, useCallback } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaStore, FaSpinner, FaTruck, FaShieldAlt, FaTag } from "react-icons/fa";
import { TbShoppingBagCheck } from "react-icons/tb";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoverStates, setHoverStates] = useState({
    google: false,
    facebook: false,
    submit: false,
    signup: false
  });

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Handle OAuth errors
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      const errorMessage = error === "OAuthSignin" 
        ? "Error connecting with Google. Please try again." 
        : "Authentication failed.";
        
      Toastify({
        text: errorMessage,
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const handleHover = (button, isHovering) => {
    setHoverStates(prev => ({ ...prev, [button]: isHovering }));
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleFacebookLogin = () => {
    const base = process.env.NEXT_PUBLIC_BACKEND_URL;
    window.location.href = `${base}/auth/facebook`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const { accessToken, user } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);

      Toastify({
        text: "🎉 Login successful! Redirecting...",
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

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "⚠️ Login failed! Please check your credentials.",
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
            
           
            
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Sign in to access personalized recommendations, track your orders, and enjoy exclusive member benefits in our premium shopping experience.
            </p>
            
            <div className="space-y-7">
              <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 rounded-lg">
                  <TbShoppingBagCheck className="text-2xl text-[#1e518e]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Fast Checkout</h4>
                  <p className="text-gray-600 mt-1">Complete purchases in seconds with one-click checkout</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 rounded-lg">
                  <FaShieldAlt className="text-xl text-[#1e518e]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Secure Shopping</h4>
                  <p className="text-gray-600 mt-1">256-bit SSL encryption protects your data</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 p-4 bg-gradient-to-r from-blue-50/50 to-transparent rounded-xl hover:shadow-md transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-[#1e518e]/10 to-[#0061b0ee]/10 rounded-lg">
                  <FaTag className="text-xl text-[#1e518e]" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Exclusive Deals</h4>
                  <p className="text-gray-600 mt-1">Member-only discounts and early access to sales</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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
                Sign in to your premium shopping account
              </p>
            </div>

            <div className="p-8 lg:p-10">
              <div className="text-center lg:text-left mb-9">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-[#1e518e] to-[#0061b0ee] rounded-full"></div>
                  <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                </div>
                <p className="text-gray-600 mt-2 text-base">
                  Sign in to access your personalized shopping dashboard
                </p>
              </div>

              <form className="space-y-7" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                    <FaEnvelope className="text-[#1e518e]" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1e518e]/20 to-[#0061b0ee]/20 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-300"></div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
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

                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-gray-800">
                    <FaLock className="text-[#1e518e]" />
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1e518e]/20 to-[#0061b0ee]/20 rounded-xl blur opacity-0 group-hover:opacity-40 transition duration-300"></div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="relative w-full px-5 py-3.5 pl-12 pr-12 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-[#1e518e]/30 focus:border-[#1e518e] bg-white/60 transition-all duration-300 text-base placeholder-gray-400 hover:border-gray-300"
                      required
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
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-5 w-5 text-[#1e518e] focus:ring-[#1e518e]/30 border-gray-300 rounded cursor-pointer transition-colors duration-200"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 text-sm text-gray-700 cursor-pointer select-none hover:text-gray-900 transition-colors duration-200"
                    >
                      Remember me for 30 days
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#1e518e]/90 hover:to-[#0061b0ee]/90 transition-all duration-200"
                    onClick={() => router.push("/forgot-password")}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => handleHover('submit', true)}
                  onMouseLeave={() => handleHover('submit', false)}
                  className={`relative w-full py-4 px-6 rounded-xl transition-all duration-300 text-base font-bold shadow-lg overflow-hidden group ${
                    loading ? 'opacity-80 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02]'
                  }`}
                  style={{
                    background: hoverStates.submit 
                      ? 'linear-gradient(135deg, #1a497c 0%, #0055a0 100%)'
                      : 'linear-gradient(135deg, #1e518e 0%, #0061b0ee 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  {loading ? (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                      <FaSpinner className="animate-spin" />
                      SIGNING IN...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                      SIGN IN
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
                  <span className="px-4 bg-white text-sm text-gray-500 font-medium">Or continue with</span>
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
                Don't have an account?{" "}
                <button
                  type="button"
                  onMouseEnter={() => handleHover('signup', true)}
                  onMouseLeave={() => handleHover('signup', false)}
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#1e518e]/90 hover:to-[#0061b0ee]/90 transition-all duration-200"
                  onClick={() => router.push("/register")}
                  style={{
                    textShadow: hoverStates.signup ? '0px 2px 8px rgba(30, 81, 142, 0.2)' : 'none'
                  }}
                >
                  Create an account
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
                <span className="text-[#1e518e] font-bold">256-bit SSL encryption</span> • Your shopping data is always secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;