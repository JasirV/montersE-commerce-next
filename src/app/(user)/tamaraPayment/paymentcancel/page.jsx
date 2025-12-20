"use client"
import React, { Suspense } from "react";
import { XCircle, RefreshCw, Home, HelpCircle, CreditCard, AlertTriangle, ArrowLeft } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const PaymentCancellationContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorCode = searchParams.get("errorCode");
  const orderId = searchParams.get("orderId");

  const errorMessages = {
    "USER_CANCELLED": "You cancelled the payment process.",
    "PAYMENT_FAILED": "The payment could not be processed.",
    "INSUFFICIENT_FUNDS": "Insufficient funds in your account.",
    "TIMEOUT": "The payment session timed out.",
    "NETWORK_ERROR": "Network connection issue. Please try again.",
    "DEFAULT": "The payment was cancelled or failed to process."
  };

  const getErrorMessage = () => {
    return errorMessages[errorCode] || errorMessages.DEFAULT;
  };

  const handleTryAgain = () => {
    if (orderId) {
      // Redirect to payment page with the same order
      router.push(`/checkout/payment?orderId=${orderId}`);
    } else {
      router.push("/cart");
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleContactSupport = () => {
    window.open("mailto:support@tamara.co", "_blank");
  };

  const handleBackToCart = () => {
    router.push("/cart");
  };

  return (
    <div className="min-h-screen safe-area-inset-bottom bg-gradient-to-b from-red-50 to-white pb-20 px-4">
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
            <h1 className="text-lg font-bold text-gray-900">Payment Status</h1>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Main Cancellation Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
          {/* Error Banner */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Payment Cancelled</h2>
            <p className="text-red-100 text-sm">Your Tamara payment was not completed</p>
          </div>

          {/* Error Details */}
          <div className="p-5">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-gray-700 mb-2">{getErrorMessage()}</p>
              
              {errorCode && (
                <div className="inline-block px-3 py-1 bg-gray-100 rounded-full">
                  <code className="text-xs font-mono text-gray-600">Error: {errorCode}</code>
                </div>
              )}
            </div>

            {/* Order Info */}
            {orderId && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Reference</p>
                    <p className="text-sm font-semibold text-gray-900">{orderId}</p>
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            )}

            {/* What Happened Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">What happened?</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-xs text-red-600">•</span>
                  </div>
                  <span className="text-sm text-gray-600">No payment was processed to your account</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-xs text-red-600">•</span>
                  </div>
                  <span className="text-sm text-gray-600">Your order is saved in your cart</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <span className="text-xs text-red-600">•</span>
                  </div>
                  <span className="text-sm text-gray-600">You can try again with Tamara or choose another payment method</span>
                </li>
              </ul>
            </div>

            {/* Quick Help */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <HelpCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Need help with Tamara?</p>
                  <p className="text-xs text-blue-700">
                    Contact Tamara support for payment-related questions or visit their help center.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleTryAgain}
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 active:scale-98 transition-all duration-200 font-semibold shadow-lg shadow-purple-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Try Payment Again
          </button>
          
          <button
            onClick={handleContactSupport}
            className="w-full flex items-center justify-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 active:scale-98 transition-all duration-200 font-semibold"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Contact Tamara Support
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-98 transition-all duration-200 font-semibold"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Homepage
          </button>
        </div>

        {/* Tamara Info */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <CreditCard className="w-4 h-4 text-purple-600 mr-2" />
            About Tamara Payments
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-xs text-green-600">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Pay in 4 installments</p>
                <p className="text-xs text-gray-500">Interest-free payments every 2 weeks</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-xs text-green-600">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">No credit check</p>
                <p className="text-xs text-gray-500">Instant approval decision</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 flex-shrink-0">
                <span className="text-xs text-green-600">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Secure & trusted</p>
                <p className="text-xs text-gray-500">Used by millions of shoppers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips for Next Time */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Tips for successful payment:</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
              <span className="text-xs text-gray-600">Ensure stable internet connection</span>
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
              <span className="text-xs text-gray-600">Complete payment within 10 minutes</span>
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
              <span className="text-xs text-gray-600">Make sure you have sufficient funds</span>
            </li>
            <li className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
              <span className="text-xs text-gray-600">Don't close the browser during payment</span>
            </li>
          </ul>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 px-4">
          <p className="text-xs text-gray-500">
            Your items are still in your cart. Complete your purchase within 24 hours to ensure availability.
          </p>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense
const PaymentCancellation = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen safe-area-inset-bottom bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-xs w-full">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading payment status...</p>
        </div>
      </div>
    }>
      <PaymentCancellationContent />
    </Suspense>
  );
};

export default PaymentCancellation;