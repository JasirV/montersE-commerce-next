"use client";
import ProductCard from "@/features/product/ProductCard";
import { WatchBycategory } from "@/service/productService";
import { useParams } from "next/navigation";
import React, {
  memo,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiHome } from "react-icons/fi";
import FilterSidebar from "@/features/product/ProductFilterSidebar";

const Page = () => {
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
  const { category, subcategory } = useParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [shouldApplyFilters, setShouldApplyFilters] = useState(false);

  // Ref for scroll target
  const productsSectionRef = useRef(null);

  const productsPerPage = 20; // Increased for 5 columns

  const [activeFilters, setActiveFilters] = useState({
    category: [],
    price: [],
    brand: [],
    discount: [],
    rating: [],
    availability: [],
    badges: [],
    gender: [],
    waterResistance: [],
    activityType: []
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error, isLoading } = await WatchBycategory("sports", {
          page: currentPage,
          limit: productsPerPage,
          category: activeFilters.category,
          brand: activeFilters.brand,
          price: activeFilters.price,
          availability: activeFilters.availability,
          badges: activeFilters.badges,
          gender: activeFilters.gender,
          waterResistance: activeFilters.waterResistance,
          activityType: activeFilters.activityType
        });
        if (data) {
          setProducts(
            data || {
              products: [],
              totalPages: 0,
              currentPage: 1,
              totalProducts: 0,
            }
          );
        } else {
          setError(error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setShouldApplyFilters(false);
      }
    };
    fetchProducts();
  }, [currentPage, shouldApplyFilters]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [currentPage]);

  const clearAllFilters = () => {
    setActiveFilters({
      category: [],
      price: [],
      brand: [],
      discount: [],
      rating: [],
      availability: [],
      badges: [],
      gender: [],
      waterResistance: [],
      activityType: []
    });
    setCurrentPage(1);
    setShouldApplyFilters(true);
  };

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

  const applyFilters = () => {
    setCurrentPage(1);
    setShouldApplyFilters(true);
  };

  const categoryFilteredProducts = useMemo(() => {
    if (loading) return [];
    return products?.products?.filter((p) => {
      const isCategoryMatch =
        p.categories &&
        p.categories.some((cat) =>
          cat?.toLowerCase()?.includes(category?.toLowerCase())
        );

      if (subcategory) {
        return (
          isCategoryMatch &&
          p.categories &&
          p.categories.some((cat) =>
            cat.toLowerCase().includes(subcategory.toLowerCase())
          )
        );
      }

      return isCategoryMatch;
    });
  }, [category, subcategory, products, loading]);

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
      if (
        activeFilters.gender.length &&
        (!p.gender || !activeFilters.gender.includes(p.gender))
      )
        return false;
      if (
        activeFilters.waterResistance.length &&
        (!p.waterResistance || !activeFilters.waterResistance.includes(p.waterResistance))
      )
        return false;
      if (
        activeFilters.activityType.length &&
        (!p.activityType || !activeFilters.activityType.includes(p.activityType))
      )
        return false;
      return true;
    });
  }, [categoryFilteredProducts, activeFilters]);

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
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
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

        {/* Mobile Filter Button */}
        <button
          type="button"
          className="md:hidden flex items-center gap-2 mb-4 xs:mb-5 text-gray-700 text-sm xs:text-base px-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Open filters"
        >
          <FiFilter className="h-4 w-4 xs:h-5 xs:w-5" />
          <span className="font-medium">Filters</span>
          {Object.values(activeFilters).some(arr => arr.length > 0) && (
            <span className="bg-[#8b6b4a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(activeFilters).flat().length}
            </span>
          )}
        </button>

        <div className="flex flex-col md:flex-row gap-6 xs:gap-7 sm:gap-8">
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 xs:p-5 sm:p-6 mb-5 xs:mb-6 sm:mb-7">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 xs:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-0">
                      {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Sports Watches` : 'Sports Watches'}
                      {subcategory && ` / ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`}
                    </h1>
                    <p className="text-sm xs:text-base font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">
                      {sortedProducts.length} {sortedProducts.length === 1 ? "sports watch" : "sports watches"} found
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
                        aria-label="Sort sports watches"
                      >
                        <option value="featured">Featured</option>
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

                {/* Active Filters */}
                {Object.values(activeFilters).some((arr) => arr.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">Active filters:</span>
                      {Object.entries(activeFilters).map(([type, values]) =>
                        values.map((val) => (
                          <span
                            key={`${type}-${val}`}
                            className="inline-flex items-center rounded-full bg-[#8b6b4a] bg-opacity-10 px-3 py-1.5 text-sm font-medium text-[#8b6b4a]"
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xs:gap-5 sm:gap-6">
                {[...Array(productsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 animate-pulse shadow-sm border border-gray-100"
                  >
                    <div className="h-48 xs:h-52 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Products Grid - 5 columns on xl screens */}
            {!loading && products.products?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xs:gap-5 sm:gap-6">
                  <Suspense
                    fallback={
                      <div className="col-span-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xs:gap-5 sm:gap-6">
                        {[...Array(productsPerPage)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-xl p-4 animate-pulse shadow-sm border border-gray-100"
                          >
                            <div className="h-48 xs:h-52 bg-gray-200 rounded-lg mb-4"></div>
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
                <div className="text-center py-12 xs:py-16 sm:py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <FiX className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl xs:text-2xl font-bold text-gray-900 mb-2">
                      No sports watches found
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm xs:text-base">
                      Try adjusting your search or filter criteria.
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

export default Page;