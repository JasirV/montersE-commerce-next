"use client";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import checkEmail from "../../../assets/checkEmail.jpg";
import Image from "next/image";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      Toastify({
        text: "Please enter your email address",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/Auth/forgot-password`,
        { email: resetEmail }
      );

      console.log("Reset email response:", response.data);

      setSubmittedEmail(resetEmail);
      setEmailSent(true);
      setResetEmail("");

      Toastify({
        text: "Reset link has been sent to your email",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();

    } catch (error) {
      console.error("Error sending reset email:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again";

      Toastify({
        text: message,
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/Auth/forgot-password`,
        { email: submittedEmail }
      );

      Toastify({
        text: "Reset link resent to your email",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #2193b0, #6dd5ed)",
        },
      }).showToast();
    } catch (error) {
      console.error("Error resending link:", error);

      Toastify({
        text: "Failed to resend link",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We'll help you regain access to your account
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {!emailSent ? (
              <>
                <button
                  type="button"
                  className="flex items-center text-blue-600 hover:text-blue-500 mb-6 text-sm font-medium"
                  onClick={() => router.push("/login")}
                >
                  <FaArrowLeft className="mr-2" size={14} />
                  Back to Login
                </button>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Forgot your password?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleResetSubmit}>
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="reset-email"
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base sm:text-sm"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Make sure this is the email you used to register your account
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2d5582] hover:bg-[#2d5587] text-white py-3 px-4 rounded-lg transition duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                        SENDING LINK...
                      </>
                    ) : (
                      "SEND RESET LINK"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                {/* Success State */}
                <div className="flex justify-center mb-6">
                  <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                    <Image 
                      src={checkEmail} 
                      alt="Email Sent" 
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Check your email
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We've sent a password reset link to:
                </p>
                <p className="text-base font-medium text-gray-900 mb-2 break-all px-4">
                  {submittedEmail}
                </p>
                <p className="text-xs text-gray-500 mb-8 px-4">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="w-full bg-[#2d5582] hover:bg-[#2d5587] text-white py-3 px-4 rounded-lg transition duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    RESEND LINK
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg transition duration-200 text-sm font-medium"
                  >
                    BACK TO LOGIN
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">
                    Didn't receive the email?
                  </p>
                  <ul className="text-xs text-gray-500 text-left space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Check your spam or junk folder</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Make sure you entered the correct email address</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Try resending the link</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;