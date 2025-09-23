"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Jewelry1 from "../assets/Jewelry/luxury-jewellery-display.jpg";
import Jewelry2 from "../assets/Jewelry/side-view-pair-silver-diamond-earrings-with-emerald-black-wall-black.jpg";
import Jewelry3 from "../assets/Jewelry/view-luxurious-golden-ring-felt-jewelry-display (1).jpg";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:7000/api/products"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Target product names
        const targetProducts = [
          // bags
          "Cartier Happy Birthday Baguette Shoulder Bag",
          "CARTIER PANTHERE BAG with WALLET-25023435",
          "CARTIER DIABOLO BALLPOINT PEN - 363354",

          // cufflinks
          "Gucci GG Supreme Sherry Line Hand Bag-1002051",
          "Alviero Martini Geo Classic Bag -47734623",
          "Gucci Ophidia Boston Hand Bag- 58.02.007",

          // watches
          "Rolex Orchid 25.5mm - 1352",
          "Panerai Radiomir Officine",
          "OMEGA SEAMASTER PROFESSIONAL 300M 36mm REF-2561.80",

          "Cartier Must De Waist Bag",
          "Chopard Happy Diamonds 22mm - 20/6063",
          "DUNHILL MILLENNIUM EL PRIMO 40mm",

          "Cartier Panthere Backpack -48554073",
          "RAYMOND WEIL GOLD G 10M 28mm - 9812",
          "Tag Heuer Chronograph 38mm - CG 1111.0",
        ];

        const filteredProducts = data.filter((product) =>
          targetProducts.some((target) => product.name.includes(target))
        );

        // ✅ Add dummy Jewelry items
        const dummyJewelry = [
          {
            _id: "dummy-jewel-1",
            name: "Cartier Diamond Ring",
            salePrice: "12,500",
            images: [{ url: Jewelry1 }],
          },
          {
            _id: "dummy-jewel-2",
            name: "Gucci Gold Bracelet",
            salePrice: "8,900",
            images: [{ url: Jewelry2 }],
          },
          {
            _id: "dummy-jewel-3",
            name: "Tiffany & Co. Necklace",
            salePrice: "15,700",
            images: [{ url: Jewelry3 }],
          },
        ];

        setProducts([...filteredProducts, ...dummyJewelry]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  /// Group products by category and limit to 3 products per category
  const categories = {};

  products.forEach((product) => {
    let category = "Other";

    if (
      product.name.includes("Cartier Happy Birthday Baguette Shoulder Bag") ||
      product.name.includes("CARTIER PANTHERE BAG with WALLET-25023435") ||
      product.name.includes("CARTIER DIABOLO BALLPOINT PEN - 363354")
    ) {
      category = "Bags, Wallets & Pens";
    } else if (
      product.name.includes("Gucci GG Supreme Sherry Line Hand Bag-1002051") ||
      product.name.includes("Alviero Martini Geo Classic Bag -47734623") ||
      product.name.includes("Gucci Ophidia Boston Hand Bag- 58.02.007")
    ) {
      category = "Personal Accessories & Cufflinks";
    } else if (
      product.name.includes("Rolex") ||
      product.name.includes("Panerai") ||
      product.name.includes("OMEGA SEAMASTER")
    ) {
      category = "Watches";
    } else if (
      product.name.includes("Cartier Must De Waist Bag") ||
      product.name.includes("Chopard Happy Diamonds 22mm - 20/6063") ||
      product.name.includes("DUNHILL MILLENNIUM EL PRIMO 40mm")
    ) {
      category = "Clocks & Pocket Watch";
    } else if (
      product.name.includes("Cartier Panthere Backpack -48554073") ||
      product.name.includes("RAYMOND WEIL GOLD G 10M 28mm - 9812") ||
      product.name.includes("Tag Heuer Chronograph 38mm - CG 1111.0")
    ) {
      category = "Home Accessories";
    } else if (
      product.name.toLowerCase().includes("ring") ||
      product.name.toLowerCase().includes("bracelet") ||
      product.name.toLowerCase().includes("necklace") ||
      product.name.toLowerCase().includes("earring") ||
      product.name.toLowerCase().includes("jewelry") ||
      product.name.toLowerCase().includes("jewellery")
    ) {
      category = "Jewelry";
    }

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
  {product?._id && ( // make sure _id exists
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
  )}
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
