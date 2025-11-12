import React, { useState, useEffect } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ShopeBYFilterSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState(new Set());
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    brands: [],
    models: [],
    referenceNumbers: [],
    gender: '',
    availability: [],
    condition: [],
    itemCondition: [],
    discount: [],
    scopeOfDelivery: [],
    badges: [],
    luxuryBrands: [],
    luxuryModels: [],
    luxuryReferenceNumbers: []
  });

  // Dummy data
  const dummyData = {
    brands: [
      'Rolex', 'Omega', 'Tag Heuer', 'Seiko', 'Casio', 
      'Tissot', 'Fossil', 'Michael Kors', 'Apple', 'Samsung'
    ],
    models: [
      'Submariner', 'Speedmaster', 'Aquaracer', 'Presage', 'G-Shock',
      'Le Locle', 'Grant', 'Watch Series', 'Galaxy Watch', 'Datejust'
    ],
    referenceNumbers: [
      'REF-001', 'REF-002', 'REF-003', 'REF-004', 'REF-005',
      'REF-006', 'REF-007', 'REF-008', 'REF-009', 'REF-010'
    ],
    luxuryBrands: [
      'Patek Philippe', 'Audemars Piguet', 'Richard Mille', 
      'Vacheron Constantin', 'Jaeger-LeCoultre', 'Breguet'
    ],
    luxuryModels: [
      'Nautilus', 'Royal Oak', 'RM 011', 'Overseas', 'Reverso', 'Classique'
    ],
    luxuryReferenceNumbers: [
      'LUX-001', 'LUX-002', 'LUX-003', 'LUX-004', 'LUX-005'
    ]
  };

  const toggleSection = (section) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(section)) {
      newOpenSections.delete(section);
    } else {
      newOpenSections.add(section);
    }
    setOpenSections(newOpenSections);
  };

  const handleFilterChange = (filterType, value, isChecked = null) => {
    setSelectedFilters(prev => {
      if (filterType === 'gender') {
        return { ...prev, gender: isChecked ? value : '' };
      }
      
      if (typeof isChecked === 'boolean') {
        if (isChecked) {
          return {
            ...prev,
            [filterType]: [...prev[filterType], value]
          };
        } else {
          return {
            ...prev,
            [filterType]: prev[filterType].filter(item => item !== value)
          };
        }
      }
      
      return prev;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      brands: [],
      models: [],
      referenceNumbers: [],
      gender: '',
      availability: [],
      condition: [],
      itemCondition: [],
      discount: [],
      scopeOfDelivery: [],
      badges: [],
      luxuryBrands: [],
      luxuryModels: [],
      luxuryReferenceNumbers: []
    });
    setPriceRange([0, 10000]);
  };

  const removeFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].filter(item => item !== value)
    }));
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
    selectedItems = [] 
  }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [localItems, setLocalItems] = useState(items);

    useEffect(() => {
      if (searchTerm) {
        const filtered = items.filter(item => 
          item.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setLocalItems(filtered);
      } else {
        setLocalItems(items);
      }
    }, [searchTerm, items]);

    return (
      <div className="space-y-2">
        <div className="relative">
          <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {localItems.map((item, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={(e) => handleFilterChange(filterType, item, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {item}
              </span>
            </label>
          ))}
          {localItems.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-2">
              No items found
            </div>
          )}
        </div>
      </div>
    );
  };

  const PriceRangeChart = () => {
    const pricePoints = [0, 1000, 2500, 5000, 7500, 10000];
    const priceData = [20, 40, 60, 80, 100, 80, 60, 40, 30, 50];

    return (
      <div className="space-y-3">
        {/* Price Range Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Price Range</span>
            <span className="text-sm font-semibold text-blue-600">
              {priceRange[0].toLocaleString()} AED - {priceRange[1].toLocaleString()} AED
            </span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer pointer-events-none"
            />
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer pointer-events-none"
            />
            <div className="relative h-2">
              <div className="absolute h-2 bg-blue-500 rounded-lg" 
                   style={{left: `${(priceRange[0]/10000)*100}%`, right: `${100-(priceRange[1]/10000)*100}%`}}>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            {pricePoints.map((price) => (
              <span key={price}>{price.toLocaleString()} AED</span>
            ))}
          </div>
        </div>

        {/* Price Distribution Chart */}
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Price Distribution</span>
          <div className="h-16 flex items-end space-x-1 bg-gray-50 rounded-lg p-2">
            {priceData.map((height, index) => (
              <div
                key={index}
                className="flex-1 bg-blue-400 rounded-t hover:bg-blue-500 transition-colors cursor-pointer"
                style={{ height: `${height}%` }}
                title={`${Math.round((index/priceData.length)*10000).toLocaleString()} AED`}
              />
            ))}
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
        onChange={(e) => handleFilterChange(filterType, label, e.target.checked)}
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
        onChange={(e) => handleFilterChange(filterType, label, e.target.checked)}
        className="border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </label>
  );

  // Active filters display
  const ActiveFilters = () => {
    const activeFilters = [];
    
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach(value => {
          if (value) {
            activeFilters.push({ type: key, value });
          }
        });
      } else if (values) {
        activeFilters.push({ type: key, value: values });
      }
    });

    if (activeFilters.length === 0) return null;

    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Active Filters</h3>
          <button
            onClick={clearAllFilters}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear All
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {filter.value}
              <button
                onClick={() => removeFilter(filter.type, filter.value)}
                className="hover:text-blue-900"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </span>
          ))}
          {priceRange[0] > 0 || priceRange[1] < 10000 ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Price: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} AED
              <button
                onClick={() => setPriceRange([0, 10000])}
                className="hover:text-green-900"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </span>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center shadow-xl"
        >
          <FunnelIcon className="h-6 w-6" />
          {Object.values(selectedFilters).flat().filter(Boolean).length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {Object.values(selectedFilters).flat().filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto
        w-full sm:w-80 lg:w-64 xl:w-72 bg-white z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out
        overflow-y-auto
        shadow-xl lg:shadow-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">FILTERS</h2>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <ActiveFilters />

        {/* Filter Content */}
        <div className="p-4 space-y-6 pb-32 lg:pb-4">
          {/* SHOP BY CATEGORY */}
          <FilterSection title="SHOP BY CATEGORY" isOpen={true}>
            <div className="space-y-2">
              {['Watches', 'Accessories', 'Leather/Leather goods', 'Jewelry', 'Golds'].map((category) => (
                <CheckboxOption 
                  key={category} 
                  label={category} 
                  filterType="categories"
                  checked={selectedFilters.categories.includes(category)}
                />
              ))}
            </div>
          </FilterSection>

          {/* PRICE */}
          <FilterSection title="PRICE">
            <PriceRangeChart />
          </FilterSection>

          {/* BRANDS */}
          <FilterSection title="BRANDS">
            <SearchableList 
              placeholder="Search brands..." 
              items={dummyData.brands}
              filterType="brands"
              selectedItems={selectedFilters.brands}
            />
          </FilterSection>

          {/* MODELS */}
          <FilterSection title="MODELS">
            <SearchableList 
              placeholder="Search models..." 
              items={dummyData.models}
              filterType="models"
              selectedItems={selectedFilters.models}
            />
          </FilterSection>

          {/* REFERENCE NUMBERS */}
          <FilterSection title="REFERENCE NUMBERS">
            <SearchableList 
              placeholder="Search reference numbers..." 
              items={dummyData.referenceNumbers}
              filterType="referenceNumbers"
              selectedItems={selectedFilters.referenceNumbers}
            />
          </FilterSection>

          {/* GENDER */}
          <FilterSection title="GENDER">
            <div className="space-y-2">
              <RadioOption 
                name="gender" 
                label="Men / Unisex" 
                filterType="gender"
                checked={selectedFilters.gender === 'Men / Unisex'}
              />
              <RadioOption 
                name="gender" 
                label="Women" 
                filterType="gender"
                checked={selectedFilters.gender === 'Women'}
              />
            </div>
          </FilterSection>

          {/* AVAILABILITY */}
          <FilterSection title="AVAILABILITY">
            <div className="space-y-2">
              <CheckboxOption 
                label="In Stock" 
                filterType="availability"
                checked={selectedFilters.availability.includes('In Stock')}
              />
              <CheckboxOption 
                label="Sold Out" 
                filterType="availability"
                checked={selectedFilters.availability.includes('Sold Out')}
              />
            </div>
          </FilterSection>

          {/* CONDITION */}
          <FilterSection title="CONDITION">
            <div className="space-y-2">
              <CheckboxOption 
                label="New Model" 
                filterType="condition"
                checked={selectedFilters.condition.includes('New Model')}
              />
              <CheckboxOption 
                label="Unworn" 
                filterType="condition"
                checked={selectedFilters.condition.includes('Unworn')}
              />
              <CheckboxOption 
                label="Used" 
                filterType="condition"
                checked={selectedFilters.condition.includes('Used')}
              />
            </div>
          </FilterSection>

          {/* ITEM CONDITION */}
          <FilterSection title="ITEM CONDITION">
            <div className="space-y-2">
              <CheckboxOption 
                label="Good" 
                filterType="itemCondition"
                checked={selectedFilters.itemCondition.includes('Good')}
              />
              <CheckboxOption 
                label="Excellent" 
                filterType="itemCondition"
                checked={selectedFilters.itemCondition.includes('Excellent')}
              />
            </div>
          </FilterSection>

          {/* DISCOUNT */}
          <FilterSection title="DISCOUNT">
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Any %</span>
              </label>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </FilterSection>

      

          {/* SCOPE OF DELIVERY */}
          <FilterSection title="SCOPE OF DELIVERY">
            <div className="space-y-2">
              {['Full Set', 'Box Only', 'Papers Only', 'Watch Only'].map((scope) => (
                <CheckboxOption 
                  key={scope} 
                  label={scope} 
                  filterType="scopeOfDelivery"
                  checked={selectedFilters.scopeOfDelivery.includes(scope)}
                />
              ))}
            </div>
          </FilterSection>

          {/* BADGES */}
          <FilterSection title="BADGES">
            <div className="space-y-2">
              {['Popular', 'New Arrivals', 'Promoted'].map((badge) => (
                <label key={badge} className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedFilters.badges.includes(badge)}
                    onChange={(e) => handleFilterChange('badges', badge, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 flex items-center">
                    {badge}
                    {badge === 'New Arrivals' && (
                      <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">New</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Action Buttons - Sticky on Mobile */}
          <div className="fixed bottom-0 left-0 right-0 lg:static bg-white border-t border-gray-200 p-4 lg:p-0 lg:border-t-0 lg:pt-4 space-y-2 shadow-lg lg:shadow-none">
            <button 
              className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 rounded-lg font-semibold shadow-sm hover:from-[#1a477a] hover:to-[#005399] transition-colors"
              onClick={() => {
                console.log('Applied Filters:', { selectedFilters, priceRange });
                setIsMobileOpen(false);
              }}
            >
              Apply Filters
            </button>
            <button 
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              onClick={clearAllFilters}
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