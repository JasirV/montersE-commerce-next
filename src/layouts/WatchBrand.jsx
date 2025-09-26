import React from "react";
import { FaArrowRight } from "react-icons/fa";
import bagsOne from "../assets/beautiful-elegance-luxury-fashion-green-handbag.jpg";
import Image from "next/image";

const BrandNewAdded = ({ products,loading }) => {
  // const products = [
  //   { id: 1, name: "Coach Mini Hand Bag", image: bagsOne },
  //   { id: 2, name: "Breitling Airwolf", image: bagsOne },
  //   { id: 3, name: "Bally Black Leather", image: bagsOne },
  //   { id: 4, name: "Breitling Callisto 200M", image: bagsOne },
  //   { id: 5, name: "Alfred Dunhill Business", image: bagsOne },
  //   { id: 6, name: "Alfred Dunhill RPM 8042", image: bagsOne },
  // ];
  // console.log(products, "products");
  const skeletonArray = Array(6).fill(null);

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center tracking-tight">
          Brand New Added
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {loading
            ? skeletonArray.map((_, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm animate-pulse flex flex-col"
                >
                  {/* Image skeleton */}
                  <div className="flex justify-center items-center p-4 bg-gray-50">
                    <div className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] bg-gray-200 rounded-md" />
                  </div>

                  {/* Product name skeleton */}
                  <div className="px-4 flex-1 flex items-center justify-center text-center py-3">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>

                  {/* Bottom strip skeleton */}
                  <div className="border-t bg-gray-50 px-4 py-2">
                    <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded" />
                  </div>
                </div>
              )):
          products?.map((product) => (
            <div
              key={product._id}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="flex justify-center items-center p-4 bg-gray-50">
                {console.log(product.images[0], "image")}
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  width={160}
                  height={160}
                  loading="lazy"
                  className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="px-4 flex-1 flex items-center justify-center text-center py-3">
                <h3 className="text-sm font-medium text-gray-800 leading-tight">
                  {product.name}
                </h3>
              </div>

              {/* Bottom strip */}
              <div className="border-t bg-gray-50 px-4 py-2">
                <a
                  href="#"
                  className="flex items-center justify-center text-sm font-medium text-[#1e518e] hover:text-[#0061b0] transition"
                >
                  Get Price <FaArrowRight className="ml-1 text-xs" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandNewAdded;
