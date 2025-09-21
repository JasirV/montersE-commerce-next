'use client';
import React, { useState, useEffect, useCallback } from "react";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaHeart,
} from "react-icons/fa";
import Link from "next/link";
import logo from "../../assets/montreslogo.png";
import SubNavbar from "./SubNavabar";
import Image from "next/image";

const Navbar = ({ onSignUpClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const popularSearches = [
    { term: "Rolex Daytona", path: "/search?q=rolex+daytona" },
    { term: "Omega Seamaster", path: "/search?q=omega+seamaster" },
    { term: "Patek Philippe", path: "/search?q=patek+philippe" },
    { term: "Audemars Piguet", path: "/search?q=audemars+piguet" },
    { term: "Luxury Watches for Men", path: "/search?q=luxury+watches+men" },
  ];

  // Scroll effect
  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchFocus = useCallback(() => setIsSearchFocused(true), []);
  const handleSearchBlur = useCallback(
    () => setTimeout(() => setIsSearchFocused(false), 200),
    []
  );
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    []
  );
  const toggleMobileSearch = useCallback(
    () => setIsMobileSearchOpen((prev) => !prev),
    []
  );

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileSearchOpen &&
        !event.target.closest(".mobile-search-container")
      ) {
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSearchOpen]);

  return (
    <>
      {/* Main Header */}
      <header
        className={`w-full bg-white sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16 lg:h-18">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes size={20} />
                ) : (
                  <FaBars size={20} />
                )}
              </button>

              <Link
                href="/"
                className="flex items-center"
                aria-label="Montres Home"
              >
                <Image
                  src={logo}
                  alt="Montres - Luxury Watches Dubai"
                  className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                />
                {isClient && (
                  <meta itemProp="url" content={window.location.origin} />
                )}
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <div
                className={`flex w-full border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm transition-all duration-300 ring-1 ${
                  isSearchFocused ? "ring-[#1e518e]" : "ring-transparent"
                }`}
                role="search"
              >
                <input
                  type="search"
                  placeholder="Search Rolex, Omega, Patek Philippe..."
                  className="flex-grow px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base outline-none rounded-l-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
                <button type="submit" className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 md:px-5 flex items-center justify-center">
                  <FaSearch className="text-sm md:text-base" />
                </button>
              </div>

              {searchQuery && isSearchFocused && (
                <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md py-2 z-30 border border-gray-200">
                  <div className="px-4 py-1.5 text-xs md:text-sm text-gray-500 font-medium">
                    Popular in UAE
                  </div>
                  {popularSearches.map((search) => (
                    <Link
                      key={search.term}
                      href={search.path}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      onClick={() => setIsSearchFocused(false)}
                    >
                      {search.term}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-gray-700">
              <Link
                href="/wishlist"
                className="hover:text-[#1e518e] transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="Wishlist"
              >
                <FaHeart className="text-lg md:text-xl" />
              </Link>

              <Link
                href="/cart"
                className="flex items-center justify-center rounded-full bg-gradient-to-br  text-gray-700 hover:text-[#1e518e] p-2.5 hover:shadow-md transition-all hover:scale-105"
                aria-label="Shopping cart"
              >
                <FaShoppingCart className="text-lg md:text-xl" />
              </Link>

              <button
                onClick={onSignUpClick}
                className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 md:px-4 py-2 md:py-1.5 rounded-full flex items-center gap-2 text-sm md:text-base hover:shadow-lg transition-all hover:scale-105"
                aria-label="Sign in or register"
              >
                <FaUser />
                <span>Sign In</span>
              </button>
            </nav>

            {/* Mobile Icons */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={toggleMobileSearch}
                className="text-gray-700 p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <FaSearch size={18} />
              </button>

              <Link
                href="/wishlist"
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Wishlist"
              >
                <FaHeart size={18} className="text-gray-700" />
              </Link>

              <Link
                href="/cart"
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Shopping cart"
              >
                <FaShoppingCart size={18} className="text-gray-700" />
              </Link>

              <button
                onClick={onSignUpClick}
                className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white p-2 rounded-full flex items-center justify-center shadow hover:shadow-md transition-all"
                aria-label="Sign in"
              >
                <FaUser className="text-sm" />
              </button>
            </div>
          </div>

          {/* Mobile Search - Full Width */}
          {isMobileSearchOpen && (
            <div className="md:hidden mb-2 relative mobile-search-container">
              <div className="flex w-full border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm mb-1">
                <input
                  type="search"
                  placeholder="Search luxury watches..."
                  className="flex-grow px-4 py-3 text-base outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  className="bg-[#1e518e] text-white px-4 flex items-center justify-center"
                  onClick={() => setIsMobileSearchOpen(false)}
                >
                  <FaSearch size={16} />
                </button>
              </div>
              {searchQuery && (
                <div className="absolute w-full bg-white shadow-lg rounded-xl py-2 z-20 border border-gray-200 mt-1">
                  <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
                    Popular Searches
                  </div>
                  {popularSearches.map((search) => (
                    <Link
                      key={search.term}
                      href={search.path}
                      className="block px-4 py-3 text-sm hover:bg-gray-50 transition-colors border-b last:border-b-0"
                      onClick={() => setIsMobileSearchOpen(false)}
                    >
                      {search.term}
                    </Link>
                  ))}
                </div>
              )}
            </div>   
          )}
        </div>
      </header>

      {/* Sub Navbar */}
      <SubNavbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
