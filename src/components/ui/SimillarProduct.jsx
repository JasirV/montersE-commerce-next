import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Dummy1 from "../../assets/Omega Seamaster.jpg";
import newCurrency from "../../assets/newSymbole.png";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { GlobalContext } from "../shared/context/GlobalContext";
import axios from "axios";

// Single product card component
const ProductCard = ({ product }) => {
  const { decrementWishlist, incrementWishlist, incrementCart } =
    useContext(GlobalContext);
  const [isWishlisted, setIsWishlisted] = useState([]);
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is in wishlist
  const checkIsWishlisted = (productId) => {
    return isWishlisted.includes(productId);
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
        `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlists`,
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

  // Add/Remove from wishlist
  const toggleWishlist = async (product) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
         Toastify({
        text:
         "Please log in first to add to wishlist",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
        return;
      }

      const productId = product._id || product.productId?._id;
      if (!productId) {
        // console.error("Product ID not found");
        return;
      }

      // Check if product is already in wishlist
      const alreadyWishlisted = checkIsWishlisted(productId);

      if (alreadyWishlisted) {
        // Remove from wishlist
        await removeFromWishlist(productId);
      } else {
        // Add to wishlist
        await addToWishlist(product);
      }
    } catch (error) {
   
          Toastify({
        text:
          "Failed to update wishlist. Please try again.",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  };

  const addToWishlist = async (product) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
         Toastify({
        text:
         "Please log in first to add to wishlist",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
        return;
      }

      // Make sure a default wishlist exists
      if (!defaultWishlistId) {
        Toastify({
        text:
         "No wishlist found. Please create a wishlist first.",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
        return;
      }

      const productId = product._id || product.productId?._id;

      if (!productId) {
        console.error("Product ID not found");
        return;
      }

      // Check if already in wishlist
      if (checkIsWishlisted(productId)) {
    Toastify({
  text: "Product is already in your wishlist.",
  duration: 3000,
  gravity: "top",
  position: "right",
  close: true,
  style: {
    background: "linear-gradient(to right, #2193b0, #6dd5ed)", // blue gradient
  },
}).showToast();

        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/add`,
        {
          wishlistId: defaultWishlistId,
          productId: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      incrementWishlist();
      if (response.status === 200) {
        // Add to local wishlist state
        setIsWishlisted((prev) => [...prev, productId]);
             Toastify({
        text:
         "added to wishlist",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      }
    } catch (error) {
     
          Toastify({
        text:
         "Failed to add to wishlist. Please try again.",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/wishlist/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            wishlistId: defaultWishlistId,
            productId: productId,
          },
        }
      );

      decrementWishlist();
      if (response.status === 200) {
        // Remove from local wishlist state
        setIsWishlisted((prev) => prev.filter((id) => id !== productId));
       
      }
    } catch (error) {
      // console.error("Error removing from wishlist:", error);
          Toastify({
        text:
          "Failed to remove from wishlist. Please try again.",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  };

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Toastify({
        text:
         "Please log in to add items to your cart",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
        return;
      }

      const productId = product._id || product.productId?._id;
      if (!productId) {
        Toastify({
        text:
         "Invalid product data",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/cart/add`,
        {
          productId: productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      incrementCart();

      if (response.status === 200) {
        Toastify({
        text:
         " added to cart",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      } else {
        Toastify({
        text:
         "Failed to add to cart. Try again!",
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
     
    }
  };

  // Fetch wishlists when component mounts
  useEffect(() => {
    fetchWishlists();
  }, []);

  const productId = product._id || product.productId?._id;
  const isProductWishlisted = checkIsWishlisted(productId);

  return (
    <div className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-gray-200 mx-2 my-2">
      {/* Product Image Container */}
      <div className="relative h-52 bg-gray-50">
        <Image
          src={product.images?.[0]?.url || Dummy1}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.src = Dummy1;
          }}
        />

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group/wishlist ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          aria-label={
            isProductWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
        >
          <FaHeart
            className={`text-sm transition-colors ${
              isProductWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-600 group-hover/wishlist:text-red-500"
            }`}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="text-gray-800 font-semibold text-[15px] mb-3 line-clamp-2 leading-tight min-h-[2.8rem]">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-3">
          <div className="flex items-center">
            <Image
              src={newCurrency}
              alt="Currency"
              className="w-4 h-4 mr-1.5"
            />
            <span className="text-xl font-bold text-gray-900">
              {product.salePrice?.toLocaleString() || "0"}
            </span>
          </div>
          {product.regularPrice && product.regularPrice > product.salePrice && (
            <span className="text-sm text-gray-500 line-through ml-1">
              {product.regularPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#0061b0ee] hover:to-[#1e518e] text-white py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-lg active:scale-95 group/cart"
        >
          <FaShoppingCart className="text-sm group-hover/cart:scale-110 transition-transform" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

const SimilarProduct = ({ productId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
  const fetchSimilarProducts = async () => {
    if (!productId) {
      console.log("No product ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage (or wherever you store it)
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/products/${productId}/similar`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const products =
          response.data.products || response.data.similarProducts || [];
        console.log("Products found:", products.length);
        setSimilarProducts(products);
      } else {
        console.log("API returned success: false");
        setSimilarProducts([]);
      }
    } catch (err) {
      console.error("Error fetching similar products:", err);
      console.error("Error details:", err.response?.data);
      setError("Failed to load similar products");
      setSimilarProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchSimilarProducts();
}, [productId]);


  // Show loading state
  if (loading) {
    return (
      <div className="bg-gray-50/80 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Similar Products
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Loading similar products...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-5 animate-pulse"
              >
                <div className="h-52 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gray-50/80 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Similar Products
          </h2>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no similar products
  if (!similarProducts || similarProducts.length === 0) {
    return (
      <div className="bg-gray-50/80 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Similar Products
          </h2>
          <p className="text-gray-600 text-lg">
            No similar products found at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/80 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Similar Products
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover more premium products that match your exquisite style and
            preferences
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {similarProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 group">
            View More Products
            <svg
              className="ml-3 w-5 h-5 transition-transform group-hover:translate-y-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimilarProduct;
