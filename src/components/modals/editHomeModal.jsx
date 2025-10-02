"use client";
import { fetchProduct } from "@/service/productService";
import { useEffect, useState } from "react";

const EditHomeModal = ({ isOpen, onClose, onSelectProduct }) => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchProducts = async () => {
      try {
        const res = await fetchProduct();
        setItems(res.data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isOpen]);

  // Filter products based on search
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;
  console.log(items,'res'
  )
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4">Select Product</h3>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product..."
          className="w-full p-2 border rounded mb-4"
        />

        {loading ? (
          <p>Loading products...</p>
        ) : filteredItems.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredItems.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between border-b py-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={product.images?.[0]?.url || "https://via.placeholder.com/50"}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <span>{product.name}</span>
              </div>
              <button
                onClick={() => onSelectProduct(product)}
                className="px-3 py-1 text-white bg-[#6B46C1] rounded hover:bg-[#5a37a1]"
              >
                Select
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EditHomeModal;
