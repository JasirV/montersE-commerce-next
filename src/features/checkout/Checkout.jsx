"use client";

import React, { useEffect, useState } from "react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaGooglePay,
  FaApplePay,
  FaMapMarkerAlt,
  FaHome,
  FaBriefcase,
  FaPlus,
  FaEdit,
  FaTrash,
  FaMoneyBillWave,
} from "react-icons/fa";
import Image from "next/image";
import { getCart } from "@/service/productService";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

// VAT Configuration
const VAT_RATE = 0.05; // 5%

const CheckoutForm = ({ totalAmount, vatAmount, finalTotal }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setPaymentError("");

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setPaymentError(error.message);
        setProcessing(false);
        return;
      }

      // Here you would send the paymentMethod.id to your server
      console.log("PaymentMethod:", paymentMethod);
      console.log("Amount Details:", {
        subtotal: totalAmount - vatAmount,
        vat: vatAmount,
        total: finalTotal,
      });

      // Simulate API call to your backend
      // const response = await fetch('/api/create-payment-intent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     paymentMethodId: paymentMethod.id,
      //     amount: finalTotal * 100, // Convert to cents
      //     vatAmount: vatAmount * 100,
      //     subtotal: (totalAmount - vatAmount) * 100
      //   }),
      // });

      // const { clientSecret } = await response.json();

      // const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

      // if (confirmError) {
      //   setPaymentError(confirmError.message);
      // } else {
      //   // Payment successful
      //   console.log('Payment successful!');
      // }
    } catch (err) {
      setPaymentError("An unexpected error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 rounded-lg p-3">
        <CardElement options={cardElementOptions} />
      </div>
      {paymentError && (
        <div className="text-red-600 text-sm">{paymentError}</div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors ${
          !stripe || processing
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-700"
        }`}
      >
        {processing ? "Processing..." : `Pay ${finalTotal.toFixed(2)} AED`}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [step, setStep] = useState("checkout");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "United Arab Emirates",
    state: "",
    city: "",
    street: "",
    building: "",
    apartment: "",
    landmark: "",
    postalCode: "",
  });

  const [billingForm, setBillingForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "United Arab Emirates",
    state: "",
    city: "",
    street: "",
    building: "",
    apartment: "",
    postalCode: "",
  });

  // Calculate VAT and totals
  const calculateTotals = (cartTotal) => {
    const subtotalValue = cartTotal;
    const vatValue = subtotalValue * VAT_RATE;
    const finalTotalValue = subtotalValue + vatValue;

    setSubtotal(subtotalValue);
    setVatAmount(vatValue);
    setFinalTotal(finalTotalValue);
  };

  const handlePlaceOrder = () => {
    if (!privacyAccepted) {
      alert("Please accept the privacy policy to continue");
      return;
    }
    if (!selectedAddress && !shippingForm.firstName) {
      alert("Please fill in shipping address");
      return;
    }
    setStep("payment");
  };

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        const result = await getCart(token);
        setCheckoutProducts(result.cart || []);
        calculateTotals(result.totalAmount || 0);

        const mockAddresses = [
          {
            id: 1,
            type: "home",
            firstName: "John",
            lastName: "Doe",
            phone: "+971501234567",
            email: "john.doe@example.com",
            country: "United Arab Emirates",
            state: "Dubai",
            city: "Dubai",
            street: "Sheikh Zayed Road",
            building: "Burj Khalifa",
            apartment: "2501",
            landmark: "Near Dubai Mall",
            postalCode: "12345",
            isDefault: true,
          },
        ];
        setShippingAddresses(mockAddresses);
        setSelectedAddress(mockAddresses[0]);
      } catch (err) {
        console.log("Failed to fetch cart:", err.message);
      }
    };

    fetchData();
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        {step === "checkout" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FaMapMarkerAlt className="text-blue-500 mr-2" />
                  Shipping Address
                </h2>

                {!showAddressForm ? (
                  <div className="space-y-4">
                    {/* Address Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {shippingAddresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddress?.id === address.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getAddressIcon(address.type)}
                              <span className="font-medium text-sm">
                                {getAddressTypeText(address.type)}
                              </span>
                            </div>
                            {address.isDefault && (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              {address.firstName} {address.lastName}
                            </p>
                            <p>
                              {address.street}, {address.building}
                            </p>
                            <p>
                              {address.city}, {address.state}
                            </p>
                            <p>{address.country}</p>
                            <p className="font-medium">{address.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Address Button */}
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <FaPlus className="text-xs" />
                      <span>Add New Address</span>
                    </button>

                    {/* Direct Form for New Shipping Address */}
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-4">
                        Or enter new shipping address:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={shippingForm.firstName}
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={shippingForm.lastName}
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={shippingForm.phone}
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                phone: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={shippingForm.email}
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium mb-1">
                            Street Address *
                          </label>
                          <input
                            type="text"
                            value={shippingForm.street}
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                street: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            value={shippingForm.city}
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                city: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            State *
                          </label>
                          <input
                            type="text"
                            value={shippingForm.state}
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                state: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={shippingForm.postalCode}
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                postalCode: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Country *
                          </label>
                          <select
                            value={shippingForm.country}
                            onChange={(e) =>
                              setShippingForm({
                                ...shippingForm,
                                country: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option>United Arab Emirates</option>
                            <option>Saudi Arabia</option>
                            <option>Bahrain</option>
                            <option>Kuwait</option>
                            <option>Qatar</option>
                            <option>Oman</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Add New Address Form (simplified)
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      ← Back to address selection
                    </button>
                    {/* Add your address form here */}
                  </div>
                )}
              </div>

              {/* Billing Address Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Billing Address</h2>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="billingSameAsShipping"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="mr-3 text-blue-600"
                  />
                  <label
                    htmlFor="billingSameAsShipping"
                    className="text-sm text-gray-600"
                  >
                    Billing address is the same as shipping address
                  </label>
                </div>

                {!billingSameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={billingForm.firstName}
                        onChange={(e) =>
                          setBillingForm({
                            ...billingForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={billingForm.lastName}
                        onChange={(e) =>
                          setBillingForm({
                            ...billingForm,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={billingForm.street}
                        onChange={(e) =>
                          setBillingForm({
                            ...billingForm,
                            street: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={billingForm.city}
                        onChange={(e) =>
                          setBillingForm({
                            ...billingForm,
                            city: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={billingForm.state}
                        onChange={(e) =>
                          setBillingForm({
                            ...billingForm,
                            state: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={billingForm.postalCode}
                        onChange={(e) =>
                          setBillingForm({
                            ...billingForm,
                            postalCode: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Country *
                      </label>
                      <select
                        value={billingForm.country}
                        onChange={(e) =>
                          setBillingForm({
                            ...billingForm,
                            country: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option>United Arab Emirates</option>
                        <option>Saudi Arabia</option>
                        <option>Bahrain</option>
                        <option>Kuwait</option>
                        <option>Qatar</option>
                        <option>Oman</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                  {checkoutProducts.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={
                              item.productId.images?.[0]?.url ||
                              "/placeholder.png"
                            }
                            alt={item.productId.name}
                            fill
                            className="rounded-lg object-cover border border-gray-200"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.productId.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {item.quantity}
                          </p>
                          {item.productId.color && (
                            <p className="text-xs text-gray-500">
                              Color: {item.productId.color}
                            </p>
                          )}
                          {item.productId.size && (
                            <p className="text-xs text-gray-500">
                              Size: {item.productId.size}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                          {(item.productId.salePrice * item.quantity).toFixed(
                            2
                          )}{" "}
                          AED
                        </p>
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {item.productId.salePrice} AED each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {subtotal.toFixed(2)} AED
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (5%)</span>
                    <span className="font-medium">
                      {vatAmount.toFixed(2)} AED
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>{finalTotal.toFixed(2)} AED</span>
                  </div>
                </div>
              </div>

              {/* Rest of your payment method section remains the same */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "stripe"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <FaCcVisa className="text-xl text-blue-600" />
                        <FaCcMastercard className="text-xl text-red-600" />
                        <FaCcAmex className="text-xl text-indigo-600" />
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "cash"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex items-center space-x-2">
                      <FaMoneyBillWave className="text-green-500" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                  </label>
                </div>

                {/* Privacy Policy */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="privacy-policy"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="mt-0.5 mr-3 text-blue-600"
                    />
                    <label
                      htmlFor="privacy-policy"
                      className="text-xs text-gray-600 leading-relaxed"
                    >
                      I agree to the{" "}
                      <a
                        href="/privacy-policy"
                        className="text-blue-600 hover:underline"
                      >
                        privacy policy
                      </a>
                    </label>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    !privacyAccepted ||
                    (!selectedAddress && !shippingForm.firstName)
                  }
                  className={`w-full mt-4 text-white py-3 rounded-lg font-medium transition-colors ${
                    privacyAccepted &&
                    (selectedAddress || shippingForm.firstName)
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {paymentMethod === "cash"
                    ? "Place Order (Cash)"
                    : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "payment" && paymentMethod === "stripe" && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)} AED</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>VAT (5%):</span>
                <span>{vatAmount.toFixed(2)} AED</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total:</span>
                <span>{finalTotal.toFixed(2)} AED</span>
              </div>
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                totalAmount={subtotal}
                vatAmount={vatAmount}
                finalTotal={finalTotal}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getAddressIcon = (type) => {
  switch (type) {
    case "home":
      return <FaHome className="text-blue-500" />;
    case "work":
      return <FaBriefcase className="text-green-500" />;
    default:
      return <FaMapMarkerAlt className="text-purple-500" />;
  }
};

const getAddressTypeText = (type) => {
  switch (type) {
    case "home":
      return "Home";
    case "work":
      return "Work";
    default:
      return "Other";
  }
};

export default CheckoutPage;
