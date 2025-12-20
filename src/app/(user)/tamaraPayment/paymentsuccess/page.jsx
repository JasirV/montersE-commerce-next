"use client"
import React, { useEffect, useState, Suspense } from "react";
import { Check, Download, Share2, Home, ShoppingBag, Clock, Shield, Gift, CreditCard, Calendar, User, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const TamaraPaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tamaraDetails, setTamaraDetails] = useState({
    installmentPlan: "Pay in 4 installments",
    nextPaymentDate: "30 days from now",
    paymentMethod: "Tamara"
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
        
        // If you have Tamara-specific API, you can fetch additional details here
        if (paymentId) {
          // fetchTamaraPaymentDetails(paymentId);
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
    console.log("Downloading Tamara receipt...");
    // Implement receipt download functionality
    alert("Receipt download functionality would be implemented here");
  };

  const handleShare = async () => {
    if (navigator.share && orderDetails) {
      try {
        await navigator.share({
          title: "Tamara Payment Confirmation",
          text: `I just completed a payment using Tamara! ${orderDetails.total} ${orderDetails.currency} split into 4 payments.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Sharing cancelled");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert("Failed to copy link");
      }
    }
  };

  const handleContinueShopping = () => {
    window.location.href = "/";
  };

  const handleViewOrder = () => {
    window.location.href = "/orders";
  };

  const handleManageTamaraPayments = () => {
    // Redirect to Tamara customer portal or payment management
    window.open("https://tamara.co/portal", "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen safe-area-inset-bottom bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-xs w-full">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Confirming your Tamara payment...</p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen safe-area-inset-bottom bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-xs w-full">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 text-sm mb-6">
            {error || "Failed to load order details"}
          </p>
          <button
            onClick={handleContinueShopping}
            className="w-full flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 font-semibold text-sm shadow-sm"
          >
            <Home className="w-4 h-4 mr-2" />
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
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
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
    <div className="min-h-screen safe-area-inset-bottom bg-gradient-to-b from-purple-50 to-white pb-20 px-4">
      {/* Fixed Header for Mobile */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-4 mb-4 -mx-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Payment Successful!</h1>
              <p className="text-sm text-purple-100">Tamara • Pay in 4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Main Success Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
          {/* Success Banner */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full mb-2">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Payment Confirmed</h2>
            <p className="text-green-100 text-sm">Interest-free installments with Tamara</p>
          </div>

          {/* Amount Section */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-gray-500 text-sm text-center mb-1">Total Amount</p>
            <div className="flex items-baseline justify-center">
              <span className="text-lg text-gray-500 mr-1">{orderDetails.currency}</span>
              <span className="text-4xl font-bold text-gray-900">{orderDetails.total}</span>
            </div>
            <div className="mt-2 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                <CreditCard className="w-3 h-3 mr-1" />
                Split into 4 payments
              </span>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Details</h3>
            
            <div className="space-y-3">
              {/* Payment Method */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Method</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">Tamara</span>
              </div>

              {/* Date & Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Date & Time</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{date}</div>
                  <div className="text-xs text-gray-500">{time}</div>
                </div>
              </div>

              {/* Next Payment */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Next Payment</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {orderDetails.currency} {installments.remaining}
                  </div>
                  <div className="text-xs text-gray-500">{tamaraDetails.nextPaymentDate}</div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Customer</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {orderDetails.shippingAddress?.firstName || "Customer"}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                    {orderDetails.shippingAddress?.email || ""}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-purple-600 mr-2" />
                  <span className="text-sm text-gray-600">Status</span>
                </div>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">
                  Completed
                </span>
              </div>
            </div>
          </div>

          {/* Order ID */}
          <div className="bg-gray-50 p-3 border-t border-gray-100">
            <div className="flex items-center justify-center">
              <span className="text-xs text-gray-500 mr-2">Order ID:</span>
              <code className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {orderDetails._id?.slice(-8) || "N/A"}
              </code>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleDownloadReceipt}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-200 active:scale-95 transition-transform duration-150"
          >
            <Download className="w-5 h-5 text-purple-600 mb-1" />
            <span className="text-xs font-medium text-gray-700">Receipt</span>
          </button>
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-200 active:scale-95 transition-transform duration-150"
          >
            <Share2 className="w-5 h-5 text-purple-600 mb-1" />
            <span className="text-xs font-medium text-gray-700">
              {copied ? "Copied!" : "Share"}
            </span>
          </button>
        </div>

        {/* Main Actions */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleContinueShopping}
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 active:scale-98 transition-all duration-200 font-semibold shadow-lg shadow-purple-200"
          >
            <Home className="w-5 h-5 mr-2" />
            Continue Shopping
          </button>
          
          <button
            onClick={handleManageTamaraPayments}
            className="w-full flex items-center justify-center px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 active:scale-98 transition-all duration-200 font-semibold"
          >
            <Clock className="w-5 h-5 mr-2" />
            Manage Payments
          </button>
          
          <button
            onClick={handleViewOrder}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-98 transition-all duration-200 font-semibold"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            View Order
          </button>
        </div>

        {/* Tamara Benefits */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Shield className="w-4 h-4 text-purple-600 mr-2" />
            Why Tamara?
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">No interest ever</span>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
                <Clock className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Flexible payments</span>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
                <Shield className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">100% secure</span>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
                <Gift className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">No hidden fees</span>
            </div>
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mb-2">
            <Mail className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500">
            Payment confirmation sent to{" "}
            <span className="font-semibold text-gray-700">
              {orderDetails.shippingAddress?.email || "your email"}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Tamara installment details will be emailed separately
          </p>
        </div>
      </div>
    </div>
  );
};

// Main component that wraps with Suspense
const TamaraPaymentSuccess = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen safe-area-inset-bottom bg-gradient-to-b from-purple-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-xs w-full">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading payment confirmation...</p>
        </div>
      </div>
    }>
      <TamaraPaymentSuccessContent />
    </Suspense>
  );
};

export default TamaraPaymentSuccess;