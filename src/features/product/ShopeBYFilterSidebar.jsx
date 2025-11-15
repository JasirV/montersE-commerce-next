"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const ShopeBYFilterSidebar = ({ 
  activeFilters = {}, 
  toggleFilter, 
  mobileFiltersOpen, 
  setMobileFiltersOpen,
  brands = [],
  models = [],
  clearAllFilters,
  applyFilters
}) => {
  const [openSections, setOpenSections] = useState(new Set(['SHOP BY CATEGORY']));
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [localFilters, setLocalFilters] = useState({});
  const [searchTerms, setSearchTerms] = useState({});

  // Initialize local filters from activeFilters
  useEffect(() => {
    setLocalFilters({
      category: activeFilters.category || [],
      brand: activeFilters.brand || [],
      model: activeFilters.model || [],
      gender: activeFilters.gender || [],
      availability: activeFilters.availability || [],
      condition: activeFilters.condition || [],
      itemCondition: activeFilters.itemCondition || [],
      scopeOfDelivery: activeFilters.scopeOfDelivery || [],
      badges: activeFilters.badges || [],
    });
    
    // Initialize price range from active filters
    if (activeFilters.priceRange) {
      setPriceRange(activeFilters.priceRange);
    } else {
      setPriceRange({ min: 0, max: 50000 });
    }
  }, [activeFilters]);

  // Filter options based on your API structure
  const filterOptions = useMemo(() => ({
    categories: ['Watch', 'Jewellery', 'Gold', 'Accessories', 'Leather Goods', 'Leather Bags'],
    gender: ['Men/Unisex', 'Women'],
    availability: ['In Stock', 'Sold Out'],
    condition: ['Brand New', 'Unworn / Like New', 'Pre-Owned', 'Excellent', 'Not Working / For Parts'],
    itemCondition: ['Excellent', 'Good', 'Fair', 'Poor / Not Working / For Parts'],
    scopeOfDelivery: [
      'Full Set (Watch + Original Box + Original Papers)',
      'Watch with Original Papers',
      'Watch with Original Box',
      'Watch with Montres Safe Box',
      'Watch Only'
    ],
    badges: ['Popular', 'New Arrivals']
  }), []);

  const toggleSection = (section) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const handleLocalFilterChange = (filterType, value, isChecked) => {
    setLocalFilters(prev => {
      const currentValues = prev[filterType] || [];
      
      let newValues;
      if (isChecked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter(item => item !== value);
      }

      return {
        ...prev,
        [filterType]: newValues
      };
    });
  };

  const handlePriceRangeChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  const handleSearchChange = (section, value) => {
    setSearchTerms(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const getSearchResults = (items, section) => {
    const searchTerm = searchTerms[section] || '';
    if (!searchTerm) return items;
    
    return items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // CORRECTED: Proper apply filters function
  const handleApplyFilters = () => {
    console.log('Applying filters from sidebar:', {
      localFilters,
      priceRange
    });

    // Clear all existing filters first
    if (clearAllFilters) {
      clearAllFilters();
    }

    // Apply all local filters
    Object.keys(localFilters).forEach(key => {
      localFilters[key].forEach(value => {
        toggleFilter(key, value);
      });
    });

    // Apply price range if not default
    if (priceRange.min > 0 || priceRange.max < 50000) {
      toggleFilter('priceRange', priceRange);
    }

    if (applyFilters) {
      applyFilters();
    }
    setMobileFiltersOpen(false);
  };

  // CORRECTED: Better clear all function
  const handleClearAll = () => {
    setLocalFilters({
      category: [],
      brand: [],
      model: [],
      gender: [],
      availability: [],
      condition: [],
      itemCondition: [],
      scopeOfDelivery: [],
      badges: [],
    });
    setPriceRange({ min: 0, max: 50000 });
    setSearchTerms({});
    
    if (clearAllFilters) {
      clearAllFilters();
    }
  };

  const FilterSection = ({ 
    title, 
    children, 
    isOpen = false 
  }) => {
    const isExpanded = openSections.has(title) || isOpen;

    return (
      <div className="border-b border-gray-200 pb-4">
        <button
          className="flex justify-between items-center w-full py-3 text-left font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          onClick={() => toggleSection(title)}
        >
          <span className="text-sm uppercase tracking-wide">{title}</span>
          {isExpanded ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
        
        <div className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-2 pb-1">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const SearchableList = ({ 
    placeholder, 
    items, 
    filterType,
    sectionKey
  }) => {
    const filteredItems = getSearchResults(items, sectionKey);
    const selectedItems = localFilters[filterType] || [];

    return (
      <div className="space-y-2">
        <div className="relative">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerms[sectionKey] || ''}
            onChange={(e) => handleSearchChange(sectionKey, e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {filteredItems.map((item, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={(e) => handleLocalFilterChange(filterType, item, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {item}
              </span>
            </label>
          ))}
          {filteredItems.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-2">
              No items found
            </div>
          )}
        </div>
      </div>
    );
  };

  const PriceRangeFilter = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">AED {priceRange.min.toLocaleString()}</span>
          <span className="text-sm text-gray-600">AED {priceRange.max.toLocaleString()}</span>
        </div>
        
        {/* Range Slider */}
        <div className="relative py-4">
          <div className="relative h-2 bg-gray-200 rounded-lg">
            <div 
              className="absolute h-2 bg-blue-600 rounded-lg"
              style={{
                left: `${(priceRange.min / 50000) * 100}%`,
                right: `${100 - (priceRange.max / 50000) * 100}%`
              }}
            ></div>
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={priceRange.min}
            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
            className="absolute w-full h-2 opacity-0 cursor-pointer top-4"
          />
          <input
            type="range"
            min="0"
            max="50000"
            step="100"
            value={priceRange.max}
            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
            className="absolute w-full h-2 opacity-0 cursor-pointer top-4"
          />
        </div>

        {/* Input Fields */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">Max Price</label>
            <input
              type="number"
              placeholder="50000"
              value={priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    );
  };

  const CheckboxOption = ({ label, filterType, checked = false }) => (
    <label className="flex items-center space-x-2 cursor-pointer group py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => handleLocalFilterChange(filterType, label, e.target.checked)}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </label>
  );

  const RadioOption = ({ label, name, filterType, checked = false }) => (
    <label className="flex items-center space-x-2 cursor-pointer group py-1">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={(e) => {
          if (e.target.checked) {
            // For radio buttons, replace the entire array with the selected value
            setLocalFilters(prev => ({
              ...prev,
              [filterType]: [label]
            }));
          }
        }}
        className="border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </label>
  );

  // Count total active filters for badge
  const totalActiveFilters = useMemo(() => {
    let count = Object.values(localFilters).reduce((total, current) => total + current.length, 0);
    // Count price range as active if not default
    if (priceRange.min > 0 || priceRange.max < 50000) {
      count += 1;
    }
    return count;
  }, [localFilters, priceRange]);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileFiltersOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setMobileFiltersOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen md:h-auto
        w-full sm:w-80 md:w-72 bg-white z-50 md:z-auto
        transform transition-transform duration-300 ease-in-out
        overflow-y-auto
        shadow-xl md:shadow-none
        ${mobileFiltersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">
              FILTERS
              {totalActiveFilters > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {totalActiveFilters}
                </span>
              )}
            </h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-4 space-y-6 pb-32 md:pb-4">
          {/* SHOP BY CATEGORY */}
          <FilterSection title="SHOP BY CATEGORY" isOpen={true}>
            <div className="space-y-2">
              {filterOptions.categories.map((category) => (
                <CheckboxOption 
                  key={category} 
                  label={category} 
                  filterType="category"
                  checked={(localFilters.category || []).includes(category)}
                />
              ))}
            </div>
          </FilterSection>

          {/* PRICE */}
          <FilterSection title="PRICE">
            <PriceRangeFilter />
          </FilterSection>

          {/* BRANDS */}
          <FilterSection title="BRANDS">
            <SearchableList 
              placeholder="Search brands..." 
              items={brands}
              filterType="brand"
              sectionKey="brands"
            />
          </FilterSection>

          {/* MODELS */}
          <FilterSection title="MODELS">
            <SearchableList 
              placeholder="Search models..." 
              items={models}
              filterType="model"
              sectionKey="models"
            />
          </FilterSection>

          {/* GENDER */}
          <FilterSection title="GENDER">
            <div className="space-y-2">
              {filterOptions.gender.map((gender) => (
                <RadioOption 
                  key={gender}
                  name="gender" 
                  label={gender} 
                  filterType="gender"
                  checked={(localFilters.gender || []).includes(gender)}
                />
              ))}
            </div>
          </FilterSection>

          {/* AVAILABILITY */}
          <FilterSection title="AVAILABILITY">
            <div className="space-y-2">
              {filterOptions.availability.map((availability) => (
                <CheckboxOption 
                  key={availability}
                  label={availability} 
                  filterType="availability"
                  checked={(localFilters.availability || []).includes(availability)}
                />
              ))}
            </div>
          </FilterSection>

          {/* CONDITION */}
          <FilterSection title="CONDITION">
            <div className="space-y-2">
              {filterOptions.condition.map((condition) => (
                <CheckboxOption 
                  key={condition}
                  label={condition} 
                  filterType="condition"
                  checked={(localFilters.condition || []).includes(condition)}
                />
              ))}
            </div>
          </FilterSection>

          {/* ITEM CONDITION */}
          <FilterSection title="ITEM CONDITION">
            <div className="space-y-2">
              {filterOptions.itemCondition.map((itemCondition) => (
                <CheckboxOption 
                  key={itemCondition}
                  label={itemCondition} 
                  filterType="itemCondition"
                  checked={(localFilters.itemCondition || []).includes(itemCondition)}
                />
              ))}
            </div>
          </FilterSection>

          {/* SCOPE OF DELIVERY */}
          <FilterSection title="SCOPE OF DELIVERY">
            <div className="space-y-2">
              {filterOptions.scopeOfDelivery.map((scope) => (
                <CheckboxOption 
                  key={scope} 
                  label={scope} 
                  filterType="scopeOfDelivery"
                  checked={(localFilters.scopeOfDelivery || []).includes(scope)}
                />
              ))}
            </div>
          </FilterSection>

          {/* BADGES */}
          <FilterSection title="BADGES">
            <div className="space-y-2">
              {filterOptions.badges.map((badge) => (
                <CheckboxOption 
                  key={badge}
                  label={badge} 
                  filterType="badges"
                  checked={(localFilters.badges || []).includes(badge)}
                />
              ))}
            </div>
          </FilterSection>

          {/* Action Buttons - Sticky on Mobile */}
          <div className="fixed bottom-0 left-0 right-0 md:static bg-white border-t border-gray-200 p-4 md:p-0 md:border-t-0 md:pt-4 space-y-2 shadow-lg md:shadow-none">
            <button 
              className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 rounded-lg font-semibold shadow-sm hover:from-[#1a477a] hover:to-[#005399] transition-colors"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </button>
            <button 
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              onClick={handleClearAll}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopeBYFilterSidebar;