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

        if (res?.data?.homeProducts) {
          const filtered = res.data.homeProducts.filter(
            (item) => item.title.toLowerCase() !== "jewelry"
          );

          const categoriesWithThreeProducts = filtered.map((category) => ({
            ...category,
            products: category.products?.slice(0, 3) || [],
          }));

          setHomeProducts(categoriesWithThreeProducts);
        } else {
          setHomeProducts([]);
        }
      } catch (error) {
        console.error("Error fetching home products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeProducts();
  }, []);

  const SkeletonCard = () => (
    <div className="flex flex-col items-center text-center animate-pulse h-full">
      <div className="w-full h-[110px] bg-gray-300 rounded mb-2"></div>
      <div className="h-3 w-2/3 bg-gray-300 rounded mb-1"></div>
      <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4">
              <div className="h-6 w-1/3 bg-gray-300 rounded mb-4 animate-pulse"></div>
              <div className="grid grid-cols-3 gap-3">
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

  return (
    <div className="bg-gray-50 p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {homeProducts.length > 0 ? (
          homeProducts.map((categoryItem) => (
            <div
              key={categoryItem._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-4 border border-gray-100"
            >
              {/* Category Title */}
              <h2 className="text-lg font-semibold mb-3 text-gray-800 border-b border-gray-200 pb-2">
                {categoryItem.title}
              </h2>

              {/* Product Grid */}
              <div className="grid grid-cols-3 gap-3">
                {categoryItem.products?.length > 0 ? (
                  categoryItem.products.map((product, index) => (
                    <div
                      key={product._id || index}
                      className="flex flex-col items-center text-center group h-full"
                    >
                      {/* Image Container (equal height) */}
                      <div className="w-full h-[110px] sm:h-[130px] flex justify-center items-center rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-50 mb-1">
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

                      {/* Product Name */}
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-tight min-h-[32px]">
                        {product.name || product.sku}
                      </p>

                      {/* Price */}
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        {product.salePrice
                          ? `${(
                              parseFloat(
                                product.salePrice.toString().replace(/,/g, "")
                              ) * rate
                            ).toFixed(2)} ${currency}`
                          : "Price N/A"}
                      </p>
                    </div>
                  ))
                ) : (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-400 text-xs py-6 h-full"
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
