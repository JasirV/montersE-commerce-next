"use client"
import React, { useEffect, useState } from "react";
import { X, AlertTriangle, RefreshCw, Home, ShoppingBag, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";

const PaymentCancel = () => {
  const searchParams = useSearchParams();

  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "#123456789",
    amount: "431.64",
    currency: "AED",
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    items: 3
  });

  useEffect(() => {
    // You can fetch actual order details from your API here
    const orderId = searchParams.get('orderId');
    
    if (orderId) {
      // Fetch order details from your backend
      // fetchOrderDetails(orderId);
    }
  }, [searchParams]);

  const handleRetryPayment = () => {
    const orderId = searchParams.get('orderId');
    if (orderId) {
      // Redirect to checkout with the same order
      window.location.href = `/checkout?orderId=${orderId}`;
    } else {
      window.location.href = "/checkout";
    }
  };

  const handleContinueShopping = () => {
    window.location.href = "/";
  };

  const handleViewCart = () => {
    window.location.href = "/cart";
  };

  const handleContactSupport = () => {
    window.location.href = "/contact";
  };

  const commonIssues = [
    "Insufficient funds in your account",
    "Card expiration date passed",
    "Incorrect CVV code",
    "Daily transaction limit exceeded",
    "Bank declined the transaction",
    "Network connectivity issues"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        
        {/* Cancellation Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          
          {/* Header with Warning Icon */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-center relative">
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-orange-100">
                <X className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Cancelled</h1>
            <p className="text-orange-100 text-sm">Your transaction was not completed</p>
          </div>

          {/* Content */}
          <div className="pt-10 px-6 pb-6">
            
            {/* Warning Message */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-orange-800 text-sm mb-1">
                    Don't worry, you haven't been charged
                  </h3>
                  <p className="text-orange-700 text-xs">
                    Your payment was cancelled before completion. No amount has been deducted from your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-semibold text-gray-900">{orderDetails.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-gray-900">
                    {orderDetails.currency} {orderDetails.amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items</span>
                  <span className="font-semibold text-gray-900">{orderDetails.items} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">{orderDetails.date}</span>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Common Issues</h3>
              <div className="space-y-2">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                <X className="w-3 h-3 mr-1" />
                Cancelled
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                Not Charged
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 mb-4">
              <button
                onClick={handleRetryPayment}
                className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Retry Payment
              </button>
              
              <button
                onClick={handleViewCart}
                className="w-full flex items-center justify-center px-6 py-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Review Cart
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleContinueShopping}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Continue Shopping
              </button>
              <button
                onClick={handleContactSupport}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                Get Help
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-center text-gray-500 text-xs">
              Need immediate assistance?{" "}
              <a href="tel:+9718001234" className="text-blue-600 hover:underline font-semibold">
                Call +971 800 1234
              </a>
            </p>
            <p className="text-center text-gray-400 text-xs mt-1">
              Our support team is available 24/7
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 grid gap-4">
          {/* Tips Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Tips for Successful Payment</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>Ensure your card details are correct and up to date</span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>Check your internet connection stability</span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>Verify with your bank if there are any restrictions</span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>Try using a different payment method if issues persist</span>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">Still Need Help?</h3>
            <p className="text-blue-800 text-xs mb-3">
              Our customer support team is here to help you complete your purchase.
            </p>
            <div className="space-y-2 text-sm">
              <a 
                href="mailto:support@yourstore.com" 
                className="flex items-center text-blue-700 hover:text-blue-800 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                support@yourstore.com
              </a>
              <a 
                href="/help" 
                className="flex items-center text-blue-700 hover:text-blue-800 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Visit Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;