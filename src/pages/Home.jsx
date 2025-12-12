"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCurrency } from "@/app/CurrencyContext";
import { getHomeProductGrid } from "@/service/productService";

const ProductGrid = () => {
  const [homeProducts, setHomeProducts] = useState([]);
  const [limitedProducts, setLimitedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currency, rate } = useCurrency();

  // ==============================================
  // CATEGORY CHECK HELPERS (Optimized with memoization)
  // ==============================================

  const isBagCategory = useCallback((product) => {
    if (!product) return false;

    const name = product.name?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";
    const subCategory = product.subCategory?.toLowerCase() || "";
    const mainCategory = product.leatherMainCategory?.toLowerCase() || "";
    const material = product.material?.toLowerCase() || "";

    // Check for bag-related keywords
    if (name.includes("bag")) return true;
    if (mainCategory.includes("bag")) return true;
    if (subCategory.includes("bag")) return true;
    if (category.includes("bag")) return true;
    if (material.includes("leather") && (name.includes("bag") || mainCategory.includes("bag"))) return true;

    return false;
  }, []);

  const isAccessoriesCategory = useCallback((product) => {
    if (!product) return false;

    const category = product.category?.toLowerCase() || "";
    const subCategory = product.subCategory?.toLowerCase() || "";
    const mainCategory = product.leatherMainCategory?.toLowerCase() || "";

    // Direct category checks
    if (category === "accessories") return true;
    if (subCategory === "accessories") return true;
    if (mainCategory === "accessories") return true;

    return false;
  }, []);

  // ==============================================
  // ROUTE GENERATOR (Optimized)
  // ==============================================

  const generateProductRoute = useCallback((product) => {
    if (!product?._id) return "/";

    const productId = product._id;

    // Priority 1: BAG CATEGORY
    if (isBagCategory(product)) {
      return `/LeatherBagsDetails/${productId}`;
    }

    // Priority 2: ACCESSORIES
    if (isAccessoriesCategory(product)) {
      return `/AccessoriesDeatils/${productId}`;
    }

    // Default: Normal product
    return `/ProductDetailPage/${productId}`;
  }, [isBagCategory, isAccessoriesCategory]);

  // ==============================================
  // API CALLS (Optimized)
  // ==============================================

  const fetchLimitedEdition = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/admin/product/getLimited`
      );
      return res?.data?.products || [];
    } catch (error) {
      console.error("Error fetching limited edition products:", error);
      return [];
    }
  }, []);

  // ==============================================
  // DATA FETCHING (Optimized)
  // ==============================================

  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      try {
        setLoading(true);

        // Parallel API calls for better performance
        const [homeRes, limited] = await Promise.allSettled([
          getHomeProductGrid(),
          fetchLimitedEdition()
        ]);

        if (!mounted) return;

        // Process home products
        const homeProductsData = homeRes.status === 'fulfilled' ? homeRes.value?.data?.homeProducts : [];
        const filteredCategories = Array.isArray(homeProductsData)
          ? homeProductsData
              .filter(item => item?.title?.toLowerCase() !== "jewelry")
              .map(category => ({
                ...category,
                products: Array.isArray(category.products) ? category.products.slice(0, 3) : [],
              }))
          : [];

        // Process limited edition
        const limitedData = limited.status === 'fulfilled' ? limited.value : [];
        setLimitedProducts(limitedData || []);

        // Build Limited Edition Category
        const limitedEditionCategory = {
          _id: "limited-edition",
          title: "Limited Edition",
          products: Array.isArray(limitedData) ? limitedData.slice(0, 3) : [],
        };

        // Combine results
        const finalList = [...filteredCategories, limitedEditionCategory];
        
        if (mounted) {
          setHomeProducts(finalList);
        }
      } catch (error) {
        console.error("Error loading homepage data:", error);
        if (mounted) {
          setHomeProducts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      mounted = false;
    };
  }, [fetchLimitedEdition]);

  // ==============================================
  // SKELETON UI (Optimized for Performance)
  // ==============================================

  const SkeletonCard = () => (
    <div className="flex flex-col items-center text-center animate-pulse">
      <div className="w-full aspect-square bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
      <div className="h-3 w-2/3 bg-gray-200 rounded mb-1"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
    </div>
  );

  const ProductSkeleton = () => (
    <div className="bg-gray-50 p-4 lg:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="h-6 w-1/3 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-3 animate-pulse"></div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((__, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <ProductSkeleton />;
  }

  // ==============================================
  // PRODUCT COMPONENT (Optimized)
  // ==============================================

  const ProductItem = ({ product }) => {
    const route = generateProductRoute(product);
    const imageUrl = product.images?.[0]?.url;
    const productName = product.name || "Product";
    const productPrice = product.salePrice
      ? `${(parseFloat(product.salePrice.toString()) * rate).toFixed(2)} ${currency}`
      : "Price N/A";

    return (
      <div className="flex flex-col items-center text-center group">
        {/* Image Container with optimized loading */}
        <div className="w-full aspect-square flex justify-center items-center rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 mb-2 relative">
          <Link 
            href={route}
            className="block w-full h-full"
            prefetch={false} // Disable prefetch for better initial load
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={productName}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                width={120}
                height={120}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 20vw, 15vw"
                quality={75} // Reduce quality for faster loading
                priority={false} // Don't prioritize these images
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                No Image
              </div>
            )}
          </Link>
        </div>

        {/* Product Name */}
        <p className="text-xs text-gray-600 line-clamp-2 leading-tight min-h-[32px] px-1">
          {productName}
        </p>

        {/* Price */}
        <p className="text-sm font-bold text-gray-900 mt-1">
          {productPrice}
        </p>
      </div>
    );
  };

  // ==============================================
  // MAIN UI RENDER (Optimized)
  // ==============================================

  return (
    <div className="bg-gray-50 p-4 lg:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {homeProducts.length > 0 ? (
          homeProducts.map((categoryItem) => (
            <div
              key={categoryItem._id || categoryItem.title}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-4 border border-gray-100 flex flex-col"
            >
              {/* Category Title */}
              <h2 className="text-base font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
                {categoryItem.title}
              </h2>

              {/* Product Grid - Fixed 3 columns */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {categoryItem.products?.length > 0 ? (
                  categoryItem.products.map((product) => (
                    <ProductItem 
                      key={product._id} 
                      product={product} 
                    />
                  ))
                ) : (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 text-xs aspect-square"
                    >
                      No Product
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 py-8">
            No categories found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;