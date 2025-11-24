"use client";
import ProductCard from "@/features/product/ProductCard";
import { LeatherBycategory } from "@/service/productService";
import { useParams, useSearchParams } from "next/navigation";
import React, {
  memo,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiHome } from "react-icons/fi";
import HandbagFilterSidebar from "@/features/product/HangBagFilter";

// Create a component that uses useSearchParams and wrap it in Suspense
const SearchParamsWrapper = ({ children }) => {
  const searchParams = useSearchParams();
  return children(searchParams);
};

// Main component without useSearchParams
const PageContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState({
    products: [],
    totalPages: 0,
    currentPage: 1,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);
  const [searchParamsState, setSearchParamsState] = useState(null);
  
  const { category, subcategory } = useParams();
  const productsSectionRef = useRef(null);

  const productsPerPage = 16;

  // Updated active filters structure for handbags
  const [activeFilters, setActiveFilters] = useState({
    subCategory: [],
    brand: [],
    color: [],
    material: [],
    condition: [],
    priceRange: { min: 0, max: 100000 },
    gender: [],
    hardware: [],
    interiorMaterial: [],
    availability: []
  });

  // ✅ CORRECTED: Update URL with current filters and pagination
  const updateURL = useCallback((filters, page, sort) => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams();

    // Add all filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "priceRange" && value) {
        if (value.min > 0) params.set("minPrice", value.min.toString());
        if (value.max < 100000) params.set("maxPrice", value.max.toString());
      } else if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => params.append(key, v));
      }
    });

    // Add pagination and sort
    params.set("page", page.toString());
    if (sort && sort !== "featured") {
      params.set("sortBy", sort);
    }

    // Update URL without page reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, []);

  // Build API parameters from active filters
  const buildApiParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: productsPerPage,
      // Add your specific filter parameters here based on your API
      brand: activeFilters.brand,
      subCategory: activeFilters.subCategory,
      color: activeFilters.color,
      material: activeFilters.material,
      condition: activeFilters.condition,
      gender: activeFilters.gender,
      availability: activeFilters.availability,
      minPrice: activeFilters.priceRange?.min,
      maxPrice: activeFilters.priceRange?.max
    };

    // Add category from URL if available
    if (category) {
      params.category = [category];
    }

    // Add sort option
    if (sortOption && sortOption !== "featured") {
      const sortMappings = {
        priceLowHigh: "price_low_high",
        priceHighLow: "price_high_low",
        newest: "newest",
        premium: "premium",
        rating: "rating",
        discount: "discount",
      };
      params.sortBy = sortMappings[sortOption] || sortOption;
    }

    console.log("Final API params for leather bags:", params);
    return params;
  }, [activeFilters, currentPage, sortOption, category, productsPerPage]);

  // Fetch products based on current filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiParams = buildApiParams();
      console.log("Fetching leather bags with params:", apiParams);

      const result = await LeatherBycategory("Bag", apiParams);

      if (result.error) {
        throw new Error(result.error.message || "Failed to fetch leather bags");
      }

      if (result.data) {
        console.log(
          "Leather bags fetched successfully:",
          result.data.products.length
        );
        setProducts(result.data);
      }
    } catch (err) {
      console.error("Error fetching leather bags:", err);
      setError("Failed to load leather bags. Please try again later.");
    } finally {
      setLoading(false);
      setShouldApplyFilters(false);
    }
  }, [buildApiParams]);

  // Initialize filters from URL on component mount
  useEffect(() => {
    if (!searchParamsState) return;

    const initialFilters = { 
      subCategory: [],
      brand: [],
      color: [],
      material: [],
      condition: [],
      priceRange: { min: 0, max: 100000 },
      gender: [],
      hardware: [],
      interiorMaterial: [],
      availability: []
    };
    let hasURLFilters = false;

    const filterKeys = [
      "subCategory",
      "brand",
      "color",
      "material",
      "condition",
      "gender",
      "hardware",
      "interiorMaterial",
      "availability"
    ];

    filterKeys.forEach((key) => {
      const values = searchParamsState.getAll(key);
      if (values.length > 0) {
        initialFilters[key] = values;
        hasURLFilters = true;
      }
    });

    // Handle price range
    const minPrice = searchParamsState.get("minPrice");
    const maxPrice = searchParamsState.get("maxPrice");
    if (minPrice || maxPrice) {
      initialFilters.priceRange = {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 100000,
      };
      hasURLFilters = true;
    }

    // Handle sort option
    const urlSortOption = searchParamsState.get("sortBy");
    if (urlSortOption) {
      setSortOption(urlSortOption);
    }

    // Handle page
    const urlPage = searchParamsState.get("page");
    if (urlPage) {
      setCurrentPage(parseInt(urlPage));
    }

    if (hasURLFilters) {
      setActiveFilters(initialFilters);
    }
  }, [searchParamsState]);

  // Fetch products when filters, page, or sort change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update URL when filters change
  useEffect(() => {
    updateURL(activeFilters, currentPage, sortOption);
  }, [activeFilters, currentPage, sortOption, updateURL]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  // Extract unique values for dynamic filters
  const brands = useMemo(() => {
    return [...new Set(products.products?.map(p => p.brand).filter(Boolean))];
  }, [products.products]);

  const subCategories = useMemo(() => {
    return [...new Set(products.products?.flatMap(p => p.categories || []).filter(Boolean))];
  }, [products.products]);

  const colors = useMemo(() => {
    return [...new Set(products.products?.map(p => p.color).filter(Boolean))];
  }, [products.products]);

  const materials = useMemo(() => {
    return [...new Set(products.products?.map(p => p.material).filter(Boolean))];
  }, [products.products]);

  // Toggle filter function for HandbagFilterSidebar
  const toggleFilter = useCallback((filterType, value) => {
    setCurrentPage(1); // Reset to first page when filters change

    setActiveFilters(prev => {
      // Handle price range separately
      if (filterType === 'priceRange') {
        return {
          ...prev,
          priceRange: value
        };
      }
      
      // Handle array-based filters
      if (Array.isArray(prev[filterType])) {
        const currentArray = prev[filterType];
        const updatedArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        
        return {
          ...prev,
          [filterType]: updatedArray
        };
      }
      
      return prev;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      subCategory: [],
      brand: [],
      color: [],
      material: [],
      condition: [],
      priceRange: { min: 0, max: 100000 },
      gender: [],
      hardware: [],
      interiorMaterial: [],
      availability: []
    });
    setCurrentPage(1);
    setShouldApplyFilters(true);
  }, []);

  const applyFilters = useCallback(() => {
    setMobileFiltersOpen(false);
    setShouldApplyFilters(true);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Filter products based on active filters
  const filteredProducts = useMemo(() => {
    if (!products.products?.length) return [];
    
    return products.products.filter(product => {
      // Sub Category filter
      if (activeFilters.subCategory.length > 0) {
        const productCategories = product.categories || [];
        if (!activeFilters.subCategory.some(subCat => 
          productCategories.includes(subCat)
        )) return false;
      }

      // Brand filter
      if (activeFilters.brand.length > 0 && product.brand) {
        if (!activeFilters.brand.includes(product.brand)) return false;
      }

      // Color filter
      if (activeFilters.color.length > 0 && product.color) {
        if (!activeFilters.color.includes(product.color)) return false;
      }

      // Material filter
      if (activeFilters.material.length > 0 && product.material) {
        if (!activeFilters.material.includes(product.material)) return false;
      }

      // Condition filter
      if (activeFilters.condition.length > 0 && product.condition) {
        if (!activeFilters.condition.includes(product.condition)) return false;
      }

      // Gender filter
      if (activeFilters.gender.length > 0 && product.gender) {
        if (!activeFilters.gender.includes(product.gender)) return false;
      }

      // Price range filter
      if (activeFilters.priceRange && product.price) {
        const productPrice = parseFloat(product.price);
        if (productPrice < activeFilters.priceRange.min || 
            productPrice > activeFilters.priceRange.max) {
          return false;
        }
      }

      // Availability filter
      if (activeFilters.availability.length > 0) {
        if (activeFilters.availability.includes('In Stock') && !product.inStock) {
          return false;
        }
        if (activeFilters.availability.includes('Sold Out') && product.inStock) {
          return false;
        }
      }

      return true;
    });
  }, [products.products, activeFilters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!filteredProducts.length) return [];

    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case "priceLowHigh":
          return parseFloat(a.price || 0) - parseFloat(b.price || 0);
        case "priceHighLow":
          return parseFloat(b.price || 0) - parseFloat(a.price || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "discount":
          return parseFloat(b.discount || 0) - parseFloat(a.discount || 0);
        case "newest":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "premium":
          return (b.isPremium || 0) - (a.isPremium || 0);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  // Calculate display range for pagination
  const getDisplayRange = useCallback(() => {
    const startItem = (currentPage - 1) * productsPerPage + 1;
    const endItem = Math.min(
      currentPage * productsPerPage,
      products.totalProducts || 0
    );
    return { startItem, endItem };
  }, [currentPage, products.totalProducts, productsPerPage]);

  const { startItem, endItem } = getDisplayRange();

  // Get active filter count for badge
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    
    // Count array filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        count += value.length;
      }
    });
    
    // Count price range if not default
    if (activeFilters.priceRange && 
        (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 100000)) {
      count += 1;
    }
    
    return count;
  }, [activeFilters]);

  return (
    <div className="bg-[#f8f5f2] min-h-screen">
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 xs:py-5 sm:py-6 md:py-8 lg:py-10">
        
        {/* Breadcrumbs */}
        <nav className="flex mb-4 xs:mb-5 sm:mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-2 text-sm xs:text-base">
            <li className="inline-flex items-center">
              <FiHome className="w-4 h-4 mr-2 text-gray-600" />
              <a
                href="/"
                className="inline-flex items-center font-bold text-gray-900 hover:text-[#8b6b4a] transition-colors duration-200"
              >
                Home
              </a>
            </li>
            {category && (
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-700 capitalize">Leather Bags</span>
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
          className="md:hidden flex items-center gap-2 mb-4 xs:mb-5 text-gray-700 text-sm xs:text-base px-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Open filters"
        >
          <FiFilter className="h-4 w-4 xs:h-5 xs:w-5" />
          <span className="font-medium">Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="bg-[#8b6b4a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>

        <div className="flex flex-col md:flex-row gap-6 xs:gap-7 sm:gap-8">
          {/* Handbag Filter Sidebar */}
          <aside className="md:w-72 lg:w-80">
            <HandbagFilterSidebar
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              clearAllFilters={clearAllFilters}
              applyFilters={applyFilters}
              // Pass dynamic data
              brands={brands}
              subCategories={subCategories}
              colors={colors}
              materials={materials}
            />
          </aside>

          {/* Products Section */}
          <main className="flex-1 min-w-0" ref={productsSectionRef}>
            {/* Header Section */}
            {!loading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 xs:p-5 sm:p-6 mb-5 xs:mb-6 sm:mb-7">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 xs:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-0">
                      {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Leather Bags` : 'Leather Bags'}
                      {subcategory && ` / ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`}
                    </h1>
                    <p className="text-sm xs:text-base font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                      {products.totalProducts || 0} {products.totalProducts === 1 ? "leather bag" : "leather bags"} found
                    </p>
                  </div>
                  
                  {/* Enhanced Sort Filter */}
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="sort"
                      className="text-sm xs:text-base font-semibold text-gray-700 whitespace-nowrap"
                    >
                      Sort by:
                    </label>
                    <div className="relative flex-1 min-w-[180px]">
                      <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm xs:text-base focus:border-[#8b6b4a] focus:ring-2 focus:ring-[#8b6b4a] focus:ring-opacity-20 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                        aria-label="Sort leather bags"
                      >
                        <option value="featured">Featured</option>
                        <option value="premium">Premium Quality</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                        <option value="discount">Best Discount</option>
                        <option value="newest">Newest Arrivals</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <FiChevronLeft className="h-4 w-4 text-gray-400 transform -rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {getActiveFilterCount() > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Active filters:</span>
                      
                      {/* Display array filters */}
                      {Object.entries(activeFilters).map(([type, values]) => {
                        if (Array.isArray(values) && values.length > 0) {
                          return values.map((val) => (
                            <span
                              key={`${type}-${val}`}
                              className="inline-flex items-center rounded-full  bg-opacity-10 px-3 py-1.5 text-sm font-medium text-[#8b6b4a]"
                            >
                              {val}
                              <button
                                type="button"
                                className="ml-2 hover:text-[#6a4f36] transition-colors duration-200"
                                onClick={() => toggleFilter(type, val)}
                                aria-label={`Remove ${val} filter`}
                              >
                                <FiX className="h-3 w-3" />
                              </button>
                            </span>
                          ));
                        }
                        return null;
                      })}
                      
                      {/* Display price range filter if active */}
                      {activeFilters.priceRange && 
                       (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 100000) && (
                        <span className="inline-flex items-center rounded-full bg-[#8b6b4a] bg-opacity-10 px-3 py-1.5 text-sm font-medium text-[#8b6b4a]">
                          AED {activeFilters.priceRange.min.toLocaleString()} - AED {activeFilters.priceRange.max.toLocaleString()}
                          <button
                            type="button"
                            className="ml-2 hover:text-[#6a4f36] transition-colors duration-200"
                            onClick={() => toggleFilter('priceRange', { min: 0, max: 100000 })}
                            aria-label="Remove price range filter"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </span>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-3 xs:p-4 animate-pulse shadow-sm border border-gray-100"
                  >
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 xs:mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 xs:mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12 xs:py-16 sm:py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <FiX className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl xs:text-2xl font-bold text-gray-900 mb-2">
                    Error Loading Leather Bags
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm xs:text-base">{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="px-6 py-3 text-sm xs:text-base font-semibold rounded-lg bg-[#8b6b4a] text-white hover:bg-[#6a4f36] transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.products?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
                  <Suspense
                    fallback={
                      <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 lg:gap-6">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-xl p-3 xs:p-4 animate-pulse shadow-sm border border-gray-100"
                          >
                            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 xs:mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2 xs:mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    }
                  >
                    {sortedProducts.map((product) => (
                      <div key={product._id} className="flex justify-center">
                        <ProductCard 
                          product={product} 
                          className="w-full max-w-[280px] mx-auto"
                        />
                      </div>
                    ))}
                  </Suspense>
                </div>

                {/* Pagination */}
                {products.totalPages > 1 && (
                  <MobileResponsivePagination
                    currentPage={currentPage}
                    totalPages={products.totalPages || 1}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              !loading &&
              !error && (
                <div className="text-center py-12 xs:py-16 sm:py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiX className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl xs:text-2xl font-bold text-gray-900 mb-2">
                      No leather bags found
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm xs:text-base">
                      Try adjusting your search or filter criteria to find premium leather bags.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 text-sm xs:text-base font-semibold rounded-lg bg-[#8b6b4a] text-white hover:bg-[#6a4f36] transition-colors duration-200 shadow-sm hover:shadow-md"
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

// Mobile Responsive Pagination Component (keep the same as before)
const MobileResponsivePagination = memo(
  ({ currentPage, totalPages, onPageChange }) => {
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
      <div className="mt-8 sm:mt-10">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
              isFirstPage
                ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md"
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
                        ? "bg-[#8b6b4a] text-white border-[#8b6b4a] shadow-md"
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
                : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md"
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
                  : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md"
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
                  : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md"
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
                      <span className="px-3 py-1 text-base text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => onPageChange(page)}
                        className={`flex items-center justify-center min-w-10 h-10 px-3 text-base font-medium rounded-lg border transition-all duration-200 ${
                          currentPage === page
                            ? "bg-[#8b6b4a] text-white border-[#8b6b4a] shadow-md"
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
  }
);

MobileResponsivePagination.displayName = "MobileResponsivePagination";

// Main page component with Suspense boundary
const Page = () => {
  return (
    <Suspense 
      fallback={
        <div className="bg-[#f8f5f2] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b6b4a] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leather bags...</p>
          </div>
        </div>
      }
    >
      <SearchParamsWrapper>
        {(searchParams) => <PageContent searchParams={searchParams} />}
      </SearchParamsWrapper>
    </Suspense>
  );
};

export default Page;