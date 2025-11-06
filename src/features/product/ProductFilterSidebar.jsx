"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import Link from "next/link";

// Import icons directly
import { 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiSearch, 
  FiShoppingCart,
  FiUser, 
  FiClock, 
  FiGrid 
} from "react-icons/fi";
import { 
  FaTimes, 
  FaChevronDown, 
} from "react-icons/fa";

// Updated filter data with new structure
const filtersData = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "watch", label: "Watch" },
      { value: "home_accessories", label: "Home Accessories" },
      { value: "leather", label: "Leather" },
      { value: "personal_accessories", label: "Personal Accessories" },
      { value: "jewellery", label: "Jewellery" },
      { value: "gold", label: "Gold" },
    ],
  },
  {
    id: "price",
    name: "Price",
    options: [
      { value: "1-500", label: "AED 1 - AED 500" },
      { value: "501-1000", label: "AED 501 - AED 1,000" },
      { value: "1001-5000", label: "AED 1,001 - AED 5,000" },
      { value: "5001-10000", label: "AED 5,001 - AED 10,000" },
      { value: "10001-20000", label: "AED 10,001 - AED 20,000" },
      { value: "20001-40000", label: "AED 20,001 - AED 40,000" },
      { value: "40000-50000", label: "AED 40,000 - AED 50,000" },
    ],
  },
  {
    id: "brand",
    name: "Brand",
    options: [
      { value: "rolex", label: "Rolex" },
      { value: "longines", label: "Longines" },
      { value: "tiffany_co", label: "Tiffany & Co" },
      { value: "christian_dior", label: "Christian Dior" },
      { value: "gucci", label: "Gucci" },
      { value: "saint_laurent", label: "Saint Laurent" },
      { value: "jean_d_eve", label: "Jean D'eve" },
      { value: "omega", label: "Omega" },
      { value: "zenith", label: "Zenith" },
    ],
  },
  {
    id: "discount",
    name: "Discount",
    options: [
      { value: "20", label: "20% or More" },
      { value: "40", label: "40% or More" },
      { value: "60", label: "60% or More" },
      { value: "90", label: "90% or More" },
    ],
  },
  {
    id: "model",
    name: "Model",
    options: [
      { value: "deal_of_day", label: "Deal of the Day" },
      { value: "in_demand", label: "In Demand" },
      { value: "moglix_choice", label: "Moglix Choice" },
      { value: "same_day_dispatch", label: "Same Day Dispatch" },
      { value: "top_seller", label: "Top Seller" },
    ],
  },
  {
    id: "gender",
    name: "Gender",
    options: [
      { value: "men/unisex", label: "Men/unisex" },
      { value: "women", label: "Women" },
     
    ],
  },
  {
    id: "reference_number",
    name: "Reference Number",
    options: [
      { value: "ref_001", label: "REF-001" },
      { value: "ref_002", label: "REF-002" },
      { value: "ref_003", label: "REF-003" },
      { value: "ref_004", label: "REF-004" },
      { value: "ref_005", label: "REF-005" },
    ],
  },
  {
    id: "dial_color",
    name: "Dial Color",
    options: [
      { value: "black", label: "Black" },
      { value: "white", label: "White" },
      { value: "blue", label: "Blue" },
      { value: "green", label: "Green" },
      { value: "silver", label: "Silver" },
      { value: "gold", label: "Gold" },
      { value: "mother_of_pearl", label: "Mother of Pearl" },
    ],
  },
  {
    id: "strap_color",
    name: "Strap Color",
    options: [
      { value: "black", label: "Black" },
      { value: "brown", label: "Brown" },
      { value: "white", label: "White" },
      { value: "blue", label: "Blue" },
      { value: "steel", label: "Steel" },
      { value: "gold", label: "Gold" },
      { value: "leather", label: "Leather" },
    ],
  },
 
  {
    id: "availability",
    name: "Availability",
    options: [{ value: "in_stock", label: "Show in stock only" }],
  },
];

// Menu items data
const menuItemsData = [
  { name: "Home", path: "/" },
  {
    name: "Shop",
    path: "/shop",
    subMenu: [
      { name: "All Products", path: "/shop/all" },
      { name: "New Arrivals", path: "/shop/new" },
      { name: "Best Sellers", path: "/shop/bestsellers" },
    ],
  },
  { name: "Collections", path: "/collections" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

// Filter section component
const FilterSection = ({ section, activeFilters, toggleFilter }) => {
  return (
    <Disclosure as="div" className="border-b border-gray-200 py-4">
      {({ open }) => (
        <>
          <h3 className="-mx-2 -my-3 flow-root">
            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-600 hover:text-gray-900">
              <span className="text-base xs:text-lg font-bold text-gray-900">
                {section.name}
              </span>
              <span className="ml-6 flex items-center">
                <FiChevronDown
                  className={`${
                    open ? "-rotate-180" : "rotate-0"
                  } h-5 xs:h-6 w-5 xs:w-6 transform transition-transform duration-200`}
                  aria-hidden="true"
                />
              </span>
            </Disclosure.Button>
          </h3>
          <Disclosure.Panel className="pt-4 pb-2 transition-all duration-300 ease-in-out">
            <div className="space-y-3">
              {section.id === "brand" && (
                <div className="relative mb-3">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiSearch className="h-4 xs:h-5 w-4 xs:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full rounded-lg border-0 py-1.5 xs:py-2 pl-8 xs:pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 text-xs xs:text-sm"
                    placeholder="Search brands"
                  />
                </div>
              )}
              {section.options.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`filter-${section.id}-${optionIdx}`}
                    name={`${section.id}[]`}
                    type="checkbox"
                    className="h-4 xs:h-5 w-4 xs:w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={
                      activeFilters && activeFilters[section.id]?.includes(option.value) || false
                    }
                    onChange={() => toggleFilter && toggleFilter(section.id, option.value)}
                  />
                  <label
                    htmlFor={`filter-${section.id}-${optionIdx}`}
                    className="ml-2 xs:ml-3 text-xs xs:text-sm text-gray-600"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

// Menu item component
const MenuItem = ({ item, dropdown, setDropdown }) => {
  const hasSubmenu = item.subMenu && item.subMenu.length > 0;

  return (
    <div key={item.name} className="border-b border-gray-200">
      {hasSubmenu ? (
        <button
          onClick={() => setDropdown(dropdown === item.name ? null : item.name)}
          className="w-full flex justify-between items-center px-4 py-3 xs:py-4 text-left text-gray-800 hover:bg-gray-50 transition-colors duration-200"
          aria-expanded={dropdown === item.name}
        >
          <span className="font-medium text-sm xs:text-base">{item.name}</span>
          <span className="text-gray-400 transition-transform duration-300">
            <FaChevronDown
              size={12}
              className={`transform transition-transform duration-300 ${
                dropdown === item.name ? "rotate-180" : "rotate-0"
              }`}
            />
          </span>
        </button>
      ) : (
        <Link
          href={item.path}
          className="w-full flex justify-between items-center px-4 py-3 xs:py-4 text-left text-gray-800 hover:bg-gray-50 transition-colors duration-200"
          onClick={() => setDropdown(null)}
        >
          <span className="font-medium text-sm xs:text-base">{item.name}</span>
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
          <div className="bg-gray-50 pl-4 xs:pl-6">
            {item.subMenu.map((sub) => (
              <Link
                key={sub.name}
                href={sub.path}
                className="block px-4 py-2 xs:py-3 text-gray-600 hover:bg-gray-100 border-t border-gray-200 text-xs xs:text-sm transition-colors duration-200"
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
};

const FilterSidebar = ({ 
  activeFilters = {}, 
  toggleFilter, 
  mobileFiltersOpen, 
  setMobileFiltersOpen,
  clearAllFilters,
  applyFilters 
}) => {
  const [dropdown, setDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [tempFilters, setTempFilters] = useState(activeFilters);

  // Memoize data
  const filters = useMemo(() => filtersData, []);
  const menuItems = useMemo(() => menuItemsData, []);

  // Initialize temp filters when activeFilters change
  useEffect(() => {
    setTempFilters(activeFilters);
  }, [activeFilters]);

  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some(arr => arr && arr.length > 0);
  }, [activeFilters]);

  // Check if temp filters are different from active filters
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(tempFilters) !== JSON.stringify(activeFilters);
  }, [tempFilters, activeFilters]);

  // Handle filter changes in temp state
  const handleTempFilterChange = (type, value) => {
    setTempFilters((prev) => {
      const currentValues = prev[type] || [];
      const updated = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [type]: updated };
    });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    // Update the actual active filters with temp filters
    Object.keys(tempFilters).forEach(type => {
      const tempValues = tempFilters[type] || [];
      const activeValues = activeFilters[type] || [];
      
      // Add new filters
      tempValues.forEach(value => {
        if (!activeValues.includes(value)) {
          toggleFilter(type, value);
        }
      });
      
      // Remove filters that are no longer in temp
      activeValues.forEach(value => {
        if (!tempValues.includes(value)) {
          toggleFilter(type, value);
        }
      });
    });
    
    setMobileFiltersOpen(false);
  };

  // Handle clear/apply based on whether there are filters
  const handleClearOrApply = () => {
    if (hasActiveFilters || hasUnsavedChanges) {
      applyFilters && applyFilters();
    } else {
      clearAllFilters && clearAllFilters();
    }
    setMobileFiltersOpen(false);
  };

  // Handle menu open/close with smooth transitions
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

  // Close menu when clicking on overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  // Close menu when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
        <div className="flex justify-around items-center h-14 xs:h-16">
          {/* Shop */}
          <button
            onClick={openMenu}
            className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-1 xs:p-2 transition-colors duration-200"
          >
            <FiGrid className="h-5 xs:h-6 w-5 xs:w-6" />
            <span className="text-[10px] xs:text-xs mt-0.5">Shop</span>
          </button>

          {/* Filters */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex flex-col items-center justify-center text-indigo-600 p-1 xs:p-2 transition-colors duration-200"
            aria-label="Open filters"
          >
            <FiFilter className="h-5 xs:h-6 w-5 xs:w-6" />
            <span className="text-[10px] xs:text-xs mt-0.5">Filters</span>
            {hasActiveFilters && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Waitlist */}
          <Link href="/wishlist">
            <button className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-1 xs:p-2 transition-colors duration-200">
              <FiClock className="h-5 xs:h-6 w-5 xs:w-6" />
              <span className="text-[10px] xs:text-xs mt-0.5">Waitlist</span>
            </button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <button className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-1 xs:p-2 transition-colors duration-200">
              <FiShoppingCart className="h-5 xs:h-6 w-5 xs:w-6" />
              <span className="text-[10px] xs:text-xs mt-0.5">Cart</span>
            </button>
          </Link>

          {/* My Account */}
          <Link href="/UserProfile">
            <button className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-1 xs:p-2 transition-colors duration-200">
              <FiUser className="h-5 xs:h-6 w-5 xs:w-6" />
              <span className="text-[10px] xs:text-xs mt-0.5">My Account</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile sidebar overlay and sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${
          mobileFiltersOpen ? "block" : "hidden"
        }`}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
          onClick={() => setMobileFiltersOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile sidebar */}
        <div
          className={`fixed inset-y-0 left-0 w-72 xs:w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-3 xs:p-4 border-b border-gray-200">
            <h2 className="text-base xs:text-lg font-bold text-gray-800">
              Filters
            </h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-1 xs:p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close filters"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Filters content */}
          <div className="px-3 xs:px-4 pb-20 overflow-y-auto h-[calc(100%-120px)]">
            {filters.map((section) => (
              <FilterSection 
                key={section.id} 
                section={section} 
                activeFilters={tempFilters}
                toggleFilter={handleTempFilterChange}
              />
            ))}
          </div>

          {/* Fixed buttons at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 xs:p-4 flex justify-between gap-2 xs:gap-3">
            <button
              className="px-4 xs:px-6 py-2 xs:py-3 text-xs xs:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex-1 transition-colors duration-200"
              onClick={clearAllFilters}
            >
              Clear all
            </button>
            <button
              className="px-4 xs:px-6 py-2 xs:py-3 text-xs xs:text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex-1 transition-colors duration-200"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-40"
          } md:hidden`}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`fixed inset-y-0 left-0 w-72 xs:w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isClosing ? "-translate-x-full" : "translate-x-0"
          } md:hidden`}
        >
          <div className="flex justify-between items-center p-3 xs:p-4 border-b border-gray-200">
            <h2 className="text-base xs:text-lg font-bold text-gray-800">
              Menu
            </h2>
            <button
              onClick={closeMenu}
              className="p-1 xs:p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close menu"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <div className="overflow-y-auto h-full pb-4">
            {/* Main Menu Items */}
            {menuItems.map((item) => (
              <MenuItem
                key={item.name}
                item={item}
                dropdown={dropdown}
                setDropdown={setDropdown}
              />
            ))}
          </div>
        </div>
      )}

      {/* Desktop filters */}
      <div className="hidden lg:block lg:w-72 xl:w-80">
        <div className="sticky top-20">
          <div
            className="bg-white p-4 xs:p-5 sm:p-6 rounded-lg shadow-sm border border-gray-200"
            style={{ margin: "3%" }}
          >
            <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6">
              <h2 className="text-lg xs:text-xl font-bold text-gray-900">
                Filters
              </h2>
              {hasActiveFilters && (
                <button 
                  className="text-sm xs:text-base font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  onClick={clearAllFilters}
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
                toggleFilter={toggleFilter}
              />
            ))}

            {/* Apply Filters Button for Desktop */}
            {hasActiveFilters && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
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

export default FilterSidebar;