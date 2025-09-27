"use client";

import React, { useState, useMemo, memo, lazy, Suspense, useEffect } from "react";
import { Disclosure } from '@headlessui/react';
import Link from 'next/link';


// Lazy load icons for better performance
const FiFilter = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiFilter })));
const FiX = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiX })));
const FiChevronDown = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiChevronDown })));
const FiSearch = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiSearch })));
const FiShoppingCart = lazy(() => import('react-icons/fi').then(module => ({ default: module.FiShoppingCart })));
const FaTimes = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaTimes })));
const FaChevronDown = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaChevronDown })));
const FaChevronRight = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaChevronRight })));

import {

  FiUser,
  FiClock,
  FiGrid,
} from "react-icons/fi";
// Memoized filter data
const filtersData = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'watch', label: 'Watch' },
      { value: 'sport', label: 'Sport' },
      { value: 'classic', label: 'Classic' },
    ],
  },
  {
    id: 'price',
    name: 'Price',
    options: [
      { value: '1-500', label: 'AED 1 - AED 500' },
      { value: '2501-5000', label: 'AED 2501 - AED 5000' },
      { value: '8000-90000', label: 'AED 8000 - AED 90000' },
    ],
  },
  {
    id: 'brand',
    name: 'Brand',
    options: [
      { value: 'rolex', label: 'Rolex' },
      { value: 'omega', label: 'Omega' },
      { value: 'rado', label: 'Rado' },
      { value: 'hurmen', label: 'Hurmen' },
    ],
  },
  {
    id: 'discount',
    name: 'Discount',
    options: [
      { value: '90', label: '90% or More' },
      { value: '40', label: '40% or More' },
      { value: '20', label: '20% or More' },
      { value: '60', label: '60% or More' },
    ],
  },
  {
    id: 'rating',
    name: 'Rating',
    options: [
      { value: '5', label: '★★★★★' },
      { value: '4', label: '★★★★☆ & Up' },
      { value: '3', label: '★★★☆☆ & Up' },
      { value: '2', label: '★★☆☆☆ & Up' },
    ],
  },
  {
    id: 'badges',
    name: 'Badges',
    options: [
      { value: 'deal_of_day', label: 'Deal of the Day' },
      { value: 'in_demand', label: 'In Demand' },
      { value: 'moglix_choice', label: 'Moglix Choice' },
      { value: 'same_day_dispatch', label: 'Same Day Dispatch' },
      { value: 'top_seller', label: 'Top Seller' },
    ],
  },
  {
    id: 'availability',
    name: 'Availability',
    options: [
      { value: 'in_stock', label: 'Show in stock only' },
    ],
  },
];

// Memoized menu items
const menuItemsData = [
  { name: 'Home', path: '/' },
  { 
    name: 'Shop', 
    path: '/shop', 
    subMenu: [
      { name: 'All Products', path: '/shop/all' },
      { name: 'New Arrivals', path: '/shop/new' },
      { name: 'Best Sellers', path: '/shop/bestsellers' }
    ]
  },
  { name: 'Collections', path: '/collections' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' }
];

// Filter section component to prevent re-renders
const FilterSection = memo(({ section }) => {
  return (
    <Disclosure as="div" className="border-b border-gray-200 py-4">
      {({ open }) => (
        <>
          <h3 className="-mx-2 -my-3 flow-root">
            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-600 hover:text-gray-900">
              <span className="text-base xs:text-lg font-bold text-gray-900">{section.name}</span>
              <span className="ml-6 flex items-center">
                <Suspense fallback={<div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>}>
                  <FiChevronDown
                    className={`${open ? '-rotate-180' : 'rotate-0'} h-5 xs:h-6 w-5 xs:w-6 transform transition-transform duration-200`}
                    aria-hidden="true"
                  />
                </Suspense>
              </span>
            </Disclosure.Button>
          </h3>
          <Disclosure.Panel className="pt-4 pb-2 transition-all duration-300 ease-in-out">
            <div className="space-y-3">
              {section.id === 'brand' && (
                <div className="relative mb-3">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Suspense fallback={<div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>}>
                      <FiSearch className="h-4 xs:h-5 w-4 xs:w-5 text-gray-400" />
                    </Suspense>
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
                  {section.id === 'rating' ? (
                    <div className="flex items-center">
                      <input
                        id={`filter-mobile-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        type="checkbox"
                        className="h-4 xs:h-5 w-4 xs:w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                        className="ml-2 xs:ml-3 text-xs xs:text-sm text-gray-600"
                      >
                        <span className="text-yellow-400 text-sm xs:text-base">{option.label}</span>
                      </label>
                    </div>
                  ) : (
                    <>
                      <input
                        id={`filter-mobile-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        type="checkbox"
                        className="h-4 xs:h-5 w-4 xs:w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                        className="ml-2 xs:ml-3 text-xs xs:text-sm text-gray-600"
                      >
                        {option.label}
                      </label>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
});

FilterSection.displayName = 'FilterSection';

// Menu item component to prevent re-renders
const MenuItem = memo(({ item, dropdown, setDropdown }) => {
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
            <Suspense fallback={<div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>}>
              <FaChevronDown 
                size={12} 
                className={`transform transition-transform duration-300 ${dropdown === item.name ? 'rotate-180' : 'rotate-0'}`}
              />
            </Suspense>
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
            dropdown === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
});

MenuItem.displayName = 'MenuItem';

const FilterSidebar = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Memoize data
  const filters = useMemo(() => filtersData, []);
  const menuItems = useMemo(() => menuItemsData, []);

  // Handle menu open/close with smooth transitions
  const openMenu = () => {
    setIsClosing(false);
    setIsMenuOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setDropdown(null);
      setIsClosing(false);
      document.body.style.overflow = 'unset'; // Re-enable scrolling
    }, 300); // Match this with the transition duration
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
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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
          <Suspense
            fallback={<div className="h-5 xs:h-6 w-5 xs:w-6 bg-gray-200 rounded animate-pulse"></div>}
          >
            <FiGrid className="h-5 xs:h-6 w-5 xs:w-6" />
          </Suspense>
          <span className="text-[10px] xs:text-xs mt-0.5">Shop</span>
        </button>

        {/* Filters */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex flex-col items-center justify-center text-indigo-600 p-1 xs:p-2 transition-colors duration-200"
          aria-label="Open filters"
        >
          <Suspense
            fallback={<div className="h-5 xs:h-6 w-5 xs:w-6 bg-gray-200 rounded animate-pulse"></div>}
          >
            <FiFilter className="h-5 xs:h-6 w-5 xs:w-6" />
          </Suspense>
          <span className="text-[10px] xs:text-xs mt-0.5">Filters</span>
        </button>

        {/* Waitlist */}
        <Link
         href="/wishlist"
         >
          <button
          className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-1 xs:p-2 transition-colors duration-200"
        >
          <Suspense
            fallback={<div className="h-5 xs:h-6 w-5 xs:w-6 bg-gray-200 rounded animate-pulse"></div>}
          >
            <FiClock className="h-5 xs:h-6 w-5 xs:w-6" />
          </Suspense>
          <span className="text-[10px] xs:text-xs mt-0.5">Waitlist</span>
        </button>
        </Link>
   

        {/* Cart */}
        <Link
         href="/cart"
        >
          <button
          className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-1 xs:p-2 transition-colors duration-200"
        >
          <Suspense
            fallback={<div className="h-5 xs:h-6 w-5 xs:w-6 bg-gray-200 rounded animate-pulse"></div>}
          >
            <FiShoppingCart className="h-5 xs:h-6 w-5 xs:w-6" />
          </Suspense>
          <span className="text-[10px] xs:text-xs mt-0.5">Cart</span>
        </button>

        </Link>
        
        {/* My Account */}
        <Link
        href="/UserProfile"
        >
       <button
          className="flex flex-col items-center justify-center text-gray-600 hover:text-indigo-600 p-1 xs:p-2 transition-colors duration-200"
        >
          <Suspense
            fallback={<div className="h-5 xs:h-6 w-5 xs:w-6 bg-gray-200 rounded animate-pulse"></div>}
          >
            <FiUser className="h-5 xs:h-6 w-5 xs:w-6" />
          </Suspense>
          <span className="text-[10px] xs:text-xs mt-0.5">My Account</span>
        </button>
        </Link>
       

      </div>
    </div>

      {/* Mobile sidebar overlay and sidebar */}
      <div className={`md:hidden fixed inset-0 z-50 ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
        {/* Overlay */}
        <div 
          className="fixed inset-0  bg-opacity-40 transition-opacity duration-300" 
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
            <h2 className="text-base xs:text-lg font-bold text-gray-800">Filters</h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-1 xs:p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close filters"
            >
              <Suspense fallback={<div className="h-5 xs:h-6 w-5 xs:w-6 bg-gray-200 rounded animate-pulse"></div>}>
                <FaTimes size={18} />
              </Suspense>
            </button>
          </div>

          {/* Filters content */}
          <div className="px-3 xs:px-4 pb-20 overflow-y-auto h-[calc(100%-120px)]">
            {filters.map((section) => (
              <FilterSection key={section.id} section={section} />
            ))}
          </div>

          {/* Fixed buttons at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 xs:p-4 flex justify-between gap-2 xs:gap-3">
            <button 
              className="px-4 xs:px-6 py-2 xs:py-3 text-xs xs:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex-1 transition-colors duration-200"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Clear all
            </button>
            <button 
              className="px-4 xs:px-6 py-2 xs:py-3 text-xs xs:text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex-1 transition-colors duration-200"
              onClick={() => setMobileFiltersOpen(false)}
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
            isClosing ? 'opacity-0' : 'opacity-40'
          } md:hidden`}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className={`fixed inset-y-0 left-0 w-72 xs:w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isClosing ? '-translate-x-full' : 'translate-x-0'
          } md:hidden`}
        >
          <div className="flex justify-between items-center p-3 xs:p-4 border-b border-gray-200">
            <h2 className="text-base xs:text-lg font-bold text-gray-800">Menu</h2>
            <button
              onClick={closeMenu}
              className="p-1 xs:p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close menu"
            >
              <Suspense fallback={<div className="h-5 xs:h-6 w-5 xs:w-6 bg-gray-200 rounded animate-pulse"></div>}>
                <FaTimes size={18} />
              </Suspense>
            </button>
          </div>

          <div className="overflow-y-auto h-full pb-4">
            {/* Main Menu Items */}
            {menuItems.map((item) => (
              <MenuItem key={item.name} item={item} dropdown={dropdown} setDropdown={setDropdown} />
            ))}
          </div>
        </div>
      )}

      {/* Desktop filters */}
      <div className="hidden lg:block lg:w-72 xl:w-80">
        <div className="sticky top-20">
          <div className="bg-white p-4 xs:p-5 sm:p-6 rounded-lg shadow-sm border border-gray-200" style={{margin:"3%"}}>
            <div className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6">
              <h2 className="text-lg xs:text-xl font-bold text-gray-900">Filters</h2>
              <button className="text-sm xs:text-base font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                Clear all
              </button>
            </div>

            {filters.map((section) => (
              <FilterSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(FilterSidebar);