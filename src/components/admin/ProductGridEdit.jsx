"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useCurrency } from "@/app/CurrencyContext";
import { getProducts, updateProduct } from "@/service/productService";
import { FiEdit2 } from "react-icons/fi"; // Edit icon
import EditHomeModal from "../modals/editHomeModal";

const ProductGridEdit = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const { currency, rate } = useCurrency();

  const categoryHeadings = [
    "Jewelry",
    "Watches",
    "Bags,wallets&Pens",
    "Colcks&Pocket Watch",
    "Personal Accessories& Cufflinks",
    "Home Accessories",
  ];

  const dummyProducts = {
    Jewelry: [
      { _id: "dummy-jewel-1", name: "Cartier Diamond Ring", salePrice: "12,500", images: [] },
      { _id: "dummy-jewel-2", name: "Tiffany & Co. Necklace", salePrice: "15,700", images: [] },
      { _id: "dummy-jewel-3", name: "Diamond Earrings", salePrice: "11,200", images: [] },
    ],
    Watches: [
      { _id: "dummy-watch-1", name: "Rolex Luxury Watch", salePrice: "25,000", images: [] },
      { _id: "dummy-watch-2", name: "Omega Seamaster", salePrice: "18,500", images: [] },
      { _id: "dummy-watch-3", name: "Cartier Tank Watch", salePrice: "22,000", images: [] },
    ],
    "Bags,wallets&Pens": [
      { _id: "dummy-bag-1", name: "Designer Leather Bag", salePrice: "7,500", images: [] },
      { _id: "dummy-bag-2", name: "Luxury Wallet", salePrice: "2,800", images: [] },
      { _id: "dummy-bag-3", name: "Premium Fountain Pen", salePrice: "1,500", images: [] },
    ],
    "Colcks&Pocket Watch": [
      { _id: "dummy-clock-1", name: "Vintage Pocket Watch", salePrice: "9,800", images: [] },
      { _id: "dummy-clock-2", name: "Antique Wall Clock", salePrice: "12,300", images: [] },
      { _id: "dummy-clock-3", name: "Modern Desk Clock", salePrice: "4,500", images: [] },
    ],
    "Personal Accessories& Cufflinks": [
      { _id: "dummy-accessory-1", name: "Designer Cufflinks", salePrice: "3,200", images: [] },
      { _id: "dummy-accessory-2", name: "Silver Tie Clip", salePrice: "1,800", images: [] },
      { _id: "dummy-accessory-3", name: "Gold Money Clip", salePrice: "2,500", images: [] },
    ],
    "Home Accessories": [
      { _id: "dummy-home-1", name: "Luxury Home Clock", salePrice: "6,500", images: [] },
      { _id: "dummy-home-2", name: "Crystal Vase", salePrice: "3,800", images: [] },
      { _id: "dummy-home-3", name: "Silver Photo Frame", salePrice: "2,200", images: [] },
    ],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await getProducts();
        setProducts(result || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.salePrice);
  };

  const handleSave = async () => {
    try {
      await updateProduct(editingProduct._id, { name: editName, salePrice: editPrice });
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editingProduct._id ? { ...p, name: editName, salePrice: editPrice } : p
        )
      );
      setEditingProduct(null);
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[100px] p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryHeadings.map((category, index) => {
          const categoryProducts = products.filter((p) => p.category === category);
          const displayProducts =
            categoryProducts.length > 0 ? categoryProducts.slice(0, 3) : dummyProducts[category];

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 relative"
            >
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {category}
              </h2>

              <div className="grid grid-cols-3 gap-4">
                {displayProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col items-center text-center group relative"
                  >
                    <button
                      onClick={() => openEditModal(product)}
                      className="absolute top-2 right-2 text-white p-1 rounded-full bg-[#6B46C1] hover:bg-[#5a37a1] z-10"
                    >
                      <FiEdit2 size={16} />
                    </button>

                    <div className="w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                      <Link href={`/ProductDetailPage/${product._id}`}>
                        <Image
                          src={
                            product.images?.[0]?.url ||
                            "https://via.placeholder.com/300x300?text=No+Image"
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
                        ? `${(parseFloat(product.salePrice.replace(/,/g, "")) * rate).toFixed(2)} ${currency}`
                        : "Price not available"}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">{product.name}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <EditHomeModal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)}>
  
</EditHomeModal>
    </div>
  );
};

export default ProductGridEdit;
