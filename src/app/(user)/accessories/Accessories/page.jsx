"use client";

import React, {
  useState,
  useMemo,
  Suspense,
  useEffect,
  useCallback,
} from "react";
import { useParams, useSearchParams } from "next/navigation";
import ProductCard from "@/features/product/ProductCard";
import AccessoriesFilterSidebar from "../../../../features/product/HangBagFilter";
import { getAllAccessories } from "../../../../service/productService";
import {
  FiFilter,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiGrid,
  FiList,
  FiSearch,
  FiArrowUp,
} from "react-icons/fi";

// SearchParamsWrapper component to handle suspense
const SearchParamsWrapper = ({ children }) => {
  const searchParams = useSearchParams();
  return children(searchParams);
};

// Main content component that uses searchParams
const PageContent = ({ searchParams }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState({
    products: [],
    totalPages: 0,
    currentPage: 1,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const productsPerPage = 12;

  // Initialize active filters
  const [activeFilters, setActiveFilters] = useState({
    subcategory: [],
    brand: [],
    color: [],
    material: [],
    condition: [],
    gender: [],
    priceRange: null,
  });

  // Extract dynamic filter options from products
  const categories = useMemo(() => {
    const productCategories = products.products
      .map((p) => p.category)
      .filter(Boolean);
    return productCategories.length > 0
      ? [...new Set(productCategories)]
      : [
          "Watch Straps",
          "Watch Bands",
          "Bracelets",
          "Watch Boxes",
          "Winder Boxes",
          "Tools",
          "Cleaning Kits",
          "Watch Cases",
        ];
  }, [products.products]);

  const brands = useMemo(() => {
    const productBrands = products.products.map((p) => p.brand).filter(Boolean);
    return productBrands.length > 0
      ? [...new Set(productBrands)]
      : [
          "Rolex",
          "Omega",
          "Patek Philippe",
          "Audemars Piguet",
          "Tag Heuer",
          "Breitling",
          "Cartier",
          "IWC",
          "Hublot",
          "Panerai",
        ];
  }, [products.products]);

  const colors = useMemo(() => {
    const productColors = products.products.map((p) => p.color).filter(Boolean);
    return productColors.length > 0
      ? [...new Set(productColors)]
      : [
          "Black",
          "Brown",
          "Blue",
          "Green",
          "Red",
          "White",
          "Gray",
          "Gold",
          "Silver",
          "Beige",
        ];
  }, [products.products]);

  const materials = useMemo(() => {
    const productMaterials = products.products
      .map((p) => p.material)
      .filter(Boolean);
    return productMaterials.length > 0
      ? [...new Set(productMaterials)]
      : [
          "Leather",
          "Metal",
          "Stainless Steel",
          "Rubber",
          "Nylon",
          "Silicone",
          "Carbon Fiber",
          "Alligator",
          "Crocodile",
          "Canvas",
        ];
  }, [products.products]);

  const genders = useMemo(() => {
    return ["Men", "Women", "Unisex"];
  }, []);

  const conditions = useMemo(() => {
    return ["New", "Used", "Refurbished"];
  }, []);

  // Update URL with current filters and pagination
  const updateURL = useCallback((filters, page, sort, search = "") => {
    const params = new URLSearchParams();

    // Add all filters to URL
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "priceRange" && value) {
        if (value.min) params.set("minPrice", value.min);
        if (value.max) params.set("maxPrice", value.max);
      } else if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => params.append(key, v));
      }
    });

    // Add pagination, sort, and search
    params.set("page", page.toString());
    params.set("sortBy", sort);
    if (search) {
      params.set("search", search);
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
      published: true,
    };

    // Add search query if exists
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    // Add active filters
    Object.keys(activeFilters).forEach((key) => {
      if (key === "priceRange" && activeFilters[key]) {
        params.minPrice = activeFilters[key].min;
        params.maxPrice = activeFilters[key].max;
      } else if (
        Array.isArray(activeFilters[key]) &&
        activeFilters[key].length > 0
      ) {
        // Map frontend filter keys to backend field names
        const fieldMappings = {
          subcategory: "subcategory",
          brand: "brand",
          color: "color",
          material: "material",
          condition: "condition",
          gender: "gender",
        };

        const backendField = fieldMappings[key] || key;
        params[backendField] = activeFilters[key];
      }
    });

    // Add sort option
    if (sortOption && sortOption !== "newest") {
      const sortMappings = {
        price_low_high: "price_asc",
        price_high_low: "price_desc",
        newest: "newest",
        name_asc: "name_asc",
        name_desc: "name_desc",
      };
      params.sortBy = sortMappings[sortOption] || "newest";
    }

    return params;
  }, [activeFilters, currentPage, sortOption, productsPerPage, searchQuery]);

  // Fetch all accessories based on current filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiParams = buildApiParams();

      const result = await getAllAccessories(apiParams);

      if (result?.error) {
        throw new Error(result.error.message || "Failed to fetch accessories");
      }

      if (result?.data) {
        setProducts(result.data);
      } else if (result?.products) {
        // Handle case where API returns products directly
        setProducts({
          products: result.products || [],
          totalPages: result.totalPages || 0,
          currentPage: result.currentPage || 1,
          totalProducts: result.totalProducts || 0,
        });
      } else {
        throw new Error("No data received from API");
      }
    } catch (err) {
      console.error("Error fetching accessories:", err);
      setError(
        err.message || "Failed to load accessories. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [buildApiParams]);

  // Initialize filters from URL on component mount
  useEffect(() => {
    const initialFilters = { ...activeFilters };
    let hasURLFilters = false;

    const filterKeys = [
      "subcategory",
      "brand",
      "color",
      "material",
      "condition",
      "gender",
    ];

    filterKeys.forEach((key) => {
      const values = searchParams.getAll(key);
      if (values.length > 0) {
        initialFilters[key] = values;
        hasURLFilters = true;
      }
    });

    // Handle price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      initialFilters.priceRange = {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 5000,
      };
      hasURLFilters = true;
    }

    // Handle page from URL
    const urlPage = searchParams.get("page");
    if (urlPage && !isNaN(parseInt(urlPage))) {
      setCurrentPage(parseInt(urlPage));
    }

    // Handle sort from URL
    const urlSort = searchParams.get("sortBy");
    if (urlSort) {
      setSortOption(urlSort);
    }

    // Handle search from URL
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }

    if (hasURLFilters) {
      setActiveFilters(initialFilters);
    }

    // Fetch products after initializing from URL
    fetchProducts();
  }, [searchParams]);

  // Debounced fetch when filters, page, sort, or search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, sortOption, activeFilters, searchQuery]);

  // Update URL when filters change
  useEffect(() => {
    updateURL(activeFilters, currentPage, sortOption, searchQuery);
  }, [activeFilters, currentPage, sortOption, searchQuery, updateURL]);

  // Handle scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle filter changes
  const toggleFilter = useCallback((type, value, clear = false) => {
    setCurrentPage(1); // Reset to first page when filters change

    if (clear) {
      setActiveFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[type];
        return newFilters;
      });
      return;
    }

    if (type === "priceRange") {
      setActiveFilters((prev) => ({
        ...prev,
        priceRange: value,
      }));
      return;
    }

    setActiveFilters((prev) => {
      const currentValues = prev[type] || [];
      let updated;

      if (currentValues.includes(value)) {
        updated = currentValues.filter((v) => v !== value);
      } else {
        updated = [...currentValues, value];
      }

      if (updated.length === 0) {
        const newFilters = { ...prev };
        delete newFilters[type];
        return newFilters;
      }

      return {
        ...prev,
        [type]: updated,
      };
    });
  }, []);

  // Handle search
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      setCurrentPage(1);
      fetchProducts();
    },
    [fetchProducts]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      subcategory: [],
      brand: [],
      color: [],
      material: [],
      condition: [],
      gender: [],
      priceRange: null,
    });
    setSearchQuery("");
    setCurrentPage(1);
  }, []);

  // Apply filters (for mobile)
  const applyFilters = useCallback(() => {
    setMobileFiltersOpen(false);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;

    Object.keys(activeFilters).forEach((key) => {
      if (key === "priceRange") {
        if (activeFilters[key] !== null) count++;
      } else if (
        Array.isArray(activeFilters[key]) &&
        activeFilters[key].length > 0
      ) {
        count += activeFilters[key].length;
      }
    });
    return count;
  }, [activeFilters, searchQuery]);

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

  return (
    <div className="bg-[#f8f5f2] min-h-screen relative">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-[#8b6b4a] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#6a4f36] transition-all duration-200 active:scale-95"
          aria-label="Scroll to top"
        >
          <FiArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        {/* Mobile Header - Sticky on mobile */}
        <div className="sticky top-0 z-40 bg-[#f8f5f2] pt-3 pb-3 sm:pt-0 sm:pb-0 sm:relative">
          {/* Breadcrumbs - Mobile Optimized */}
          <nav className="flex mb-3 sm:mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap text-xs sm:text-sm">
              <li className="flex items-center">
                <a
                  href="/"
                  className="inline-flex items-center font-medium text-gray-700 hover:text-[#8b6b4a] transition-colors duration-200"
                >
                  <FiHome className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden xs:inline">Home</span>
                </a>
              </li>
              <li className="flex items-center">
                <span className="mx-1 text-gray-400">/</span>
                <span className="text-gray-900 font-semibold truncate max-w-[120px] xs:max-w-none">
                  All Accessories
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar - Hidden on mobile, shown via drawer */}
          <aside className="hidden lg:block lg:w-64 xl:w-72">
            <AccessoriesFilterSidebar
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              clearAllFilters={clearAllFilters}
              applyFilters={applyFilters}
              categories={categories}
              brands={brands}
              colors={colors}
              materials={materials}
              genders={genders}
              conditions={conditions}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          </aside>

          {/* Products Section */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            {!loading && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-0">
                      All Accessories
                    </h1>
                    <div className="flex items-center gap-2">
                      <p className="text-sm sm:text-base font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                        {products.totalProducts || 0}{" "}
                        {products.totalProducts === 1 ? "item" : "items"}
                      </p>
                      {products.totalProducts > 0 && (
                        <p className="text-xs sm:text-sm text-gray-500">
                          Showing {startItem}-{endItem}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Desktop Controls */}
                  <div className="hidden sm:flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === "grid"
                            ? "bg-[#8b6b4a] text-white"
                            : "text-gray-600 hover:text-[#8b6b4a]"
                        }`}
                        aria-label="Grid view"
                      >
                        <FiGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          viewMode === "list"
                            ? "bg-[#8b6b4a] text-white"
                            : "text-gray-600 hover:text-[#8b6b4a]"
                        }`}
                        aria-label="List view"
                      >
                        <FiList className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sort Filter */}
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="sort"
                        className="text-sm font-semibold text-gray-700 whitespace-nowrap"
                      >
                        Sort by:
                      </label>
                      <div className="relative min-w-[180px]">
                        <select
                          id="sort"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-sm focus:border-[#8b6b4a] focus:ring-2 focus:ring-[#8b6b4a] focus:ring-opacity-20 transition-all duration-200 appearance-none cursor-pointer shadow-sm hover:shadow-md"
                          aria-label="Sort accessories"
                        >
                          <option value="newest">Newest Arrivals</option>
                          <option value="price_low_high">
                            Price: Low to High
                          </option>
                          <option value="price_high_low">
                            Price: High to Low
                          </option>
                          <option value="name_asc">Name: A to Z</option>
                          <option value="name_desc">Name: Z to A</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <FiChevronLeft className="h-4 w-4 text-gray-400 transform -rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        Active filters:
                      </span>
                      {searchQuery.trim() && (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-[#8b6b4a]">
                          Search: {searchQuery}
                          <button
                            type="button"
                            className="ml-2 hover:text-[#6a4f36] transition-colors duration-200"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </span>
                      )}
                      {Object.entries(activeFilters).map(([type, values]) => {
                        if (type === "priceRange" && values) {
                          return (
                            <span
                              key="price-range"
                              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-[#8b6b4a]"
                            >
                              AED {values.min} - AED {values.max}
                              <button
                                type="button"
                                className="ml-2 hover:text-[#6a4f36] transition-colors duration-200"
                                onClick={() =>
                                  toggleFilter("priceRange", null, true)
                                }
                                aria-label="Remove price filter"
                              >
                                <FiX className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        }

                        if (Array.isArray(values) && values.length > 0) {
                          return values.map((val) => (
                            <span
                              key={`${type}-${val}`}
                              className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-[#8b6b4a]"
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
                      <button
                        onClick={clearAllFilters}
                        className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline whitespace-nowrap transition-colors duration-200 ml-2"
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
              <div
                className={`grid gap-4 sm:gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {[...Array(productsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-xl p-4 animate-pulse shadow-sm border border-gray-100 ${
                      viewMode === "list" ? "flex gap-4" : ""
                    }`}
                  >
                    <div
                      className={`bg-gray-200 rounded-lg ${
                        viewMode === "list"
                          ? "w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0"
                          : "h-48 sm:h-56 mb-4"
                      }`}
                    ></div>
                    <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="max-w-md mx-auto px-4">
                  <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <FiX className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Error Loading Accessories
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={fetchProducts}
                    className="px-6 py-3 text-sm font-semibold rounded-lg bg-[#8b6b4a] text-white hover:bg-[#6a4f36] transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.products?.length > 0 ? (
              <>
                <div
                  className={`gap-4 sm:gap-6 lg:gap-8 ${
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "flex flex-col gap-6 sm:gap-8"
                  }`}
                >
                  {products.products.map((product) => (
                    <div
                      key={product._id}
                      className={
                        viewMode === "list"
                          ? "bg-white rounded-xl shadow-sm border border-gray-100"
                          : ""
                      }
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {products.totalPages > 1 && (
                  <MobileResponsivePagination
                    currentPage={currentPage}
                    totalPages={products.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              !loading &&
              !error && (
                <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto px-4">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiSearch className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No accessories found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search or filter criteria to find more
                      accessories.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="px-6 py-3 text-sm font-semibold rounded-lg bg-[#8b6b4a] text-white hover:bg-[#6a4f36] transition-colors duration-200 shadow-sm hover:shadow-md"
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

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto animate-slideIn">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Close filters"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Active Filters Count */}
              {activeFilterCount > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    {activeFilterCount} active filter
                    {activeFilterCount !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Filter Content */}
            <div className="p-4">
              <AccessoriesFilterSidebar
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                mobileFiltersOpen={mobileFiltersOpen}
                setMobileFiltersOpen={setMobileFiltersOpen}
                clearAllFilters={clearAllFilters}
                applyFilters={applyFilters}
                categories={categories}
                brands={brands}
                colors={colors}
                materials={materials}
                genders={genders}
                conditions={conditions}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                isMobile={true}
              />
            </div>

            {/* Mobile Filter Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 py-3 px-4 bg-[#8b6b4a] text-white font-semibold rounded-xl hover:bg-[#6a4f36] transition-colors duration-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];

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
    <div className="mt-8 sm:mt-12">
      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 ${
            isFirstPage
              ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
              : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md active:scale-95"
          }`}
          aria-label="Previous page"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-2">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`flex items-center justify-center w-10 h-10 text-sm font-semibold rounded-xl border transition-all duration-200 ${
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
          className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 ${
            isLastPage
              ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
              : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md active:scale-95"
          }`}
          aria-label="Next page"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          {/* Previous Button */}
          <button
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-200 ${
              isFirstPage
                ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md active:scale-95"
            }`}
            aria-label="Previous page"
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>

          {/* Current Page Display */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-600">Page</span>
              <span className="text-lg font-bold text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg">
                {currentPage}
              </span>
              <span className="text-sm font-medium text-gray-600">of</span>
              <span className="text-lg font-bold text-gray-900">
                {totalPages}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {Math.min(currentPage * 12, totalPages * 12)} of {totalPages * 12}{" "}
              items
            </p>
          </div>

          {/* Next Button */}
          <button
            onClick={() => !isLastPage && onPageChange(currentPage + 1)}
            disabled={isLastPage}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl border-2 transition-all duration-200 ${
              isLastPage
                ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                : "text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md active:scale-95"
            }`}
            aria-label="Next page"
          >
            <FiChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Page Numbers for Mobile - Scrollable */}
        {totalPages > 1 && (
          <div className="mt-4">
            <div className="flex items-center justify-center space-x-2 overflow-x-auto scrollbar-hide px-2 py-2">
              {pageNumbers.map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <span className="px-2 py-1 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page)}
                      className={`flex items-center justify-center min-w-10 h-10 px-3 text-sm font-semibold rounded-xl border transition-all duration-200 ${
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
};

// Main Page component with Suspense boundary
const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-[#f8f5f2] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b6b4a] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading accessories...</p>
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
