"use client";

import React, {
  useState,
  useMemo,
  memo,
  lazy,
  Suspense,
  useEffect,
} from "react";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";

// Lazy load icons
const FiFilter = lazy(() =>
  import("react-icons/fi").then((module) => ({ default: module.FiFilter }))
);
const FiX = lazy(() =>
  import("react-icons/fi").then((module) => ({ default: module.FiX }))
);
const FiChevronDown = lazy(() =>
  import("react-icons/fi").then((module) => ({ default: module.FiChevronDown }))
);
const FiSearch = lazy(() =>
  import("react-icons/fi").then((module) => ({ default: module.FiSearch }))
);
const FiShoppingCart = lazy(() =>
  import("react-icons/fi").then((module) => ({
    default: module.FiShoppingCart,
  }))
);
const FaTimes = lazy(() =>
  import("react-icons/fa").then((module) => ({ default: module.FaTimes }))
);
const FaChevronDown = lazy(() =>
  import("react-icons/fa").then((module) => ({ default: module.FaChevronDown }))
);
const FaChevronRight = lazy(() =>
  import("react-icons/fa").then((module) => ({
    default: module.FaChevronRight,
  }))
);

import { FiUser, FiClock, FiGrid } from "react-icons/fi";

// Default filter structure - can be overridden by backend

// Menu items
const menuItemsData = [
  { name: "Home", path: "/" },
  {
    name: "Shop",
    path: "/shop",
    subMenu: [
      { name: "All Products", path: "/shop/all" },
      { name: "New Arrivals", path: "/shop/new" },
      { name: "Best Sellers", path: "/shop/bestsellers" },
      { name: "Luxury Watches", path: "/shop/luxury-watches" },
      { name: "Vintage Collection", path: "/shop/vintage" },
    ],
  },
  { name: "Brands", path: "/brands" },
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

// Custom filter components
const RangeFilter = memo(({ section, activeFilters, onChange }) => {
  const [minPrice, setMinPrice] = useState(activeFilters.price_range?.min || section.min);
  const [maxPrice, setMaxPrice] = useState(activeFilters.price_range?.max || section.max);

  const handleRangeChange = (type, value) => {
    if (type === 'min') {
      setMinPrice(Math.min(value, maxPrice));
    } else {
      setMaxPrice(Math.max(value, minPrice));
    }
  };

  const applyRange = () => {
    onChange('price_range', { min: minPrice, max: maxPrice });
  };

  return (
    <div className="space-y-4">
      {/* Price ranges */}
      <div className="space-y-2">
        {section.ranges.map((range) => (
          <div key={range.value} className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              checked={activeFilters.price === range.value}
              onChange={() => onChange('price', range.value)}
            />
            <label className="ml-3 text-sm text-gray-600">{range.label}</label>
          </div>
        ))}
      </div>
      
      {/* Custom range slider */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Price Range
        </label>
        <div className="space-y-3">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Min Price</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => handleRangeChange('min', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                min={section.min}
                max={section.max}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Max Price</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => handleRangeChange('max', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                min={section.min}
                max={section.max}
              />
            </div>
          </div>
          <button
            onClick={applyRange}
            className="w-full bg-indigo-600 text-white py-2 rounded text-sm hover:bg-indigo-700"
          >
            Apply Range
          </button>
        </div>
      </div>
    </div>
  );
});

const ColorFilter = memo(({ section, activeFilters, onChange }) => {
  return (
    <div className="space-y-2">
      {section.options.map((option) => (
        <div key={option.value} className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            checked={activeFilters[section.id]?.includes(option.value)}
            onChange={() => onChange(section.id, option.value)}
          />
          <div className="ml-3 flex items-center space-x-2">
            {option.color && (
              <div
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: option.color }}
              />
            )}
            <label className="text-sm text-gray-600">{option.label}</label>
          </div>
        </div>
      ))}
    </div>
  );
});

const SearchFilter = memo(({ section, activeFilters, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value) => {
    setSearchTerm(value);
    onChange(section.id, value);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={section.placeholder || `Search ${section.name.toLowerCase()}...`}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
});

const FilterSection = memo(({ section, activeFilters, onChange }) => {
  const renderFilterContent = () => {
    switch (section.type) {
      case 'range':
        return (
          <RangeFilter
            section={section}
            activeFilters={activeFilters}
            onChange={onChange}
          />
        );
      case 'color-checkbox':
        return (
          <ColorFilter
            section={section}
            activeFilters={activeFilters}
            onChange={onChange}
          />
        );
      case 'search':
        return (
          <SearchFilter
            section={section}
            activeFilters={activeFilters}
            onChange={onChange}
          />
        );
      case 'search-checkbox':
        return (
          <>
            <div className="relative mb-3">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border-0 py-1.5 pl-8 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 text-sm"
                placeholder={`Search ${section.name.toLowerCase()}...`}
              />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {section.options.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`filter-${section.id}-${optionIdx}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={activeFilters[section.id]?.includes(option.value)}
                    onChange={() => onChange(section.id, option.value)}
                  />
                  <label
                    htmlFor={`filter-${section.id}-${optionIdx}`}
                    className="ml-3 text-sm text-gray-600"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </>
        );
      default: // checkbox
        return (
          <div className="space-y-2">
            {section.options.map((option, optionIdx) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`filter-${section.id}-${optionIdx}`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={activeFilters[section.id]?.includes(option.value)}
                  onChange={() => onChange(section.id, option.value)}
                />
                <label
                  htmlFor={`filter-${section.id}-${optionIdx}`}
                  className="ml-3 text-sm text-gray-600"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <Disclosure as="div" className="border-b border-gray-200 py-4">
      {({ open }) => (
        <>
          <h3 className="-mx-2 -my-3 flow-root">
            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-600 hover:text-gray-900">
              <span className="text-sm font-bold text-gray-900">
                {section.name}
              </span>
              <FiChevronDown
                className={`${
                  open ? "-rotate-180" : "rotate-0"
                } h-5 w-5 transform transition-transform duration-200`}
                aria-hidden="true"
              />
            </Disclosure.Button>
          </h3>
          <Disclosure.Panel className="pt-4 pb-2 transition-all duration-300 ease-in-out">
            {renderFilterContent()}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
});

// Menu Item Component
const MenuItem = memo(({ item, dropdown, setDropdown }) => {
  const hasSubmenu = item.subMenu && item.subMenu.length > 0;

  return (
    <div key={item.name} className="border-b border-gray-200">
      {hasSubmenu ? (
        <button
          onClick={() => setDropdown(dropdown === item.name ? null : item.name)}
          className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 hover:bg-gray-50 transition-colors duration-200"
        >
          <span className="font-medium text-sm">{item.name}</span>
          <FaChevronDown
            size={12}
            className={`transform transition-transform duration-300 ${
              dropdown === item.name ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      ) : (
        <Link
          href={item.path}
          className="w-full flex justify-between items-center px-4 py-3 text-left text-gray-800 hover:bg-gray-50 transition-colors duration-200"
          onClick={() => setDropdown(null)}
        >
          <span className="font-medium text-sm">{item.name}</span>
        </Link>
      )}

      {hasSubmenu && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            dropdown === item.name
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-50 pl-6">
            {item.subMenu.map((sub) => (
              <Link
                key={sub.name}
                href={sub.path}
                className="block px-4 py-3 text-gray-600 hover:bg-gray-100 border-t border-gray-200 text-sm transition-colors duration-200"
                onClick={() => setDropdown(null)}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const FilterSidebar2 = ({ 
  // Props from parent component
  activeFilters = {},
  onFilterChange,
  mobileFiltersOpen,
  setMobileFiltersOpen,
  clearAllFilters,
  applyFilters,
  // Backend integration props
  backendFilters = null,
  loading = false,
  onFiltersUpdate,
  productCount = 0,
  defaultFiltersData=[]
}) => {
  const [dropdown, setDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [tempFilters, setTempFilters] = useState(activeFilters);
  const [brandSearch, setBrandSearch] = useState('');

  // Use backend filters if provided, otherwise use defaults
  const filters = useMemo(() => {
    return backendFilters || defaultFiltersData;
  }, [backendFilters]);

  const menuItems = useMemo(() => menuItemsData, []);

  // Initialize temp filters when activeFilters change
  useEffect(() => {
    setTempFilters(activeFilters);
  }, [activeFilters]);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    setTempFilters(prev => {
      if (type === 'price_range') {
        return { ...prev, price_range: value };
      }
      
      if (type === 'reference_number') {
        return { ...prev, reference_number: value };
      }
      
      const currentValues = prev[type] || [];
      const updated = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [type]: updated };
    });
  };

  // Apply filters
  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange(tempFilters);
    }
    setMobileFiltersOpen(false);
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters = {};
    setTempFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  // Check if there are active filters
  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some(arr => 
      Array.isArray(arr) ? arr.length > 0 : arr !== undefined && arr !== ''
    );
  }, [activeFilters]);

  // Mobile menu handlers
  const openMenu = () => {
    setIsClosing(false);
    setIsMenuOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setDropdown(null);
      setIsClosing(false);
      document.body.style.overflow = "unset";
    }, 300);
  };

  if (loading) {
    return (
      <div className="lg:w-72 xl:w-80 bg-gray-100 animate-pulse rounded-lg p-4">
        <div className="h-6 bg-gray-300 rounded mb-4"></div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-gray-300 rounded mb-2"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={openMenu}
            className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-2 transition-colors duration-200"
          >
            <FiGrid className="h-6 w-6" />
            <span className="text-xs mt-0.5">Shop</span>
          </button>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex flex-col items-center justify-center text-indigo-600 p-2 transition-colors duration-200"
          >
            <FiFilter className="h-6 w-6" />
            <span className="text-xs mt-0.5">Filters</span>
            {hasActiveFilters && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          <Link href="/wishlist">
            <button className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-2 transition-colors duration-200">
              <FiClock className="h-6 w-6" />
              <span className="text-xs mt-0.5">Waitlist</span>
            </button>
          </Link>

          <Link href="/cart">
            <button className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-2 transition-colors duration-200">
              <FiShoppingCart className="h-6 w-6" />
              <span className="text-xs mt-0.5">Cart</span>
            </button>
          </Link>

          <Link href="/UserProfile">
            <button className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-2 transition-colors duration-200">
              <FiUser className="h-6 w-6" />
              <span className="text-xs mt-0.5">Account</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile Filters Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${mobileFiltersOpen ? "block" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
          onClick={() => setMobileFiltersOpen(false)}
        />
        
        <div className={`fixed inset-y-0 left-0 w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">
              Filters {productCount > 0 && `(${productCount})`}
            </h2>
            <button onClick={() => setMobileFiltersOpen(false)}>
              <FaTimes size={18} />
            </button>
          </div>

          <div className="px-4 pb-20 overflow-y-auto h-[calc(100%-120px)]">
            {filters.map((section) => (
              <FilterSection 
                key={section.id} 
                section={section} 
                activeFilters={tempFilters}
                onChange={handleFilterChange}
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between gap-3">
            <button
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex-1"
              onClick={handleClearAll}
            >
              Clear All
            </button>
            <button
              className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex-1"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-72 xl:w-80">
        <div className="sticky top-20">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 m-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Filters {productCount > 0 && `(${productCount})`}
              </h2>
              {hasActiveFilters && (
                <button 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={handleClearAll}
                >
                  Clear all
                </button>
              )}
            </div>

            {filters.map((section) => (
              <FilterSection
                key={section.id}
                section={section}
                activeFilters={activeFilters}
                onChange={onFilterChange}
              />
            ))}

            {hasActiveFilters && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(FilterSidebar2);