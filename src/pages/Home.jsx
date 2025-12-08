"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCurrency } from "@/app/CurrencyContext";
import { getHomeProductGrid } from "@/service/productService";

const ProductGrid = () => {
  const [homeProducts, setHomeProducts] = useState([]);
  const [limitedProducts, setLimitedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currency, rate } = useCurrency();

  // -------------------------
  //  GET LIMITED EDITION API
  // -------------------------
  const fetchLimitedEdition = async () => {
    try {
      const res = await axios.get(
        "https://api.montres.ae/api/admin/product/getLimited"
      );

      return res?.data?.products || [];
    } catch (error) {
      console.error("Error fetching limited edition products:", error);
      return [];
    }
  };

  // -------------------------
  //  FETCH HOME + LIMITED
  // -------------------------
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);

        // Load categories (normal home products)
        const res = await getHomeProductGrid();

        // Remove jewelry category as required
        const filteredCategories = res?.data?.homeProducts
          ?.filter((item) => item.title.toLowerCase() !== "jewelry")
          .map((category) => ({
            ...category,
            products: category.products?.slice(0, 3) || [],
          })) || [];

        // Load limited edition products
        const limited = await fetchLimitedEdition();
        setLimitedProducts(limited);

        // Build Limited Edition Category
        const limitedEditionCategory = {
          _id: "limited-edition",
          title: "Limited Edition",
          products: limited.slice(0, 3), // always 3 products max
        };

        // FINAL LIST
        const finalList = [...filteredCategories, limitedEditionCategory];

        setHomeProducts(finalList);
      } catch (error) {
        console.error("Error loading homepage data:", error);
        setHomeProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // -------------------------
  //  Skeleton UI
  // -------------------------
  const SkeletonCard = () => (
    <div className="flex flex-col items-center text-center animate-pulse">
      <div className="w-full h-[120px] bg-gray-300 rounded mb-2"></div>
      <div className="h-3 w-2/3 bg-gray-300 rounded mb-1"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <div className="h-6 w-1/3 bg-gray-300 rounded mb-3 animate-pulse"></div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                {Array.from({ length: 3 }).map((__, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------
  //       MAIN UI
  // -------------------------
  return (
    <div className="bg-gray-50 p-4 lg:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {homeProducts.length > 0 ? (
          homeProducts.map((categoryItem) => (
            <div
              key={categoryItem._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-4 border border-gray-100 flex flex-col"
            >
              {/* Category Title */}
              <h2 className="text-lg font-semibold mb-2 text-gray-800 border-b border-gray-200 pb-1">
                {categoryItem.title}
              </h2>

              {/* Product Listing */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
                {categoryItem.products?.length > 0 ? (
                  categoryItem.products.map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col items-center text-center"
                    >
                      {/* Image */}
                      <div className="w-full h-[120px] flex justify-center items-center rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 mb-1">
                        <Link href={`/ProductDetailPage/${product._id}`}>
                          <Image
                            src={product.images?.[0]?.url}
                            alt={product.name || "Product"}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            width={150}
                            height={150}
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      {/* Name */}
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-tight min-h-[32px]">
                        {product.name}
                      </p>

                      {/* Price */}
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {product.salePrice
                          ? `${(
                              parseFloat(product.salePrice.toString()) * rate
                            ).toFixed(2)} ${currency}`
                          : "Price N/A"}
                      </p>
                    </div>
                  ))
                ) : (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 text-xs py-6 h-[180px]"
                    >
                      No Product
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No categories found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
