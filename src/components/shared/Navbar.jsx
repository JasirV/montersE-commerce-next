"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { useSession, signOut } from "next-auth/react";
import { fetchProductAll } from "@/service/productService";

const Navbar = ({ onSignUpClick }) => {
  const { data: session, status } = useSession();
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

  // Get combined user data
  const getUserData = useCallback(() => {
    if (session?.user) return { ...session.user, source: "session" };
    if (isClient && localUser) return { ...localUser, source: "localStorage" };
    return null;
  }, [session, isClient, localUser]);

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

    window.triggerNavbarAuthUpdate = handleAuthChange;
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdated", handleStorageChange);
      delete window.triggerNavbarAuthUpdate;
    };
  }, [loadUserFromStorage]);

  // Scroll shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) return setResults([]);

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchProductAll({ search: searchQuery });
        console.log(res, "res");
        setResults(res.data.products || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSearchOpen, userDropdownOpen]);

  const handleLogout = useCallback(async () => {
    if (user?.source === "session") {
      await signOut({ redirect: false, callbackUrl: "/" });
    } else {
      localStorage.removeItem("user");
      setLocalUser(null);
      window.dispatchEvent(new Event("authChange"));
    }
    setUserDropdownOpen(false);
    router.push("/");
  }, [user, router]);

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
      }
    },
    [searchQuery, router]
  );

  const handleSelect = (productId) => {
    router.push(`/ProductDetailPage/${productId}`);
    setSearchQuery("");
    setResults([]);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const toggleMobileSearch = () => setIsMobileSearchOpen((prev) => !prev);
  const toggleUserDropdown = () => setUserDropdownOpen((prev) => !prev);

  const popularSearches = [
    { term: "Rolex Daytona", path: "/search?q=rolex+daytona" },
    { term: "Omega Seamaster", path: "/search?q=omega+seamaster" },
    { term: "Patek Philippe", path: "/search?q=patek+philippe" },
    { term: "Audemars Piguet", path: "/search?q=audemars+piguet" },
    { term: "Luxury Watches for Men", path: "/search?q=luxury+watches+men" },
  ];

  if (status === "loading") {
    return (
      <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full" />
          </div>
        </div>
      </header>
    );
  }

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
              <button
                className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <FaTimes size={20} />
                ) : (
                  <FaBars size={20} />
                )}
              </button>
              <Link href="/" className="flex items-center">
                <Image
                  src={logo}
                  alt="Montres"
                  className="h-8 md:h-10 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <form
                onSubmit={handleSearchSubmit}
                className={`flex w-full border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm ${
                  isSearchFocused ? "ring-1 ring-[#1e518e]" : "ring-transparent"
                }`}
              >
                <input
                  type="search"
                  placeholder="Search Rolex, Omega, Patek Philippe..."
                  className="flex-grow px-4 py-2 outline-none rounded-l-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 flex items-center justify-center"
                >
                  <FaSearch />
                </button>
              </form>
              {searchQuery && isSearchFocused && (
                <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-xl py-2 z-50 border max-h-80 overflow-y-auto">
                  {/* Live Search Results */}
                  <div className="px-4 py-1.5 text-xs text-gray-500 font-medium border-b">
                    Search Results
                  </div>

                  {loading ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Loading...
                    </div>
                  ) : results.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No results found
                    </div>
                  ) : (
                    results.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSelect(product._id)}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                      >
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded" />
                        )}
                        <div className="text-sm text-gray-700 truncate">
                          {product.name}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Popular Searches Section */}
                  <div className="px-4 py-1.5 text-xs text-gray-500 font-medium border-t mt-2">
                    Popular in UAE
                  </div>
                  {popularSearches.map((search) => (
                    <Link
                      key={search.term}
                      href={search.path}
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setIsSearchFocused(false)}
                    >
                      {search.term}
                    </Link>
                  ))}
                </div>
              )}
            </div>   

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/wishlist"
                className="hover:text-[#1e518e] p-2 rounded-full hover:bg-gray-100"
              >
                <FaHeart />
              </Link>
              <Link
                href="/cart"
                className="flex items-center justify-center rounded-full bg-gradient-to-br p-2.5 hover:shadow-md"
              >
                <FaShoppingCart />
              </Link>

              {user ? (
                <div className="relative user-dropdown-container">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-8 h-8 rounded-full"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-full flex items-center justify-center text-white text-sm">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium truncate">
                      {user.name?.split(" ")[0] || "User"}
                    </span>
                    <FaChevronDown
                      className={`transition-transform ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.email || ""}
                        </p>
                        <p className="text-xs text-gray-400">
                          {user.source === "session"
                            ? "NextAuth"
                            : "Local Storage"}
                        </p>
                      </div>
                      <button
                        onClick={handleUserDashboard}
                        className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50"
                      >
                        <FaUser size={14} />
                        My Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 flex items-center gap-2 hover:bg-gray-50"
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
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <FaUser />
                  Sign In
                </button>
              )}
            </nav>

            {/* Mobile Icons */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleMobileSearch}
                className="p-2.5 rounded-full hover:bg-gray-100"
              >
                <FaSearch />
              </button>
              <Link
                href="/wishlist"
                className="p-2.5 rounded-full hover:bg-gray-100"
              >
                <FaHeart />
              </Link>
              <Link
                href="/cart"
                className="p-2.5 rounded-full hover:bg-gray-100"
              >
                <FaShoppingCart />
              </Link>

              {user ? (
                <div className="relative user-dropdown-container">
                  <button
                    onClick={toggleUserDropdown}
                    className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white p-2 rounded-full flex items-center justify-center"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-6 h-6 rounded-full"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-xs">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </button>
                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-2 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.email || ""}
                        </p>
                      </div>
                      <button
                        onClick={handleUserDashboard}
                        className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 border-b"
                      >
                        <FaUser size={14} />
                        My Dashboard
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 flex items-center gap-2"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onSignUpClick}
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white p-2 rounded-full flex items-center justify-center"
                >
                  <FaUser />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search */}
          {isMobileSearchOpen && (
            <div className="md:hidden mb-2 relative mobile-search-container">
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm mb-1"
              >
                <input
                  type="search"
                  placeholder="Search luxury watches..."
                  className="flex-grow px-4 py-3 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#1e518e] text-white px-4 flex items-center justify-center"
                >
                  <FaSearch />
                </button>
              </form>
              {searchQuery && isSearchFocused && (
                <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-xl py-2 z-50 border max-h-80 overflow-y-auto">
                  <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
                    Search Results
                  </div>

                  {loading ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Loading...
                    </div>
                  ) : results.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No results found
                    </div>
                  ) : (
                    results.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSelect(product._id)}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                      >
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded" />
                        )}
                        <div className="text-sm text-gray-700 truncate">
                          {product.name}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Optional: Popular searches below */}
                  <div className="px-4 py-2 text-xs text-gray-500 font-medium border-t mt-2">
                    Popular Searches
                  </div>
                  {popularSearches.map((search) => (
                    <Link
                      key={search.term}
                      href={search.path}
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setIsSearchFocused(false)}
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

      {/* Search results dropdown */}
      {/* {searchQuery && (
        <div className="absolute w-full bg-white shadow-lg rounded-xl py-2 z-50 border mt-1 max-h-80 overflow-y-auto">
          {loading ? <div className="px-4 py-3 text-sm text-gray-500">Loading...</div> :
            results.length === 0 ? <div className="px-4 py-3 text-sm text-gray-500">No results found</div> :
              results.map(product => (
                <div key={product._id} onClick={() => handleSelect(product._id)} className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50">
                  {product.images?.[0]?.url ? <img src={product.images[0].url} alt={product.name} className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-200 rounded" />}
                  <div className="text-sm text-gray-700 truncate">{product.name}</div>
                </div>
              ))}
        </div>
      )} */}
    </>
  );
};

export default Navbar;
