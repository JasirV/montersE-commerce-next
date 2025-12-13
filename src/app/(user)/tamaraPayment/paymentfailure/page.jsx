"use client"
import React, { Suspense } from "react";
import { XCircle, AlertTriangle, RefreshCw, Home, CreditCard, HelpCircle, Lock, Shield, ArrowLeft, RotateCcw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const PaymentFailureContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorCode = searchParams.get("errorCode");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency") || "SAR";

  const failureReasons = {
    "DECLINED": "Your payment was declined by Tamara.",
    "INSUFFICIENT_FUNDS": "Insufficient funds in your account.",
    "EXPIRED_CARD": "Your payment method has expired.",
    "SECURITY_VIOLATION": "Security check failed. Please verify your details.",
    "LIMIT_EXCEEDED": "Payment amount exceeds your Tamara limit.",
    "TECHNICAL_ERROR": "A technical error occurred. Please try again.",
    "ACCOUNT_LOCKED": "Your Tamara account requires attention.",
    "DEFAULT": "We couldn't process your payment at this time."
  };

  const getFailureReason = () => {
    return failureReasons[errorCode] || failureReasons.DEFAULT;
  };

  const getRecommendation = () => {
    const recommendations = {
      "DECLINED": "Contact your bank or try a different payment method.",
      "INSUFFICIENT_FUNDS": "Ensure sufficient funds or use another payment method.",
      "EXPIRED_CARD": "Update your payment details in Tamara app.",
      "SECURITY_VIOLATION": "Verify your identity through Tamara app.",
      "LIMIT_EXCEEDED": "Split your payment or use another method.",
      "TECHNICAL_ERROR": "Wait a few minutes and try again.",
      "ACCOUNT_LOCKED": "Contact Tamara support to resolve account issues.",
      "DEFAULT": "Try again or contact Tamara support for assistance."
    };
    return recommendations[errorCode] || recommendations.DEFAULT;
  };

  const handleTryAgain = () => {
    // Clear any stored payment errors
    localStorage.removeItem("payment_error");
    
    if (orderId) {
      router.push(`/checkout/payment?orderId=${orderId}&retry=true`);
    } else {
      router.push("/cart");
    }
  };

  const handleUseDifferentMethod = () => {
    if (orderId) {
      router.push(`/checkout/payment-methods?orderId=${orderId}`);
    } else {
      router.push("/cart");
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Payment Failure - Order: ${orderId || "N/A"}`);
    const body = encodeURIComponent(`Error Code: ${errorCode || "Unknown"}\nAmount: ${amount || "N/A"} ${currency}`);
    window.open(`mailto:support@tamara.co?subject=${subject}&body=${body}`, "_blank");
  };

  const handleBackToCart = () => {
    router.push("/cart");
  };

  const handleDownloadReceipt = () => {
    // This would typically generate a payment attempt receipt
    console.log("Downloading payment attempt receipt...");
    alert("A receipt for this payment attempt has been sent to your email.");
  };

  return (
    <div className="min-h-screen safe-area-inset-bottom bg-gradient-to-b from-orange-50 to-white pb-20 px-4">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 mb-4 -mx-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={handleBackToCart}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900">Payment Failed</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Main Failure Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4 border border-red-100">
          {/* Failure Banner */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-4 text-center relative">
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-red-200">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <div className="pt-4">
              <h2 className="text-xl font-bold text-white mb-1">Payment Failed</h2>
              <p className="text-red-100 text-sm">We couldn't complete your Tamara payment</p>
            </div>
          </div>

          {/* Content */}
          <div className="pt-8 px-4 pb-4">
            {/* Error Message */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mb-3">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{getFailureReason()}</h3>
              <p className="text-gray-600 text-sm mb-3">{getRecommendation()}</p>
              
              {errorCode && (
                <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">
                  <code className="text-xs font-mono text-gray-600">Error: {errorCode}</code>
                </div>
              )}
            </div>

            {/* Order Summary */}
            {(orderId || amount) && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                  <CreditCard className="w-4 h-4 text-gray-600 mr-2" />
                  Payment Attempt Details
                </h4>
                <div className="space-y-2">
                  {orderId && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Order ID:</span>
                      <span className="text-sm font-medium text-gray-900">{orderId}</span>
                    </div>
                  )}
                  {amount && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Amount:</span>
                      <span className="text-sm font-medium text-gray-900">{currency} {amount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                      Failed
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Immediate Actions */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">What would you like to do?</h4>
              <div className="space-y-3">
                <button
                  onClick={handleTryAgain}
                  className="w-full flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 active:scale-98 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                      <RefreshCw className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Try Again</p>
                      <p className="text-xs text-gray-500">Retry the same payment</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                </button>

                <button
                  onClick={handleUseDifferentMethod}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 active:scale-98 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">Different Method</p>
                      <p className="text-xs text-gray-500">Use another payment option</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                </button>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-1">Your security is important</p>
                  <p className="text-xs text-green-700">
                    No funds were charged. Tamara may have declined the payment to protect you from unauthorized activity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleTryAgain}
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 active:scale-98 transition-all duration-200 font-semibold shadow-lg shadow-orange-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Retry Payment
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-98 transition-all duration-200 font-semibold text-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Receipt
            </button>
            <button
              onClick={handleContactSupport}
              className="flex items-center justify-center px-4 py-3 border border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 active:scale-98 transition-all duration-200 font-semibold text-sm"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Support
            </button>
          </div>
          
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-98 transition-all duration-200 font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Homepage
          </button>
        </div>

        {/* Common Issues & Solutions */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <HelpCircle className="w-4 h-4 text-purple-600 mr-2" />
            Common Issues & Solutions
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Insufficient Funds</p>
              <p className="text-xs text-gray-600">Ensure your account has enough balance or try a different card.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Expired Payment Method</p>
              <p className="text-xs text-gray-600">Update your card details in the Tamara app.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-1">Technical Errors</p>
              <p className="text-xs text-gray-600">Wait 5 minutes and try again. Clear browser cache if needed.</p>
            </div>
          </div>
        </div>

        {/* Tamara Support Information */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center mr-3 flex-shrink-0">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Tamara Support</h4>
              <p className="text-xs text-gray-600 mb-2">
                If you believe this is an error, contact Tamara support directly:
              </p>
              <div className="space-y-1">
                <p className="text-xs text-gray-700">
                  📧 <span className="font-medium">Email:</span> support@tamara.co
                </p>
                <p className="text-xs text-gray-700">
                  🌐 <span className="font-medium">Website:</span> help.tamara.co
                </p>
                <p className="text-xs text-gray-700">
                  📱 <span className="font-medium">App:</span> Open Tamara app for live chat
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-6 text-center px-4">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 mb-2">
            <AlertTriangle className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-xs text-gray-500 mb-1">
            Your cart items are saved for 24 hours. Complete your purchase to secure your items.
          </p>
          <p className="text-xs text-gray-400">
            No charges were made to your account. All transactions are secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense
const PaymentFailure = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen safe-area-inset-bottom bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-xs w-full">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading payment status...</p>
        </div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
};

export default PaymentFailure;