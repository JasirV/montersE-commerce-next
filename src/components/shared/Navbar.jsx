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
  FaStar,
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
    { term: "Rolex Date", path: "/search?q=rolex+date" },
    { term: "Rolex 1908", path: "/search?q=rolex+1908" },
    { term: "Rolex Gmt II", path: "/search?q=rolex+gmt+ii" },
    { term: "Rolex Daytona", path: "/search?q=rolex+daytona" },
    { term: "Rolex Cellini", path: "/search?q=rolex+cellini" },
    { term: "Rolex Datejust", path: "/search?q=rolex+datejust" },
    { term: "Rolex Explorer", path: "/search?q=rolex+explorer" },
    { term: "Rolex Submariner", path: "/search?q=rolex+submariner" },
    { term: "Rolex Explorer II", path: "/search?q=rolex+explorer+ii" },
    { term: "Rolex Datejust 41", path: "/search?q=rolex+datejust+41" },
  ];

  // Format price with currency
  const formatPrice = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Generate random discount for demo (you can replace with actual discount data)
  const getRandomDiscount = () => {
    const discounts = [7, 4, 3, 1];
    return discounts[Math.floor(Math.random() * discounts.length)];
  };

  // Format product display with brand, model, and reference number
  const formatProductDisplay = (product) => {
    const parts = [];
    if (product.brand) parts.push(product.brand);
    if (product.model) parts.push(product.model);
    if (product.referenceNumber) parts.push(`Ref: ${product.referenceNumber}`);

    return parts.join(" - ") || product.name;
  };

  // Search results component matching your screenshot design
  const SearchResults = ({ isMobile = false }) => (
    <div
      className={`absolute top-full mt-1 w-full bg-white shadow-xl rounded-lg py-3 z-50 border max-h-96 overflow-y-auto ${
        isMobile
          ? "mobile-search-results left-0 right-0 mx-2"
          : "desktop-search-results"
      }`}
    >
      {/* Results Header */}
      <div className="px-4 py-2 text-sm font-semibold text-gray-800 border-b bg-gray-50 rounded-t-lg">
        RESULTS:
      </div>

      {loading ? (
        <div className="px-4 py-6 text-sm text-gray-500 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1e518e] mr-3"></div>
          Searching...
        </div>
      ) : results.length === 0 && searchQuery.trim() ? (
        <div className="px-4 py-6 text-sm text-gray-500 text-center">
          No results found for "{searchQuery}"
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {results.slice(0, 6).map((product) => {
            const discount = getRandomDiscount();
            const originalPrice = product.price * (1 + discount / 100);

            return (
              <div
                key={product._id}
                onClick={() => handleSelect(product._id)}
                className="flex items-start gap-4 px-4 py-4 cursor-pointer hover:bg-blue-50 transition-colors group"
              >
                {/* Product Image */}
                <div className="flex-shrink-0">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="object-cover rounded-lg border border-gray-200 group-hover:border-[#1e518e] transition-colors"
                    />
                  ) : (
                    <div className="w-15 h-15 bg-gray-200 rounded-lg flex items-center justify-center">
                      <FaSearch className="text-gray-400" size={20} />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  {/* Brand and Model */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {product.brand}
                      </div>
                      <div className="text-xs text-gray-700 mt-1 line-clamp-2">
                        {formatProductDisplay(product)}
                      </div>
                    </div>

                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded ml-2 flex-shrink-0">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="mt-2 space-y-1">
                    {discount > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(originalPrice)}
                          </span>
                        </div>
                        {discount === 1 && (
                          <div className="text-xs text-green-600 font-medium">
                            Coupon available
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggested Searches Section */}
      <div className="border-t pt-3">
        <div className="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-50">
          SUGGESTED SEARCHES:
        </div>
        <div className="grid grid-cols-1 gap-1 px-2">
          {popularSearches.map((search, index) => (
            <Link
              key={search.term}
              href={search.path}
              className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1e518e] transition-colors rounded"
              onClick={() => {
                setIsSearchFocused(false);
                if (isMobile) setIsMobileSearchOpen(false);
              }}
            >
              <span>{search.term}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                71
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Search Tips */}
      {results.length === 0 && searchQuery.trim() && !loading && (
        <div className="px-4 py-3 border-t bg-gray-50">
          <div className="text-xs text-gray-500 mb-2 font-medium">
            Search Tips:
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Try searching by brand (Rolex, Omega, etc.)</div>
            <div>• Search by model (Submariner, Daytona, Seamaster)</div>
            <div>• Use reference numbers</div>
            <div>• Use specific product names</div>
          </div>
        </div>
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
        <div className="container mx-auto px-4 sm:px-5 md:px-6 lg:px-8">
          {/* Main Navbar Container */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left Section: Mobile Menu & Logo */}
            <div className="flex items-center flex-1 md:flex-none">
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-700 p-2.5 rounded-lg hover:bg-gray-100 transition-colors mr-2 flex-shrink-0"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes size={20} />
                ) : (
                  <FaBars size={20} />
                )}
              </button>

              {/* Logo - 50% larger */}
              <div className="flex justify-center md:justify-start flex-1 md:flex-none">
                <Link
                  href="/"
                  className="flex items-center justify-center md:justify-start"
                >
                  <Image
                    src={logo}
                    alt="Montres"
                    width={260}
                    height={100}
                    priority
                    className="
    object-contain
    h-12 w-auto     /* Mobile */
    sm:h-14         /* Small screens */
    md:h-16         /* Tablets */
    lg:h-16         /* Desktop (reduced) */
    xl:h-17        /* Large desktop (reduced) */
  "
                  />
                </Link>
              </div>
            </div>

            {/* Desktop Search - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-6 lg:mx-8 xl:mx-12 relative search-container">
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

            {/* Desktop Navigation Icons */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-4">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative flex items-center justify-center p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Wishlist"
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
                className="relative flex items-center justify-center p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Shopping cart"
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

              {/* User Section */}
              {user ? (
                <div className="relative user-dropdown-container">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors duration-200"
                    aria-label="User menu"
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
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2.5 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-200"
                >
                  <FaUser size={16} />
                  Sign In
                </button>
              )}
            </nav>

            {/* Mobile Navigation Icons */}
            <div className="flex md:hidden items-center gap-1">
              {/* Search Icon */}
              <button
                onClick={toggleMobileSearch}
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <FaSearch className="text-gray-700 text-lg" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="relative flex items-center justify-center p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Wishlist"
              >
                <FaHeart
                  size={18}
                  className="text-gray-700 hover:text-[#1e518e]"
                />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link
                href="/cart"
                className="relative flex items-center justify-center p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <FaShoppingCart
                  size={18}
                  className="text-gray-700 hover:text-[#1e518e]"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Icon */}
              {user ? (
                <div className="relative user-dropdown-container">
                  <button
                    onClick={toggleUserDropdown}
                    className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="User menu"
                  >
                    {user.picture ? (
                      <Image
                        src={user.picture}
                        alt={user.name || "User"}
                        className="w-7 h-7 rounded-full object-cover border border-gray-300"
                        width={28}
                        height={28}
                      />
                    ) : (
                      <div className="w-7 h-7 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {getUserInitial(user)}
                      </div>
                    )}
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || getUserDisplayName(user)}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleUserDashboard}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-700 flex items-center gap-3 border-b hover:bg-gray-50 transition-colors"
                      >
                        <FaUser size={13} className="text-gray-500" />
                        My Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 text-sm text-red-600 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <FaSignOutAlt size={13} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onSignUpClick}
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white p-2.5 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200"
                  aria-label="Sign in"
                >
                  <FaUser size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="md:hidden pb-3 relative mobile-search-container">
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full h-12 border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm"
              >
                <input
                  type="search"
                  placeholder="Search by brand, model, reference number..."
                  className="flex-grow px-4 py-3 outline-none text-sm bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 flex items-center justify-center hover:from-[#16467c] hover:to-[#0055a0] transition-colors min-w-[50px]"
                >
                  <FaSearch size={16} />
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
