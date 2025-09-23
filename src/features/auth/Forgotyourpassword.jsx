"use client";
import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import checkEmail from "../../assets/checkEmail.jpg";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ import toast

const ForgotPasswordForm = ({ setActiveTab }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:7000/api/Auth/forgot-password",
        { email: resetEmail }
      );

      console.log("Reset email response:", response.data);

      setSubmittedEmail(resetEmail);
      setEmailSent(true);
      setResetEmail("");

      toast.success("Reset link has been sent to your email ");
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!submittedEmail) return;

    try {
      await axios.post("http://localhost:7000/api/Auth/forgot-password", {
        email: submittedEmail,
      });

      toast.info("Reset link resent to your email ");
    } catch (error) {
      console.error("Error resending link:", error);
      toast.error("Failed to resend link ❌");
    }
  };

  return (
    <div className="space-y-5">
      {!emailSent ? (
        <>
          <button
            type="button"
            className="flex items-center text-blue-600 hover:text-blue-500 mb-4"
            onClick={() => setActiveTab("login")}
          >
            <FaArrowLeft className="mr-2" />
            Back to Login
          </button>

          <div>
            <h3 className="text-xl font-semibold mb-2">Reset your password</h3>
            <p className="text-sm text-gray-600">
              We'll send you a link to reset your password
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleResetSubmit}>
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
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d5582] hover:bg-[#2d5587] text-white py-2.5 px-4 rounded-md transition duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Sending..." : "SEND RESET LINK"}
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-10">
          {/* Success State */}
          <div className="flex justify-center mb-6">
            <Image src={checkEmail} alt="Email Sent" className="h-24 w-24" />
          </div>

          <h3 className="text-xl font-semibold mb-2">Check your email</h3>
          <p className="text-sm text-gray-600 mb-6">
            We emailed a reset link to{" "}
            <span className="font-medium">{submittedEmail}</span>
          </p>

          <button
            type="button"
            onClick={handleResend}
            className="bg-[#2d5582] hover:bg-[#2d5587] text-white py-2 px-6 rounded-md transition duration-200"
          >
            Send Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
