"use client";
import ProductCard from "@/features/product/ProductCard";
import { getBrandsBaeWatchs } from "@/service/productService";
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
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiHome, FiClock } from "react-icons/fi";
import HandbagFilterSidebar from "@/features/product/HangBagFilter";

// Create a component that uses useSearchParams and wrap it in Suspense
const SearchParamsWrapper = ({ children }) => {
  const searchParams = useSearchParams();
  return children(searchParams);
};

// Main component without useSearchParams
const PageContent = ({ searchParams }) => {
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
  
  const { brand } = useParams();
  
  const productsSectionRef = useRef(null);
  const productsPerPage = 16;

  // Active filters structure
  const [activeFilters, setActiveFilters] = useState({
    subCategory: [],
    brand: [],
    color: [],
    material: [],
    leatherType: [],
    size: [],
    condition: [],
    priceRange: { min: 0, max: 10000 },
    gender: [],
    hardware: [],
    interiorMaterial: [],
    availability: []
  });

  // Format brand name for display
  const formattedBrandName = useMemo(() => {
    if (!brand) return '';
    const decoded = decodeURIComponent(brand);
    return decoded.charAt(0).toUpperCase() + decoded.slice(1).toLowerCase();
  }, [brand]);

  // Update URL with current filters and pagination
  const updateURL = useCallback((filters, page, sort) => {
    if (typeof window === 'undefined') return;
    
    const params = new URLSearchParams();

    // Add all filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "priceRange" && value) {
        if (value.min > 0) params.set("minPrice", value.min.toString());
        if (value.max < 10000) params.set("maxPrice", value.max.toString());
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
      brand: activeFilters.brand,
      subCategory: activeFilters.subCategory,
      color: activeFilters.color,
      material: activeFilters.material,
      leatherType: activeFilters.leatherType,
      size: activeFilters.size,
      condition: activeFilters.condition,
      gender: activeFilters.gender,
      availability: activeFilters.availability,
      minPrice: activeFilters.priceRange?.min > 0 ? activeFilters.priceRange.min : undefined,
      maxPrice: activeFilters.priceRange?.max < 10000 ? activeFilters.priceRange.max : undefined
    };

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

    // Clean up undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined || params[key] === null || params[key] === '') {
        delete params[key];
      }
    });

    return params;
  }, [activeFilters, currentPage, sortOption, productsPerPage]);

  // Fetch products based on current filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiParams = buildApiParams();
      
      // Use formatted brand name for API call to ensure case consistency
      const brandName = formattedBrandName;
      
      // console.log("Fetching brand watches for:", brandName);

      const result = await getBrandsBaeWatchs(brandName, apiParams);
        console.log("Fetching brand watches for:", result);
      // Check if API call was successful
      if (!result.success || result.error) {
        console.warn("API returned error:", result.error);
        setProducts({
          products: [],
          totalPages: 0,
          currentPage: 1,
          totalProducts: 0,
        });
        return;
      }

      // Extract data from the correct structure
      const responseData = result.data;
      
      if (responseData && Array.isArray(responseData.products)) {
        setProducts({
          products: responseData.products,
          totalPages: responseData.totalPages || 1,
          currentPage: responseData.currentPage || currentPage,
          totalProducts: responseData.totalProducts || 0,
        });
      } else {
        // Handle invalid data structure
        setProducts({
          products: [],
          totalPages: 0,
          currentPage: 1,
          totalProducts: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching brand watches:", err);
      setError(err.message);
      setProducts({
        products: [],
        totalPages: 0,
        currentPage: 1,
        totalProducts: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [buildApiParams, formattedBrandName, currentPage]);

  // Initialize filters from URL on component mount
  useEffect(() => {
    if (!searchParams) return;

    const initialFilters = { 
      subCategory: [],
      brand: [],
      color: [],
      material: [],
      leatherType: [],
      size: [],
      condition: [],
      priceRange: { min: 0, max: 10000 },
      gender: [],
      hardware: [],
      interiorMaterial: [],
      availability: []
    };

    const filterKeys = [
      "subCategory", "brand", "color", "material", "leatherType", 
      "size", "condition", "gender", "hardware", "interiorMaterial", "availability"
    ];

    filterKeys.forEach((key) => {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        initialFilters[key] = values;
      }
    });

    // Handle price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      initialFilters.priceRange = {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 10000,
      };
    }

    // Handle sort option
    const urlSortOption = searchParams.get("sortBy");
    if (urlSortOption) {
      setSortOption(urlSortOption);
    }

    // Handle page
    const urlPage = searchParams.get("page");
    if (urlPage) {
      const pageNum = parseInt(urlPage);
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum);
      }
    }

    setActiveFilters(initialFilters);
  }, [searchParams]);

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

  const leatherTypes = useMemo(() => {
    return [...new Set(products.products?.map(p => p.leatherType).filter(Boolean))];
  }, [products.products]);

  const sizes = useMemo(() => {
    return [...new Set(products.products?.map(p => p.size).filter(Boolean))];
  }, [products.products]);

  // Toggle filter function
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
      leatherType: [],
      size: [],
      condition: [],
      priceRange: { min: 0, max: 10000 },
      gender: [],
      hardware: [],
      interiorMaterial: [],
      availability: []
    });
    setCurrentPage(1);
  }, []);

  const applyFilters = useCallback(() => {
    setMobileFiltersOpen(false);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

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
        (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000)) {
      count += 1;
    }
    
    return count;
  }, [activeFilters]);

  // Check if we should show empty state
  const showEmptyState = useMemo(() => {
    return !loading && (!products.products || products.products.length === 0);
  }, [loading, products.products]);

  // Get total products count
  const totalProductsCount = useMemo(() => {
    return products.totalProducts || 0;
  }, [products.totalProducts]);

  return (
    <div className="bg-[#f8f5f2] min-h-screen">
      <div className="container mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-4 xs:py-5 sm:py-6 md:py-8 lg:py-10">
        
        {/* Enhanced Breadcrumbs */}
        <nav className="flex mb-4 xs:mb-5 sm:mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 xs:space-x-2 text-sm xs:text-base flex-wrap">
            <li className="inline-flex items-center">
              <a
                href="/"
                className="inline-flex items-center font-medium text-gray-600 hover:text-[#8b6b4a] transition-colors duration-200 text-xs xs:text-sm"
              >
                <FiHome className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                Home
              </a>
            </li>
            <li className="flex items-center">
              <span className="mx-1 xs:mx-2 text-gray-400">/</span>
              <a
                href="/brands"
                className="font-medium text-gray-600 hover:text-[#8b6b4a] transition-colors duration-200 text-xs xs:text-sm"
              >
                Brands
              </a>
            </li>
            {formattedBrandName && (
              <li className="flex items-center">
                <span className="mx-1 xs:mx-2 text-gray-400">/</span>
                <span className="font-semibold text-gray-900 text-xs xs:text-sm">
                  {formattedBrandName} Watches
                </span>
              </li>
            )}
          </ol>
        </nav>

        {/* Mobile Filter Button with Enhanced Badge */}
        <div className="md:hidden flex items-center justify-between mb-4 xs:mb-5">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-700 text-sm xs:text-base px-4 py-2.5 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 active:scale-95"
            onClick={() => setMobileFiltersOpen(true)}
            aria-label="Open filters"
          >
            <FiFilter className="h-4 w-4 xs:h-5 xs:w-5" />
            <span className="font-medium">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-[#8b6b4a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          {/* Mobile Results Count */}
          {!loading && (
            <div className="text-right">
              <p className="text-xs xs:text-sm font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
                {totalProductsCount.toLocaleString()} found
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 xs:gap-5 sm:gap-6 md:gap-8">
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
              leatherTypes={leatherTypes}
              sizes={sizes}
            />
          </aside>

          {/* Products Section */}
          <main className="flex-1 min-w-0" ref={productsSectionRef}>
            {/* Enhanced Header Section */}
            {!loading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 xs:p-4 sm:p-5 md:p-6 mb-4 xs:mb-5 sm:mb-6 md:mb-7">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 xs:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 md:gap-4">
                    <div className="flex items-center gap-2 xs:gap-3 mb-2 sm:mb-0">
                      <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        {formattedBrandName ? `${formattedBrandName} Watches` : 'Brand Watches'}
                      </h1>
                      {/* Total Count Badge */}
                      {totalProductsCount > 0 && (
                        <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs xs:text-sm font-semibold bg-[#8b6b4a] text-white">
                          {totalProductsCount.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    {/* Mobile Total Count */}
                    <div className="sm:hidden bg-gray-50 px-3 py-1.5 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700">
                        {totalProductsCount.toLocaleString()} {totalProductsCount === 1 ? "watch" : "watches"} found
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced Sort Filter */}
                  {totalProductsCount > 0 && (
                    <div className="flex items-center justify-between sm:justify-end gap-2 xs:gap-3">
                      <label
                        htmlFor="sort"
                        className="text-xs xs:text-sm font-semibold text-gray-700 whitespace-nowrap hidden xs:block"
                      >
                        Sort by:
                      </label>
                      <div className="relative flex-1 xs:flex-none min-w-[140px] xs:min-w-[160px] sm:min-w-[180px]">
                        <select
                          id="sort"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white py-2 xs:py-2.5 pl-3 xs:pl-4 pr-8 xs:pr-10 text-xs xs:text-sm focus:border-[#8b6b4a] focus:ring-2 focus:ring-[#8b6b4a] focus:ring-opacity-20 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                          aria-label="Sort watches"
                        >
                          <option value="featured">Featured</option>
                          <option value="premium">Premium Quality</option>
                          <option value="priceLowHigh">Price: Low to High</option>
                          <option value="priceHighLow">Price: High to Low</option>
                          <option value="rating">Top Rated</option>
                          <option value="discount">Best Discount</option>
                          <option value="newest">Newest Arrivals</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 xs:pr-3">
                          <FiChevronLeft className="h-3 w-3 xs:h-4 xs:w-4 text-gray-400 transform -rotate-90" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Filters Display */}
                {getActiveFilterCount() > 0 && (
                  <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-1 xs:gap-2">
                      <span className="text-xs xs:text-sm font-medium text-gray-600 whitespace-nowrap">
                        Active filters:
                      </span>
                      
                      {/* Display array filters */}
                      {Object.entries(activeFilters).map(([type, values]) => {
                        if (Array.isArray(values) && values.length > 0) {
                          return values.map((val) => (
                            <span
                              key={`${type}-${val}`}
                              className="inline-flex items-center rounded-full  bg-opacity-10 px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm font-medium text-[#8b6b4a]"
                            >
                              {val}
                              <button
                                type="button"
                                className="ml-1 xs:ml-2 hover:text-[#6a4f36] transition-colors duration-200"
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
                       (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000) && (
                        <span className="inline-flex items-center rounded-full  bg-opacity-10 px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm font-medium text-[#8b6b4a]">
                          AED {activeFilters.priceRange.min.toLocaleString()} - AED {activeFilters.priceRange.max.toLocaleString()}
                          <button
                            type="button"
                            className="ml-1 xs:ml-2 hover:text-[#6a4f36] transition-colors duration-200"
                            onClick={() => toggleFilter('priceRange', { min: 0, max: 10000 })}
                            aria-label="Remove price range filter"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      
                      <button
                        onClick={clearAllFilters}
                        className="text-xs xs:text-sm font-semibold text-red-600 hover:text-red-700 hover:underline whitespace-nowrap transition-colors duration-200 ml-1 xs:ml-2"
                        aria-label="Clear all filters"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Loading State */}
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-2 xs:p-3 sm:p-4 animate-pulse shadow-sm border border-gray-100"
                  >
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-2 xs:mb-3 sm:mb-4"></div>
                    <div className="h-3 xs:h-4 bg-gray-200 rounded mb-1 xs:mb-2 sm:mb-3"></div>
                    <div className="h-3 xs:h-4 bg-gray-200 rounded w-3/4 mb-1 xs:mb-2"></div>
                    <div className="h-4 xs:h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Empty State */}
            {showEmptyState && (
              <div className="text-center py-12 xs:py-16 sm:py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-20 h-20 xs:w-24 xs:h-24 mx-auto mb-4 xs:mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                    <FiClock className="w-8 h-8 xs:w-10 xs:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-3 xs:mb-4">
                    No {formattedBrandName || 'Brand'} Watches Found
                  </h3>
                  <p className="text-gray-600 mb-6 xs:mb-8 text-sm xs:text-base leading-relaxed">
                    {getActiveFilterCount() > 0 
                      ? "We couldn't find any watches matching your current filters. Try adjusting your search criteria or explore other options."
                      : `We currently don't have any ${formattedBrandName ? formattedBrandName + ' ' : ''}watches available. Check back soon for new arrivals or explore other brands.`
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {getActiveFilterCount() > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="px-6 xs:px-8 py-3 text-sm xs:text-base font-semibold rounded-lg bg-[#8b6b4a] text-white hover:bg-[#6a4f36] transition-colors duration-200 shadow-sm hover:shadow-md active:scale-95"
                        aria-label="Clear all filters"
                      >
                        Clear All Filters
                      </button>
                    )}
                    <a
                      href="/brands"
                      className="px-6 xs:px-8 py-3 text-sm xs:text-base font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow-md active:scale-95 text-center"
                    >
                      Browse All Brands
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Products Grid */}
            {!loading && !showEmptyState && products.products?.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {products.products.map((product,index) => (
                    <div key={product._id || product.id || `${product.brand}-${product.model}-${index}`} className="flex justify-center">

                      <ProductCard 
                        product={product} 
                        className="w-full max-w-[280px] mx-auto"
                      />
                    </div>
                  ))}
                </div>

                {/* Enhanced Pagination with Results Count */}
                {products.totalPages > 1 && (
                  <div className="mt-6 xs:mt-7 sm:mt-8 md:mt-10">
                    {/* Results Count */}
                    <div className="text-center mb-4 xs:mb-5">
                      <p className="text-sm xs:text-base text-gray-600 font-medium">
                        Showing <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
                        <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
                        <span className="font-semibold text-gray-900">{totalProductsCount.toLocaleString()}</span>{" "}
                        {totalProductsCount === 1 ? "watch" : "watches"}
                      </p>
                    </div>
                    
                    <MobileResponsivePagination
                      currentPage={currentPage}
                      totalPages={products.totalPages || 1}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Enhanced Mobile Responsive Pagination Component
const MobileResponsivePagination = memo(
  ({ currentPage, totalPages, onPageChange }) => {
    const generatePageNumbers = () => {
      if (totalPages <= 5) {
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
      <div className="mt-6 xs:mt-8">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-center space-x-1 xs:space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className={`flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 rounded-lg border transition-all duration-200 ${
              isFirstPage
                ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md active:scale-95"
            }`}
            aria-label="Previous page"
          >
            <FiChevronLeft className="h-3 w-3 xs:h-4 xs:w-4" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1 xs:space-x-2">
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2 xs:px-3 py-1 text-sm text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 text-xs xs:text-sm font-medium rounded-lg border transition-all duration-200 ${
                      currentPage === page
                        ? "bg-[#8b6b4a] text-white border-[#8b6b4a] shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md active:scale-95"
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
            className={`flex items-center justify-center w-8 h-8 xs:w-9 xs:h-9 rounded-lg border transition-all duration-200 ${
              isLastPage
                ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md active:scale-95"
            }`}
            aria-label="Next page"
          >
            <FiChevronRight className="h-3 w-3 xs:h-4 xs:w-4" />
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-3 xs:p-4">
            {/* Previous Button */}
            <button
              onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
              disabled={isFirstPage}
              className={`flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 rounded-xl border-2 transition-all duration-200 ${
                isFirstPage
                  ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md active:scale-95"
              }`}
              aria-label="Previous page"
            >
              <FiChevronLeft className="h-4 w-4 xs:h-5 xs:w-5" />
            </button>

            {/* Current Page Display */}
            <div className="flex items-center space-x-2 xs:space-x-3">
              <span className="text-sm xs:text-base font-medium text-gray-600">Page</span>
              <span className="text-base xs:text-lg font-bold text-gray-900 bg-gray-50 px-2 xs:px-3 py-1 rounded-lg">
                {currentPage}
              </span>
              <span className="text-sm xs:text-base font-medium text-gray-600">of</span>
              <span className="text-base xs:text-lg font-bold text-gray-900">
                {totalPages}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => !isLastPage && onPageChange(currentPage + 1)}
              disabled={isLastPage}
              className={`flex items-center justify-center w-10 h-10 xs:w-12 xs:h-12 rounded-xl border-2 transition-all duration-200 ${
                isLastPage
                  ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md active:scale-95"
              }`}
              aria-label="Next page"
            >
              <FiChevronRight className="h-4 w-4 xs:h-5 xs:w-5" />
            </button>
          </div>

          {/* Page Numbers for Mobile - Scrollable */}
          {totalPages > 1 && (
            <div className="mt-3 xs:mt-4 flex justify-center">
              <div className="flex items-center space-x-1 xs:space-x-2 overflow-x-auto scrollbar-hide max-w-full px-2 xs:px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                {pageNumbers.map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-2 xs:px-3 py-1 text-sm text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => onPageChange(page)}
                        className={`flex items-center justify-center min-w-8 h-8 xs:min-w-10 xs:h-10 px-2 xs:px-3 text-xs xs:text-sm font-medium rounded-lg border transition-all duration-200 ${
                          currentPage === page
                            ? "bg-[#8b6b4a] text-white border-[#8b6b4a] shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md active:scale-95"
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
const BrandBaeWatches = () => {
  return (
    <Suspense 
      fallback={
        <div className="bg-[#f8f5f2] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b6b4a] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading watches...</p>
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

export default BrandBaeWatches;