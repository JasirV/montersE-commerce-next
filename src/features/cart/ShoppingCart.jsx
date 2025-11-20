"use client";
import React, { useEffect, useState, useMemo, useRef, useContext } from "react";
import { FiTrash2, FiHeart, FiShoppingCart, FiTag, FiChevronRight } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import newCurrency from "../../assets/newSymbole.png";
import {
  getCart,
  Recommendations,
  removeFromCart,
  updateCart,
} from "@/service/productService";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/components/shared/context/GlobalContext";
import axios from "axios";

const ShoppingCart = () => {
  const { incrementCart, decrementCart, incrementWishlist, decrementWishlist } =
    useContext(GlobalContext);
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingOne, setLoadingOne] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState([]);
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showOffers, setShowOffers] = useState(false);

  const syncTimeout = useRef(null);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await getCart(token);
      setCartItems(result.cart);
      setTotalAmount(result.totalAmount);
    } catch (err) {
      console.log("Failed to fetch cart:", err.message);
    }
  };

  // Fetch user's wishlists and check wishlist status
  const fetchWishlists = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        return;
      }

      setIsLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/wishlists`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.wishlists?.length > 0) {
        const defaultWishlist =
          res.data.wishlists.find((w) => w.isDefault) || res.data.wishlists[0];
        setDefaultWishlistId(defaultWishlist._id || defaultWishlist.id);

        // Extract all product IDs from all wishlists
        const allWishlistProductIds = res.data.wishlists.flatMap(
          (wishlist) =>
            wishlist.products?.map((product) => product._id || product) || []
        );

        setIsWishlisted(allWishlistProductIds);
      } else {
        console.log("No wishlists found or empty response");
        setDefaultWishlistId(null);
      }
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      setDefaultWishlistId(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a product is in wishlist
  const checkIsWishlisted = (productId) => {
    return isWishlisted.includes(productId);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log(
          "User not logged in — skipping cart/wishlist/recommendations"
        );
        setCartItems([]);
        setRecommendedProducts([]);
        return; // 🚫 Stop here if not logged in
      }

      try {
        setLoadingOne(true);
        await fetchCartItems();
        await fetchWishlists();
        setLoadingOne(false);

        setLoadingTwo(true);
        const result = await Recommendations(token);
        setRecommendedProducts(result?.recommended);
        setLoadingTwo(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setLoadingOne(false);
        setLoadingTwo(false);
      }
    };

    fetchData();
  }, []);

  const handleRemove = async (productId) => {
    setCartItems((prev) =>
      prev.filter((item) => item.productId._id !== productId)
    );

    const token = localStorage.getItem("accessToken");
    removeFromCart(token, productId);
    decrementCart();

    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(syncCartWithBackend, 1000);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.productId._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    if (syncTimeout.current) clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(syncCartWithBackend, 1000);
  };

  const syncCartWithBackend = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.log("Guest user — skipping cart sync");
      return; // 🚫 Don't sync if guest
    }

    try {
      const items = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));
      await updateCart(token, items);
    } catch (err) {
      console.error("Failed to sync cart:", err.message);
    }
  };

  const handleCheckout = async () => {
    await syncCartWithBackend();
    window.location.href = "/checkout";
  };

  useEffect(() => {
    const handleUnload = () => {
      syncCartWithBackend();
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [cartItems]);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (!item?.productId) return acc; // ✅ Skip null product items

      const price =
        item.productId?.salePrice ?? item.productId?.regularPrice ?? 0; // ✅ Safe with nullish coalescing

      return acc + price * (item.quantity || 0);
    }, 0);
  }, [cartItems]);

  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount for demo
  const finalTotal = subtotal - discount;

  // Utility function for clean toast usage
  const showToast = (message, type = "info") => {
    const colors = {
      success: "linear-gradient(to right, #00b09b, #96c93d)", // green
      error: "linear-gradient(to right, #ff5f6d, #ffc371)", // red/orange
      info: "linear-gradient(to right, #2193b0, #6dd5ed)", // blue
      warning: "linear-gradient(to right, #f7971e, #ffd200)", // yellow/orange
    };

    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      style: {
        background: colors[type] || colors.info,
      },
    }).showToast();
  };

  // ✅ Toggle Wishlist (Add/Remove)
  const handleToggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showToast("Please login to manage wishlist", "error");
        return;
      }

      if (!defaultWishlistId) {
        showToast("No wishlist available", "error");
        return;
      }

      const productId = product._id || product.productId?._id;
      if (!productId) {
        showToast("Invalid product data", "error");
        return;
      }

      // Set loading state
      setWishlistLoading((prev) => ({ ...prev, [productId]: true }));

      const isAlreadyWishlisted = isWishlisted.includes(productId);

      if (isAlreadyWishlisted) {
        // ✅ Remove from wishlist
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/remove`,
          {
            data: { wishlistId: defaultWishlistId, productId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        decrementWishlist();

        if (response.status === 200) {
          setIsWishlisted((prev) => prev.filter((id) => id !== productId));
          showToast("Removed from wishlist", "info");
        }
      } else {
        // ✅ Add to wishlist
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASEURL}/wishlist/add`,
          {
            wishlistId: defaultWishlistId,
            productId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        incrementWishlist();

        if (response.status === 200) {
          setIsWishlisted((prev) => [...prev, productId]);
          showToast("Added to wishlist!", "success");
        }
      }
    } catch (error) {
      console.log("Error toggling wishlist:", error);

      if (error.response?.status === 400) {
        showToast("Product is already in your wishlist!", "warning");
      } else {
        showToast(
          error.response?.data?.message || "Something went wrong!",
          "error"
        );
      }
    } finally {
      // Clear loading state
      setWishlistLoading((prev) => ({
        ...prev,
        [product._id || product.productId?._id]: false,
      }));
    }
  };

  // ✅ Add to Cart
  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        showToast("Please log in to add items to your cart", "error");
        return;
      }

      const productId = product._id || product.productId?._id;
      if (!productId) {
        showToast("Invalid product data", "error");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/cart/add`,
        {
          productId: productId,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      incrementCart();

      if (response.status === 200) {
        showToast(`${product?.name || "Product"} added to cart`, "success");
        await fetchCartItems();
      } else {
        showToast("Failed to add to cart. Try again!", "error");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showToast(
        error.response?.data?.message || "Failed to add to cart.",
        "error"
      );
    }
  };

  // Apply coupon
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      showToast("Please enter a coupon code", "warning");
      return;
    }

    // Demo coupon validation
    if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon({
        code: couponCode,
        discount: 0.1, // 10% discount
      });
      showToast("Coupon applied successfully!", "success");
      setCouponCode("");
    } else {
      showToast("Invalid coupon code", "error");
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed", "info");
  };

  // Helper component to display price with currency symbol
const PriceWithCurrency = ({ amount, className = "" }) => (
  <span className={`inline-flex items-center gap-1 ${className}`}>
    <Image
      src={newCurrency}
      alt="Currency"
      width={16}
      height={16}
      className="w-4 h-4"
    />
    <span>{amount.toFixed(2)}</span>
  </span>
);


  // Available offers data
  const availableOffers = [
    {
      id: 1,
      code: "SAVE10",
      description: "Get 10% off on orders above 100",
      minAmount: 100,
    },
    {
      id: 2,
      code: "WELCOME15",
      description: "15% off for new customers",
      minAmount: 50,
    },
    {
      id: 3,
      code: "FREESHIP",
      description: "Free shipping on orders above 200",
      minAmount: 200,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Side - Cart Items */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          {/* Header with Cart Icon */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="relative">
              <FiShoppingCart className="text-2xl text-[#1e518e]" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold">
              Shopping Cart{" "}
              <span className="text-gray-500 text-base font-normal">
                ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
              </span>
            </h2>
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <FiShoppingCart className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm mb-4">
                Add some items to get started
              </p>
              <button
                onClick={() => router.push("/products")}
                className="mt-4 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cartItems
                .filter((item) => item?.productId) // ✅ skip null products
                .map((item, index) => {
                  const productId = item.productId._id;
                  const isInWishlist = checkIsWishlisted(productId);
                  const isLoadingWishlist = wishlistLoading[productId];
                  const regularPrice = item.productId?.regularPrice || item.productId?.salePrice;
                  const salePrice = item.productId?.salePrice;
                  const hasDiscount = salePrice && salePrice < regularPrice;
                  const discountPercentage = hasDiscount 
                    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={item._id || index}
                      className="flex flex-col sm:flex-row justify-between items-start border-b pb-4 mb-4 gap-4"
                    >
                      {/* Product Info */}
                      <div className="flex items-start gap-3 sm:gap-4 flex-1">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                          <Image
                            src={
                              item.productId.images?.[0]?.url ||
                              "/placeholder.png"
                            }
                            alt={item.productId.name || "Product"}
                            unoptimized
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 mb-1">
                            {item.productId.name || "Unknown Product"}
                          </h3>
                          

                          {/* Price Display */}
                          <div className="flex items-center gap-2 mb-3">
                            {hasDiscount ? (
                              <>
                                <PriceWithCurrency 
                                  amount={salePrice * item.quantity} 
                                  className="text-lg font-bold text-gray-800"
                                />
                                <PriceWithCurrency 
                                  amount={regularPrice * item.quantity}
                                  className="text-sm text-gray-500 line-through"
                                />
                                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                                  {discountPercentage}% OFF
                                </span>
                              </>
                            ) : (
                              <PriceWithCurrency 
                                amount={regularPrice * item.quantity}
                                className="text-lg font-bold text-gray-800"
                              />
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 mt-3 flex-wrap">
                            <button
                              onClick={() => handleRemove(productId)}
                              className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm hover:text-red-600 transition-colors"
                            >
                              <FiTrash2 /> Remove
                            </button>
                            <button
                              onClick={() =>
                                handleToggleWishlist(item.productId)
                              }
                              disabled={isLoadingWishlist}
                              className={`flex items-center gap-1 text-xs sm:text-sm font-medium transition-colors ${
                                isInWishlist
                                  ? "text-green-600 cursor-default"
                                  : "text-gray-600 hover:text-red-600"
                              } ${
                                isLoadingWishlist
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <FiHeart
                                className={`text-base ${
                                  isInWishlist
                                    ? "text-green-600 fill-green-600"
                                    : ""
                                } ${isLoadingWishlist ? "animate-pulse" : ""}`}
                              />
                              {isLoadingWishlist
                                ? "Processing..."
                                : isInWishlist
                                ? "Added to Wishlist"
                                : "Move to Wishlist"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex sm:flex-col justify-between items-end sm:items-center w-full sm:w-auto gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 sm:mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(productId, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(productId, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full border flex items-center justify-center text-sm hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {/* Recommended Section */}
              <div className="mt-6 sm:mt-8">
                <h3 className="font-bold text-lg mb-4">Recommended for you</h3>
                {loadingTwo ? (
                  <RecommendedSkeleton />
                ) : recommendedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {recommendedProducts.map((product) => {
                      const productId = product._id;
                      const isInWishlist = checkIsWishlisted(productId);
                      const isLoadingWishlist = wishlistLoading[productId];
                      const regularPrice = product.regularPrice || product.salePrice;
                      const salePrice = product.salePrice;
                      const hasDiscount = salePrice && salePrice < regularPrice;
                      const discountPercentage = hasDiscount 
                        ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
                        : 0;

                      return (
                        <div
                          key={product._id}
                          className="border rounded-lg p-2 sm:p-3 shadow-sm hover:shadow-md transition-shadow relative group bg-white"
                        >
                          <div className="relative aspect-square mb-2">
                            <Image
                              src={product.images[0]?.url || "/placeholder.png"}
                              unoptimized
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                            {hasDiscount && (
                              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                {discountPercentage}% OFF
                              </span>
                            )}
                            <button
                              onClick={() => handleToggleWishlist(product)}
                              disabled={isLoadingWishlist}
                              className={`absolute top-2 right-2 p-1 rounded-full transition-colors ${
                                isInWishlist
                                  ? "text-green-600 bg-white shadow-md"
                                  : "text-gray-400 hover:text-red-500 bg-white/80 hover:bg-white"
                              } ${
                                isLoadingWishlist
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <FiHeart
                                className={`${
                                  isInWishlist ? "fill-green-600" : ""
                                } ${isLoadingWishlist ? "animate-pulse" : ""}`}
                              />
                            </button>
                          </div>
                          <h4 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 mb-1">
                            {product.name}
                          </h4>
                          
                          {/* Price Display */}
                          <div className="flex items-center gap-1 mb-2">
                            {hasDiscount ? (
                              <>
                                <PriceWithCurrency 
                                  amount={salePrice}
                                  className="text-sm font-bold text-gray-900"
                                />
                                <PriceWithCurrency 
                                  amount={regularPrice}
                                  className="text-xs text-gray-500 line-through"
                                />
                              </>
                            ) : (
                              <PriceWithCurrency 
                                amount={regularPrice}
                                className="text-sm font-bold text-gray-900"
                              />
                            )}
                          </div>

                          <button
                            onClick={() => addToCart(product)}
                            className="w-full mt-2 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white text-xs sm:text-sm py-2 rounded hover:opacity-90 transition-opacity"
                          >
                            Add to Cart
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recommendations available at the moment.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Side - Order Summary */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm h-fit sticky top-4">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          {/* Coupon Section */}
          <div className="mb-4">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border flex-1 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={applyCoupon}
                className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                APPLY
              </button>
            </div>

            {appliedCoupon && (
              <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-green-700 font-medium">
                      Coupon Applied: {appliedCoupon.code}
                    </span>
                    <p className="text-green-600 text-sm">
                      {appliedCoupon.discount * 100}% discount applied
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-green-700 hover:text-green-900 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Available Offers */}
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowOffers(!showOffers)}
                className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FiTag className="text-blue-600" />
                  <span className="text-blue-600 font-medium">Available Offers</span>
                </div>
                <FiChevronRight 
                  className={`text-gray-400 transition-transform ${showOffers ? 'rotate-90' : ''}`}
                />
              </button>
              
              {showOffers && (
                <div className="border-t">
                  {availableOffers.map((offer) => (
                    <div key={offer.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-800">{offer.code}</span>
                        <button
                          onClick={() => {
                            setCouponCode(offer.code);
                            setShowOffers(false);
                          }}
                          className="text-blue-600 text-sm hover:text-blue-800"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">{offer.description}</p>
                      <p className="text-gray-500 text-xs">
                        Min. spend: <PriceWithCurrency amount={offer.minAmount} className="inline-flex" />
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-3 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>
                Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
              <PriceWithCurrency amount={subtotal} />
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedCoupon.code})</span>
                <PriceWithCurrency amount={-discount} />
              </div>
            )}
          </div>

          <div className="flex justify-between font-bold text-gray-800 text-lg mb-4 border-t pt-4">
            <span>Total Amount</span>
            <PriceWithCurrency amount={finalTotal} />
          </div>

          <button
            disabled={cartItems.length === 0}
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {cartItems.length === 0 ? "CART IS EMPTY" : "PROCEED TO CHECKOUT"}
          </button>

          {/* Payment Options */}
          <div className="space-y-3">
            {/* Tabby Payment Option */}
            <div className="border border-green-200 rounded-lg p-3 bg-green-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-green-700 text-sm">tabby</span>
                <span className="text-green-600 text-xs">• Interest-free</span>
              </div>
              <p className="text-green-700 text-xs">
                Pay in 4 interest-free payments on orders over{" "}
                <span className="font-medium">
                  <PriceWithCurrency amount={100} className="inline-flex" />
                </span>
                .{" "}
                <a href="https://tabby.ai/en-AE/business" className="underline font-medium">
                  Learn more
                </a>
              </p>
            </div>

            {/* Stripe Payment Option */}
            <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-blue-700 text-sm">Stripe</span>
                <span className="text-blue-600 text-xs">• Secure payment</span>
              </div>
              <p className="text-blue-700 text-xs">
                Pay securely with credit/debit card, Apple Pay, or Google Pay. 
                All major cards accepted.
              </p>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              🔒 Secure checkout • SSL encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecommendedSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="border rounded-lg p-2 sm:p-3 shadow-sm animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="bg-gray-200 aspect-square mb-2 rounded"></div>

          {/* Product Name Placeholder */}
          <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>

          {/* Price Placeholder */}
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>

          {/* Add to Cart Button Placeholder */}
          <div className="h-8 bg-gray-300 rounded mt-2"></div>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;