import Image from "next/image";
import React, { useMemo, memo, lazy, Suspense } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

// Lazy load the Services component
const Services = lazy(() => import("./Services"));

// Memoized product data to prevent unnecessary re-renders
const productsData = [
  {
    id: 1,
    name: "Hermès Kelly Red Watch 20mm",
    price: "4000.0 AED",
    moq: "MOQ: 100 Pieces",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
  },
  {
    id: 2,
    name: "Hermès Kelly Red Watch 20mm",
    price: "4000.0 AED",
    moq: "MOQ: 35 Pieces",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
  },
  {
    id: 3,
    name: "Hermès Kelly Red Watch 20mm",
    price: "4000.0 AED",
    moq: "MOQ: 80 Pieces",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
  },
  {
    id: 4,
    name: "Hermès Kelly Red Watch 20mm",
    price: "4000.0 AED",
    moq: "MOQ: 50 Pieces",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
  }
];

// Single product card component to prevent re-renders
const ProductCard = memo(({ product }) => {
  // console.log(product,'product lin 42');
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative h-48 xs:h-56 sm:h-64 bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-3 xs:p-4"
          loading="lazy"
        />
        {/* Wishlist Button */}
        <button 
          className="absolute top-2 right-2 xs:top-3 xs:right-3 p-1.5 xs:p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Add to wishlist"
        >
          <FaHeart className="text-sm xs:text-base text-gray-400 hover:text-red-500" />
        </button>
      </div>
      
      {/* Product Details */}
      <div className="p-3 xs:p-4">
        <h3 className="text-gray-700 font-medium text-xs xs:text-sm mb-1 xs:mb-2 line-clamp-2" style={{ minHeight: '2.5rem' }}>
          {product.name}
        </h3>
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-base xs:text-lg font-bold text-gray-900">{product.price}</span>
        </div>
        <p className="text-xs xs:text-sm text-gray-500 mb-2 xs:mb-4">{product.moq}</p>
        
        {/* Add to Cart Button */}
        <button className="w-full flex items-center justify-center gap-1 xs:gap-2 bg-gray-900 hover:bg-gray-800 text-white py-1.5 xs:py-2 px-2 xs:px-4 rounded text-xs xs:text-sm transition-colors">
          <FaShoppingCart className="text-xs xs:text-sm" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

const SimilarProduct = () => {
  // Memoize the products data
  const products = useMemo(() => productsData, []);

  return (
    <div className="bg-gray-50 py-4 xs:py-6 sm:py-8 px-3 xs:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-xl xs:text-2xl font-bold text-gray-800 mb-4 xs:mb-6 sm:mb-8 text-center">Similar Products</h2>
        
        {/* Products Grid - Responsive columns */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {/* View More Button */}
        <div className="mt-6 xs:mt-8 sm:mt-10 text-center">
          <button className="inline-flex items-center px-4 xs:px-5 py-2 xs:py-2.5 border border-gray-300 rounded-md shadow-sm text-xs xs:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            View More Products
          </button>
        </div>
      </div>
      
      {/* Lazy load Services with a loading fallback */}
      <Suspense fallback={
        <div className="max-w-7xl mx-auto mt-6 xs:mt-8 sm:mt-10 bg-white rounded-lg shadow-md p-4 xs:p-6">
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 xs:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="h-8 xs:h-10 sm:h-12 w-8 xs:w-10 sm:w-12 bg-gray-200 rounded-full animate-pulse mb-2 xs:mb-3 sm:mb-4"></div>
                <div className="h-3 xs:h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-1 xs:mb-2"></div>
                <div className="h-2 xs:h-3 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        </div>
      }>
        <Services />
      </Suspense>
    </div>
  );
};

export default memo(SimilarProduct);