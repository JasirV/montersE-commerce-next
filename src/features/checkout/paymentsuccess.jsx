"use client"
import React, { useEffect, useState } from "react";
import { Check, Download, Share2, Home, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      setError("Order ID not found");
      setLoading(false);
      return;
    }

    const response = await axios.get(
      `http://localhost:9000/api/order/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Axios returns JSON in response.data
    setOrderDetails(response.data.order);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch order details");
  } finally {
    setLoading(false);
  }
};


    fetchOrderDetails();
  }, [searchParams]);

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt...");
  };

  const handleShare = () => {
    if (navigator.share && orderDetails) {
      navigator.share({
        title: "Payment Confirmation",
        text: `I just completed a payment of ${orderDetails.total} ${orderDetails.currency}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleContinueShopping = () => {
    window.location.href = "/";
  };

  const handleViewOrder = () => {
    window.location.href = "/orders";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">
            {error || "Failed to load order details"}
          </p>
          <button
            onClick={handleContinueShopping}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDate(orderDetails.createdAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 px-3 sm:px-4 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header with Success Icon */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 sm:p-8 text-center relative">
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-green-100">
                <Check className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-green-100 text-xs sm:text-sm">
              Your transaction has been completed successfully
            </p>
          </div>

          {/* Content */}
          <div className="pt-8 sm:pt-10 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Amount */}
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-gray-600 text-sm mb-2">Total Amount Paid</p>
              <div className="flex items-baseline justify-center">
                <span className="text-xl sm:text-2xl text-gray-500 mr-1">
                  {orderDetails.currency}
                </span>
                <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                  {orderDetails.total}
                </span>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">
                  Subtotal
                </span>
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  {orderDetails.currency} {orderDetails.subtotal}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">
                  Date & Time
                </span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                    {date}
                  </div>
                  <div className="text-gray-500 text-xs">{time}</div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">
                  Payment Method
                </span>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm capitalize">
                    {orderDetails.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">
                  Customer
                </span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                    {orderDetails.shippingAddress.firstName}{" "}
                    {orderDetails.shippingAddress.lastName}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {orderDetails.shippingAddress.email}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">
                  Payment Status
                </span>
                <span
                  className={`font-semibold text-xs sm:text-sm capitalize ${
                    orderDetails.paymentStatus === "completed"
                      ? "text-green-600"
                      : orderDetails.paymentStatus === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {orderDetails.paymentStatus}
                </span>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-4 sm:mb-6">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                <Check className="w-3 h-3 mr-1" />
                Paid
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium capitalize">
                {orderDetails.paymentStatus}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                #{orderDetails._id.slice(-8)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Receipt
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Share
              </button>
            </div>

            {/* Primary Actions */}
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={handleContinueShopping}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Continue Shopping
              </button>
              <button
                onClick={handleViewOrder}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold text-sm sm:text-base"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                View Order Details
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
            <p className="text-center text-gray-500 text-xs">
              A confirmation email has been sent to{" "}
              <span className="font-semibold">
                {orderDetails.shippingAddress.email}
              </span>
            </p>
            <p className="text-center text-gray-400 text-xs mt-1">
              Need help?{" "}
              <a href="/contact" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
              What happens next?
            </h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <p>• Your order is being processed</p>
              <p>• You will receive shipping updates via email</p>
              <p>• Expected delivery: 3-5 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
