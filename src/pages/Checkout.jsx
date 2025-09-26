"use client";
import React, { useState } from "react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaGooglePay,
  FaApplePay,
} from "react-icons/fa";
import tabby from "../assets/tabby-new.png";
import bag from "../assets/HandBags/cream-kitted-bag-still-life.jpg";
import watch from "../assets/Watche/stylish-golden-watch-white-surface.jpg";
import Image from "next/image";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("montres");
  const [step, setStep] = useState("checkout"); // checkout | payment
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const handlePlaceOrder = () => {
    if (!privacyAccepted) {
      alert("Please accept the privacy policy to continue");
      return;
    }
    setStep("payment");
  };

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
                <div>
                  <label className="block text-sm font-medium">
                    First name *
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last name</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Phone *</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Email *</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Country / Region *
                  </label>
                  <select className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500">
                    <option>United Arab Emirates</option>
                    <option>Bahrain</option>
                    <option>Egypt</option>
                    <option>Iran</option>
                    <option>Iraq</option>
                    <option>India</option>
                    <option>Kuwait</option>
                    <option>Saudi Arabia</option>
                    <option>Palestine</option>
                    <option>Yemen</option>
                    <option>USA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    State / County
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium">
                  Street address *
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium">
                  Order notes (optional)
                </label>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image src={bag} alt="Bag" className="w-12 h-12 rounded" />
                    <div>
                      <p className="text-sm font-medium">
                        Seiko Sport Chronograph 38mm
                      </p>
                      <p className="text-xs text-gray-500">SKU: MON0145</p>
                    </div>
                  </div>
                  <span className="text-sm">1,100.0 AED</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={watch}
                      alt="Watch"
                      className="w-12 h-12 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        Raymond Weil Amadeus 200
                      </p>
                      <p className="text-xs text-gray-500">SKU: MON0086</p>
                    </div>
                  </div>
                  <span className="text-sm">1,200.0 AED</span>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>2,300.0 AED</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free shipping</span>
                </div>
              </div>

              {/* Final Total */}
              <div className="flex justify-between text-lg font-semibold mt-4">
                <span>Total</span>
                <span>2,300.0 AED</span>
              </div>

              {/* Payment Options */}
              <div className="mt-6 space-y-4">
                {/* Montres Trading Option */}
                <label
                  className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                    paymentMethod === "montres"
                      ? "border-purple-500 bg-purple-50"
                      : "hover:bg-gray-50"
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
                    paymentMethod === "tabby"
                      ? "border-purple-500 bg-purple-50"
                      : "hover:bg-gray-50"
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
                    <p className="font-medium">
                      Pay in 4. No interest, no fees.
                    </p>
                    <Image src={tabby} alt="Tabby" className="h-6 mt-1" />
                  </div>
                </label>
              </div>

              {/* Privacy Policy Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy-policy"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <label
                    htmlFor="privacy-policy"
                    className="text-sm text-gray-600"
                  >
                    Your personal data will be used to process your order,
                    support your experience throughout this website, and for
                    other purposes described in our{" "}
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
                  <Image src={tabby} alt="Tabby" className="h-8 mx-auto mb-4" />
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
