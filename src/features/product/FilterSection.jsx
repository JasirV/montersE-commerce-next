"use client";

import React, { useState, useMemo } from "react";
import FilterSidebar from "./ShopeBYFilterSidebar";
import { FiX } from "react-icons/fi";

const FilterSection = ({
  products,
  category,
  subcategory,
  onFilterChange,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    price: [],
    brand: [],
    discount: [],
    availability: [],
    badges: [],
  });

  const toggleFilter = (type, value) => {
    setActiveFilters((prev) => {
      const updated = prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value];
      const newFilters = { ...prev, [type]: updated };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const cleared = {
      category: [],
      price: [],
      brand: [],
      discount: [],
      rating: [],
      availability: [],
      badges: [],
    };
    setActiveFilters(cleared);
    onFilterChange(cleared);
  };

  // extract unique brands for filter list
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand))],
    [products]
  );

  return (
    <aside className="md:w-64 lg:w-79">
      {/* Filter Sidebar */}
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

      {/* Active Filters Display */}
      {Object.values(activeFilters).some((arr) => arr.length > 0) && (
        <div className="mt-4 mb-3 flex flex-wrap gap-2">
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
          >
            Clear all
          </button>
        </div>
      )}
    </aside>
  );
};

export default FilterSection;
