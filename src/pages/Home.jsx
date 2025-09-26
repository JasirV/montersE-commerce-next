"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Jewelry1 from "../assets/Jewelry/luxury-jewellery-display.jpg";
import Jewelry2 from "../assets/Jewelry/side-view-pair-silver-diamond-earrings-with-emerald-black-wall-black.jpg";
import Jewelry3 from "../assets/Jewelry/view-luxurious-golden-ring-felt-jewelry-display (1).jpg";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dummy jewelry products for specified categories only
  const dummyJewelry = [
    // Jewelry Category
  // Watches Category
    {
      _id: "dummy-watch-1",
      name: "Rolex Luxury Watch",
      salePrice: "25,000",
      images: [{ url: Jewelry1 }],
      category: "Watches"
    },
    {
      _id: "dummy-watch-2",
      name: "Omega Seamaster",
      salePrice: "18,500",
      images: [{ url: Jewelry2 }],
      category: "Watches"
    },
    {
      _id: "dummy-watch-3",
      name: "Cartier Tank Watch",
      salePrice: "22,000",
      images: [{ url: Jewelry3 }],
      category: "Watches"
    },


    // Watches Category
    {
      _id: "dummy-watch-1",
      name: "Rolex Luxury Watch",
      salePrice: "25,000",
      images: [{ url: Jewelry1 }],
      category: "Watches"
    },
    {
      _id: "dummy-watch-2",
      name: "Omega Seamaster",
      salePrice: "18,500",
      images: [{ url: Jewelry2 }],
      category: "Watches"
    },
    {
      _id: "dummy-watch-3",
      name: "Cartier Tank Watch",
      salePrice: "22,000",
      images: [{ url: Jewelry3 }],
      category: "Watches"
    },

    // Bags, wallets & Pens Category
    {
      _id: "dummy-bag-1",
      name: "Designer Leather Bag",
      salePrice: "7,500",
      images: [{ url: Jewelry1 }],
      category: "Bags,wallets&Pens"
    },
    {
      _id: "dummy-bag-2",
      name: "Luxury Wallet",
      salePrice: "2,800",
      images: [{ url: Jewelry2 }],
      category: "Bags,wallets&Pens"
    },
    {
      _id: "dummy-bag-3",
      name: "Premium Fountain Pen",
      salePrice: "1,500",
      images: [{ url: Jewelry3 }],
      category: "Bags,wallets&Pens"
    },

    // Clocks & Pocket Watch Category
    {
      _id: "dummy-clock-1",
      name: "Vintage Pocket Watch",
      salePrice: "9,800",
      images: [{ url: Jewelry1 }],
      category: "Colcks&Pocket Watch"
    },
    {
      _id: "dummy-clock-2",
      name: "Antique Wall Clock",
      salePrice: "12,300",
      images: [{ url: Jewelry2 }],
      category: "Colcks&Pocket Watch"
    },
    {
      _id: "dummy-clock-3",
      name: "Modern Desk Clock",
      salePrice: "4,500",
      images: [{ url: Jewelry3 }],
      category: "Colcks&Pocket Watch"
    },

    // Personal Accessories & Cufflinks Category
    {
      _id: "dummy-accessory-1",
      name: "Designer Cufflinks",
      salePrice: "3,200",
      images: [{ url: Jewelry1 }],
      category: "Personal Accessories& Cufflinks"
    },
    {
      _id: "dummy-accessory-2",
      name: "Silver Tie Clip",
      salePrice: "1,800",
      images: [{ url: Jewelry2 }],
      category: "Personal Accessories& Cufflinks"
    },
    {
      _id: "dummy-accessory-3",
      name: "Gold Money Clip",
      salePrice: "2,500",
      images: [{ url: Jewelry3 }],
      category: "Personal Accessories& Cufflinks"
    },

    // Home Accessories Category
    {
      _id: "dummy-home-1",
      name: "Luxury Home Clock",
      salePrice: "6,500",
      images: [{ url: Jewelry1 }],
      category: "Home Accessories"
    },
    {
      _id: "dummy-home-2",
      name: "Crystal Vase",
      salePrice: "3,800",
      images: [{ url: Jewelry2 }],
      category: "Home Accessories"
    },
    {
      _id: "dummy-home-3",
      name: "Silver Photo Frame",
      salePrice: "2,200",
      images: [{ url: Jewelry3 }],
      category: "Home Accessories"
    },


       {
      _id: "dummy-jewel-1",
      name: "Cartier Diamond Ring",
      salePrice: "12,500",
      images: [{ url: Jewelry1 }],
      category: "Jewelry"
    },
    {
      _id: "dummy-jewel-2",
      name: "Tiffany & Co. Necklace",
      salePrice: "15,700",
      images: [{ url: Jewelry2 }],
      category: "Jewelry"
    },
    {
      _id: "dummy-jewel-3",
      name: "Diamond Earrings",
      salePrice: "11,200",
      images: [{ url: Jewelry3 }],
      category: "Jewelry"
    },

  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(dummyJewelry);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  // Group products by category and limit to 3 products per category
  const categories = {};

  products.forEach((product) => {
    const category = product.category || "Other";

    if (!categories[category]) {
      categories[category] = [];
    }

    if (categories[category].length < 3) {
      categories[category].push(product);
    }
  });

  return (
    <div className="bg-gray-50 min-h-[100px] p-4 sm:p-6 lg:p-8">
      {/* Outer grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categories).map(
          ([category, categoryProducts], index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5"
            >
              {/* Category Title */}
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {category}
              </h2>

              {/* Products Grid */}
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, productIndex) => {
                  const product = categoryProducts[productIndex];

                  return product ? (
                    <div
                      key={product._id}
                      className="flex flex-col items-center text-center group"
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Link href={`/ProductDetailPage/${product._id}`}>
                          <Image
                            src={
                              product.images && product.images.length > 0
                                ? product.images[0].url
                                : "https://via.placeholder.com/300x300?text=No+Image"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                            width={300}
                            height={300}
                            loading="lazy"
                          />
                        </Link>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        {product.salePrice
                          ? `${product.salePrice} AED`
                          : "Price not available"}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {product.name}
                      </p>
                    </div>
                  ) : (
                    <div
                      key={productIndex}
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
          )
        )}
      </div>
    </div>
  );
};

export default ProductGrid;