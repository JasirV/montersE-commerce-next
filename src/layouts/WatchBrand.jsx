import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { useCurrency } from "@/app/CurrencyContext";
import axios from "axios";
import Bag from '../assets/beautiful-elegance-luxury-fashion-green-handbag.jpg'

const BrandNewAdded = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { currency, convertPrice, getCurrencySymbol } = useCurrency();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
         const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/products`
      );
        
        let productsArray = response.data;
        
        if (!Array.isArray(response.data)) {
          if (response.data.data && Array.isArray(response.data.data)) {
            productsArray = response.data.data;
          } else if (response.data.products && Array.isArray(response.data.products)) {
            productsArray = response.data.products;
          } else {
            productsArray = Object.values(response.data);
          }
        }

        if (!Array.isArray(productsArray)) {
          throw new Error('Products data is not in expected format');
        }

        const filteredProducts = productsArray
          .filter(product => 
            product &&
            product.inStock && 
            product.available && 
            product.stockQuantity > 0 &&
            product.brand
          )
          .slice(0, 6);

        setProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);




  // Dummy products as fallback
  const dummyProducts = [
    {
      _id: "1",
      name: "Luxury Leather Handbag",
      images: Bag,
      price: 299.99
    },
    {
      _id: "2",
      name: "Designer Crossbody Bag",
      images: Bag,
      price: 199.99
    },
    {
      _id: "3",
      name: "Elegant Evening Clutch",
      images: Bag,
      price: 149.99
    },
    {
      _id: "4",
      name: "Premium Tote Bag",
      images: Bag,
      price: 249.99
    },
    {
      _id: "5",
      name: "Vintage Shoulder Bag",
      images: Bag,
      price: 179.99
    },
    {
      _id: "6",
      name: "Modern Backpack Purse",
      images: Bag,
      price: 219.99
    }
  ];

  const skeletonArray = Array(6).fill(null);
  
  const displayProducts = products && products.length > 0 ? products : dummyProducts;

  const getProductImage = (product) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0].url;
    }
    if (product.image) {
      return product.image;
    }
    if (product.images && typeof product.images === 'string') {
      return product.images;
    }
    return Bag;
  };

  const getProductName = (product) => {
    return product.name || `${product.brand} ${product.model || ''}`.trim() || 'Product Name';
  };

  const getProductPrice = (product) => {
    const basePrice = product.salePrice || product.price || product.regularPrice || 0;
    return convertPrice(basePrice);
  };

  const getRegularPrice = (product) => {
    if (product.regularPrice && product.salePrice && product.regularPrice !== product.salePrice) {
      return convertPrice(product.regularPrice);
    }
    return null;
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Brand New
        </h2>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {loading
            ? skeletonArray.map((_, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm animate-pulse flex flex-col"
                >
                  <div className="flex justify-center items-center p-4 bg-gray-50">
                    <div className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] bg-gray-200 rounded-md" />
                  </div>

                  <div className="px-4 flex-1 flex items-center justify-center text-center py-3">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>

                  <div className="border-t bg-gray-50 px-4 py-2">
                    <div className="h-4 w-1/2 mx-auto bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            : displayProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col group"
                >
                  {/* Image with Hover Effects */}
                  <div className="flex justify-center items-center p-4 bg-gray-50 relative overflow-hidden">
                    <div className="relative">
                      <Image
                        src={getProductImage(product)}
                        alt={getProductName(product)}
                        unoptimized   // <--- bypasses Vercel
                        width={160}
                        height={160}
                        loading="lazy"
                        className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] object-contain transition duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = Bag;
                        }}
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="px-4 flex-1 flex items-center justify-center text-center py-3">
                    <h3 className="text-sm font-medium text-gray-800 leading-tight group-hover:text-[#1e518e] transition duration-300">
                      {getProductName(product)}
                    </h3>
                  </div>

                  {/* Price Display */}
                  <div className="px-4 text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {getCurrencySymbol()}{getProductPrice(product)}
                    </p>
                    {getRegularPrice(product) && (
                      <p className="text-sm text-gray-500 line-through">
                        {getCurrencySymbol()}{getRegularPrice(product)}
                      </p>
                    )}
                  </div>

                  {/* Bottom strip */}
                  <div className="border-t bg-gray-50 px-4 py-2 group-hover:bg-gray-100 transition duration-300">
                    <a
                      href={`/ProductDetailPage/${product._id || product.id}`}
                      className="flex items-center justify-center text-sm font-medium text-[#1e518e] hover:text-[#0061b0] transition"
                    >
                      Get Price <FaArrowRight className="ml-1 text-xs group-hover:translate-x-1 transition-transform duration-300" />
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