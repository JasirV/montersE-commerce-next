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
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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

  // Ref for scroll target
  const productsSectionRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error, isLoading } = await WatchBycategory("sports", {
          page: currentPage,
          limit: 15,
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
      }
    };
    fetchProducts();
  }, [currentPage]);

  // Scroll to top when page changes
  useEffect(() => {
    if (productsSectionRef.current) {
      productsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  const productsPerPage = 15;

  const [activeFilters, setActiveFilters] = useState({
    category: [],
    price: [],
    brand: [],
    discount: [],
    rating: [],
    availability: [],
    badges: [],
  });

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        default:
          return 0;
      }
    });

    return result.length > 0 ? result : products.products || [];
  }, [filteredProducts, sortOption, products]);

  const toggleFilter = (type, value) => {
    setActiveFilters((prev) => {
      const updated = prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value];
      return { ...prev, [type]: updated };
    });
    setCurrentPage(1);
  };

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
          <ol className="inline-flex items-center space-x-1 text-xs xs:text-sm">
            <li>
              <a
                href="#"
                className="flex items-center text-gray-700 hover:text-[#8b6b4a] font-semibold"
              >
                Home
              </a>
            </li>
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

          {/* Products Section with ref for scrolling */}
          <main className="flex-1" ref={productsSectionRef}>
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xs:gap-4">
                {[...Array(productsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-3 animate-pulse"
                  >
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
                    Sports Watches
                  </h2>
                  <p className="text-xs xs:text-sm text-gray-500">
                    {sortedProducts.length}{" "}
                    {sortedProducts.length === 1 ? "product" : "products"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sort"
                    className="text-xs xs:text-sm font-medium text-gray-700 whitespace-nowrap"
                  >
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

            {/* Active Filters */}
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
            {products.products?.length > 0 ? (
              <>
                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xs:gap-4">
                  <Suspense
                    fallback={
                      <div className="col-span-full grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xs:gap-4">
                        {[...Array(productsPerPage)].map((_, i) => (
                          <div
                            key={i}
                            className="bg-white rounded-lg p-3 animate-pulse"
                          >
                            <div className="h-40 xs:h-44 bg-gray-200 rounded mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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

                {/* Mobile Responsive Pagination */}
                <MobileResponsivePagination
                  currentPage={currentPage}
                  totalPages={products.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-8 xs:py-10 sm:py-12">
                <h3 className="text-base xs:text-lg font-medium text-gray-900">
                  No products found
                </h3>
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
      <div className="mt-6 sm:mt-8">
        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
            disabled={isFirstPage}
            className={`flex items-center justify-center w-8 h-8 rounded border ${
              isFirstPage
                ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
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
                  <span className="px-2 py-1 text-sm text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page)}
                    className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded border ${
                      currentPage === page
                        ? "bg-[#8b6b4a] text-white border-[#8b6b4a]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
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
            className={`flex items-center justify-center w-8 h-8 rounded border ${
              isLastPage
                ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
            aria-label="Next page"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
              disabled={isFirstPage}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                isFirstPage
                  ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
              aria-label="Previous page"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>

            {/* Current Page Display */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Page</span>
              <span className="text-sm font-semibold text-gray-900">
                {currentPage}
              </span>
              <span className="text-sm text-gray-600">of</span>
              <span className="text-sm font-semibold text-gray-900">
                {totalPages}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => !isLastPage && onPageChange(currentPage + 1)}
              disabled={isLastPage}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border ${
                isLastPage
                  ? "text-gray-400 cursor-not-allowed bg-gray-100 border-gray-200"
                  : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
              aria-label="Next page"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Page Numbers for Mobile - Scrollable */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide max-w-full px-2 py-1">
                {pageNumbers.map((page, index) => (
                  <React.Fragment key={index}>
                    {page === "..." ? (
                      <span className="px-2 py-1 text-sm text-gray-500">
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => onPageChange(page)}
                        className={`flex items-center justify-center min-w-8 h-8 px-2 text-sm font-medium rounded border ${
                          currentPage === page
                            ? "bg-[#8b6b4a] text-white border-[#8b6b4a]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
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
