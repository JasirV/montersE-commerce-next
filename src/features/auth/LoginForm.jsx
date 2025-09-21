// LoginForm.js
import React, { useState, useCallback } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const LoginForm = ({ setActiveTab, onRequestClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState("")
  const [Loading,setLoading]=useState("")

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);




  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        " http://localhost:9000/api/Auth/Login",
        {
          email,
          password,
        }
      );
      if (response.status === 201 || response.status === 200) {
        toast.success(" Login successful!");
        onRequestClose()
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "❌Login failed!");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">
          Sign in to your account
        </h3>
        <p className="text-sm text-gray-600">
          Access your personalized dashboard
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="login-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="login-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 transition text-sm"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
            onClick={() => setActiveTab("forgot")}
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#2d5582]  hover:bg-[#2d5587] text-white py-2.5 px-4 rounded-lg transition duration-200 text-sm font-medium shadow-sm hover:shadow-md"
        >
          SIGN IN
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 px-4 hover:bg-gray-50 transition-colors text-sm"
        >
          <FcGoogle size={18} />
          <span className="font-medium">Google</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 px-4 hover:bg-gray-50 transition-colors text-sm"
        >
          <FaFacebook size={18} className="text-blue-600" />
          <span className="font-medium">Facebook</span>
        </button>
      </div>

      <p className="text-sm text-gray-600 text-center mt-4">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
          onClick={() => setActiveTab("register")}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default React.memo(LoginForm);
