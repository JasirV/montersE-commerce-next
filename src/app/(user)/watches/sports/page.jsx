"use client";

import React, {
  memo,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import { useParams, useSearchParams } from "next/navigation";
import ProductCard from "@/features/product/ProductCard";
import FilterSidebar from "@/features/product/WatchByFilterSidebar";
import { WatchBycategory } from "@/service/productService";
import {
  FiFilter,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiGrid,
  FiList,
} from "react-icons/fi";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState({ 
    products: [], 
    totalPages: 0, 
    currentPage: 1, 
    totalProducts: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);
  
  const searchParams = useSearchParams();
  const { category, subcategory } = useParams();
  const productsSectionRef = useRef(null);

  const productsPerPage = 16;

  // Initialize active filters with proper structure for sports watches
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    brand: [],
    model: [],
    referenceNumber: [],
    gender: [],
    availability: [],
    condition: [],
    itemCondition: [],
    scopeOfDelivery: [],
    badges: [],
    type: [],
    dialColor: [],
    strapColor: [],
    caseMaterial: [],
    strapMaterial: [],
    caseSize: [],
    movement: [],
    waterResistance: [],
    priceRange: null,
    activityType: [],
    bezelType: [],
    chronograph: [],
    luminosity: []
  });

  // Extract dynamic filter options from products with fallbacks for sports watches
  const brands = useMemo(() => {
    const productBrands = products.products.map((p) => p.brand).filter(Boolean);
    return productBrands.length > 0
      ? [...new Set(productBrands)]
      : ["Rolex", "Omega", "Tag Heuer", "Breitling", "Seiko", "Casio", "Garmin"];
  }, [products.products]);

  const models = useMemo(() => {
    const productModels = products.products.map((p) => p.model).filter(Boolean);
    return productModels.length > 0
      ? [...new Set(productModels)]
      : ["Submariner", "Seamaster", "Aquaracer", "Chronomat", "Prospex", "G-Shock"];
  }, [products.products]);

  const referenceNumbers = useMemo(() => {
    const productRefs = products.products
      .map((p) => p.referenceNumber)
      .filter(Boolean);
    return productRefs.length > 0
      ? [...new Set(productRefs)]
      : ["124060", "210.30.42.20.03.001", "WBP2010.BA0632"];
  }, [products.products]);

  const caseSizes = useMemo(() => {
    const sizes = products.products.map((p) => p.caseSize).filter(Boolean);

    if (sizes.length === 0) {
      return [
        "38-40mm",
        "41-42mm",
        "43-44mm",
        "45-46mm",
        "47mm+",
      ];
    }

    // Convert numeric sizes to ranges
    const sizeRanges = sizes.map((size) => {
      if (size <= 40) return "38-40mm";
      if (size <= 42) return "41-42mm";
      if (size <= 44) return "43-44mm";
      if (size <= 46) return "45-46mm";
      return "47mm+";
    });

    return [...new Set(sizeRanges)];
  }, [products.products]);

  const strapColors = useMemo(() => {
    const colors = products.products.map((p) => p.strapColor).filter(Boolean);
    return colors.length > 0
      ? [...new Set(colors)]
      : ["Black", "Blue", "Green", "Orange", "Yellow", "Stainless Steel"];
  }, [products.products]);

  // Build API parameters from active filters
  const buildApiParams = useCallback(() => {
    const params = {
      page: currentPage,
      limit: productsPerPage,
      watchType: "sports" // Specific to sports watches
    };

    // Add category from URL if available
    if (category) {
      params.category = [category];
    }

    // Add active filters
    Object.keys(activeFilters).forEach((key) => {
      if (key === "availability" && activeFilters[key].length > 0) {
        // Convert frontend availability values to backend format
        const availabilityMap = {
          "In Stock": "in_stock",
          "Sold Out": "out_of_stock",
        };

        const backendAvailability = activeFilters[key]
          .map((item) => availabilityMap[item])
          .filter(Boolean);

        if (backendAvailability.length > 0) {
          params.availability = backendAvailability;
        }
      } else if (key === "priceRange" && activeFilters[key]) {
        // Handle price range filter
        params.minPrice = activeFilters[key].min;
        params.maxPrice = activeFilters[key].max;
      } else if (
        Array.isArray(activeFilters[key]) &&
        activeFilters[key].length > 0 &&
        key !== "availability" &&
        key !== "priceRange"
      ) {
        // Map frontend filter keys to backend field names
        const fieldMappings = {
          type: "watchType",
          condition: "condition",
          itemCondition: "itemCondition",
          scopeOfDelivery: "scopeOfDelivery",
          badges: "badges",
          brand: "brand",
          model: "model",
          referenceNumber: "referenceNumber",
          gender: "gender",
          dialColor: "dialColor",
          strapColor: "strapColor",
          caseMaterial: "caseMaterial",
          strapMaterial: "strapMaterial",
          movement: "movement",
          caseSize: "caseSize",
          waterResistance: "waterResistance",
          activityType: "activityType",
          bezelType: "bezelType",
          chronograph: "chronograph",
          luminosity: "luminosity"
        };

        const backendField = fieldMappings[key] || key;
        params[backendField] = activeFilters[key];
      }
    });

    // Add sort option - Map frontend to backend sort options
    if (sortOption && sortOption !== "featured") {
      const sortMappings = {
        priceLowHigh: "price_low_high",
        priceHighLow: "price_high_low",
        newest: "newest",
        name_asc: "name_asc",
        name_desc: "name_desc",
        rating: "rating",
        discount: "discount",
        sports: "sports",
      };
      params.sortBy = sortMappings[sortOption] || sortOption;
    }

    console.log("Final API params for sports watches:", params);
    return params;
  }, [activeFilters, currentPage, sortOption, category, productsPerPage]);

  // Fetch products based on current filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiParams = buildApiParams();
      console.log("Fetching sports watches with params:", apiParams);

      const result = await WatchBycategory("sports", apiParams);

      if (result.error) {
        throw new Error(result.error.message || "Failed to fetch sports watches");
      }

      if (result.data) {
        console.log(
          "Sports watches fetched successfully:",
          result.data.products.length
        );
        setProducts(result.data);
      }
    } catch (err) {
      console.error("Error fetching sports watches:", err);
      setError("Failed to load sports watches. Please try again later.");
    } finally {
      setLoading(false);
      setShouldApplyFilters(false);
    }
  }, [buildApiParams]);

  // Initialize filters from URL on component mount
  useEffect(() => {
    const initialFilters = { ...activeFilters };
    let hasURLFilters = false;

    const filterKeys = [
      "category",
      "brand",
      "model",
      "gender",
      "condition",
      "itemCondition",
      "scopeOfDelivery",
      "badges",
      "availability",
      "type",
      "dialColor",
      "strapColor",
      "strapMaterial",
      "caseMaterial",
      "caseSize",
      "movement",
      "waterResistance",
      "referenceNumber",
      "activityType",
      "bezelType",
      "chronograph",
      "luminosity"
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
        max: maxPrice ? parseInt(maxPrice) : 50000,
      };
      hasURLFilters = true;
    }

    // Handle sort option
    const urlSortOption = searchParams.get("sortBy");
    if (urlSortOption) {
      setSortOption(urlSortOption);
    }

    // Handle page
    const urlPage = searchParams.get("page");
    if (urlPage) {
      setCurrentPage(parseInt(urlPage));
    }

    if (hasURLFilters) {
      setActiveFilters(initialFilters);
    }
  }, [searchParams]);

  // Fetch products when filters, page, or sort change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

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

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilters({
      category: [],
      brand: [],
      model: [],
      referenceNumber: [],
      gender: [],
      availability: [],
      condition: [],
      itemCondition: [],
      scopeOfDelivery: [],
      badges: [],
      type: [],
      dialColor: [],
      strapColor: [],
      caseMaterial: [],
      strapMaterial: [],
      caseSize: [],
      movement: [],
      waterResistance: [],
      priceRange: null,
      activityType: [],
      bezelType: [],
      chronograph: [],
      luminosity: []
    });
    setCurrentPage(1);
    setShouldApplyFilters(true);
  }, []);

  // Apply filters (for mobile)
  const applyFilters = useCallback(() => {
    setMobileFiltersOpen(false);
    setShouldApplyFilters(true);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.keys(activeFilters).filter((key) => {
      if (key === "priceRange") {
        return activeFilters[key] !== null;
      }
      return Array.isArray(activeFilters[key]) && activeFilters[key].length > 0;
    }).length;
  }, [activeFilters]);

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
                <span className="text-gray-700 capitalize">Sports Watches</span>
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

        {/* Mobile Filter Button and View Toggle */}
        <div className="flex items-center justify-between mb-4 xs:mb-5">
          <button
            type="button"
            className="md:hidden flex items-center gap-2 text-gray-700 text-sm xs:text-base px-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            onClick={() => setMobileFiltersOpen(true)}
            aria-label="Open filters"
          >
            <FiFilter className="h-4 w-4 xs:h-5 xs:w-5" />
            <span className="font-medium">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#8b6b4a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle - Mobile Only */}
          <div className="md:hidden flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
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
        </div>

        <div className="flex flex-col md:flex-row gap-6 xs:gap-7 sm:gap-8">
          {/* Sidebar */}
          <aside className="md:w-72 lg:w-80">
            <FilterSidebar
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              mobileFiltersOpen={mobileFiltersOpen}
              setMobileFiltersOpen={setMobileFiltersOpen}
              clearAllFilters={clearAllFilters}
              applyFilters={applyFilters}
              // Pass dynamic filter options
              brands={brands}
              models={models}
              referenceNumbers={referenceNumbers}
              caseSizes={caseSizes}
              strapColors={strapColors}
              brandSearch={brandSearch}
              setBrandSearch={setBrandSearch}
              watchType="sports"
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
                      {category
                        ? `${
                            category.charAt(0).toUpperCase() + category.slice(1)
                          } Sports Watches`
                        : "Sports Watches"}
                      {subcategory &&
                        ` / ${
                          subcategory.charAt(0).toUpperCase() +
                          subcategory.slice(1)
                        }`}
                    </h1>
                    <p className="text-sm xs:text-base font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                      {products.totalProducts || 0}{" "}
                      {products.totalProducts === 1 ? "sports watch" : "sports watches"} found
                    </p>
                  </div>

                  {/* Enhanced Controls */}
                  <div className="flex items-center gap-4">
                    {/* View Mode Toggle - Desktop */}
                    <div className="hidden md:flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
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
                          aria-label="Sort sports watches"
                        >
                          <option value="featured">Featured</option>
                          <option value="sports">Most Sporty</option>
                          <option value="priceLowHigh">Price: Low to High</option>
                          <option value="priceHighLow">Price: High to Low</option>
                          <option value="newest">Newest Arrivals</option>
                          <option value="name_asc">Name: A to Z</option>
                          <option value="name_desc">Name: Z to A</option>
                          <option value="rating">Top Rated</option>
                          <option value="discount">Best Discount</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <FiChevronLeft className="h-4 w-4 text-gray-400 transform -rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFilterCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">
                        Active filters:
                      </span>
                      {Object.entries(activeFilters).map(([type, values]) => {
                        if (type === "priceRange" && values) {
                          return (
                            <span
                              key="price-range"
                              className="inline-flex items-center rounded-full bg-opacity-10 px-3 py-1.5 text-sm font-medium text-[#8b6b4a]"
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
              <div
                className={`gap-4 xs:gap-5 sm:gap-6 ${
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : "flex flex-col gap-6"
                }`}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-xl p-3 xs:p-4 animate-pulse shadow-sm border border-gray-100 ${
                      viewMode === "list" ? "flex gap-4" : ""
                    }`}
                  >
                    <div
                      className={`bg-gray-200 rounded-lg ${
                        viewMode === "list"
                          ? "w-32 h-32 flex-shrink-0"
                          : "aspect-[3/4] mb-3 xs:mb-4"
                      }`}
                    ></div>
                    <div className={`${viewMode === "list" ? "flex-1" : ""}`}>
                      <div className="h-4 bg-gray-200 rounded mb-2 xs:mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
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
                    Error Loading Sports Watches
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
                <div
                  className={`gap-3 xs:gap-4 sm:gap-5 lg:gap-6 ${
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                      : "flex flex-col gap-6"
                  }`}
                >
                  <Suspense
                    fallback={
                      <div
                        className={`gap-3 xs:gap-4 sm:gap-5 lg:gap-6 ${
                          viewMode === "grid"
                            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                            : "flex flex-col gap-6"
                        }`}
                      >
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
                    {products.products.map((product) => (
                      <div
                        key={product._id}
                        className={
                          viewMode === "list"
                            ? "bg-white rounded-xl shadow-sm border border-gray-100"
                            : "flex justify-center"
                        }
                      >
                        <ProductCard 
                          product={product} 
                          viewMode={viewMode}
                          className={viewMode === "grid" ? "w-full max-w-[280px] mx-auto" : ""}
                        />
                      </div>
                    ))}
                  </Suspense>
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
                <div className="text-center py-12 xs:py-16 sm:py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiX className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl xs:text-2xl font-bold text-gray-900 mb-2">
                      No sports watches found
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm xs:text-base">
                      Try adjusting your search or filter criteria to find high-performance sports watches.
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

// Mobile Responsive Pagination Component
const MobileResponsivePagination = memo(({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const generatePageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
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
              ? 'text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md'
          }`}
          aria-label="Previous page"
        >
          <FiChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-2">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-1 text-sm text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`flex items-center justify-center w-9 h-9 text-sm font-medium rounded-lg border transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-[#8b6b4a] text-white border-[#8b6b4a] shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
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
              ? 'text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md'
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
                ? 'text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md'
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
                ? 'text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-[#8b6b4a] hover:text-white hover:border-[#8b6b4a] hover:shadow-md'
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
                  {page === '...' ? (
                    <span className="px-3 py-1 text-base text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page)}
                      className={`flex items-center justify-center min-w-10 h-10 px-3 text-base font-medium rounded-lg border transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-[#8b6b4a] text-white border-[#8b6b4a] shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md'
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
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
});

MobileResponsivePagination.displayName = "MobileResponsivePagination";

export default Page;