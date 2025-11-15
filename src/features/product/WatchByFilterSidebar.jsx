// features/product/WatchByFilterSidebar.jsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Disclosure } from "@headlessui/react";

// Import icons directly
import { 
  FiFilter, 
  FiChevronDown, 
  FiSearch
} from "react-icons/fi";
import { 
  FaTimes, 
  FaSlidersH
} from "react-icons/fa";

// Price Range Filter Component
const PriceRangeFilter = ({ activeFilters, toggleFilter }) => {
  const priceRange = activeFilters?.priceRange || { min: 0, max: 1000000 };
  
  const handlePriceRangeChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    const currentRange = activeFilters?.priceRange || { min: 0, max: 1000000 };
    
    let newRange;
    if (field === 'min') {
      newRange = { 
        ...currentRange, 
        min: Math.min(numValue, currentRange.max - 1000) // Ensure min doesn't exceed max
      };
    } else {
      newRange = { 
        ...currentRange, 
        max: Math.max(numValue, currentRange.min + 1000) // Ensure max doesn't go below min
      };
    }
    
    toggleFilter('priceRange', newRange);
  };

  const handleQuickRangeSelect = (min, max) => {
    toggleFilter('priceRange', { min, max });
  };

  const quickRanges = [
    { min: 0, max: 1000, label: "Under AED 1,000" },
    { min: 1000, max: 5000, label: "AED 1,000 - AED 5,000" },
    { min: 5000, max: 10000, label: "AED 5,000 - AED 10,000" },
    { min: 10000, max: 20000, label: "AED 10,000 - AED 20,000" },
    { min: 20000, max: 50000, label: "AED 20,000 - AED 50,000" },
    { min: 50000, max: 100000, label: "AED 50,000 - AED 100,000" },
    { min: 100000, max: 500000, label: "AED 100,000 - AED 500,000" },
    { min: 500000, max: 1000000, label: "AED 500,000 - AED 1,000,000" },
    { min: 1000000, max: 10000000, label: "Over AED 1,000,000" },
  ];

  // Calculate slider positions for visual representation
  const minPercentage = (priceRange.min / 1000000) * 100;
  const maxPercentage = (priceRange.max / 1000000) * 100;

  return (
    <div className="space-y-4 p-1">
      {/* Current Range Display */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          AED {priceRange.min.toLocaleString()} - AED {priceRange.max.toLocaleString()}
        </span>
      </div>

      {/* Custom Range Slider */}
      <div className="relative py-6">
        {/* Track */}
        <div className="relative h-2 bg-gray-200 rounded-full">
          {/* Selected Range */}
          <div 
            className="absolute h-2 bg-indigo-600 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${maxPercentage - minPercentage}%`
            }}
          ></div>
        </div>

        {/* Min Thumb */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `${minPercentage}%` }}
        >
          <input
            type="range"
            min="0"
            max="1000000"
            step="1000"
            value={priceRange.min}
            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Max Thumb */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-600 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
          style={{ left: `${maxPercentage}%` }}
        >
          <input
            type="range"
            min="0"
            max="1000000"
            step="1000"
            value={priceRange.max}
            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>

      {/* Input Fields */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Min Price (AED)
          </label>
          <input
            type="number"
            min="0"
            max="1000000"
            step="1000"
            value={priceRange.min}
            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="0"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Max Price (AED)
          </label>
          <input
            type="number"
            min="0"
            max="1000000"
            step="1000"
            value={priceRange.max}
            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="1000000"
          />
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="pt-2">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Quick Select
        </label>
        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
          {quickRanges.map((range, index) => (
            <button
              key={index}
              type="button"
              className={`px-3 py-2 text-xs border rounded-lg transition-all duration-200 text-left ${
                priceRange.min === range.min && priceRange.max === range.max
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
              onClick={() => handleQuickRangeSelect(range.min, range.max)}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {(priceRange.min > 0 || priceRange.max < 1000000) && (
        <div className="pt-2">
          <button
            type="button"
            className="w-full px-3 py-2 text-xs text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            onClick={() => toggleFilter('priceRange', { min: 0, max: 1000000 })}
          >
            Reset Price Range
          </button>
        </div>
      )}
    </div>
  );
};

// Filter section component (Updated to use PriceRangeFilter)
const FilterSection = ({ section, activeFilters, toggleFilter, searchTerms, setSearchTerms }) => {
  const [localSearch, setLocalSearch] = useState("");
  
  const searchTerm = searchTerms?.[section.id] || "";
  const setSearchTerm = (value) => {
    setSearchTerms?.(prev => ({ ...prev, [section.id]: value }));
  };

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return section.options;
    return section.options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [section.options, searchTerm]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchTerm(value);
  };

  // Handle checkbox change
  const handleCheckboxChange = (value) => {
    if (toggleFilter) {
      toggleFilter(section.id, value);
    }
  };

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
              {/* Search input for searchable sections */}
              {(section.type === "search-checkbox") && (
                <div className="relative mb-3">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiSearch className="h-4 xs:h-5 w-4 xs:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={localSearch}
                    onChange={handleSearchChange}
                    className="block w-full rounded-lg border-0 py-1.5 xs:py-2 pl-8 xs:pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 text-xs xs:text-sm"
                    placeholder={`Search ${section.name.toLowerCase()}...`}
                  />
                </div>
              )}

              {/* Price Range - Using the new component */}
              {section.type === "price-range" && (
                <PriceRangeFilter 
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                />
              )}

              {/* Checkbox options */}
              {(section.type === "checkbox" || section.type === "search-checkbox") && filteredOptions.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`filter-${section.id}-${optionIdx}`}
                    name={`${section.id}[]`}
                    type="checkbox"
                    className="h-4 xs:h-5 w-4 xs:w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={
                      Array.isArray(activeFilters?.[section.id]) && 
                      activeFilters[section.id].includes(option.value)
                    }
                    onChange={() => handleCheckboxChange(option.value)}
                  />
                  <label
                    htmlFor={`filter-${section.id}-${optionIdx}`}
                    className="ml-2 xs:ml-3 text-xs xs:text-sm text-gray-600 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </div>
              ))}

              {/* Color Picker */}
              {section.type === "color-picker" && filteredOptions.map((option, optionIdx) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`filter-${section.id}-${optionIdx}`}
                    name={`${section.id}[]`}
                    type="checkbox"
                    className="h-4 xs:h-5 w-4 xs:w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={
                      Array.isArray(activeFilters?.[section.id]) && 
                      activeFilters[section.id].includes(option.value)
                    }
                    onChange={() => handleCheckboxChange(option.value)}
                  />
                  <label
                    htmlFor={`filter-${section.id}-${optionIdx}`}
                    className="ml-2 xs:ml-3 text-xs xs:text-sm text-gray-600 flex items-center gap-2 cursor-pointer"
                  >
                    <span 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ 
                        backgroundColor: option.color,
                        border: option.border || 'none'
                      }}
                    ></span>
                    {option.label}
                  </label>
                </div>
              ))}

              {/* Show message if no results */}
              {filteredOptions.length === 0 && section.type !== "color-picker" && (
                <div className="text-center text-gray-500 text-xs py-2">
                  No {section.name.toLowerCase()} found
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

// Advanced Filters Modal (No changes needed here)
const AdvancedFiltersModal = ({ 
  isOpen, 
  onClose, 
  activeFilters, 
  toggleFilter,
  caseSizes = [],
  strapColors = []
}) => {
  const [searchTerms, setSearchTerms] = useState({});

  // Advanced filters data
  const advancedFiltersData = useMemo(() => [
    {
      id: "dialColor",
      name: "Dial Color",
      type: "color-picker",
      options: [
        { value: "Black", label: "Black", color: "#000000" },
        { value: "White", label: "White", color: "#FFFFFF", border: "1px solid #E5E7EB" },
        { value: "Blue", label: "Blue", color: "#3B82F6" },
        { value: "Green", label: "Green", color: "#10B981" },
        { value: "Silver", label: "Silver", color: "#9CA3AF" },
        { value: "Gold", label: "Gold", color: "#F59E0B" },
        { value: "Grey", label: "Grey", color: "#6B7280" },
        { value: "Brown", label: "Brown", color: "#92400E" },
      ],
    },
    {
      id: "strapColor",
      name: "Strap Color",
      type: "color-picker",
      options: strapColors.length > 0 
        ? strapColors.map(color => ({
            value: color,
            label: color,
            color: getColorHex(color)
          }))
        : [
            { value: "Black", label: "Black", color: "#000000" },
            { value: "Brown", label: "Brown", color: "#92400E" },
            { value: "Blue", label: "Blue", color: "#3B82F6" },
            { value: "Green", label: "Green", color: "#10B981" },
            { value: "Red", label: "Red", color: "#EF4444" },
          ],
    },
    {
      id: "caseMaterial",
      name: "Case Material",
      type: "checkbox",
      options: [
        { value: "Stainless Steel", label: "Stainless Steel" },
        { value: "Gold", label: "Gold" },
        { value: "Rose Gold", label: "Rose Gold" },
        { value: "Platinum", label: "Platinum" },
        { value: "Titanium", label: "Titanium" },
        { value: "Ceramic", label: "Ceramic" },
        { value: "Bronze", label: "Bronze" },
      ],
    },
    {
      id: "strapMaterial",
      name: "Strap Material",
      type: "checkbox",
      options: [
        { value: "Stainless Steel", label: "Stainless Steel" },
        { value: "Leather", label: "Leather" },
        { value: "Rubber", label: "Rubber" },
        { value: "Ceramic", label: "Ceramic" },
        { value: "Titanium", label: "Titanium" },
        { value: "Gold", label: "Gold" },
        { value: "Fabric", label: "Fabric" },
        { value: "Silicone", label: "Silicone" },
      ],
    },
    {
      id: "caseSize",
      name: "Case Size (mm)",
      type: "checkbox",
      options: caseSizes.length > 0 
        ? caseSizes.map(size => ({ value: size, label: size }))
        : [
            { value: "28-32mm", label: "28-32mm" },
            { value: "33-36mm", label: "33-36mm" },
            { value: "37-39mm", label: "37-39mm" },
            { value: "40-42mm", label: "40-42mm" },
            { value: "43-45mm", label: "43-45mm" },
          ],
    },
    {
      id: "movement",
      name: "Movement Type",
      type: "checkbox",
      options: [
        { value: "Automatic", label: "Automatic" },
        { value: "Manual Wind", label: "Manual Wind" },
        { value: "Quartz", label: "Quartz" },
        { value: "Solar", label: "Solar" },
        { value: "Kinetic", label: "Kinetic" },
        { value: "Smart", label: "Smart/Connected" },
      ],
    },
    {
      id: "waterResistance",
      name: "Water Resistance",
      type: "checkbox",
      options: [
        { value: "30m", label: "30m (3ATM)" },
        { value: "50m", label: "50m (5ATM)" },
        { value: "100m", label: "100m (10ATM)" },
        { value: "200m", label: "200m (20ATM)" },
        { value: "300m", label: "300m (30ATM)" },
        { value: "500m+", label: "500m+ (Professional)" },
      ],
    },
  ], [caseSizes, strapColors]);

  // Helper function to get color hex
  function getColorHex(color) {
    const colorMap = {
      'Black': '#000000',
      'White': '#FFFFFF',
      'Blue': '#3B82F6',
      'Green': '#10B981',
      'Red': '#EF4444',
      'Brown': '#92400E',
      'Silver': '#9CA3AF',
      'Gold': '#F59E0B',
      'Grey': '#6B7280',
      'Beige': '#F5F5DC'
    };
    return colorMap[color] || '#6B7280';
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] md:rounded-2xl shadow-xl transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">Advanced Filters</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-4 max-h-[calc(90vh-120px)]">
          {advancedFiltersData.map((section) => (
            <FilterSection
              key={section.id}
              section={section}
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              searchTerms={searchTerms}
              setSearchTerms={setSearchTerms}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WatchByFilterSidebar = ({ 
  activeFilters = {
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
    priceRange: { min: 0, max: 1000000 }
  }, 
  toggleFilter, 
  mobileFiltersOpen, 
  setMobileFiltersOpen,
  clearAllFilters,
  applyFilters,
  // New props for dynamic filters
  brands = [],
  models = [],
  referenceNumbers = [],
  caseSizes = [],
  strapColors = []
}) => {
  const [searchTerms, setSearchTerms] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Dynamic filter data based on actual products
  const filters = useMemo(() => {
    const baseFilters = [
      {
        id: "type",
        name: "TYPE OF WATCH",
        type: "checkbox",
        options: [
          { value: "Wrist Watch", label: "Wrist Watch" },
          { value: "Pocket Watch", label: "Pocket Watch" },
          { value: "Clocks", label: "Clocks" },
          { value: "Stopwatch", label: "Stopwatch" },
          { value: "Smart Watch", label: "Smart Watch" },
        ],
      },
      {
        id: "brand",
        name: "BRAND",
        type: "search-checkbox",
        options: brands.length > 0 
          ? brands.map(brand => ({ value: brand, label: brand }))
          : [
              { value: "Rolex", label: "Rolex" },
              { value: "Omega", label: "Omega" },
              { value: "Patek Philippe", label: "Patek Philippe" },
            ],
      },
      {
        id: "model",
        name: "MODEL",
        type: "search-checkbox",
        options: models.length > 0 
          ? models.map(model => ({ value: model, label: model }))
          : [
              { value: "Submariner", label: "Submariner" },
              { value: "Daytona", label: "Daytona" },
              { value: "Speedmaster", label: "Speedmaster" },
            ],
      },
      {
        id: "referenceNumber",
        name: "REFERENCE NUMBER",
        type: "search-checkbox",
        options: referenceNumbers.length > 0 
          ? referenceNumbers.map(ref => ({ value: ref, label: ref }))
          : [
              { value: "116610LN", label: "116610LN" },
              { value: "126610", label: "126610" },
              { value: "311.30.42.30.01.005", label: "311.30.42.30.01.005" },
            ],
      },
      {
        id: "price",
        name: "PRICE",
        type: "price-range",
        options: [] // Options are now handled in PriceRangeFilter component
      },
      {
        id: "gender",
        name: "GENDER",
        type: "checkbox",
        options: [
          { value: "Men/Unisex", label: "Men / Unisex" },
          { value: "Women", label: "Women" },
        ],
      },
      {
        id: "condition",
        name: "CONDITION",
        type: "checkbox",
        options: [
          { value: "Brand New", label: "Brand New" },
          { value: "Unworn / Like New", label: "Unworn / Like New" },
          { value: "Pre-Owned", label: "Pre-Owned" },
          { value: "Not Working / For Parts", label: "Not Working / For Parts" },
        ],
      },
      {
        id: "itemCondition",
        name: "ITEM CONDITION",
        type: "checkbox",
        options: [
          { value: "Excellent", label: "Excellent" },
          { value: "Good", label: "Good" },
          { value: "Fair", label: "Fair" },
          { value: "Poor", label: "Poor / Not Working / For Parts" },
        ],
      },
      {
        id: "scopeOfDelivery",
        name: "SCOPE OF DELIVERY",
        type: "checkbox",
        options: [
          { value: "Full Set (Watch + Original Box + Original Papers)", label: "Full Set (Watch + Original Box + Original Papers)" },
          { value: "Watch with Original Papers", label: "Watch with Original Papers" },
          { value: "Watch with Original Box", label: "Watch with Original Box" },
          { value: "Watch Only", label: "Watch Only" },
          { value: "Watch with Montres Safe Box", label: "Watch with Montres Safe Box" },
        ],
      },
      {
        id: "availability",
        name: "AVAILABILITY",
        type: "checkbox",
        options: [
          { value: "In Stock", label: "In Stock" },
          { value: "Sold Out", label: "Sold Out" },
        ],
      },
      {
        id: "badges",
        name: "BADGES",
        type: "checkbox",
        options: [
          { value: "Popular", label: "Popular" },
          { value: "New Arrivals", label: "New Arrivals" },
        ],
      },
    ];

    return baseFilters;
  }, [brands, models, referenceNumbers]);

  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some(value => {
      if (value === null) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') {
        // For priceRange, check if it's different from default
        if (value.min !== undefined && value.max !== undefined) {
          return value.min !== 0 || value.max !== 1000000;
        }
        return Object.keys(value).length > 0;
      }
      return false;
    });
  }, [activeFilters]);

  // Debug logs
  useEffect(() => {
    console.log('WatchByFilterSidebar - Active Filters:', activeFilters);
    console.log('WatchByFilterSidebar - Price Range:', activeFilters?.priceRange);
  }, [activeFilters]);

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center h-14 xs:h-16">
          {/* Filters */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex flex-col items-center justify-center text-indigo-600 p-1 xs:p-2 transition-colors duration-200 relative"
            aria-label="Open filters"
          >
            <FiFilter className="h-5 xs:h-6 w-5 xs:w-6" />
            <span className="text-[10px] xs:text-xs mt-0.5">Filters</span>
            {hasActiveFilters && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Advanced Filters */}
          <button
            onClick={() => setShowAdvancedFilters(true)}
            className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-1 xs:p-2 transition-colors duration-200"
          >
            <FaSlidersH className="h-5 xs:h-6 w-5 xs:w-6" />
            <span className="text-[10px] xs:text-xs mt-0.5">Advanced</span>
          </button>
        </div>
      </div>

      {/* Mobile Filters Sidebar */}
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
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                searchTerms={searchTerms}
                setSearchTerms={setSearchTerms}
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
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        caseSizes={caseSizes}
        strapColors={strapColors}
      />

      {/* Desktop filters */}
      <div className="hidden md:block">
        <div className="sticky top-20">
          <div
            className="bg-white p-4 xs:p-5 sm:p-6 rounded-lg shadow-sm border border-gray-200"
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

            {/* Advanced Filters Button for Desktop */}
            <button
              onClick={() => setShowAdvancedFilters(true)}
              className="w-full mb-4 px-4 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FaSlidersH size={16} />
              Advanced Filters
            </button>

            {filters.map((section) => (
              <FilterSection
                key={section.id}
                section={section}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                searchTerms={searchTerms}
                setSearchTerms={setSearchTerms}
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

export default WatchByFilterSidebar;