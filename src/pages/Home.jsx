"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useCurrency } from "@/app/CurrencyContext";
import { getHomeProductGrid } from "@/service/productService";

const ProductGrid = () => {
  const [homeProducts, setHomeProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency, rate } = useCurrency();


  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        setLoading(true);
        const res = await getHomeProductGrid();
        console.log(res)
        if (res?.data?.homeProducts) {
          setHomeProducts(res.data.homeProducts);
          setLoading(false);
        } else {
          setHomeProducts([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching home products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  // Skeleton Loader Card
  const SkeletonCard = () => (
    <div className="flex flex-col items-center text-center animate-pulse">
      <div className="w-full aspect-square rounded-lg bg-gray-300 mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded mb-1"></div>
      <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
    </div>
  );

  // Skeleton layout (mimics real layout)
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-[100px] p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5"
            >
              <div className="h-6 w-1/3 bg-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="grid grid-cols-3 gap-4">
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

  // Render main layout
  return (
    <div className="bg-gray-50 min-h-[100px] p-4 sm:p-6 lg:p-8">
      {/* Outer grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeProducts.length > 0 ? (
          homeProducts.map((categoryItem) => (
            <div
              key={categoryItem._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5"
            >
              {/* Category Title */}
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {categoryItem.title}
              </h2>

              {/* Product Grid (3 per category) */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => {
                  const product = categoryItem.products[index];
                  return product ? (
                    <div
                      key={product._id || index}
                      className="flex flex-col items-center text-center group"
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Link href={`/ProductDetailPage/${product._id}`}>
                          <Image
                            src={
                              product.images?.[0]?.url}
                            alt={product.name || "Product"}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            width={300}
                            height={300}
                            loading="lazy"
                          />
                        </Link>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        {product.salePrice
                          ? `${(
                              parseFloat(
                                product.salePrice.toString().replace(/,/g, "")
                              ) * rate
                            ).toFixed(2)} ${currency}`
                          : "Price not available"}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {product.name || product.sku}
                      </p>
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="flex flex-col items-center"
                    >
                      <div className="w-full aspect-square rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                        Empty
                      </div>
                    </div>
                  );
                })}
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
