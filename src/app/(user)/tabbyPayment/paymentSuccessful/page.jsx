"use client"
import React, { useEffect, useState } from "react";
import { Check, Download, Share2, Home, ShoppingBag, Clock, Shield, Gift } from "lucide-react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const TabbyPaymentSuccess = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabbyDetails, setTabbyDetails] = useState({
    installmentPlan: "4 interest-free payments",
    nextPaymentDate: "30 days from now",
    paymentMethod: "Tabby Card"
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const orderId = searchParams.get("orderId");
        const paymentId = searchParams.get("paymentId");

        if (!orderId) {
          setError("Order ID not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setOrderDetails(response.data.order);
        
        // If you have Tabby-specific API, you can fetch additional details here
        if (paymentId) {
          // fetchTabbyPaymentDetails(paymentId);
        }
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
    console.log("Downloading Tabby receipt...");
    // Implement Tabby receipt download
  };

  const handleShare = () => {
    if (navigator.share && orderDetails) {
      navigator.share({
        title: "Tabby Payment Confirmation",
        text: `I just completed a payment using Tabby! ${orderDetails.total} ${orderDetails.currency} split into 4 payments.`,
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

  const handleManageTabbyPayments = () => {
    // Redirect to Tabby customer portal or payment management
    window.open("https://tabby.ai/portal", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Confirming your Tabby payment...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center px-4">
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
            className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
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

  const calculateInstallments = (total) => {
    const amount = parseFloat(total);
    const installment = (amount / 4).toFixed(2);
    return {
      first: installment,
      remaining: installment
    };
  };

  const { date, time } = formatDate(orderDetails.createdAt);
  const installments = calculateInstallments(orderDetails.total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-4 px-3 sm:px-4 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          {/* Header with Success Icon */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 sm:p-8 text-center relative">
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-purple-100">
                <Check className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Tabby Payment Successful!
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm">
              Your order is confirmed with interest-free installments
            </p>
          </div>

          {/* Content */}
          <div className="pt-8 sm:pt-10 px-4 sm:px-6 pb-4 sm:pb-6">
            
        

            {/* Amount */}
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-gray-600 text-sm mb-2">Total Order Amount</p>
              <div className="flex items-baseline justify-center">
                <span className="text-xl sm:text-2xl text-gray-500 mr-1">
                  {orderDetails.currency}
                </span>
                <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                  {orderDetails.total}
                </span>
              </div>
              <p className="text-green-600 text-sm mt-2 font-semibold">
                Split into 4 interest-free payments
              </p>
            </div>

            {/* Order Details */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">Payment Method</span>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">
                    Tabby - {tabbyDetails.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">Date & Time</span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm">{date}</div>
                  <div className="text-gray-500 text-xs">{time}</div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">Next Payment</span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                    {orderDetails.currency} {installments.remaining}
                  </div>
                  <div className="text-gray-500 text-xs">{tabbyDetails.nextPaymentDate}</div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">Customer</span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                    {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {orderDetails.shippingAddress.email}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100">
                <span className="text-gray-600 text-xs sm:text-sm">Payment Status</span>
                <span className="font-semibold text-green-600 text-xs sm:text-sm capitalize">
                  Completed
                </span>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-4 sm:mb-6">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                <Check className="w-3 h-3 mr-1" />
                Paid with Tabby
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                <Shield className="w-3 h-3 mr-1" />
                Installment Plan
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
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Continue Shopping
              </button>
              
              <button
                onClick={handleManageTabbyPayments}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200 font-semibold text-sm sm:text-base"
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Manage Tabby Payments
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
              Payment confirmation sent to{" "}
              <span className="font-semibold">
                {orderDetails.shippingAddress.email}
              </span>
            </p>
            <p className="text-center text-gray-400 text-xs mt-1">
              Tabby installment details will be emailed separately
            </p>
          </div>
        </div>

        {/* Tabby Benefits Section */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
              Why customers love Tabby
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-green-600 mr-2" />
                <span>No interest</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-green-600 mr-2" />
                <span>Flexible payments</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-600 mr-2" />
                <span>Instant approval</span>
              </div>
              <div className="flex items-center">
                <Gift className="w-4 h-4 text-green-600 mr-2" />
                <span>No fees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabbyPaymentSuccess;