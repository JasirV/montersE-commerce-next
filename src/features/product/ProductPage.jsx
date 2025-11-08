"use client";

import React, { useState, useMemo, Suspense, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import FilterSidebar from "./ProductFilterSidebar";
import { fetchProduct } from "../../service/productService";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiHome } from "react-icons/fi";

const ProductPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("featured");
  const [brandSearch, setBrandSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);
  const [products, setProducts] = useState({
    products: [],
    totalPages: 0,
    currentPage: 1,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ref for scroll target
  const productsSectionRef = useRef(null);

  const { category, subcategory } = useParams();
  const productsPerPage = 16; // 4 columns × 4 rows = 16 products per page

  const [activeFilters, setActiveFilters] = useState({
    category: [],
    price: [],
    brand: [],
    discount: [],
    availability: [],
    badges: [],
    gender: []
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await fetchProduct({
          page: currentPage,
          limit: productsPerPage,
          category: activeFilters.category,
          brand: activeFilters.brand,
          price: activeFilters.price,
          availability: activeFilters.availability,
          badges: activeFilters.badges,
          gender: activeFilters.gender
        });
        setProducts(
          data || {
            products: [],
            totalPages: 0,
            currentPage: 1,
            totalProducts: 0,
          }
        );
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
        setShouldApplyFilters(false);
      }
    };

    loadProducts();
  }, [currentPage, shouldApplyFilters]);

  // Smooth scroll to products section when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      gender: []
    });
    setCurrentPage(1);
    setShouldApplyFilters(true);
  };

  const categoryFilteredProducts = useMemo(() => {
    if (loading) return [];
    return products.products.filter((p) => {
      const categoriesArray = Array.isArray(p.categories)
        ? p.categories
        : [p.categories].filter(Boolean);

      const isCategoryMatch = categoriesArray.some((cat) =>
        cat?.toLowerCase()?.includes(category?.toLowerCase())
      );

      if (subcategory) {
        return (
          isCategoryMatch &&
          categoriesArray.some((cat) =>
            cat.toLowerCase().includes(subcategory.toLowerCase())
          )
        );
      }

      return isCategoryMatch;
    });
  }, [category, subcategory, products, loading]);

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    return categoryFilteredProducts.filter((p) => {
      if (
        activeFilters.category.length &&
        !activeFilters.category.includes(p.category)
      )
        return false;
      if (activeFilters.brand.length && !activeFilters.brand.includes(p.brand))
        return false;
      if (activeFilters.availability.includes("inStock") && !p.inStock)
        return false;
      if (
        activeFilters.availability.includes("fastDelivery") &&
        !p.fastDelivery
      )
        return false;
      if (
        activeFilters.rating.length &&
        p.rating < Math.min(...activeFilters.rating)
      )
        return false;
      if (
        activeFilters.badges.length &&
        (!p.badge || !activeFilters.badges.includes(p.badge))
      )
        return false;
      return true;
    });
  }, [categoryFilteredProducts, activeFilters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!sortOption) return filteredProducts;

    const result = [...filteredProducts].sort((a, b) => {
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

    return result.length > 0 ? result : products.products || [];
  }, [filteredProducts, sortOption, products]);

  const brands = useMemo(
    () => [...new Set(categoryFilteredProducts.map((p) => p.brand))],
    [categoryFilteredProducts]
  );

  // Calculate display range for pagination
  const getDisplayRange = () => {
    const startItem = (currentPage - 1) * productsPerPage + 1;
    const endItem = Math.min(
      currentPage * productsPerPage,
      products.totalProducts || 0
    );
    return { startItem, endItem };
  };

  const { startItem, endItem } = getDisplayRange();

  const applyFilters = () => {
    setCurrentPage(1);
    setShouldApplyFilters(true);
  };

  return (
    <div className="bg-[#f8f5f2] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2 text-sm">
            <li className="inline-flex items-center">
              <FiHome className="w-4 h-4 mr-2 text-gray-600" />
              <a
                href="/"
                className="inline-flex items-center font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            {category && (
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-700 capitalize">{category}</span>
              </li>
            )}
            {subcategory && (
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-700 capitalize">{subcategory}</span>
              </li>
            )}
          </ol>
        </nav>

        {/* Mobile Filter Button */}
        <button
          type="button"
          className="md:hidden flex items-center gap-2 mb-6 text-gray-700 text-sm px-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Open filters"
        >
          <FiFilter className="h-4 w-4" />
          <span className="font-medium">Filters</span>
          {Object.values(activeFilters).some(arr => arr.length > 0) && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(activeFilters).flat().length}
            </span>
          )}
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-72 lg:w-80">
            <FilterSidebar
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              brands={brands}
              brandSearch={brandSearch}
              setBrandSearch={setBrandSearch}
              clearAllFilters={clearAllFilters}
              applyFilters={applyFilters}
            />
          </aside>

          {/* Products Section with ref for scrolling */}
          <main className="flex-1 min-w-0" ref={productsSectionRef}>
            {/* Header Section */}
            {!loading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-0">
                      {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Products'}
                      {subcategory && ` / ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`}
                    </h1>
                    <p className="text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                      {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"} found
                    </p>
                  </div>
                  
                  {/* Enhanced Sort Filter */}
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="sort"
                      className="text-sm font-semibold text-gray-700 whitespace-nowrap"
                    >
                      Sort by:
                    </label>
                    <div className="relative flex-1 min-w-[180px]">
                      <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-20 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                        aria-label="Sort products"
                      >
                        <option value="featured">Featured</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="discount">Best Discount</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <FiChevronLeft className="h-4 w-4 text-gray-400 transform -rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {Object.values(activeFilters).some((arr) => arr.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Active filters:</span>
                      {Object.entries(activeFilters).map(([type, values]) =>
                        values.map((val) => (
                          <span
                            key={`${type}-${val}`}
                            className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800"
                          >
                            {val}
                            <button
                              type="button"
                              className="ml-2 hover:text-blue-600 transition-colors duration-200"
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
                        className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline whitespace-nowrap transition-colors duration-200"
                        aria-label="Clear all filters"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(productsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 animate-pulse shadow-sm border border-gray-100"
                  >
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid - 4 columns layout */}
            {!loading && products.products?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  <Suspense
                    fallback={
                      <div className="col-span-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(productsPerPage)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-xl p-4 animate-pulse shadow-sm border border-gray-100"
                          >
                            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    }
                  >
                    {products.products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </Suspense>
                </div>

                {/* Pagination */}
                <MobileResponsivePagination
                  currentPage={currentPage}
                  totalPages={products.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              !loading && (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiX className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm">
                      Try adjusting your search or filter criteria.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                      aria-label="Clear all filters"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Mobile Responsive Pagination Component
const MobileResponsivePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = generatePageNumbers();
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="mt-8">
      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
            isFirstPage
              ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
              : "text-gray-700 bg-white border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
          }`}
          aria-label="Previous page"
        >
          <FiChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-2">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-1 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => !isLastPage && onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
            isLastPage
              ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
              : "text-gray-700 bg-white border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
          }`}
          aria-label="Next page"
        >
          <FiChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          {/* Previous Button */}
          <button
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-200 ${
              isFirstPage
                ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                : "text-gray-700 bg-white border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
            }`}
            aria-label="Previous page"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>

          {/* Current Page Display */}
          <div className="flex items-center space-x-3">
            <span className="text-base font-medium text-gray-600">Page</span>
            <span className="text-lg font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
              {currentPage}
            </span>
            <span className="text-base font-medium text-gray-600">of</span>
            <span className="text-lg font-bold text-gray-900">
              {totalPages}
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => !isLastPage && onPageChange(currentPage + 1)}
            disabled={isLastPage}
            className={`flex items-center justify-center w-12 h-12 rounded-xl border-2 transition-all duration-200 ${
              isLastPage
                ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                : "text-gray-700 bg-white border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md"
            }`}
            aria-label="Next page"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Page Numbers for Mobile - Scrollable */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide max-w-full px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
              {pageNumbers.map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="px-3 py-1 text-base text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page)}
                      className={`flex items-center justify-center min-w-10 h-10 px-3 text-base font-medium rounded-lg border transition-all duration-200 ${
                        currentPage === page
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md"
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;