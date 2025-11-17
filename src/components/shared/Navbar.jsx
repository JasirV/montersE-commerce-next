"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaHeart,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import logo from "../../assets/montreslogo.png";
import SubNavbar from "./SubNavabar";
import { useRouter } from "next/navigation";
import { GlobalContext } from "./context/GlobalContext";
import { fetchProductAll } from "@/service/productService";
import api from "@/api/axiosIntespter";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const Navbar = ({ onSignUpClick }) => {
  const global = useContext(GlobalContext);
  if (!global) return null;

  const { cartCount, wishlistCount, clearAll } = global;
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [authUpdateTrigger, setAuthUpdateTrigger] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user from localStorage
  const loadUserFromStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      setLocalUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  // Get user data with consistent property names
  const getUserData = useCallback(() => {
    if (isClient && localUser) {
      return {
        ...localUser,
        source: "localStorage",
        // Normalize user data for consistent access
        name: localUser.name || localUser.firstName || "",
        email: localUser.email || "",
        picture: localUser.picture || localUser.image || null,
        provider: localUser.provider || "email",
      };
    }
    return null;
  }, [isClient, localUser]);

  const user = getUserData();

  // Initialize client & load user
  useEffect(() => {
    setIsClient(true);
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Auth update listener
  useEffect(() => {
    const handleAuthChange = () => {
      loadUserFromStorage();
      setAuthUpdateTrigger((prev) => prev + 1);
    };

    const handleStorageChange = (e) => {
      if (e.key === "user") handleAuthChange();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [loadUserFromStorage]);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced search function to search across multiple fields
  const performSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Search across multiple fields: brand, model, referenceNumber, name
      const searchParams = {
        search: query,
        searchFields: ["brand", "model", "referenceNumber", "name"],
      };

      const res = await fetchProductAll(searchParams);
      setResults(res.data.products || []);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileSearchOpen &&
        !event.target.closest(".mobile-search-container")
      ) {
        setIsMobileSearchOpen(false);
      }
      if (
        userDropdownOpen &&
        !event.target.closest(".user-dropdown-container")
      ) {
        setUserDropdownOpen(false);
      }
      if (isSearchFocused && !event.target.closest(".search-container")) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSearchOpen, userDropdownOpen, isSearchFocused]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });

      // Remove localStorage tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      clearAll();

      // Notify and redirect
      Toastify({
        text: "Logout successful",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      window.dispatchEvent(new Event("authChange"));
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      Toastify({
        text: "Logout failed!",
        duration: 3000,
        gravity: "top",
        position: "right",
        close: true,
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  };

  const handleUserDashboard = useCallback(() => {
    router.push("/UserProfile");
    setUserDropdownOpen(false);
  }, [router]);

  const handleSearchSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
        setResults([]);
      }
    },
    [searchQuery, router]
  );

  const handleSelect = (productId) => {
    router.push(`/ProductDetailPage/${productId}`);
    setSearchQuery("");
    setResults([]);
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((prev) => !prev);
    if (!isMobileSearchOpen) {
      setIsSearchFocused(true);
    }
  };
  const toggleUserDropdown = () => setUserDropdownOpen((prev) => !prev);

  const getUserInitial = (user) => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    return "U";
  };

  const getUserDisplayName = (user) => {
    if (user?.name) return user.name.split(" ")[0];
    if (user?.firstName) return user.firstName;
    return "User";
  };

  const popularSearches = [
    { term: "Rolex Daytona", path: "/search?q=rolex+daytona" },
    { term: "Rolex Submariner", path: "/search?q=rolex+submariner" },
    { term: "Omega Seamaster", path: "/search?q=omega+seamaster" },
    { term: "Patek Philippe", path: "/search?q=patek+philippe" },
    { term: "Audemars Piguet", path: "/search?q=audemars+piguet" },
    { term: "Rolex Datejust", path: "/search?q=rolex+datejust" },
    { term: "Rolex Explorer", path: "/search?q=rolex+explorer" },
  ];

  // Format product display with brand, model, and reference number
  const formatProductDisplay = (product) => {
    const parts = [];
    if (product.brand) parts.push(product.brand);
    if (product.model) parts.push(product.model);
    if (product.referenceNumber) parts.push(`Ref: ${product.referenceNumber}`);

    return parts.join(" - ") || product.name;
  };

  // Search results component
  const SearchResults = ({ isMobile = false }) => (
    <div
      className={`absolute top-full mt-1 w-full bg-white shadow-lg rounded-xl py-2 z-50 border max-h-80 overflow-y-auto ${
        isMobile ? "mobile-search-results" : "desktop-search-results"
      }`}
    >
      {/* Live Search Results */}
      <div className="px-4 py-1.5 text-xs text-gray-500 font-medium border-b">
        Search Results
      </div>

      {loading ? (
        <div className="px-4 py-3 text-sm text-gray-500 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1e518e] mr-2"></div>
          Searching...
        </div>
      ) : results.length === 0 && searchQuery.trim() ? (
        <div className="px-4 py-3 text-sm text-gray-500">
          No results found for "{searchQuery}"
        </div>
      ) : (
        results.map((product) => (
          <div
            key={product._id}
            onClick={() => handleSelect(product._id)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 group"
          >
            {product.images?.[0]?.url ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                width={40}
                height={40}
                className="object-cover rounded border border-gray-200 group-hover:border-[#1e518e] transition-colors"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                <FaSearch className="text-gray-400" size={16} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {formatProductDisplay(product)}
              </div>
              {product.price && (
                <div className="text-xs text-gray-600 mt-1">
                  ${product.price.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Show search tips when no results */}
      {results.length === 0 && searchQuery.trim() && !loading && (
        <div className="px-4 py-3 border-t">
          <div className="text-xs text-gray-500 mb-2">Search Tips:</div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Try searching by brand (Rolex, Omega, etc.)</div>
            <div>• Search by model (Submariner, Daytona, Seamaster)</div>
            <div>• Use reference numbers</div>
            <div>• Use specific product names</div>
          </div>
        </div>
      )}

      {/* Popular Searches Section */}
      {(!searchQuery.trim() || results.length > 0) && (
        <>
          <div className="px-4 py-1.5 text-xs text-gray-500 font-medium border-t mt-2">
            Popular in UAE
          </div>
          {popularSearches.map((search) => (
            <Link
              key={search.term}
              href={search.path}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e518e] transition-colors"
              onClick={() => {
                setIsSearchFocused(false);
                if (isMobile) setIsMobileSearchOpen(false);
              }}
            >
              {search.term}
            </Link>
          ))}
        </>
      )}
    </div>
  );

  return (
    <>
      <header
        className={`w-full bg-white sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
        key={authUpdateTrigger}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Mobile Menu */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <FaTimes size={24} />
                ) : (
                  <FaBars size={24} />
                )}
              </button>

              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <Image
                  src={logo}
                  alt="Montres"
                  className="h-8 w-auto sm:h-10 md:h-12 lg:h-12"
                  width={160}
                  height={56}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative search-container">
              <form
                onSubmit={handleSearchSubmit}
                className={`flex w-full h-12 border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm transition-all ${
                  isSearchFocused
                    ? "ring-2 ring-[#1e518e] border-[#1e518e]"
                    : "ring-transparent"
                }`}
              >
                <input
                  type="search"
                  placeholder="Search by brand, model, reference number..."
                  className="flex-grow px-6 py-3 outline-none rounded-l-full text-sm bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-6 flex items-center justify-center hover:from-[#16467c] hover:to-[#0055a0] transition-colors min-w-[60px]"
                >
                  <FaSearch size={18} />
                </button>
              </form>

              {/* Desktop Search Results */}
              {isSearchFocused && (searchQuery || results.length > 0) && (
                <SearchResults />
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <FaHeart
                  size={20}
                  className="text-gray-700 hover:text-[#1e518e]"
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1.5 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <FaShoppingCart
                  size={20}
                  className="text-gray-700 hover:text-[#1e518e]"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1.5 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative user-dropdown-container">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors duration-200"
                  >
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getUserInitial(user)}
                      </div>
                    )}
                    <span className="text-sm font-medium truncate max-w-24">
                      {getUserDisplayName(user)}
                    </span>
                    <FaChevronDown
                      className={`transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                      size={14}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name || getUserDisplayName(user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {user.email}
                        </p>
                        {user.provider && user.provider !== "email" && (
                          <p className="text-xs text-gray-400 mt-1">
                            Signed in with {user.provider}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={handleUserDashboard}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <FaUser size={14} className="text-gray-500" />
                        My Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <FaSignOutAlt size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onSignUpClick}
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-200"
                >
                  <FaUser size={16} />
                  Sign In
                </button>
              )}
            </nav>

            {/* Mobile Icons */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleMobileSearch}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaSearch className="text-gray-700" />
              </button>

              <Link
                href="/wishlist"
                className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <FaHeart
                  size={20}
                  className="text-gray-700 hover:text-[#1e518e]"
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1.5 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <FaShoppingCart
                  size={20}
                  className="text-gray-700 hover:text-[#1e518e]"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1.5 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative user-dropdown-container">
                  <button
                    onClick={toggleUserDropdown}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover border border-gray-300"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getUserInitial(user)}
                      </div>
                    )}
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name || getUserDisplayName(user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleUserDashboard}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 flex items-center gap-3 border-b hover:bg-gray-50 transition-colors"
                      >
                        <FaUser size={14} className="text-gray-500" />
                        My Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <FaSignOutAlt size={14} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onSignUpClick}
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white p-2 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200"
                >
                  <FaUser size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          {isMobileSearchOpen && (
            <div className="md:hidden mb-4 relative mobile-search-container">
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full h-14 border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm mb-2"
              >
                <input
                  type="search"
                  placeholder="Search by brand, model, reference number..."
                  className="flex-grow px-5 py-4 outline-none text-sm bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-5 flex items-center justify-center hover:from-[#16467c] hover:to-[#0055a0] transition-colors min-w-[60px]"
                >
                  <FaSearch size={18} />
                </button>
              </form>

              {/* Mobile Search Results */}
              {(searchQuery || results.length > 0) && (
                <SearchResults isMobile={true} />
              )}
            </div>
          )}
        </div>
      </header>

      <SubNavbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

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
