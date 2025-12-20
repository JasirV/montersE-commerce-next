"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { FaGlobe } from "react-icons/fa"; // Only FaGlobe remains here
import axios from "axios";
import ShippingTermsModal from "./ShippingTermsModal";
import { toast, Toaster } from "react-hot-toast";

// Components
import ShippingAddress from "./components/ShippingAddress";
import BillingAddress from "./components/BillingAddress";
import OrderSummary from "./components/OrderSummary";
import PaymentMethod from "./components/PaymentMethod";

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
  const [language, setLanguage] = useState("en"); // 'en' or 'ar'
  const fetchLockRef = useRef(false);
  const debounceRef = useRef(null);
  // Address states
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [showShippingAddressForm, setShowShippingAddressForm] = useState(false);
  const [showBillingAddressForm, setShowBillingAddressForm] = useState(false);
  // Editing states
  const [editingShippingId, setEditingShippingId] = useState(null);
  const [editingBillingId, setEditingBillingId] = useState(null);

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

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

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

      let response;
      if (editingShippingId) {
        // Update existing address
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASEURL}/address/shipping/${editingShippingId}`,
          shippingForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new address
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/address/shipping`,
          shippingForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.success) {
        toast.success(
          editingShippingId
            ? "Shipping address updated successfully"
            : "Shipping address saved successfully"
        );
        fetchUserAddresses(); // Refresh addresses
        setShowShippingAddressForm(false);
        setEditingShippingId(null); // Reset editing state

        // Select the address
        if (response.data.address) {
          setSelectedShippingAddress(response.data.address._id);
        }

        // Reset pre-scoring check for Tabby
        setTabbyPreScoringChecked(false);
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

      let response;
      if (editingBillingId) {
        // Update existing address
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_BASEURL}/address/billing/${editingBillingId}`,
          billingForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new address
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/address/billing`,
          billingForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.success) {
        toast.success(
          editingBillingId
            ? "Billing address updated successfully"
            : "Billing address saved successfully"
        );
        fetchUserAddresses(); // Refresh addresses
        setShowBillingAddressForm(false);
        setEditingBillingId(null); // Reset editing state

        // Select the address
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

  // Handle edit shipping address
  const handleEditShippingAddress = (addressId) => {
    const address = shippingAddresses.find((addr) => addr._id === addressId);
    if (address) {
      prefillShippingForm(address);
      setEditingShippingId(addressId);
      setShowShippingAddressForm(true);
      // Determine if we are keeping default setting from address or not
      // Typically we just load the form as is.
    }
  };

  // Handle edit billing address
  const handleEditBillingAddress = (addressId) => {
    const address = billingAddresses.find((addr) => addr._id === addressId);
    if (address) {
      prefillBillingForm(address);
      setEditingBillingId(addressId);
      setShowBillingAddressForm(true);
    }
  };


  const [tabbyEligibility, setTabbyEligibility] = useState(null); // 'eligible', 'rejected', null
  const [showTabbySnippet, setShowTabbySnippet] = useState(false);
  const [tabbyPreScoringChecked, setTabbyPreScoringChecked] = useState(false);
  const tabbyScriptRef = useRef(null);

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
  // Get selected shipping address object
  const getSelectedShippingAddress = useMemo(() => {
    if (!selectedShippingAddress) return null;
    return shippingAddresses.find(
      (addr) => addr._id === selectedShippingAddress
    );
  }, [selectedShippingAddress, shippingAddresses]);
  // Get authentication token
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  // NEW: Check if customer is eligible for Tabby (UAE only)
  const isCustomerEligibleForTabby = useCallback(() => {
    // Get current shipping country
    let shippingCountry;
    if (selectedShippingAddress && getSelectedShippingAddress) {
      shippingCountry = getSelectedShippingAddress.country;
    } else {
      shippingCountry = shippingForm.country;
    }

    // Tabby is only for UAE customers
    if (shippingCountry !== "United Arab Emirates") {
      console.log("Tabby rejected: Country is not UAE", shippingCountry);
      return false;
    }

    // Check currency is AED (always true for Montres)
    const currency = "AED";
    if (currency !== "AED") {
      console.log("Tabby rejected: Currency is not AED", currency);
      return false;
    }

    // Check phone has UAE code
    let phone;
    if (selectedShippingAddress && getSelectedShippingAddress) {
      phone = getSelectedShippingAddress.phone;
    } else {
      phone = shippingForm.phone;
    }

    if (phone && !phone.includes("+971") && !phone.startsWith("971")) {
      console.log("Tabby rejected: Phone is not UAE", phone);
      return false;
    }

    return true;
  }, [shippingForm, selectedShippingAddress, getSelectedShippingAddress]);

  // ===========================
  // NEW: Background Pre-scoring for Tabby
  // ===========================
  const checkTabbyEligibility = useCallback(async () => {
    if (!isCustomerEligibleForTabby()) {
      setTabbyEligibility("rejected");
      setShowTabbySnippet(false);
      return;
    }

    // Don't check if already checked recently
    if (tabbyPreScoringChecked) return;

    try {
      const token = getAuthToken();
      if (!token) {
        console.log("No token for Tabby pre-scoring");
        return;
      }

      // Get customer data
      const customerEmail =
        shippingForm.email ||
        (getSelectedShippingAddress && getSelectedShippingAddress.email);
      const customerPhone =
        shippingForm.phone ||
        (getSelectedShippingAddress && getSelectedShippingAddress.phone);

      if (!customerEmail || !customerPhone) {
        console.log("Missing customer data for pre-scoring");
        return;
      }

      console.log("Running Tabby pre-scoring for:", {
        amount: orderSummary.total,
        email: customerEmail,
        phone: customerPhone,
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/payment/tabby/pre-scoring`,
        {
          amount: orderSummary.total.toString(), // Must be string as per Tabby requirement
          currency: "AED",
          buyer: {
            email: customerEmail,
            phone: customerPhone,
          },
          shipping_address: {
            city:
              shippingForm.city ||
              (getSelectedShippingAddress && getSelectedShippingAddress.city),
            address:
              shippingForm.address1 ||
              (getSelectedShippingAddress &&
                getSelectedShippingAddress.address1),
            zip:
              shippingForm.postalCode ||
              (getSelectedShippingAddress &&
                getSelectedShippingAddress.postalCode) ||
              "00000",
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Tabby pre-scoring response:", response.data);

      if (response.data.eligible === true) {
        setTabbyEligibility("eligible");
        setShowTabbySnippet(true);
        setTabbyPreScoringChecked(true);
      } else {
        setTabbyEligibility("rejected");
        setShowTabbySnippet(false);
        setTabbyPreScoringChecked(true);
      }
    } catch (error) {
      console.error("Tabby pre-scoring error:", error);
      // If pre-scoring fails, still show Tabby but with warning
      setTabbyEligibility("error");
      setShowTabbySnippet(true);
    }
  }, [
    orderSummary.total,
    shippingForm,
    getSelectedShippingAddress,
    isCustomerEligibleForTabby,
    tabbyPreScoringChecked,
  ]);

  // Run pre-scoring when address or total changes
  useEffect(() => {
    if (
      orderSummary.total > 0 &&
      (shippingForm.email ||
        (selectedShippingAddress && getSelectedShippingAddress))
    ) {
      const timer = setTimeout(() => {
        checkTabbyEligibility();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    orderSummary.total,
    shippingForm.email,
    selectedShippingAddress,
    checkTabbyEligibility,
  ]);

  // ===========================
  // FIXED: Fetch user addresses
  // ===========================
  const fetchUserAddresses = useCallback(() => {
    // 🛑 Debounce (300ms)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      // 🛑 Prevent duplicate parallel calls
      if (fetchLockRef.current) return;
      fetchLockRef.current = true;

      try {
        setIsLoadingAddresses(true);

        const token = getAuthToken();
        if (!token) {
          // toast.error("Please login to continue");
          setIsLoadingAddresses(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // ✅ Fetch both in parallel
        const [shippingResponse, billingResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/address/shipping`, {
            headers,
          }),
          axios.get(`${process.env.NEXT_PUBLIC_BASEURL}/address/billing`, {
            headers,
          }),
        ]);

        console.log("Shipping API Response:", shippingResponse.data);

        // Handle Shipping Address
        let shippingData = shippingResponse?.data?.shippingAddress;
        let fetchedShippingAddresses = [];

        if (shippingData) {
          if (Array.isArray(shippingData)) {
            fetchedShippingAddresses = shippingData;
          } else if (typeof shippingData === "object") {
            // If it's a single object (and not empty), wrap in array
            if (Object.keys(shippingData).length > 0) {
              fetchedShippingAddresses = [shippingData];
            }
          }
        }

        setShippingAddresses(fetchedShippingAddresses);

        // Auto-select first address if available
        if (fetchedShippingAddresses.length > 0) {
          setSelectedShippingAddress(fetchedShippingAddresses[0]._id);
          prefillShippingForm(fetchedShippingAddresses[0]);
          setShowShippingAddressForm(false);
        } else {
          // No address found, show form
          setShowShippingAddressForm(true);
        }

        // Handle Billing Address
        let billingData = billingResponse?.data?.billingAddress;
        let fetchedBillingAddresses = [];

        if (billingData) {
          if (Array.isArray(billingData)) {
            fetchedBillingAddresses = billingData;
          } else if (typeof billingData === "object") {
            if (Object.keys(billingData).length > 0) {
              fetchedBillingAddresses = [billingData];
            }
          }
        }

        setBillingAddresses(fetchedBillingAddresses);

      } catch (error) {
        console.error("Error fetching addresses:", error);
        // toast.error("Failed to load addresses");
        // If error (e.g. 404 meaning no address), show form
        setShowShippingAddressForm(true);
      } finally {
        fetchLockRef.current = false;
        setIsLoadingAddresses(false);
      }
    }, 300);
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

  // Calculate Order Summary
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

    // Reset Tabby pre-scoring since address changed
    setTabbyPreScoringChecked(false);
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
    if (selectedShippingAddress && getSelectedShippingAddress) {
      shippingAddress = getSelectedShippingAddress;
    } else {
      shippingAddress = shippingForm;
    }

    // Get billing address
    if (billingSameAsShipping) {
      billingAddress = shippingAddress;
    } else if (selectedBillingAddress && getSelectedBillingAddress) {
      billingAddress = getSelectedBillingAddress;
    } else {
      billingAddress = billingForm;
    }

    // Validate addresses
    const shippingValid = validateForm(shippingAddress, "shipping");
    const billingValid =
      billingSameAsShipping || validateForm(billingAddress, "billing");

    if (!shippingValid || !billingValid) {
      if (!shippingValid) {
        setShowShippingAddressForm(true);
        // Optional: scroll to shipping form
        document.getElementById("shipping-form-container")?.scrollIntoView({ behavior: "smooth" });
      } else if (!billingValid) {
        setShowBillingAddressForm(true);
        // Optional: scroll to billing form
        document.getElementById("billing-form-container")?.scrollIntoView({ behavior: "smooth" });
      }

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
        name: product.name || "Product",
        image: product.images?.[0]?.url || product.image || "",
      };
    });

    return {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal: orderSummary.subtotal,
      shippingFee: orderSummary.shippingFee,
      total: orderSummary.total,
      currency: "AED",
      language: language,
    };
  };

  // ===========================
  // NEW: Tabby Payment Integration
  // ===========================
  const createTabbyPayment = async () => {
    if (!privacyAccepted) {
      toast.error("Please accept the privacy policy");
      return;
    }

    if (checkoutProducts.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isCustomerEligibleForTabby()) {
      toast.error(
        "Tabby is only available for UAE customers with UAE phone numbers"
      );
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

      const orderReference = `MONT-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/tabby/create-session`,
        {
          payment: {
            amount: orderData.total.toFixed(2), // MUST be string
            currency: "AED",
            description: "Montres Watch Purchase",

            buyer: {
              name: `${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`,
              email: orderData.shippingAddress.email,
              phone: orderData.shippingAddress.phone,
              dob: "1995-08-24" // optional / use real DOB if available
            },

            buyer_history: {
              registered_since: "2023-01-01T10:00:00Z",
              loyalty_level: 1,
              wishlist_count: 0,
              is_social_networks_connected: true,
              is_phone_number_verified: true,
              is_email_verified: true
            },

            order: {
              reference_id: orderReference,
              tax_amount: "0.00",
              shipping_amount: orderData.shippingFee.toFixed(2),
              discount_amount: "0.00",

              items: orderData.items.map((item) => ({
                reference_id: item.productId,
                title: item.name,
                description: item.description || item.name,
                quantity: item.quantity,
                unit_price: item.price.toFixed(2),
                discount_amount: "0.00",
                image_url: item.image || "",
                product_url: `${window.location.origin}/product/${item.productId}`,
                category: "Watches",
                brand: "Montres"
              }))
            },

            shipping_address: {
              city: orderData.shippingAddress.city,
              address: orderData.shippingAddress.address1,
              zip: orderData.shippingAddress.postalCode || "00000"
            },

            meta: {
              order_id: orderReference,
              customer: orderData.userId || "GUEST"
            }
          },

          lang: "en",
          merchant_code: "MTAE",

          merchant_urls: {
            success: `${window.location.origin}/checkout/success?order=${orderReference}&payment=tabby`,
            cancel: `${window.location.origin}/checkout?canceled=true`,
            failure: `${window.location.origin}/checkout/failure?order=${orderReference}`
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success && response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Tabby error:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to create Tabby payment session"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Unified handlePlaceOrder Function
  const handlePlaceOrder = async () => {
    if (paymentMethod === "stripe") {
      await createStripePayment();
    } else if (paymentMethod === "tamara") {
      await createTamaraPayment();
    } else if (paymentMethod === "tabby") {
      await createTabbyPayment();
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
            setShippingForm({
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
          }
        } else {
          setBillingAddresses((prev) =>
            prev.filter((addr) => addr._id !== addressId)
          );
          if (selectedBillingAddress === addressId) {
            setSelectedBillingAddress(null);
            setBillingForm({
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
          }
        }
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  // NEW: Toggle language
  const toggleLanguage = () => {
    const newLang = language === "en" ? "ar" : "en";
    setLanguage(newLang);
    toast.success(
      `Language changed to ${newLang === "en" ? "English" : "Arabic"}`
    );
  };

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    console.log("Component mounted, fetching addresses and cart...");
    fetchUserAddresses();
    fetchCartItems();

    // Check URL for language parameter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    if (langParam && (langParam === "en" || langParam === "ar")) {
      setLanguage(langParam);
    }
  }, [fetchUserAddresses, fetchCartItems]);

  if (!isMounted) return null;



  return (
    <div
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Language Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === "en" ? "Checkout" : "الدفع"}
          </h1>
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaGlobe className="text-gray-600" />
            <span>{language === "en" ? "العربية" : "English"}</span>
          </button>
        </div>

        {step === "checkout" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Section */}
              <ShippingAddress
                language={language}
                showForm={showShippingAddressForm}
                setShowForm={setShowShippingAddressForm}
                isLoading={isLoadingAddresses}
                addresses={shippingAddresses}
                selectedAddressId={selectedShippingAddress}
                onSelect={handleShippingAddressSelect}
                onDelete={deleteAddress}
                onEdit={handleEditShippingAddress}
                form={shippingForm}
                setForm={setShippingForm}
                errors={formErrors.shipping}
                onSave={saveShippingAddress}
                isSaving={isSavingAddress}
                countries={countries}
                isEditing={!!editingShippingId}
                onCancel={() => {
                  setShowShippingAddressForm(false);
                  setEditingShippingId(null);
                  setShippingForm({
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
                }}
              />

              {/* Billing Address Section */}
              <BillingAddress
                language={language}
                showForm={showBillingAddressForm}
                setShowForm={setShowBillingAddressForm}
                sameAsShipping={billingSameAsShipping}
                setSameAsShipping={handleBillingSameToggle}
                addresses={billingAddresses}
                selectedAddressId={selectedBillingAddress}
                onSelect={handleBillingAddressSelect}
                onDelete={deleteAddress}
                onEdit={handleEditBillingAddress}
                form={billingForm}
                setForm={setBillingForm}
                errors={formErrors.billing}
                onSave={saveBillingAddress}
                isSaving={isSavingAddress}
                countries={countries}
                isEditing={!!editingBillingId}
                onCancel={() => {
                  setShowBillingAddressForm(false);
                  setEditingBillingId(null);
                  setBillingForm({
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
                }}
              />

              {/* Payment Method Section */}

            </div>

            {/* Right Column - Order Summary & Payment */}
            <div className="space-y-6">
              {/* Order Summary */}
              <OrderSummary
                checkoutProducts={checkoutProducts}
                orderSummary={orderSummary}
                language={language}
              />
              <PaymentMethod
                language={language}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                privacyAccepted={privacyAccepted}
                setPrivacyAccepted={setPrivacyAccepted}
                handlePlaceOrder={handlePlaceOrder}
                isLoading={isLoading}
                orderSummary={orderSummary}
                checkoutProducts={checkoutProducts}
                isCustomerEligibleForTabby={isCustomerEligibleForTabby}
                tabbyEligibility={tabbyEligibility}
                showTabbySnippet={showTabbySnippet}
                setIsShippingModalOpen={setIsShippingModalOpen}
              />

            </div>
          </div>
        )}

        {/* Shipping Terms Modal */}
        <ShippingTermsModal
          isOpen={isShippingModalOpen}
          onClose={() => setIsShippingModalOpen(false)}
          language={language}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
