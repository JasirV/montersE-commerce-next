import React, { useState, useEffect, useMemo } from "react";
import { FaArrowRight, FaClock } from "react-icons/fa";
import Image from "next/image";
import { useCurrency } from "../../src/app/CurrencyContext.js";
import axios from "axios";
import Link from "next/link";
import Bag from "@/assets/beautiful-elegance-luxury-fashion-green-handbag.jpg";

// Import icons separately to avoid issues
import { FaShoppingBag, FaGem, FaShoePrints, FaTshirt } from "react-icons/fa";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Currency Context
  const { currency, convertPrice, getCurrencySymbol } = useCurrency();

  // Format price with thousands separators and proper decimals
  const formatPrice = (price) => {
    try {
      // Convert to number if it's not already
      const priceNumber = typeof price === 'number' ? price : parseFloat(price);
      
      // Check if it's a valid number
      if (isNaN(priceNumber)) {
        return "0.00";
      }
      
      // Format with 2 decimal places and thousands separators
      return priceNumber.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch (error) {
      console.error("Error formatting price:", error);
      return "0.00";
    }
  };

  // Format price with currency symbol and proper spacing
  const formatPriceWithCurrency = (price) => {
    const formattedPrice = formatPrice(price);
    const symbol = getCurrencySymbol();
    
    // Return formatted price with currency symbol and proper spacing
    // Different currencies have different formatting conventions
    switch (currency) {
      case 'USD':
      case 'CAD':
      case 'AUD':
      case 'NZD':
      case 'SGD':
      case 'HKD':
        // Prefix with symbol: $1,234.00
        return `${symbol}${formattedPrice}`;
      
      case 'EUR':
      case 'GBP':
        // Prefix with symbol: €1,234.00 or £1,234.00
        return `${symbol}${formattedPrice}`;
      
      case 'JPY':
        // No decimals, with symbol: ¥1,234
        const jpyPrice = parseFloat(price).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        return `${symbol}${jpyPrice}`;
      
      case 'INR':
        // Indian numbering system with symbol: ₹1,234.00
        const inrPrice = parseFloat(price).toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return `${symbol}${inrPrice}`;
      
      case 'AED':
      case 'SAR':
      case 'QAR':
        // Arabic currencies: 1,234.00 AED
        return `${formattedPrice} ${symbol}`;
      
      default:
        // Default: symbol before number
        return `${symbol}${formattedPrice}`;
    }
  };

  // Time periods for filtering
  const timePeriods = useMemo(() => {
    const now = new Date();
    return {
      last24Hours: new Date(now.setHours(now.getHours() - 24)).toISOString(),
      last7Days: new Date(now.setDate(now.getDate() - 7)).toISOString(),
      last30Days: new Date(now.setDate(now.getDate() - 30)).toISOString(),
    };
  }, []);

  // Determine which time filter to use based on current time
  const getCurrentTimeFilter = () => {
    const hour = new Date().getHours();

    // Morning (5 AM - 12 PM): Show last 24 hours
    if (hour >= 5 && hour < 12) {
      return timePeriods.last24Hours;
    }
    // Afternoon (12 PM - 5 PM): Show last 7 days
    else if (hour >= 12 && hour < 17) {
      return timePeriods.last7Days;
    }
    // Evening/Night (5 PM - 5 AM): Show last 30 days
    else {
      return timePeriods.last30Days;
    }
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/products`
        );

        let productsArray = response.data;

        if (!Array.isArray(response.data)) {
          if (response.data.data && Array.isArray(response.data.data)) {
            productsArray = response.data.data;
          } else if (
            response.data.products &&
            Array.isArray(response.data.products)
          ) {
            productsArray = response.data.products;
          } else {
            productsArray = Object.values(response.data);
          }
        }

        if (!Array.isArray(productsArray)) {
          throw new Error("Products data is not in expected format");
        }

        // Get current time filter
        const timeFilter = getCurrentTimeFilter();

        // Filter products based on time and ensure they have required properties
        const filtered = productsArray
          .filter(
            (product) =>
              product &&
              product._id && // Ensure product has an ID
              product.inStock &&
              product.available &&
              product.stockQuantity > 0 &&
              product.createdAt &&
              new Date(product.createdAt) >= new Date(timeFilter)
          )
          // Sort by newest first
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setProducts(filtered);
        setFilteredProducts(filtered);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load new arrivals");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [timePeriods]);

  // Show skeleton only when loading
  const skeletonArray = Array(6).fill(null);

  // CATEGORY CHECK HELPERS
  // ==============================================

  // Check if product belongs to BAG category
  const isBagCategory = (product) => {
    if (!product) return false;

    const p = product;
    const name = p.name?.toLowerCase() || "";
    const category = p.category?.toLowerCase() || "";
    const subCategory = p.subCategory?.toLowerCase() || "";
    const mainCategory = p.leatherMainCategory?.toLowerCase() || "";
    const material = p.material?.toLowerCase() || "";

    if (mainCategory.includes("bag")) return true;
    if (subCategory.includes("bag")) return true;
    if (category.includes("bag")) return true;
    if (name.includes("bag")) return true;
    if (name.includes("handbag")) return true;
    if (name.includes("purse")) return true;
    if (name.includes("tote")) return true;
    if (material.includes("leather")) return true;

    return false;
  };

  // Check if product belongs to ACCESSORIES category
  const isAccessoriesCategory = (product) => {
    if (!product) return false;

    const p = product;
    const category = p.category?.toLowerCase() || "";
    const subCategory = p.subCategory?.toLowerCase() || "";
    const main = p.leatherMainCategory?.toLowerCase() || "";
    const name = p.name?.toLowerCase() || "";

    if (category === "accessories") return true;
    if (subCategory === "accessories") return true;
    if (main === "accessories") return true;
    if (name.includes("accessory")) return true;
    if (name.includes("belt")) return true;
    if (name.includes("wallet")) return true;
    if (name.includes("glove")) return true;
    if (name.includes("scarf")) return true;

    return false;
  };

  // Check if product belongs to WATCH category
  const isWatchCategory = (product) => {
    if (!product) return false;

    const p = product;
    const category = p.category?.toLowerCase() || "";
    const subCategory = p.subCategory?.toLowerCase() || "";
    const main = p.leatherMainCategory?.toLowerCase() || "";
    const name = p.name?.toLowerCase() || "";

    if (category.includes("watch")) return true;
    if (subCategory.includes("watch")) return true;
    if (main.includes("watch")) return true;
    if (name.includes("watch")) return true;
    if (name.includes("timepiece")) return true;
    if (name.includes("chronograph")) return true;

    return false;
  };

  // Check if product belongs to JEWELRY category
  const isJewelryCategory = (product) => {
    if (!product) return false;

    const p = product;
    const category = p.category?.toLowerCase() || "";
    const subCategory = p.subCategory?.toLowerCase() || "";
    const main = p.leatherMainCategory?.toLowerCase() || "";
    const name = p.name?.toLowerCase() || "";

    if (category.includes("jewelry")) return true;
    if (category.includes("jewellery")) return true;
    if (subCategory.includes("jewelry")) return true;
    if (main.includes("jewelry")) return true;
    if (name.includes("jewelry")) return true;
    if (name.includes("ring")) return true;
    if (name.includes("necklace")) return true;
    if (name.includes("bracelet")) return true;
    if (name.includes("earring")) return true;
    if (name.includes("pendant")) return true;

    return false;
  };

  // Check if product belongs to SHOE category
  const isShoeCategory = (product) => {
    if (!product) return false;

    const p = product;
    const category = p.category?.toLowerCase() || "";
    const subCategory = p.subCategory?.toLowerCase() || "";
    const main = p.leatherMainCategory?.toLowerCase() || "";
    const name = p.name?.toLowerCase() || "";

    if (category.includes("shoe")) return true;
    if (category.includes("footwear")) return true;
    if (subCategory.includes("shoe")) return true;
    if (main.includes("shoe")) return true;
    if (name.includes("shoe")) return true;
    if (name.includes("sneaker")) return true;
    if (name.includes("boot")) return true;
    if (name.includes("loafer")) return true;
    if (name.includes("oxford")) return true;

    return false;
  };

  // Check if product belongs to CLOTHING category
  const isClothingCategory = (product) => {
    if (!product) return false;

    const p = product;
    const category = p.category?.toLowerCase() || "";
    const subCategory = p.subCategory?.toLowerCase() || "";
    const main = p.leatherMainCategory?.toLowerCase() || "";
    const name = p.name?.toLowerCase() || "";

    if (category.includes("clothing")) return true;
    if (category.includes("apparel")) return true;
    if (subCategory.includes("clothing")) return true;
    if (main.includes("clothing")) return true;
    if (name.includes("shirt")) return true;
    if (name.includes("dress")) return true;
    if (name.includes("pant")) return true;
    if (name.includes("jacket")) return true;
    if (name.includes("t-shirt")) return true;
    if (name.includes("hoodie")) return true;
    if (name.includes("sweater")) return true;
    if (name.includes("blouse")) return true;

    return false;
  };

  // Generate product detail page URL based on product category/type
  const getProductDetailUrl = (product) => {
    if (!product._id) return "#";

    // Priority 1: BAG CATEGORY
    if (isBagCategory(product)) {
      return `/LeatherBagsDetails/${product._id}`;
    }

    // Priority 2: ACCESSORIES
    if (isAccessoriesCategory(product)) {
      return `/AccessoriesDeatils/${product._id}`;
    }

    // Priority 3: WATCH
    if (isWatchCategory(product)) {
      return `/ProductDetailPage/${product._id}`;
    }

    // Priority 4: JEWELRY
    if (isJewelryCategory(product)) {
      return `/JewelryDetails/${product._id}`;
    }

    // Priority 5: SHOES
    if (isShoeCategory(product)) {
      return `/ShoeDetails/${product._id}`;
    }

    // Priority 6: CLOTHING
    if (isClothingCategory(product)) {
      return `/ClothingDetails/${product._id}`;
    }

    // Default: Normal product
    return `/ProductDetailPage/${product._id}`;
  };

  // Get appropriate icon for product category
  const getProductIcon = (product) => {
    if (isWatchCategory(product)) {
    } else if (isBagCategory(product)) {
      return <FaShoppingBag className="text-white" />;
    } else if (isJewelryCategory(product)) {
      return <FaGem className="text-white" />;
    } else if (isShoeCategory(product)) {
      return <FaShoePrints className="text-white" />;
    } else if (isClothingCategory(product)) {
      return <FaTshirt className="text-white" />;
    } else if (isAccessoriesCategory(product)) {
      return <FaShoppingBag className="text-white" />;
    }
    return <FaShoppingBag className="text-white" />;
  };

  // Get product image with better handling
  const getProductImage = (product) => {
    // First, try to get image from various possible locations
    let imageUrl = "";

    // Check images array
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const firstImage = product.images[0];
      imageUrl = firstImage.url || firstImage;
    }
    // Check image field directly
    else if (product.image) {
      imageUrl = product.image;
    }
    // Check images as string
    else if (product.images && typeof product.images === "string") {
      imageUrl = product.images;
    }
    // Check thumbnail
    else if (product.thumbnail) {
      imageUrl = product.thumbnail;
    }
    // Check featuredImage
    else if (product.featuredImage) {
      imageUrl = product.featuredImage;
    }

    // Validate the URL
    if (imageUrl) {
      // Ensure URL is valid
      if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://") ||
        imageUrl.startsWith("/")
      ) {
        return imageUrl;
      }
      // If relative path without leading slash, add it
      if (imageUrl.startsWith("uploads/") || imageUrl.startsWith("images/")) {
        return `/${imageUrl}`;
      }
    }

    // Return fallback image
    return Bag.src || Bag;
  };

  const getProductName = (product) => {
    return (
      product.name ||
      product.title ||
      `${product.brand || ""} ${product.model || ""}`.trim() ||
      "New Arrival Product"
    );
  };

  const getProductPrice = (product) => {
    try {
      const basePrice =
        product.salePrice || product.price || product.regularPrice || 0;
      const convertedPrice = convertPrice(basePrice);
      
      // Format the price with proper thousands separators and decimals
      return formatPriceWithCurrency(convertedPrice);
    } catch (error) {
      console.error("Error converting price:", error);
      return formatPriceWithCurrency(0);
    }
  };

  const getRegularPrice = (product) => {
    try {
      if (
        product.regularPrice &&
        product.salePrice &&
        product.regularPrice > product.salePrice
      ) {
        const convertedPrice = convertPrice(product.regularPrice);
        return formatPriceWithCurrency(convertedPrice);
      }
      return null;
    } catch (error) {
      console.error("Error converting regular price:", error);
      return null;
    }
  };

  // Calculate savings amount
  const getSavingsAmount = (product) => {
    try {
      if (
        product.regularPrice &&
        product.salePrice &&
        product.regularPrice > product.salePrice
      ) {
        const regularPrice = parseFloat(product.regularPrice) || 0;
        const salePrice = parseFloat(product.salePrice) || 0;
        const savings = regularPrice - salePrice;
        const convertedSavings = convertPrice(savings);
        
        // Format savings amount properly
        return formatPrice(convertedSavings);
      }
      return "0.00";
    } catch (error) {
      console.error("Error calculating savings:", error);
      return "0.00";
    }
  };

  // Get time-based display text
  const getTimeDisplayText = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Morning Refresh • Last 24 Hours";
    } else if (hour >= 12 && hour < 17) {
      return "Afternoon Update • Last 7 Days";
    } else {
      return "Evening Selection • Last 30 Days";
    }
  };

  // Get product category label
  const getProductCategory = (product) => {
    if (isWatchCategory(product)) {
      return "Watch";
    } else if (isBagCategory(product)) {
      return "Bag";
    } else if (isJewelryCategory(product)) {
      return "Jewelry";
    } else if (isShoeCategory(product)) {
      return "Shoes";
    } else if (isClothingCategory(product)) {
      return "Clothing";
    } else if (isAccessoriesCategory(product)) {
      return "Accessory";
    }
    return product.category || "Product";
  };

  // Get product image alt text
  const getProductAltText = (product) => {
    const name = getProductName(product);
    const category = getProductCategory(product);
    return `${name} - ${category}`;
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Main Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <FaClock className="text-white text-xs sm:text-sm" />
            <span className="truncate">Fresh Arrivals</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            Discover New Arrivals
          </h2>

          {/* Sub Header Text - Mobile Friendly */}
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto mb-4 px-2">
            Fresh picks just for you • Curated daily • Limited stock
          </p>

          <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-gray-500 px-2">
            <FaClock className="text-[#1e518e] text-xs sm:text-sm" />
            <span className="truncate">{getTimeDisplayText()}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center mb-6 px-2">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs sm:text-sm max-w-md mx-auto">
              <span>⚠️ {error}</span>
            </div>
          </div>
        )}

        {/* Products Grid - Optimized for 2 items on mobile, 3 on tablet, 6 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {loading
            ? skeletonArray.map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm flex flex-col animate-pulse border border-gray-200"
                >
                  <div className="aspect-square p-3 sm:p-4 bg-gray-100">
                    <div className="w-full h-full bg-gray-200 rounded-md sm:rounded-lg" />
                  </div>
                  <div className="p-3 sm:p-4 flex-1">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 sm:mb-3" />
                    <div className="h-2.5 sm:h-3 bg-gray-200 rounded w-3/4" />
                  </div>
                  <div className="p-3 sm:p-4 pt-0">
                    <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/2 mb-2 sm:mb-3" />
                    <div className="h-8 sm:h-10 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))
            : filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-lg sm:hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-200 hover:border-[#1e518e] relative h-full"
                >
                  {/* Category Badge */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                    <div className="flex items-center gap-1 bg-black/70 text-white text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                      {getProductIcon(product)}
                      <span>{getProductCategory(product)}</span>
                    </div>
                  </div>

                  {/* New Badge */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                    <span className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm">
                      NEW
                    </span>
                  </div>

                  {/* Product Image Container */}
                  <Link
                    href={getProductDetailUrl(product)}
                    className="relative aspect-square p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white block overflow-hidden"
                  >
                    {/* Image Container with consistent sizing */}
                    <div className="relative w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <Image
                        src={getProductImage(product)}
                        alt={getProductAltText(product)}
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                        className="object-contain p-2 sm:p-3 lg:p-4"
                        quality={80}
                        unoptimized
                        loading="lazy"
                        onError={(e) => {
                          console.error("Image failed to load:", e.target.src);
                          e.target.src = Bag.src || Bag;
                        }}
                        priority={false}
                      />
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e518e]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-800 leading-tight line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-[#1e518e] transition-colors duration-300 min-h-[40px] sm:min-h-[44px]">
                      {getProductName(product)}
                    </h3>

                    {/* Brand/Model Info if available */}
                    {(product.brand || product.model) && (
                      <p className="text-xs text-gray-500 mb-2 truncate">
                        {product.brand}
                        {product.brand && product.model && " • "}
                        {product.model}
                      </p>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <div className="mb-2 sm:mb-3">
                      <div className="flex items-baseline gap-1 sm:gap-2">
                        <p className="text-base sm:text-lg font-bold text-gray-900">
                          {getProductPrice(product)}
                        </p>
                        {getRegularPrice(product) && (
                          <p className="text-xs sm:text-sm text-gray-500 line-through">
                            {getRegularPrice(product)}
                          </p>
                        )}
                      </div>
                      {getRegularPrice(product) && (
                        <div className="flex items-center gap-1 sm:gap-2 mt-0.5">
                          <span className="bg-red-50 text-red-600 text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            Save {getCurrencySymbol()}
                            {getSavingsAmount(product)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={getProductDetailUrl(product)}
                      className="flex items-center justify-center w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] hover:from-[#1a4780] hover:to-[#0057a0] text-white font-medium text-xs sm:text-sm py-2 sm:py-2.5 rounded-lg transition-all duration-300 group/cta shadow-sm hover:shadow"
                    >
                      <span>Discover Arrivals</span>
                      <FaArrowRight className="ml-1.5 sm:ml-2 text-xs group-hover/cta:translate-x-0.5 sm:group-hover/cta:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;