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
  FiGrid,
  FiPlus,
  FiMinus
} from "react-icons/fi";
import { 
  FaTimes, 
  FaChevronDown,
  FaSlidersH
} from "react-icons/fa";

// Complete filter data structure
const filtersData = [
  {
    id: "type",
    name: "TYPE OF WATCH",
    type: "checkbox",
    options: [
      { value: "wrist_watch", label: "Wrist Watch" },
      { value: "pocket_watch", label: "Pocket Watch" },
      { value: "clocks", label: "Clocks" },
      { value: "stopwatch", label: "Stopwatch" },
      { value: "smart_watch", label: "Smart Watch" },
    ],
  },
  {
    id: "brand",
    name: "BRAND",
    type: "search-checkbox",
    options: [
      { value: "rolex", label: "Rolex" },
      { value: "omega", label: "Omega" },
      { value: "patek_philippe", label: "Patek Philippe" },
      { value: "audemars_piguet", label: "Audemars Piguet" },
      { value: "cartier", label: "Cartier" },
      { value: "tag_heuer", label: "TAG Heuer" },
      { value: "breitling", label: "Breitling" },
      { value: "iwc", label: "IWC" },
      { value: "hublot", label: "Hublot" },
      { value: "longines", label: "Longines" },
      { value: "tissot", label: "Tissot" },
      { value: "seiko", label: "Seiko" },
      { value: "casio", label: "Casio" },
      { value: "fossil", label: "Fossil" },
      { value: "apple", label: "Apple Watch" },
      { value: "samsung", label: "Samsung Galaxy Watch" },
    ],
  },
  {
    id: "model",
    name: "MODEL",
    type: "search-checkbox",
    options: [
      { value: "submariner", label: "Submariner" },
      { value: "daytona", label: "Daytona" },
      { value: "datejust", label: "Datejust" },
      { value: "speedmaster", label: "Speedmaster" },
      { value: "seamaster", label: "Seamaster" },
      { value: "nautilus", label: "Nautilus" },
      { value: "royal_oak", label: "Royal Oak" },
      { value: "santos", label: "Santos" },
      { value: "tank", label: "Tank" },
      { value: "carrera", label: "Carrera" },
    ],
  },
  {
    id: "reference_number",
    name: "REFERENCE NUMBER",
    type: "search-checkbox",
    options: [
      { value: "ref_124060", label: "124060" },
      { value: "ref_126610", label: "126610" },
      { value: "ref_116500", label: "116500" },
      { value: "ref_126234", label: "126234" },
      { value: "ref_311_30_42_30_01_005", label: "311.30.42.30.01.005" },
      { value: "ref_210_22_42_20_03_001", label: "210.22.42.20.03.001" },
      { value: "ref_5711_1a", label: "5711/1A" },
      { value: "ref_15202st", label: "15202ST" },
      { value: "ref_wssa0018", label: "WSSA0018" },
      { value: "ref_wsta0029", label: "WSTA0029" },
    ],
  },
  {
    id: "price",
    name: "PRICE",
    type: "price-range",
    options: [
      { value: "0-1000", label: "Under AED 1,000" },
      { value: "1000-5000", label: "AED 1,000 - AED 5,000" },
      { value: "5000-10000", label: "AED 5,000 - AED 10,000" },
      { value: "10000-20000", label: "AED 10,000 - AED 20,000" },
      { value: "20000-50000", label: "AED 20,000 - AED 50,000" },
      { value: "50000-100000", label: "AED 50,000 - AED 100,000" },
      { value: "100000-500000", label: "AED 100,000 - AED 500,000" },
      { value: "500000-1000000", label: "AED 500,000 - AED 1,000,000" },
      { value: "1000000+", label: "Over AED 1,000,000" },
    ],
    range: {
      min: 0,
      max: 1000000,
      step: 1000,
    }
  },
  {
    id: "gender",
    name: "GENDER",
    type: "checkbox",
    options: [
      { value: "men_unisex", label: "Men / Unisex" },
      { value: "women", label: "Women" },
    ],
  },
  {
    id: "condition",
    name: "CONDITION",
    type: "checkbox",
    options: [
      { value: "brand_new", label: "Brand New" },
      { value: "unworn_like_new", label: "Unworn / Like New" },
      { value: "pre_owned", label: "Pre-Owned" },
      { value: "not_working_parts", label: "Not Working / For Parts" },
    ],
  },
  {
    id: "item_condition",
    name: "ITEM CONDITION",
    type: "checkbox",
    options: [
      { value: "excellent", label: "Excellent" },
      { value: "good", label: "Good" },
      { value: "fair", label: "Fair" },
      { value: "poor", label: "Poor / Not Working / For Parts" },
    ],
  },
  {
    id: "scope_of_delivery",
    name: "SCOPE OF DELIVERY",
    type: "checkbox",
    options: [
      { value: "full_set", label: "Full Set (Watch + Original Box + Original Papers)" },
      { value: "watch_with_papers", label: "Watch with Original Papers" },
      { value: "watch_with_box", label: "Watch with Original Box" },
      { value: "watch_only", label: "Watch Only" },
      { value: "watch_with_safe_box", label: "Watch with Montres Safe Box" },
    ],
  },
  {
    id: "included_accessories",
    name: "INCLUDED ACCESSORIES",
    type: "checkbox",
    options: [
      { value: "extra_strap", label: "Extra Strap" },
      { value: "original_strap", label: "Original Strap" },
      { value: "warranty_card", label: "Warranty Card" },
      { value: "certificate", label: "Certificate" },
      { value: "travel_case", label: "Travel Case" },
      { value: "bezel_protector", label: "Bezel Protector" },
      { value: "cleaning_cloth", label: "Cleaning Cloth" },
      { value: "other_accessories", label: "Other Accessories" },
    ],
  },
  {
    id: "availability",
    name: "AVAILABILITY",
    type: "checkbox",
    options: [
      { value: "in_stock", label: "In Stock" },
      { value: "sold_out", label: "Sold Out" },
    ],
  },
  {
    id: "badges",
    name: "BADGES",
    type: "checkbox",
    options: [
      { value: "popular", label: "Popular" },
      { value: "new_arrivals", label: "New Arrivals" },
    
    ],
  },
];

// Color options with actual color representation
const colorOptions = [
  { value: "black", label: "Black", color: "#000000" },
  { value: "white", label: "White", color: "#FFFFFF", border: "1px solid #E5E7EB" },
  { value: "blue", label: "Blue", color: "#3B82F6" },
  { value: "green", label: "Green", color: "#10B981" },
  { value: "silver", label: "Silver", color: "#9CA3AF" },
  { value: "gold", label: "Gold", color: "#F59E0B" },
  { value: "mother_of_pearl", label: "Mother of Pearl", color: "linear-gradient(45deg, #FFE5F1, #E0F7FA, #FFF9C4)" },
  { value: "grey", label: "Grey", color: "#6B7280" },
  { value: "brown", label: "Brown", color: "#92400E" },
  { value: "champagne", label: "Champagne", color: "#FDE68A" },
  { value: "red", label: "Red", color: "#EF4444" },
  { value: "navy", label: "Navy", color: "#1E3A8A" },
  { value: "burgundy", label: "Burgundy", color: "#831843" },
  { value: "rose_gold", label: "Rose Gold", color: "#FBCFE8" },
  { value: "bronze", label: "Bronze", color: "#D97706" },
];

// Advanced filters for modal
const advancedFiltersData = [
  {
    id: "dial_color",
    name: "Dial Color",
    type: "color-picker",
    options: colorOptions,
  },
  {
    id: "case_color",
    name: "Case Color",
    type: "color-picker",
    options: colorOptions,
  },
  {
    id: "strap_color",
    name: "Strap Color",
    type: "color-picker",
    options: colorOptions,
  },
  {
    id: "strap_material",
    name: "Strap Material",
    type: "checkbox",
    options: [
      { value: "stainless_steel", label: "Stainless Steel" },
      { value: "leather", label: "Leather" },
      { value: "rubber", label: "Rubber" },
      { value: "ceramic", label: "Ceramic" },
      { value: "titanium", label: "Titanium" },
      { value: "gold", label: "Gold" },
      { value: "fabric", label: "Fabric" },
      { value: "silicone", label: "Silicone" },
    ],
  },
  {
    id: "case_material",
    name: "Case Material",
    type: "checkbox",
    options: [
      { value: "stainless_steel", label: "Stainless Steel" },
      { value: "gold", label: "Gold" },
      { value: "rose_gold", label: "Rose Gold" },
      { value: "platinum", label: "Platinum" },
      { value: "titanium", label: "Titanium" },
      { value: "ceramic", label: "Ceramic" },
      { value: "bronze", label: "Bronze" },
    ],
  },
  {
    id: "case_size",
    name: "Case Size (mm)",
    type: "checkbox",
    options: [
      { value: "28-32", label: "28-32mm" },
      { value: "33-36", label: "33-36mm" },
      { value: "37-39", label: "37-39mm" },
      { value: "40-42", label: "40-42mm" },
      { value: "43-45", label: "43-45mm" },
      { value: "46-48", label: "46-48mm" },
      { value: "49+", label: "49mm and above" },
    ],
  },
  {
    id: "strap_size",
    name: "Strap Size (mm)",
    type: "checkbox",
    options: [
      { value: "14-16", label: "14-16mm" },
      { value: "17-19", label: "17-19mm" },
      { value: "20-22", label: "20-22mm" },
      { value: "23-25", label: "23-25mm" },
      { value: "26-28", label: "26-28mm" },
    ],
  },
  {
    id: "year_of_production",
    name: "Year of Production",
    type: "checkbox",
    options: [
      { value: "2020-2024", label: "2020-2024" },
      { value: "2015-2019", label: "2015-2019" },
      { value: "2010-2014", label: "2010-2014" },
      { value: "2000-2009", label: "2000-2009" },
      { value: "1990-1999", label: "1990-1999" },
      { value: "1980-1989", label: "1980-1989" },
      { value: "1970-1979", label: "1970-1979" },
      { value: "1960-1969", label: "1960-1969" },
      { value: "1950-1959", label: "1950-1959" },
      { value: "pre_1950", label: "Pre-1950" },
    ],
  },
  {
    id: "water_resistance",
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
  {
    id: "movement",
    name: "Movement Type",
    type: "checkbox",
    options: [
      { value: "automatic", label: "Automatic" },
      { value: "manual_wind", label: "Manual Wind" },
      { value: "quartz", label: "Quartz" },
      { value: "solar", label: "Solar" },
      { value: "kinetic", label: "Kinetic" },
      { value: "smart", label: "Smart/Connected" },
    ],
  },
  {
    id: "complications",
    name: "Complications",
    type: "checkbox",
    options: [
      { value: "date", label: "Date" },
      { value: "day_date", label: "Day-Date" },
      { value: "chronograph", label: "Chronograph" },
      { value: "moon_phase", label: "Moon Phase" },
      { value: "gmt", label: "GMT" },
      { value: "perpetual_calendar", label: "Perpetual Calendar" },
      { value: "tourbillon", label: "Tourbillon" },
      { value: "power_reserve", label: "Power Reserve" },
    ],
  },
  {
    id: "crystal",
    name: "Crystal Material",
    type: "checkbox",
    options: [
      { value: "sapphire", label: "Sapphire" },
      { value: "mineral", label: "Mineral" },
      { value: "plexiglas", label: "Plexiglas" },
      { value: "hardlex", label: "Hardlex" },
    ],
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

// Color Picker Component
const ColorPicker = ({ options, selectedColors = [], onColorChange }) => {
  return (
    <div className="grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 gap-2 xs:gap-3">
      {options.map((colorOption) => (
        <button
          key={colorOption.value}
          className={`relative flex flex-col items-center p-1 xs:p-2 rounded-lg border-2 transition-all duration-200 ${
            selectedColors.includes(colorOption.value)
              ? "border-indigo-600 bg-indigo-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onColorChange(colorOption.value)}
        >
          {/* Color Circle */}
          <div
            className="w-6 h-6 xs:w-8 xs:h-8 rounded-full border border-gray-200 mb-1"
            style={{ 
              background: colorOption.color,
              border: colorOption.border || 'none'
            }}
          />
          
          {/* Checkmark for selected */}
          {selectedColors.includes(colorOption.value) && (
            <div className="absolute -top-1 -right-1 bg-indigo-600 rounded-full p-0.5">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          
          {/* Label */}
          <span className="text-[10px] xs:text-xs text-gray-600 text-center leading-tight">
            {colorOption.label}
          </span>
        </button>
      ))}
    </div>
  );
};

// Filter section component
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

  // Handle color selection
  const handleColorChange = (colorValue) => {
    toggleFilter && toggleFilter(section.id, colorValue);
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

              {/* Color Picker */}
              {section.type === "color-picker" && (
                <ColorPicker
                  options={section.options}
                  selectedColors={activeFilters?.[section.id] || []}
                  onColorChange={handleColorChange}
                />
              )}

              {/* Price Range Slider */}
              {section.type === "price-range" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">AED {activeFilters?.priceRange?.min || section.range.min}</span>
                    <span className="text-sm text-gray-600">AED {activeFilters?.priceRange?.max || section.range.max}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min={section.range.min}
                      max={section.range.max}
                      step={section.range.step}
                      value={activeFilters?.priceRange?.max || section.range.max}
                      onChange={(e) => toggleFilter?.('priceRange', { 
                        min: activeFilters?.priceRange?.min || section.range.min, 
                        max: parseInt(e.target.value) 
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={activeFilters?.priceRange?.min || ''}
                      onChange={(e) => toggleFilter?.('priceRange', { 
                        min: parseInt(e.target.value) || section.range.min, 
                        max: activeFilters?.priceRange?.max || section.range.max 
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={activeFilters?.priceRange?.max || ''}
                      onChange={(e) => toggleFilter?.('priceRange', { 
                        min: activeFilters?.priceRange?.min || section.range.min, 
                        max: parseInt(e.target.value) || section.range.max 
                      })}
                    />
                  </div>
                </div>
              )}

              {/* Checkbox options */}
              {section.type === "checkbox" && filteredOptions.map((option, optionIdx) => (
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

// Advanced Filters Modal
const AdvancedFiltersModal = ({ isOpen, onClose, activeFilters, toggleFilter }) => {
  const [searchTerms, setSearchTerms] = useState({});
  const [tempFilters, setTempFilters] = useState(activeFilters);

  // Initialize temp filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempFilters(activeFilters);
    }
  }, [isOpen, activeFilters]);

  // Handle filter changes in temp state
  const handleTempFilterChange = (type, value, clear = false) => {
    setTempFilters((prev) => {
      if (clear) {
        const newFilters = { ...prev };
        delete newFilters[type];
        return newFilters;
      }

      if (type === 'priceRange') {
        return { ...prev, [type]: value };
      }

      const currentValues = prev[type] || [];
      const updated = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      
      if (updated.length === 0) {
        const newFilters = { ...prev };
        delete newFilters[type];
        return newFilters;
      }
      
      return { ...prev, [type]: updated };
    });
  };

  // Apply filters and close modal
  const handleApplyFilters = () => {
    // Update the actual active filters with temp filters
    Object.keys(tempFilters).forEach(type => {
      if (type === 'priceRange') {
        // Price range is handled differently
        return;
      }
      
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

    // Handle price range
    if (tempFilters.priceRange && (!activeFilters.priceRange || 
        tempFilters.priceRange.min !== activeFilters.priceRange.min || 
        tempFilters.priceRange.max !== activeFilters.priceRange.max)) {
      toggleFilter('priceRange', tempFilters.priceRange);
    }
    
    onClose();
  };

  // Clear all advanced filters
  const clearAdvancedFilters = () => {
    advancedFiltersData.forEach(section => {
      toggleFilter(section.id, null, true);
    });
    setTempFilters(prev => {
      const newFilters = { ...prev };
      advancedFiltersData.forEach(section => {
        delete newFilters[section.id];
      });
      return newFilters;
    });
  };

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
              activeFilters={tempFilters}
              toggleFilter={handleTempFilterChange}
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
              onClick={clearAdvancedFilters}
            >
              Clear Advanced
            </button>
            <button
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WatchByFilterSidebar = ({ 
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
  const [searchTerms, setSearchTerms] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Memoize data
  const filters = useMemo(() => filtersData, []);
  const menuItems = useMemo(() => menuItemsData, []);

  // Initialize temp filters when activeFilters change
  useEffect(() => {
    setTempFilters(activeFilters);
  }, [activeFilters]);

  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some(arr => arr && arr.length > 0) || 
           activeFilters.priceRange;
  }, [activeFilters]);

  // Check if temp filters are different from active filters
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(tempFilters) !== JSON.stringify(activeFilters);
  }, [tempFilters, activeFilters]);

  // Handle filter changes in temp state
  const handleTempFilterChange = (type, value, clear = false) => {
    setTempFilters((prev) => {
      if (clear) {
        const newFilters = { ...prev };
        delete newFilters[type];
        return newFilters;
      }

      if (type === 'priceRange') {
        return { ...prev, [type]: value };
      }

      const currentValues = prev[type] || [];
      const updated = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      
      if (updated.length === 0) {
        const newFilters = { ...prev };
        delete newFilters[type];
        return newFilters;
      }
      
      return { ...prev, [type]: updated };
    });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    // Update the actual active filters with temp filters
    Object.keys(tempFilters).forEach(type => {
      if (type === 'priceRange') {
        // Price range is handled differently
        return;
      }
      
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

    // Handle price range
    if (tempFilters.priceRange && (!activeFilters.priceRange || 
        tempFilters.priceRange.min !== activeFilters.priceRange.min || 
        tempFilters.priceRange.max !== activeFilters.priceRange.max)) {
      toggleFilter('priceRange', tempFilters.priceRange);
    }
    
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
      if (e.key === "Escape" && showAdvancedFilters) {
        setShowAdvancedFilters(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen, showAdvancedFilters]);

  return (
    <>
      {/* Mobile Bottom Navigation */}
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
                activeFilters={tempFilters}
                toggleFilter={handleTempFilterChange}
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
              onClick={handleApplyFilters}
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
      />

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