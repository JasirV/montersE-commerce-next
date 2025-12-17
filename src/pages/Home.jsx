"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useCurrency } from "@/app/CurrencyContext";
import { getHomeProductGrid } from "@/service/productService";

/* ==============================================
   CATEGORY TITLE FORMATTER (Luxury Typography)
   ============================================== */
const formatCategoryTitle = (title = "") => {
  return title
    .replace(/,/g, ", ")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s+/g, " ")
    .trim();
};

const ProductGrid = () => {
  const [homeProducts, setHomeProducts] = useState([]);
  const [limitedProducts, setLimitedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currency, rate } = useCurrency();

  /* ==============================================
     CATEGORY CHECK HELPERS
     ============================================== */
  const isBagCategory = useCallback((product) => {
    if (!product) return false;

    const name = product.name?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";
    const subCategory = product.subCategory?.toLowerCase() || "";
    const mainCategory = product.leatherMainCategory?.toLowerCase() || "";
    const material = product.material?.toLowerCase() || "";

    return (
      name.includes("bag") ||
      category.includes("bag") ||
      subCategory.includes("bag") ||
      mainCategory.includes("bag") ||
      (material.includes("leather") && name.includes("bag"))
    );
  }, []);

  const isAccessoriesCategory = useCallback((product) => {
    if (!product) return false;

    const category = product.category?.toLowerCase() || "";
    const subCategory = product.subCategory?.toLowerCase() || "";
    const mainCategory = product.leatherMainCategory?.toLowerCase() || "";

    return (
      category === "accessories" ||
      subCategory === "accessories" ||
      mainCategory === "accessories"
    );
  }, []);

  /* ==============================================
     ROUTE GENERATOR
     ============================================== */
  const generateProductRoute = useCallback(
    (product) => {
      if (!product?._id) return "/";

      if (isBagCategory(product)) {
        return `/LeatherBagsDetails/${product._id}`;
      }

      if (isAccessoriesCategory(product)) {
        return `/AccessoriesDeatils/${product._id}`;
      }

      return `/ProductDetailPage/${product._id}`;
    },
    [isBagCategory, isAccessoriesCategory]
  );

  /* ==============================================
     API CALLS
     ============================================== */
  const fetchLimitedEdition = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/admin/product/getLimited`
      );
      return res?.data?.products || [];
    } catch (error) {
      console.error("Error fetching limited edition products:", error);
      return [];
    }
  }, []);

  /* ==============================================
     DATA FETCHING
     ============================================== */
  useEffect(() => {
    let mounted = true;

    const loadAll = async () => {
      try {
        setLoading(true);

        const [homeRes, limitedRes] = await Promise.allSettled([
          getHomeProductGrid(),
          fetchLimitedEdition(),
        ]);

        if (!mounted) return;

        const homeProductsData =
          homeRes.status === "fulfilled"
            ? homeRes.value?.data?.homeProducts
            : [];

        const filteredCategories = Array.isArray(homeProductsData)
          ? homeProductsData
              .filter(
                (item) => item?.title?.toLowerCase() !== "jewelry"
              )
              .map((category) => ({
                ...category,
                products: Array.isArray(category.products)
                  ? category.products.slice(0, 3)
                  : [],
              }))
          : [];

        const limitedData =
          limitedRes.status === "fulfilled" ? limitedRes.value : [];

        setLimitedProducts(limitedData);

        const limitedEditionCategory = {
          _id: "limited-edition",
          title: "Limited Edition",
          products: limitedData.slice(0, 3),
        };

        setHomeProducts([
          ...filteredCategories,
          limitedEditionCategory,
        ]);
      } catch (error) {
        console.error("Homepage load error:", error);
        setHomeProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
    return () => (mounted = false);
  }, [fetchLimitedEdition]);

  /* ==============================================
     SKELETON UI
     ============================================== */
  if (loading) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 shadow border"
            >
              <div className="h-5 w-1/3 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="aspect-square bg-gray-200 rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ==============================================
     PRODUCT ITEM
     ============================================== */
  const ProductItem = ({ product }) => {
    const route = generateProductRoute(product);
    const imageUrl = product.images?.[0]?.url;

    const price = product.salePrice
      ? `${(Number(product.salePrice) * rate).toFixed(
          2
        )} ${currency}`
      : "Price N/A";

    return (
      <div className="flex flex-col items-center text-center">
        <Link
          href={route}
          className="w-full aspect-square bg-gray-50 border rounded-lg overflow-hidden mb-2"
          prefetch={false}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              width={120}
              height={120}
              className="object-cover w-full h-full hover:scale-105 transition"
              loading="lazy"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </Link>

        <p className="text-xs text-gray-600 line-clamp-2 min-h-[32px]">
          {product.name}
        </p>

        <p className="text-sm font-semibold text-gray-900 mt-1">
          {price}
        </p>
      </div>
    );
  };

  /* ==============================================
     MAIN RENDER
     ============================================== */
  return (
    <div className="bg-gray-50 p-4 lg:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {homeProducts.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-xl shadow p-4 border"
          >
            <h2 className="text-base font-semibold mb-3 border-b pb-2">
              {formatCategoryTitle(category.title)}
            </h2>

            <div className="grid grid-cols-3 gap-2">
              {category.products.length ? (
                category.products.map((product) => (
                  <ProductItem
                    key={product._id}
                    product={product}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-400 text-sm">
                  No Products
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
