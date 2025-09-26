"use client";
      
import React, { useState, useMemo, memo, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import FilterSidebar from "./ProductFilterSidebar";
import { fetchProduct } from "../../service/productService";
import {
  FiFilter,
  FiX,
} from "react-icons/fi";


// Pagination component for better reusability
const Pagination = memo(({ currentPage, totalPages, setCurrentPage }) => {
  const maxVisiblePages = 5;
  
  // Calculate which page numbers to show
  const pageNumbers = useMemo(() => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-wrap justify-center gap-1 xs:gap-2">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="px-2 xs:px-3 py-1.5 text-xs xs:text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100"
        aria-label="First page"
      >
        &laquo;
      </button>
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        className="px-2 xs:px-3 py-1.5 text-xs xs:text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100"
        aria-label="Previous page"
      >
        &lsaquo;
      </button>
      
      {pageNumbers?.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-2 xs:px-3 py-1.5 text-xs xs:text-sm border rounded-md min-w-[2rem] ${
            currentPage === page
              ? "bg-[#8b6b4a] text-white"
              : "hover:bg-gray-100"
          }`}
          aria-label={`Page ${page}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-2 xs:px-3 py-1.5 text-xs xs:text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100"
        aria-label="Next page"
      >
        &rsaquo;
      </button>
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 xs:px-3 py-1.5 text-xs xs:text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100"
        aria-label="Last page"
      >
        &raquo;
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';
const ProductPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [brandSearch, setBrandSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null); // reset error
        const { data } = await fetchProduct();
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  console.log(products,"products");
  const { category, subcategory } = useParams();
  const productsPerPage = 12;

  const [activeFilters, setActiveFilters] = useState({
    category: [],
    price: [],
    brand: [],
    discount: [],
    rating: [],
    availability: [],
    badges: [],
  });

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(
  //         "https://montres-ecommerce-backend-1.onrender.com/api/products"
  //       );
  //       setProducts(response.data); // Store API products in state
  //       console.log(response.data,"response.data");
        
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  // Fixed category filtering logic - now uses API products
  const categoryFilteredProducts = useMemo(() => {
    if (loading) return [];
    
    return products?.filter((p) => {
      // First check if the main category matches
      const isCategoryMatch = p.categories && p.categories.some(cat => 
        cat?.toLowerCase()?.includes(category?.toLowerCase())
      );
      
      // If there's a subcategory in URL, check if it matches
      if (subcategory) {
        return isCategoryMatch && p.categories && p.categories.some(cat => 
          cat.toLowerCase().includes(subcategory.toLowerCase())
        );
      }
      
      // If no subcategory in URL, only check main category
      return isCategoryMatch;
    });
  }, [category, subcategory, products, loading]);

  const toggleFilter = (type, value) => {
    setActiveFilters((prev) => {
      const updated = prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      category: [],
      price: [],
      brand: [],
      discount: [],
      rating: [],
      availability: [],
      badges: [],
    });
    setCurrentPage(1);
  };

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return categoryFilteredProducts.filter((p) => {
      if (activeFilters.category.length && !activeFilters.category.includes(p.category)) return false;
      if (activeFilters.brand.length && !activeFilters.brand.includes(p.brand)) return false;
      if (activeFilters.availability.includes("inStock") && !p.inStock) return false;
      if (activeFilters.availability.includes("fastDelivery") && !p.fastDelivery) return false;
      if (activeFilters.rating.length && p.rating < Math.min(...activeFilters.rating)) return false;
      if (activeFilters.badges.length && (!p.badge || !activeFilters.badges.includes(p.badge))) return false;
      return true;
    });
  }, [categoryFilteredProducts, activeFilters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case "priceLowHigh":
          return parseFloat(a.price) - parseFloat(b.price);
        case "priceHighLow":
          return parseFloat(b.price) - parseFloat(a.price);
        case "rating":
          return b.rating - a.rating;
        case "discount":
          return parseFloat(b.discount) - parseFloat(a.discount);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  const brands = useMemo(() => [...new Set(categoryFilteredProducts.map((p) => p.brand))], [categoryFilteredProducts]);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Current page products
  const currentProducts = useMemo(() => {
    return sortedProducts.slice(
      (currentPage - 1) * productsPerPage,
      currentPage * productsPerPage
    );
  }, [sortedProducts, currentPage]);

  // Update breadcrumb to show actual category and subcategory
  // const breadcrumbText = useMemo(() => {
  //   if (subcategory) {
  //     return `${category.charAt(0).toUpperCase() + category.slice(1)} / ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`;
  //   }
  //   return `${category?.charAt(0)?.toUpperCase() + category.slice(1)}`;
  // }, [category, subcategory]);

  return (
    <div className="bg-[#f8f5f2] min-h-screen">
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 xs:py-5 sm:py-6 md:py-8 lg:py-10">
        {/* Breadcrumbs */}
        <nav className="flex mb-4 xs:mb-5 sm:mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 text-xs xs:text-sm">
            <li>
              <a href="#" className="flex items-center text-gray-700 hover:text-[#8b6b4a]">
                Home
              </a>
            </li>
            {/* <li className="text-gray-500">/ {breadcrumbText}</li> */}
          </ol>
        </nav>

        {/* Mobile Filter Button */}
        <button
          type="button"
          className="md:hidden flex items-center gap-2 mb-3 xs:mb-4 text-gray-700 text-xs xs:text-sm px-3 py-2 bg-white rounded-md shadow-sm border"
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Open filters"
        >
          <FiFilter className="h-3 xs:h-4 w-3 xs:w-4" />
          Filters
        </button>

        <div className="flex flex-col md:flex-row gap-4 xs:gap-5 sm:gap-6">
          {/* Sidebar */}
          <aside className="md:w-64 lg:w-79">
            <FilterSidebar
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              brands={brands}
              brandSearch={brandSearch}
              setBrandSearch={setBrandSearch}
              clearAllFilters={clearAllFilters}
            />
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xs:gap-4">
                {[...Array(productsPerPage)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
                    <div className="h-40 xs:h-44 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            )}
            {/* Header */}
            {!loading && (
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-4 xs:mb-5 sm:mb-6 gap-2 xs:gap-0">
              <div>
                <h2 className="text-xl xs:text-lg sm:text-lg font-bold text-[#1a1a1a] mb-1 xs:mb-2">
                  {/* {breadcrumbText} */}
                </h2>
                <p className="text-xs xs:text-sm text-gray-500">
                  {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-xs xs:text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-md border border-gray-300 py-1.5 pl-2 pr-7 text-xs xs:text-sm focus:border-[#8b6b4a] focus:ring-[#8b6b4a]"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="discount">Discount</option>
                </select>
              </div>
            </div>
            )}
            {Object.values(activeFilters).some((arr) => arr.length > 0) && (
              <div className="mb-3 xs:mb-4 flex flex-wrap gap-1 xs:gap-2">
                {Object.entries(activeFilters).map(([type, values]) =>
                  values.map((val) => (
                    <span
                      key={`${type}-${val}`}
                      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      {val}
                      <button
                        type="button"
                        className="ml-1 text-gray-400 hover:text-gray-600"
                        onClick={() => toggleFilter(type, val)}
                        aria-label={`Remove ${val} filter`}
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#8b6b4a] hover:underline whitespace-nowrap"
                  aria-label="Clear all filters"
                >
                  Clear all
                </button>
              </div>
            )}
            {/* Products Grid */}
            {products.length||error > 0 ? ( 
              <>
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xs:gap-4">
                  <Suspense fallback={
                    <div className="col-span-full grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xs:gap-4">
                      {[...Array(productsPerPage)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 animate-pulse">
                          <div className="h-40 xs:h-44 bg-gray-200 rounded mb-3"></div>
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  }>
                    {products?.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </Suspense>
                </div>

                {/* Pagination */}
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  setCurrentPage={setCurrentPage} 
                />
              </>
            ) : (
              <div className="text-center py-8 xs:py-10 sm:py-12">
                <h3 className="text-base xs:text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 xs:mt-2 text-xs xs:text-sm text-gray-500">
                  Try adjusting your search or filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-3 xs:mt-4 px-3 xs:px-4 py-1.5 xs:py-2 text-xs xs:text-sm rounded-md bg-[#8b6b4a] text-white hover:bg-[#6a4f36]"
                  aria-label="Clear all filters"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductPage);