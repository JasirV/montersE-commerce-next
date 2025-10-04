"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useCurrency } from "@/app/CurrencyContext";
import { getHomeProductGrid } from "@/service/productService";
import { FiEdit2 } from "react-icons/fi";
import EditHomeModal from "../modals/editHomeModal";

const ProductGridEdit = () => {
  const [homeProducts, setHomeProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [editingHeading, setEditingHeading] = useState(""); 
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedModalProduct, setSelectedModalProduct] = useState(null);

  const { currency, rate } = useCurrency(); // Make sure this provides currency conversion

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const res = await getHomeProductGrid();
        console.log(res)
        const homeProductsData = res.data || [];
        setHomeProducts(homeProductsData);
      } catch (err) {
        console.error("Failed to fetch home products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeProducts();
  }, []);

  const openEditModal = (product, headingTitle, index) => {
    setEditingProduct(product);
    setEditingHeading(headingTitle);
    setEditingIndex(index);
    setSelectedModalProduct(product);
  };

  const handleSave = async () => {
    if (!selectedModalProduct) return;
    console.log("Saving product:", selectedModalProduct);

    // Backend update logic (uncomment when ready)
    // try {
    //   await updateHomeProductGrid(editingHeading, editingIndex, selectedModalProduct._id);
    //   setHomeProducts((prev) =>
    //     prev.map((heading) =>
    //       heading.title === editingHeading
    //         ? {
    //             ...heading,
    //             products: heading.products.map((p, idx) =>
    //               idx === editingIndex ? selectedModalProduct : p
    //             ),
    //           }
    //         : heading
    //     )
    //   );
    //   setEditingProduct(null);
    //   setEditingHeading("");
    //   setEditingIndex(null);
    //   setSelectedModalProduct(null);
    // } catch (err) {
    //   console.error("Failed to save product:", err);
    // }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        Loading products...
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-[100px] p-4 sm:p-6 lg:p-8">
      {homeProducts.homeProducts.map((heading) => (
        <div key={heading._id} className="mb-8">
          <h2 className="text-xl font-bold mb-4">{heading.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heading.products.map((product, i) => (
              <div
                key={product._id || i}
                className="bg-white rounded-xl shadow-md p-5 relative"
              >
                <button
                  onClick={() => openEditModal(product, heading.title, i)}
                  className="absolute top-2 right-2 text-white p-1 rounded-full bg-[#6B46C1] hover:bg-[#5a37a1] z-10"
                >
                  <FiEdit2 size={16} />
                </button>

                <Link href={`/ProductDetailPage/${product._id}`}>
                  <Image
                    src={
                      product.images?.[0]?.url ||
                      "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg"
                    width={300}
                    height={300}
                  />
                </Link>

                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {product.salePrice
                    ? `${(parseFloat(product.salePrice) * rate).toFixed(2)} ${currency}`
                    : "Price not available"}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">{product.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <EditHomeModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSelectProduct={setSelectedModalProduct}
        heading={editingHeading}
        index={editingIndex}
        onSave={handleSave}
        selectedProduct={selectedModalProduct}
      />
    </div>
  );
};

export default ProductGridEdit;
