"use client";

import React, { useEffect, useState } from "react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaGooglePay,
  FaApplePay,
} from "react-icons/fa";
import Image from "next/image";
import { getCart } from "@/service/productService";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("montres");
  const [step, setStep] = useState("checkout"); // checkout | payment
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isMounted, setIsMounted] = useState(false); // ✅ Prevent hydration errors

  const handlePlaceOrder = () => {
    if (!privacyAccepted) {
      alert("Please accept the privacy policy to continue");
      return;
    }
    setStep("payment");
  };

  useEffect(() => {
    setIsMounted(true); // component is mounted, safe to use client-only APIs
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const result = await getCart(token);
        setCheckoutProducts(result.cart || []);
        setTotalAmount(result.totalAmount || 0);
      } catch (err) {
        console.log("Failed to fetch cart:", err.message);
      }
    };

    fetchData();
  }, []);

  if (!isMounted) return null; // ✅ Wait for client mount to render
  console.log(checkoutProducts)
  return (
    <div className="min-h-screen bg-gray-50 p-4 flex justify-center">
      <div className="w-full max-w-6xl">
        {step === "checkout" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDE - Billing & Shipping */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Billing & Shipping</h2>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "First name *", type: "text" },
                  { label: "Last name", type: "text" },
                  { label: "Phone *", type: "text" },
                  { label: "Email *", type: "email" },
                  { label: "State / County", type: "text" },
                ].map((field, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium">{field.label}</label>
                    <input
                      type={field.type}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium">Country / Region *</label>
                  <select className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500">
                    {[
                      "United Arab Emirates",
                      "Bahrain",
                      "Egypt",
                      "Iran",
                      "Iraq",
                      "India",
                      "Kuwait",
                      "Saudi Arabia",
                      "Palestine",
                      "Yemen",
                      "USA",
                    ].map((c, i) => (
                      <option key={i}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium">Street address *</label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium">Order notes (optional)</label>
                <textarea
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Notes about your order, e.g. delivery notes."
                />
              </div>
            </div>

            {/* RIGHT SIDE - Order Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="font-semibold text-lg mb-4">Your Order</h2>

              {/* Products */}
              <div className="space-y-4 mb-6">
                {checkoutProducts.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={item.productId.images?.[0]?.url || "/placeholder.png"}
                        alt={item.productId.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium">{item.productId.name}</p>
                        <p className="text-xs text-gray-500">{item.productId.sku}</p>
                      </div>
                    </div>
                    <span className="text-sm">{item.productId.sellprice}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{totalAmount} AED</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free shipping</span>
                </div>
              </div>

              {/* Final Total */}
              <div className="flex justify-between text-lg font-semibold mt-4">
                <span>Total</span>
                <span>{totalAmount} AED</span>
              </div>

              {/* Payment Options */}
              <div className="mt-6 space-y-4">
                {/* Montres Trading Option */}
                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    paymentMethod === "montres" ? "border-purple-500 bg-purple-50" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="montres"
                    checked={paymentMethod === "montres"}
                    onChange={() => setPaymentMethod("montres")}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Montres Trading</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <FaCcVisa className="text-2xl text-blue-600" />
                      <FaCcMastercard className="text-2xl text-red-600" />
                      <FaCcAmex className="text-2xl text-indigo-600" />
                      <FaGooglePay className="text-2xl text-gray-700" />
                      <FaApplePay className="text-2xl text-black" />
                    </div>
                  </div>
                </label>

                {/* Tabby Option */}
                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    paymentMethod === "tabby" ? "border-purple-500 bg-purple-50" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="tabby"
                    checked={paymentMethod === "tabby"}
                    onChange={() => setPaymentMethod("tabby")}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Pay in 4. No interest, no fees.</p>
                  </div>
                </label>
              </div>

              {/* Privacy Policy */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy-policy"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="privacy-policy" className="text-sm text-gray-600">
                    Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our{" "}
                    <a
                      href="/privacy-policy"
                      className="text-purple-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      privacy policy
                    </a>
                    .
                  </label>
                </div>
              </div>

              {/* Place Order */}
              <button
                onClick={handlePlaceOrder}
                disabled={!privacyAccepted}
                className={`w-full mt-6 text-white py-3 rounded-lg ${
                  privacyAccepted
                    ? "bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {paymentMethod === "montres"
                  ? "Place Order with Montres Trading"
                  : "Place Order with Tabby"}
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT GATEWAY VIEW */}
        {step === "payment" && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            {paymentMethod === "montres" ? (
              <div>
                <h2 className="font-semibold text-lg mb-4">Montres Trading</h2>
                {/* Simulated Payment Gateway */}
                <div className="border p-4 rounded-lg">
                  <p className="mb-2 font-medium">Choose Payment Method</p>
                  <div className="space-y-4">
                    <button className="w-full border rounded-lg p-3 flex items-center justify-between">
                      <span>Google Pay</span>
                      <FaGooglePay className="text-2xl text-gray-700" />
                    </button>
                    <div className="border rounded-lg p-4">
                      <p className="font-medium mb-2">Credit or Debit Card</p>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full border rounded-lg p-2 mb-2"
                      />
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-1/2 border rounded-lg p-2"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="w-1/2 border rounded-lg p-2"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        className="w-full border rounded-lg p-2"
                      />
                      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg">
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="font-semibold text-lg mb-4">Pay with Tabby</h2>
                <div className="border p-4 rounded-lg text-center">
                  {/* <Image src={tabby} alt="Tabby" className="h-8 mx-auto mb-4" /> */}
                  <p className="mb-2">
                    Complete your payment in 4 easy installments. No fees.
                  </p>
                  <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg">
                    Continue with Tabby
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
