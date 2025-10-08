"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCurrency } from "@/app/CurrencyContext";
import newCurrency from "../../assets/newSymbole.png";

// Brand logos (example)
import Omega from "../../assets/PremimumBrands/b6047a0809e6575a92443a6924e60eae.jpg";
import Rolex from "../../assets/PremimumBrands/rolex-logo-editorial-illustration-free-vector.jpg";
import Cartier from "../../assets/PremimumBrands/cartier-logo-png_seeklogo-26665.png";
import Ap from "../../assets/PremimumBrands/bbdc6dc34c14f4427a5d1fe1475cd453.jpg";
import Seamaster from '../../assets/PremimumBrands/images (6).jpeg'
import santos from '../../assets/PremimumBrands/santos.jpg'
import Speedmaster from '../../assets/PremimumBrands/images (4).png'

const MegaMenu = ({ data, megaMenuKey, isMobile = false }) => {
  const { currency } = useCurrency();

  // ✅ Only 7 brands as requested
  const topBrands = [
    { name: "Omega", logo: Omega },
    { name: "Rolex", logo: Rolex },
    { name: "Cartier", logo: Cartier },
    { name: "Ap", logo: Ap },
    { name: "Santos", logo: santos },
    { name: "Seamaster", logo: Seamaster},
    { name: "Speedmaster", logo: Speedmaster },
  ];

  // ---------- MOBILE VIEW ----------
  if (isMobile) {
    return (
      <div className="pl-4 pb-4 space-y-4">
        {/* Categories */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-1">Categories</h4>
          <ul className="space-y-2">
            {data.categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={category.path}
                  className="text-gray-600 hover:text-amber-600 block py-1 text-sm"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured Products */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Featured</h4>
          <div className="space-y-3">
            {data.featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <p className="text-amber-600 text-sm font-semibold flex items-center">
                    <Image
                      src={newCurrency}
                      alt="AED"
                      width={14}
                      height={14}
                      className="inline-block mr-1"
                    />
                    {product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Brands - Mobile */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Top Brands</h4>
          <div className="grid grid-cols-4 gap-2">
            {topBrands.slice(0, 4).map((brand) => (
              <Link
                key={brand.name}
                href={`/brands/${brand.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 border border-gray-200"
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain mb-1"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-xs font-semibold text-gray-600 mb-1">
                    {brand.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs text-gray-700 text-center font-medium truncate w-full">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Promotion */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">
            {data.promotion.title}
          </h4>
          <p className="text-xs text-gray-600 mb-2">
            {data.promotion.description}
          </p>
          <Link
            href={
              megaMenuKey === "watches"
                ? "/watches"
                : megaMenuKey === "leathers"
                ? "/leathers"
                : "/accessories"
            }
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded text-sm w-full transition-colors block text-center"
          >
            {data.promotion.cta}
          </Link>
        </div>
      </div>
    );
  }

  // ---------- DESKTOP VIEW ----------
  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-screen max-w-4xl bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Categories */}
          <div className="lg:col-span-3">
            <h3 className="font-semibold text-gray-900 mb-3 text-base">
              Categories
            </h3>
            <ul className="space-y-2">
              {data.categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.path}
                    className="text-gray-600 hover:text-amber-600 transition-colors duration-200 block py-1 text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Products */}
          <div className="lg:col-span-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-base">
              Featured Products
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.featuredProducts.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="w-12 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm group-hover:text-amber-600 transition-colors truncate">
                      {product.name}
                    </h4>
                    <p className="text-amber-600 font-semibold text-sm flex items-center">
                      <Image
                        src={newCurrency}
                        alt="AED"
                        width={12}
                        height={12}
                        className="inline-block mr-1"
                      />
                      {product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Promotion + Top Brands */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {/* Promotion */}
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  src={data.promotion.image}
                  alt={data.promotion.title}
                  width={200}
                  height={120}
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-3">
                  <div className="text-center text-white">
                    <h4 className="font-bold text-sm mb-1">
                      {data.promotion.title}
                    </h4>
                    <p className="text-xs mb-2">{data.promotion.description}</p>
                    <Link
                      href={
                        megaMenuKey === "watches"
                          ? "/watches"
                          : megaMenuKey === "leathers"
                          ? "/leathers"
                          : "/accessories"
                      }
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors inline-block"
                    >
                      {data.promotion.cta}
                    </Link>
                  </div>
                </div>
              </div>

            
            </div>
          </div>
        </div>

        {/* ✅ Popular Brands - Only 7 brands displayed */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm">POPULAR BRANDS</h3>
            <Link
              href="/brands"
              className="text-amber-600 hover:text-amber-700 text-xs font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {topBrands.map((brand, index) => (
              <Link
                key={`${brand.name}-${index}`}
                href={`/brands/${brand.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="flex flex-col items-center justify-center p-2 bg-gray-50 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 border border-gray-200 group"
              >
                {brand.logo ? (
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain mb-1 group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-xs font-semibold text-gray-600 mb-1 group-hover:scale-110 transition-transform">
                    {brand.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs text-gray-700 text-center font-medium truncate w-full">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;