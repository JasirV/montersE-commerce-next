"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaMapMarkerAlt,
  FaHome,
  FaBriefcase,
  FaPlus,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import ShippingTermsModal from "./ShippingTermsModal";
import TamaraLogo from "../../assets/Tamara.jpeg";
import { toast, Toaster } from "react-hot-toast";

// Address form validation schema
const addressSchema = {
  firstName: { required: true, type: "text" },
  lastName: { required: true, type: "text" },
  phone: { required: true, type: "tel", pattern: /^[+]?[\d\s\-()]+$/ },
  email: { required: true, type: "email" },
  address1: { required: true, type: "text" },
  address2: { required: false, type: "text" },
  city: { required: true, type: "text" },
  state: { required: true, type: "text" },
  country: { required: true, type: "text" },
  postalCode: { required: false, type: "text" },
  type: { required: true, type: "select", options: ["home", "work", "other"] },
  isDefault: { required: false, type: "checkbox" },
};

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [step, setStep] = useState("checkout");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [checkoutProducts, setCheckoutProducts] = useState([]);
  console.log(checkoutProducts, "checkoutProducts");

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shippingFee: 0,
    vatAmount: 0,
    total: 0,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Address states
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [showShippingAddressForm, setShowShippingAddressForm] = useState(false);
  const [showBillingAddressForm, setShowBillingAddressForm] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  // Form states
  const [shippingForm, setShippingForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "United Arab Emirates",
    postalCode: "",
    type: "home",
    isDefault: false,
  });

  const [billingForm, setBillingForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "United Arab Emirates",
    postalCode: "",
    type: "home",
    isDefault: false,
  });

  const [formErrors, setFormErrors] = useState({
    shipping: {},
    billing: {},
  });

  // Countries list for dropdown
  const countries = [
    "United Arab Emirates",
    "Saudi Arabia",
    "Bahrain",
    "Kuwait",
    "Qatar",
    "Oman",
    "Germany",
    "United States",
  ];

  // Get authentication token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  // Fetch user addresses from backend
  const fetchUserAddresses = useCallback(async () => {
    try {
      setIsLoadingAddresses(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      // Fetch shipping addresses
      const shippingResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/address/shipping`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Fetch billing addresses
      const billingResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/address/billing`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (shippingResponse.data.success) {
        // Deduplicate addresses by address1, city, country, and phone
        const deduplicatedShipping = deduplicateAddresses(
          shippingResponse.data.addresses
        );
        setShippingAddresses(deduplicatedShipping);

        // Select default address if available
        const defaultShipping = deduplicatedShipping.find(
          (addr) => addr.isDefault
        );
        if (defaultShipping) {
          setSelectedShippingAddress(defaultShipping._id);
          prefillShippingForm(defaultShipping);
        }
      }

      if (billingResponse.data.success) {
        const deduplicatedBilling = deduplicateAddresses(
          billingResponse.data.addresses
        );
        setBillingAddresses(deduplicatedBilling);

        const defaultBilling = deduplicatedBilling.find(
          (addr) => addr.isDefault
        );
        if (defaultBilling) {
          setSelectedBillingAddress(defaultBilling._id);
          prefillBillingForm(defaultBilling);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  // Deduplicate addresses based on address1, city, country, and phone
  const deduplicateAddresses = (addresses) => {
    const seen = new Set();
    return addresses.filter((address) => {
      const key = `${address.address1}-${address.city}-${address.country}-${address.phone}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  // Prefill shipping form with selected address
  const prefillShippingForm = (address) => {
    setShippingForm({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      phone: address.phone || "",
      email: address.email || "",
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "United Arab Emirates",
      postalCode: address.postalCode || "",
      type: address.type || "home",
      isDefault: address.isDefault || false,
    });
  };

  // Prefill billing form with selected address
  const prefillBillingForm = (address) => {
    setBillingForm({
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      phone: address.phone || "",
      email: address.email || "",
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "United Arab Emirates",
      postalCode: address.postalCode || "",
      type: address.type || "home",
      isDefault: address.isDefault || false,
    });
  };

  // Get selected shipping address object
  const getSelectedShippingAddress = useMemo(() => {
    if (!selectedShippingAddress) return null;
    return shippingAddresses.find(
      (addr) => addr._id === selectedShippingAddress
    );
  }, [selectedShippingAddress, shippingAddresses]);

  // Get selected billing address object
  const getSelectedBillingAddress = useMemo(() => {
    if (!selectedBillingAddress) return null;
    return billingAddresses.find((addr) => addr._id === selectedBillingAddress);
  }, [selectedBillingAddress, billingAddresses]);

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log("No token found");
        return;
      }

      console.log(
        "Fetching cart from:",
        `${process.env.NEXT_PUBLIC_BASEURL}/cart`
      );

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/cart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Cart API Response:", response.data);

      if (response.data.message === "Cart fetched successfully") {
        // Access cart from response.data.cart
        const cartItems = response.data.cart || [];
        console.log("Cart items:", cartItems);
        setCheckoutProducts(cartItems);
        calculateOrderSummary(cartItems);
      } else {
        console.log("Unexpected response:", response.data);
        toast.error("Failed to load cart items");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart items");
    }
  }, []);

  // ===========================
  // Calculate Order Summary
  // ===========================
  const calculateOrderSummary = (items) => {
    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      const product = item.productId;
      const price = product?.salePrice || product?.regularPrice || 0;
      return sum + price * item.quantity;
    }, 0);

    // Calculate shipping fee (free over 100 AED)
    const shippingFee = subtotal > 100 ? 0 : 20;

    // Total is subtotal + shipping fee (VAT already included)
    const total = subtotal + shippingFee;

    // Update state
    setOrderSummary({
      subtotal,
      shippingFee,
      total,
    });

    // Debug log
    console.log("Order summary calculated:", {
      subtotal,
      shippingFee,
      total,
      itemsCount: items.length,
    });
  };

  // Form validation
  const validateForm = (form, type) => {
    const errors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "address1",
      "city",
      "state",
      "country",
    ];

    requiredFields.forEach((field) => {
      if (!form[field] || form[field].trim() === "") {
        errors[field] = "This field is required";
      }
    });

    // Email validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Invalid email address";
    }

    // Phone validation
    if (form.phone && !/^[+]?[\d\s\-()]+$/.test(form.phone)) {
      errors.phone = "Invalid phone number";
    }

    setFormErrors((prev) => ({
      ...prev,
      [type]: errors,
    }));

    return Object.keys(errors).length === 0;
  };

  // Save shipping address to backend
  const saveShippingAddress = async () => {
    const isValid = validateForm(shippingForm, "shipping");
    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSavingAddress(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/address/shipping`,
        shippingForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Shipping address saved successfully");
        fetchUserAddresses(); // Refresh addresses
        setShowShippingAddressForm(false);

        // Select the newly created address
        if (response.data.address) {
          setSelectedShippingAddress(response.data.address._id);
        }
      }
    } catch (error) {
      console.error("Error saving shipping address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Save billing address to backend
  const saveBillingAddress = async () => {
    const isValid = validateForm(billingForm, "billing");
    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setIsSavingAddress(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/address/billing`,
        billingForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Billing address saved successfully");
        fetchUserAddresses(); // Refresh addresses
        setShowBillingAddressForm(false);

        // Select the newly created address
        if (response.data.address) {
          setSelectedBillingAddress(response.data.address._id);
        }
      }
    } catch (error) {
      console.error("Error saving billing address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Handle shipping address selection
  const handleShippingAddressSelect = (addressId) => {
    setSelectedShippingAddress(addressId);
    const address = shippingAddresses.find((addr) => addr._id === addressId);
    if (address) {
      prefillShippingForm(address);
    }

    if (billingSameAsShipping) {
      setSelectedBillingAddress(addressId);
      if (address) {
        prefillBillingForm(address);
      }
    }
  };

  // Handle billing address selection
  const handleBillingAddressSelect = (addressId) => {
    setSelectedBillingAddress(addressId);
    const address = billingAddresses.find((addr) => addr._id === addressId);
    if (address) {
      prefillBillingForm(address);
    }
  };

  // Toggle billing same as shipping
  const handleBillingSameToggle = (checked) => {
    setBillingSameAsShipping(checked);
    if (checked && getSelectedShippingAddress) {
      setSelectedBillingAddress(selectedShippingAddress);
      prefillBillingForm(getSelectedShippingAddress);
    }
  };

  // Prepare order data for payment
  const prepareOrderData = () => {
    let shippingAddress;
    let billingAddress;

    // Get shipping address
    if (selectedShippingAddress) {
      shippingAddress = getSelectedShippingAddress;
    } else {
      shippingAddress = shippingForm;
    }

    // Get billing address
    if (billingSameAsShipping) {
      billingAddress = shippingAddress;
    } else if (selectedBillingAddress) {
      billingAddress = getSelectedBillingAddress;
    } else {
      billingAddress = billingForm;
    }

    // Validate addresses
    const shippingValid = validateForm(shippingAddress, "shipping");
    const billingValid =
      billingSameAsShipping || validateForm(billingAddress, "billing");

    if (!shippingValid || !billingValid) {
      toast.error("Please fix address errors before proceeding");
      return null;
    }

    // Prepare items for order
    const items = checkoutProducts.map((item) => {
      const product = item.productId || {};
      const price = product.salePrice || product.regularPrice || 0;
      return {
        productId: product._id || item.productId,
        quantity: item.quantity,
        price: price,
        name: product.name,
        image: product.image,
      };
    });

    return {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal: orderSummary.subtotal,
      shippingFee: orderSummary.shippingFee,
      vatAmount: orderSummary.vatAmount,
      total: orderSummary.total,
      currency: "AED",
    };
  };

  // Create Stripe payment session
  const createStripePayment = async () => {
    if (!privacyAccepted) {
      toast.error("Please accept the privacy policy");
      return;
    }

    if (checkoutProducts.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = prepareOrderData();
    if (!orderData) return;

    try {
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/payment/stripe/create-checkout`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success && response.data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create Stripe payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Create Tamara payment session
  const createTamaraPayment = async () => {
    if (!privacyAccepted) {
      toast.error("Please accept the privacy policy");
      return;
    }

    if (checkoutProducts.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = prepareOrderData();
    if (!orderData) return;

    try {
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        toast.error("Please login to continue");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/payment/tamara/create-checkout`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success && response.data.checkoutUrl) {
        // Redirect to Tamara checkout
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Tamara payment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to create Tamara payment"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle place order based on selected payment method
  const handlePlaceOrder = async () => {
    if (paymentMethod === "stripe") {
      await createStripePayment();
    } else if (paymentMethod === "tamara") {
      await createTamaraPayment();
    } else {
      toast.error("Please select a payment method");
    }
  };

  // Delete address
  const deleteAddress = async (addressId, type) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = getAuthToken();
      const endpoint =
        type === "shipping"
          ? `${process.env.NEXT_PUBLIC_BASEURL}/address/shipping/${addressId}`
          : `${process.env.NEXT_PUBLIC_BASEURL}/address/billing/${addressId}`;

      const response = await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Address deleted successfully");

        if (type === "shipping") {
          setShippingAddresses((prev) =>
            prev.filter((addr) => addr._id !== addressId)
          );
          if (selectedShippingAddress === addressId) {
            setSelectedShippingAddress(null);
          }
        } else {
          setBillingAddresses((prev) =>
            prev.filter((addr) => addr._id !== addressId)
          );
          if (selectedBillingAddress === addressId) {
            setSelectedBillingAddress(null);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    console.log("Component mounted, fetching addresses and cart...");
    fetchUserAddresses();
    fetchCartItems();
  }, [fetchUserAddresses, fetchCartItems]);

  if (!isMounted) return null;

  // Loading state
  if (isLoadingAddresses) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {step === "checkout" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FaMapMarkerAlt className="text-blue-500 mr-3" />
                    Shipping Address
                  </h2>
                  <button
                    onClick={() =>
                      setShowShippingAddressForm(!showShippingAddressForm)
                    }
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <FaPlus className="text-xs" />
                    <span>
                      {showShippingAddressForm ? "Cancel" : "Add New Address"}
                    </span>
                  </button>
                </div>

                {/* Address Selection */}
                {!showShippingAddressForm ? (
                  <div className="space-y-4">
                    {shippingAddresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shippingAddresses.map((address) => (
                          <div
                            key={address._id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all relative group ${
                              selectedShippingAddress === address._id
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() =>
                              handleShippingAddressSelect(address._id)
                            }
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {address.type === "home" ? (
                                  <FaHome className="text-blue-500" />
                                ) : address.type === "work" ? (
                                  <FaBriefcase className="text-green-500" />
                                ) : (
                                  <FaMapMarkerAlt className="text-purple-500" />
                                )}
                                <span className="font-medium text-sm capitalize">
                                  {address.type}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {address.isDefault && (
                                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                    Default
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAddress(address._id, "shipping");
                                  }}
                                  className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1">
                              <p className="font-medium">
                                {address.firstName} {address.lastName}
                              </p>
                              <p>{address.address1}</p>
                              {address.address2 && <p>{address.address2}</p>}
                              <p>
                                {address.city}, {address.state}{" "}
                                {address.postalCode}
                              </p>
                              <p>{address.country}</p>
                              <p className="font-medium mt-2">
                                {address.phone}
                              </p>
                              <p>{address.email}</p>
                            </div>

                            {selectedShippingAddress === address._id && (
                              <div className="absolute top-2 right-2">
                                <FaCheckCircle className="text-green-500" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <FaMapMarkerAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                          No shipping addresses saved yet
                        </p>
                        <button
                          onClick={() => setShowShippingAddressForm(true)}
                          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <FaPlus />
                          <span>Add Your First Address</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Shipping Address Form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Form fields */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.shipping.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="John"
                        />
                        {formErrors.shipping.firstName && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.shipping.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.shipping.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Doe"
                        />
                        {formErrors.shipping.lastName && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.shipping.lastName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.shipping.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="+971 50 123 4567"
                        />
                        {formErrors.shipping.phone && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.shipping.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.shipping.email
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="john@example.com"
                        />
                        {formErrors.shipping.email && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.shipping.email}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={shippingForm.address1}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              address1: e.target.value,
                            })
                          }
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.shipping.address1
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="123 Main Street"
                        />
                        {formErrors.shipping.address1 && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.shipping.address1}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apartment, Suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          value={shippingForm.address2}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              address2: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Apt 4B"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.shipping.city
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Dubai"
                        />
                        {formErrors.shipping.city && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.shipping.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province *
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.shipping.state
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Dubai"
                        />
                        {formErrors.shipping.state && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.shipping.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="12345"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.shipping.country
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        {formErrors.shipping.country && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.shipping.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Type
                        </label>
                        <select
                          value={shippingForm.type}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              type: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="shipping-default"
                          checked={shippingForm.isDefault}
                          onChange={(e) =>
                            setShippingForm({
                              ...shippingForm,
                              isDefault: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="shipping-default"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Set as default shipping address
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={saveShippingAddress}
                        disabled={isSavingAddress}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {isSavingAddress ? (
                          <>
                            <FaSpinner className="w-4 h-4 animate-spin inline mr-2" />
                            Saving...
                          </>
                        ) : (
                          "Save Shipping Address"
                        )}
                      </button>
                      <button
                        onClick={() => setShowShippingAddressForm(false)}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Billing Address Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Billing Address</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="billingSameAsShipping"
                        checked={billingSameAsShipping}
                        onChange={(e) =>
                          handleBillingSameToggle(e.target.checked)
                        }
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="billingSameAsShipping"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Same as shipping address
                      </label>
                    </div>
                    {!billingSameAsShipping && (
                      <button
                        onClick={() =>
                          setShowBillingAddressForm(!showBillingAddressForm)
                        }
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <FaPlus className="text-xs" />
                        <span>
                          {showBillingAddressForm ? "Cancel" : "Add New"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {billingSameAsShipping ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center text-blue-700">
                      <FaCheckCircle className="w-5 h-5 mr-2" />
                      <p className="font-medium">
                        Billing address will use the shipping address
                      </p>
                    </div>
                  </div>
                ) : !showBillingAddressForm ? (
                  <div className="space-y-4">
                    {billingAddresses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {billingAddresses.map((address) => (
                          <div
                            key={address._id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all relative group ${
                              selectedBillingAddress === address._id
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() =>
                              handleBillingAddressSelect(address._id)
                            }
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {address.type === "home" ? (
                                  <FaHome className="text-blue-500" />
                                ) : address.type === "work" ? (
                                  <FaBriefcase className="text-green-500" />
                                ) : (
                                  <FaMapMarkerAlt className="text-purple-500" />
                                )}
                                <span className="font-medium text-sm capitalize">
                                  {address.type}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {address.isDefault && (
                                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                    Default
                                  </span>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteAddress(address._id, "billing");
                                  }}
                                  className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaTrash className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1">
                              <p className="font-medium">
                                {address.firstName} {address.lastName}
                              </p>
                              <p>{address.address1}</p>
                              {address.address2 && <p>{address.address2}</p>}
                              <p>
                                {address.city}, {address.state}{" "}
                                {address.postalCode}
                              </p>
                              <p>{address.country}</p>
                              <p className="font-medium mt-2">
                                {address.phone}
                              </p>
                              <p>{address.email}</p>
                            </div>

                            {selectedBillingAddress === address._id && (
                              <div className="absolute top-2 right-2">
                                <FaCheckCircle className="text-green-500" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <FaMapMarkerAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                          No billing addresses saved yet
                        </p>
                        <button
                          onClick={() => setShowBillingAddressForm(true)}
                          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <FaPlus />
                          <span>Add Billing Address</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Billing Address Form */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Form fields similar to shipping form */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.billing.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="John"
                        />
                        {formErrors.billing.firstName && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.billing.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.billing.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Doe"
                        />
                        {formErrors.billing.lastName && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.billing.lastName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.billing.phone
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="+971 50 123 4567"
                        />
                        {formErrors.billing.phone && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.billing.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.billing.email
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="john@example.com"
                        />
                        {formErrors.billing.email && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.billing.email}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={billingForm.address1}
                          onChange={(e) =>
                            setBillingForm({
                              ...billingForm,
                              address1: e.target.value,
                            })
                          }
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.billing.address1
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="123 Main Street"
                        />
                        {formErrors.billing.address1 && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.billing.address1}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apartment, Suite, etc. (Optional)
                        </label>
                        <input
                          type="text"
                          value={billingForm.address2}
                          onChange={(e) =>
                            setBillingForm({
                              ...billingForm,
                              address2: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Apt 4B"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.billing.city
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Dubai"
                        />
                        {formErrors.billing.city && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.billing.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State/Province *
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.billing.state
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Dubai"
                        />
                        {formErrors.billing.state && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.billing.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="12345"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.billing.country
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {countries.map((country) => (
                            <option key={country} value={country}>
                              {country}
                            </option>
                          ))}
                        </select>
                        {formErrors.billing.country && (
                          <p className="mt-1 text-xs text-red-600">
                            {formErrors.billing.country}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address Type
                        </label>
                        <select
                          value={billingForm.type}
                          onChange={(e) =>
                            setBillingForm({
                              ...billingForm,
                              type: e.target.value,
                            })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="billing-default"
                          checked={billingForm.isDefault}
                          onChange={(e) =>
                            setBillingForm({
                              ...billingForm,
                              isDefault: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="billing-default"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Set as default billing address
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={saveBillingAddress}
                        disabled={isSavingAddress}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {isSavingAddress ? (
                          <>
                            <FaSpinner className="w-4 h-4 animate-spin inline mr-2" />
                            Saving...
                          </>
                        ) : (
                          "Save Billing Address"
                        )}
                      </button>
                      <button
                        onClick={() => setShowBillingAddressForm(false)}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                  {checkoutProducts.length > 0 ? (
                    checkoutProducts.map((item, index) => {
                      const product = item.productId || {};
                      const price =
                        product.salePrice || product.regularPrice || 0;
                      const totalPrice = price * item.quantity;
                      const mainImage =
                        product.images.find((img) => img.type === "main") ||
                        product.images[0];
                      const imageUrl = mainImage?.url || "/placeholder.png";

                      const productName = product.name || "Unnamed Product";

                      return (
                        <div
                          key={index}
                          className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                              src={imageUrl}
                              alt={productName}
                              fill
                              unoptimized
                              className="rounded-lg object-cover"
                              sizes="64px"
                            />

                            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {productName}
                            </h4>
                            {item.color && (
                              <p className="text-xs text-gray-500">
                                Color: {item.color}
                              </p>
                            )}
                            {item.size && (
                              <p className="text-xs text-gray-500">
                                Size: {item.size}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {totalPrice.toFixed(2)} AED
                            </p>
                            <p className="text-xs text-gray-500">
                              {price.toFixed(2)} AED each
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Your cart is empty</p>
                      <a
                        href="/shop"
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 inline-block"
                      >
                        Continue Shopping
                      </a>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {orderSummary.subtotal.toFixed(2)} AED
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span
                      className={`font-medium ${
                        orderSummary.shippingFee === 0 ? "text-green-600" : ""
                      }`}
                    >
                      {orderSummary.shippingFee === 0
                        ? "Free"
                        : `${orderSummary.shippingFee.toFixed(2)} AED`}
                    </span>
                  </div>
                  {/* Optional: VAT info (included in prices) */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT (5%) included</span>
                    <span className="font-medium">Included</span>
                  </div>

                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3 mt-3">
                    <span>Total</span>
                    <span>{orderSummary.total.toFixed(2)} AED</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                <div className="space-y-3 mb-6">
                  {/* Stripe/Card Payment */}
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "stripe"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Credit/Debit Card</p>
                        <div className="flex items-center space-x-2">
                          <FaCcVisa className="w-6 h-6 text-blue-600" />
                          <FaCcMastercard className="w-6 h-6 text-red-600" />
                          <FaCcAmex className="w-6 h-6 text-indigo-600" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Secure payment processed by Stripe
                      </p>
                    </div>
                  </label>

                  {/* Tamara Payment */}
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      paymentMethod === "tamara"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="tamara"
                      checked={paymentMethod === "tamara"}
                      onChange={() => setPaymentMethod("tamara")}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Pay Later with Tamara</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Split your payment into 4 installments, 0% interest
                          </p>
                        </div>
                        <div className="w-16 h-8 relative">
                          <Image
                            src={TamaraLogo}
                            alt="Tamara"
                            fill
                            className="object-contain"
                            sizes="64px"
                          />
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Shipping Terms */}
                <div className="mb-6">
                  <button
                    onClick={() => setIsShippingModalOpen(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Shipping Terms & Conditions
                  </button>
                </div>

                {/* Privacy Policy */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="privacy-policy"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <label
                      htmlFor="privacy-policy"
                      className="ml-2 text-sm text-gray-600"
                    >
                      I agree to the{" "}
                      <a
                        href="/privacy-policy"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        privacy policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="/terms"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        terms of service
                      </a>
                    </label>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    isLoading ||
                    !privacyAccepted ||
                    checkoutProducts.length === 0
                  }
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${
                    isLoading ||
                    !privacyAccepted ||
                    checkoutProducts.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="w-5 h-5 animate-spin mr-3" />
                      Processing...
                    </>
                  ) : (
                    `Place Order - ${orderSummary.total.toFixed(2)} AED`
                  )}
                </button>

                {/* Security Notice */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  <FaExclamationCircle className="inline w-3 h-3 mr-1" />
                  Your payment details are secure and encrypted
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Terms Modal */}
        <ShippingTermsModal
          isOpen={isShippingModalOpen}
          onClose={() => setIsShippingModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
