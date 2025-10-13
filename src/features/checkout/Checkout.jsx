"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaMapMarkerAlt,
  FaHome,
  FaBriefcase,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";
import Image from "next/image";
import { getCart } from "@/service/productService";
import axios from "axios";
import ShippingTermsModal from "./ShippingTermsModal";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [step, setStep] = useState("checkout");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(true); // New loading state for cart

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
    postalCode: "",
  });

  // Check if we have a valid address for calculation
  const hasValidAddress = useCallback(() => {
    if (selectedAddress) return true;

    return (
      shippingForm.firstName &&
      shippingForm.lastName &&
      shippingForm.street &&
      shippingForm.city &&
      shippingForm.state &&
      shippingForm.country
    );
  }, [selectedAddress, shippingForm]);

  // Calculate totals from backend when address or cart changes
  useEffect(() => {
    if (checkoutProducts.length > 0 && hasValidAddress()) {
      calculateTotals();
    }
  }, [checkoutProducts, hasValidAddress]);

  // Update totals when selected address changes
  useEffect(() => {
    if (checkoutProducts.length > 0 && selectedAddress) {
      calculateTotals();
    }
  }, [selectedAddress]);

  const calculateTotals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("No token found");
        calculateTotalsFallback();
        return;
      }

      const items = checkoutProducts.map((item) => ({
        productId: item.productId._id || item.productId,
        quantity: item.quantity,
      }));

      // Prepare shipping address for calculation
      let shippingAddress = {};
      if (selectedAddress) {
        shippingAddress = {
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          email: selectedAddress.email,
          phone: selectedAddress.phone,
          address1: selectedAddress.street,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          postalCode: selectedAddress.postalCode,
        };
      } else if (hasValidAddress()) {
        shippingAddress = {
          firstName: shippingForm.firstName,
          lastName: shippingForm.lastName,
          email: shippingForm.email,
          phone: shippingForm.phone,
          address1: shippingForm.street,
          street: shippingForm.street,
          city: shippingForm.city,
          state: shippingForm.state,
          country: shippingForm.country,
          postalCode: shippingForm.postalCode,
        };
      } else {
        calculateTotalsFallback();
        return;
      }

      console.log("Sending calculation request with:", {
        items,
        shippingAddress,
        calculateOnly: true,
      });

      // Use the updated endpoint that handles calculateOnly
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/order/`, // Same endpoint, but with calculateOnly flag
        {
          items,
          shippingAddress,
          billingAddress: billingSameAsShipping ? shippingAddress : billingForm,
          paymentMethod,
          calculateOnly: true, // This flag is now handled by backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Calculation response:", response.data);

      if (response.data.success) {
        const {
          subtotal: calculatedSubtotal = 0,
          shippingFee: calculatedShippingFee = 0,
          total: calculatedTotal = 0,
          vatAmount: calculatedVat = 0,
        } = response.data;

        setSubtotal(calculatedSubtotal);
        setShippingFee(calculatedShippingFee);
        setFinalTotal(calculatedTotal);
        setVatAmount(calculatedVat);

        console.log("Updated totals:", {
          subtotal: calculatedSubtotal,
          shippingFee: calculatedShippingFee,
          finalTotal: calculatedTotal,
          vatAmount: calculatedVat,
        });
      } else {
        throw new Error(response.data.message || "Calculation failed");
      }
    } catch (error) {
      console.error("Error calculating totals:", error.message);
      console.error("Error details:", error.response?.data);
      calculateTotalsFallback();
    } finally {
      setLoading(false);
    }
  };

  // Improved fallback calculation
  const calculateTotalsFallback = () => {
    const cartTotal = checkoutProducts.reduce((total, item) => {
      const price = item.productId.salePrice || item.productId.price || 0;
      return total + price * item.quantity;
    }, 0);

    const subtotalValue = cartTotal;

    // Calculate shipping based on subtotal (free over 100 AED as example)
    const shippingValue = subtotalValue > 100 ? 0 : 20; // Example logic

    // Calculate VAT (5% as example for UAE)
    const vatRate = 0.05;
    const vatValue = subtotalValue * vatRate;

    const finalTotalValue = subtotalValue + shippingValue + vatValue;

    setSubtotal(subtotalValue);
    setShippingFee(shippingValue);
    setVatAmount(vatValue);
    setFinalTotal(finalTotalValue);

    console.log("Fallback calculation:", {
      subtotal: subtotalValue,
      shipping: shippingValue,
      vat: vatValue,
      total: finalTotalValue,
    });
  };

  // Update totals when form fields are completed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        checkoutProducts.length > 0 &&
        hasValidAddress() &&
        !selectedAddress
      ) {
        calculateTotals();
      }
    }, 1000); // Debounce to avoid too many API calls

    return () => clearTimeout(timer);
  }, [
    shippingForm.firstName,
    shippingForm.lastName,
    shippingForm.street,
    shippingForm.city,
    shippingForm.state,
    shippingForm.country,
  ]);

  const createOrder = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please login to continue");
        return;
      }

      // Prepare items array for order
      const items = checkoutProducts.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

      // Prepare shipping address
      let shippingAddress = {};
      if (selectedAddress) {
        shippingAddress = {
          firstName: selectedAddress.firstName,
          lastName: selectedAddress.lastName,
          email: selectedAddress.email,
          phone: selectedAddress.phone,
          address1: selectedAddress.street,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          country: selectedAddress.country,
          postalCode: selectedAddress.postalCode,
        };
      } else {
        shippingAddress = {
          firstName: shippingForm.firstName,
          lastName: shippingForm.lastName,
          email: shippingForm.email,
          phone: shippingForm.phone,
          address1: shippingForm.street,
          street: shippingForm.street,
          city: shippingForm.city,
          state: shippingForm.state,
          country: shippingForm.country,
          postalCode: shippingForm.postalCode,
        };
      }

      // Prepare billing address
      let billingAddress = {};
      if (billingSameAsShipping) {
        billingAddress = { ...shippingAddress };
      } else {
        billingAddress = {
          firstName: billingForm.firstName,
          lastName: billingForm.lastName,
          email: billingForm.email,
          phone: billingForm.phone,
          address1: billingForm.street,
          street: billingForm.street,
          city: billingForm.city,
          state: billingForm.state,
          country: billingForm.country,
          postalCode: billingForm.postalCode,
        };
      }

      // Validate required fields
      if (
        !shippingAddress.firstName ||
        !shippingAddress.lastName ||
        !shippingAddress.phone ||
        !shippingAddress.email ||
        !shippingAddress.street ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.country
      ) {
        alert("Please fill all required shipping address fields");
        setIsLoading(false);
        return;
      }

      if (
        !billingSameAsShipping &&
        (!billingAddress.firstName ||
          !billingAddress.lastName ||
          !billingAddress.phone ||
          !billingAddress.email ||
          !billingAddress.street ||
          !billingAddress.city ||
          !billingAddress.state ||
          !billingAddress.country)
      ) {
        alert("Please fill all required billing address fields");
        setIsLoading(false);
        return;
      }

      const orderData = {
        items,
        shippingAddress,
        billingAddress,
        paymentMethod,
        subtotal,
        shippingFee,
        total: finalTotal,
        vatAmount,
      };

      console.log("Creating order with data:", orderData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/order/`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        if (paymentMethod === "stripe" && response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          setStep("success");
        }
      } else {
        throw new Error(response.data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to create order"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!privacyAccepted) {
      alert("Please accept the privacy policy to continue");
      return;
    }

    if (!hasValidAddress()) {
      alert("Please fill in shipping address or select an existing address");
      return;
    }

    createOrder();
  };

  useEffect(() => {
    setIsMounted(true);

    const fetchData = async () => {
      try {
        setCartLoading(true); // Start loading
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // Get cart data
        const cartResult = await getCart(token);
        setCheckoutProducts(cartResult.cart || []);

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/order/shipping-addresses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        console.log(data, "addresses");

        if (data.success && data.addresses.length > 0) {
          setShippingAddresses(data.addresses);
          setSelectedAddress(data.addresses[0]);
        }
      } catch (err) {
        console.log("Error fetching data:", err.message);
      } finally {
        setCartLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  if (!isMounted) return null;

  // Loading state for entire checkout page
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-6xl mx-auto w-full text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
              <h2 className="text-xl font-semibold text-gray-700">Loading Your Cart...</h2>
              <p className="text-gray-500">Please wait while we prepare your checkout</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {shippingAddresses.map((address, index) => (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddress === address
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
                              {address.street}, {address.postalCode}
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

                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <FaPlus className="text-xs" />
                      <span>Add New Address</span>
                    </button>

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
                            placeholder="First Name"
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
                            placeholder="Last Name"
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
                            placeholder="Phone Number"
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
                            placeholder="Email Address"
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
                            placeholder="Street Address"
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
                            placeholder="City"
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
                            placeholder="State"
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
                            placeholder="Postal Code"
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
                            <option>Germany</option>
                            <option>United States</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      ← Back to address selection
                    </button>
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
                        placeholder="First Name"
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
                        placeholder="Last Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={billingForm.phone}
                        onChange={(e) =>
                          setBillingForm({
                            ...billingForm,
                            phone: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="Phone Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={billingForm.email}
                        onChange={(e) =>
                          setBillingForm({
                            ...billingForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="Email Address"
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
                        placeholder="Street Address"
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
                        placeholder="City"
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
                        placeholder="State"
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
                        placeholder="Postal Code"
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

                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <FaSpinner className="w-6 h-6 text-blue-600 animate-spin" />
                    <span className="ml-2 text-gray-600">Calculating totals...</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                      {checkoutProducts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Your cart is empty
                        </div>
                      ) : (
                        checkoutProducts.map((item, index) => (
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
                                {(
                                  (item.productId.salePrice ||
                                    item.productId.price ||
                                    0) * item.quantity
                                ).toFixed(2)}{" "}
                                AED
                              </p>
                              <p className="text-xs text-gray-500 whitespace-nowrap">
                                {(
                                  item.productId.salePrice ||
                                  item.productId.price ||
                                  0
                                ).toFixed(2)}{" "}
                                AED each
                              </p>
                            </div>
                          </div>
                        ))
                      )}
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
                        <span
                          className={`font-medium ${
                            shippingFee === 0 ? "text-green-600" : "text-gray-900"
                          }`}
                        >
                          {shippingFee === 0
                            ? "Free"
                            : `${shippingFee.toFixed(2)} AED`}
                        </span>
                        <button
                          onClick={() => setIsShippingModalOpen(true)}
                          className="text-blue-600 text-xs underline hover:text-blue-700"
                        >
                          View Terms
                        </button>
                        {/* Modal is rendered outside of button */}
                        <ShippingTermsModal
                          isOpen={isShippingModalOpen}
                          onClose={() => setIsShippingModalOpen(false)}
                        />
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">VAT</span>
                        <span className="font-medium">
                          {vatAmount.toFixed(2)} AED
                        </span>
                      </div>

                      <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                        <span>Total</span>
                        <span>{finalTotal.toFixed(2)} AED</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Payment Method Section */}
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
                    !hasValidAddress() ||
                    isLoading ||
                    loading ||
                    checkoutProducts.length === 0
                  }
                  className={`w-full mt-4 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    privacyAccepted &&
                    hasValidAddress() &&
                    !isLoading &&
                    !loading &&
                    checkoutProducts.length > 0
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                      Processing Order...
                    </>
                  ) : loading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                      Calculating...
                    </>
                  ) : (
                    `Place Order - ${finalTotal.toFixed(2)} AED`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. You will receive a confirmation email
              shortly.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </button>
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