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
import logo from "../../assets/montreslogo.png";
import SubNavbar from "./SubNavabar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const Navbar = ({ onSignUpClick }) => {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [defaultWishlistId, setDefaultWishlistId] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get user data from both session and localStorage
  const getUserData = useCallback(() => {
    // Don't return user data until component is mounted
    if (!mounted) return null;

    if (session?.user) {
      console.log("Using session user:", session.user);
      return {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        source: "session",
      };
    }

    if (isClient && localUser) {
      console.log("Using local user:", localUser);
      return {
        ...localUser,
        source: "localStorage",
      };
    }

    return null;
  }, [session, isClient, localUser, mounted]);

  const user = getUserData();

  // Load user from localStorage on client side and force session check
  useEffect(() => {
    setIsClient(true);
    loadUserFromStorage();
    
    // Force session update on mount
    const checkSession = async () => {
      try {
        await update();
      } catch (error) {
        console.error("Error updating session:", error);
      }
    };
    
    checkSession();
  }, [update]);

  // Listen for auth changes from other components
  useEffect(() => {
    const handleAuthChange = () => {
      console.log("Auth change detected, reloading user data...");
      loadUserFromStorage();
      // Force session update
      update();
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, [update]);

  // Enhanced session synchronization
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      console.log("Session authenticated:", session.user);
      // Clear local storage when session is active to avoid conflicts
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          console.log("Clearing local storage due to active session");
          // Don't clear, just use session data
        }
      }
    }
  }, [status, session]);

  // Fetch wishlist data when user is authenticated
  useEffect(() => {
    const fetchWishlistData = async () => {
      if (!user) {
        setWishlistCount(0);
        setDefaultWishlistId(null);
        return;
      }

      try {
        const token = user.source === "session" 
          ? null // NextAuth handles tokens automatically
          : localStorage.getItem("token");

        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        console.log("Fetching wishlists for user:", user);
        const response = await fetch("http://localhost:9000/api/products/wishlists/getAll", {
          method: "GET",
          headers: headers,
          credentials: user.source === "session" ? "include" : "omit",
        });

        console.log("Wishlist response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Wishlist API response:", data);
          
          // Handle different response formats
          let wishlists = [];
          let totalCount = 0;
          let wishlistId = null;

          // Case 1: Response is an array of wishlists
          if (Array.isArray(data)) {
            wishlists = data;
            totalCount = data.reduce((total, wishlist) => {
              return total + (wishlist.items?.length || 0);
            }, 0);
            if (data.length > 0) {
              wishlistId = data[0]._id || data[0].id;
            }
          }
          // Case 2: Response has a wishlists array property
          else if (data.wishlists && Array.isArray(data.wishlists)) {
            wishlists = data.wishlists;
            totalCount = data.wishlists.reduce((total, wishlist) => {
              return total + (wishlist.items?.length || 0);
            }, 0);
            if (data.wishlists.length > 0) {
              wishlistId = data.wishlists[0]._id || data.wishlists[0].id;
            }
          }
          // Case 3: Response is a single wishlist object
          else if (data && typeof data === 'object') {
            wishlists = [data];
            totalCount = data.items?.length || 0;
            wishlistId = data._id || data.id;
          }
          // Case 4: Response has data property
          else if (data.data) {
            if (Array.isArray(data.data)) {
              wishlists = data.data;
              totalCount = data.data.reduce((total, wishlist) => {
                return total + (wishlist.items?.length || 0);
              }, 0);
              if (data.data.length > 0) {
                wishlistId = data.data[0]._id || data.data[0].id;
              }
            } else if (data.data.items) {
              totalCount = data.data.items.length || 0;
              wishlistId = data.data._id || data.data.id;
            }
          }

          console.log("Processed wishlist data:", { totalCount, wishlistId, wishlists });
          
          setWishlistCount(totalCount);
          setDefaultWishlistId(wishlistId);
        } else {
          console.error("Failed to fetch wishlists, status:", response.status);
          setWishlistCount(0);
          setDefaultWishlistId(null);
        }
      } catch (error) {
        console.error("Error fetching wishlists:", error);
        setWishlistCount(0);
        setDefaultWishlistId(null);
      }
    };

    if (mounted) {
      fetchWishlistData();
    }
  }, [user, mounted]);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (!mounted) return;
      
      // Re-fetch wishlist data when updates occur
      const fetchWishlistData = async () => {
        if (!user) {
          setWishlistCount(0);
          return;
        }

        try {
          const token = user.source === "session" 
            ? null 
            : localStorage.getItem("token");

          const headers = {
            "Content-Type": "application/json",
          };

          if (token) {
            headers.Authorization = `Bearer ${token}`;
          }

          const response = await fetch("http://localhost:9000/api/products/wishlists/getAll", {
            method: "GET",
            headers: headers,
            credentials: user.source === "session" ? "include" : "omit",
          });

          if (response.ok) {
            const data = await response.json();
            let totalCount = 0;

            // Handle different response formats
            if (Array.isArray(data)) {
              totalCount = data.reduce((total, wishlist) => {
                return total + (wishlist.items?.length || 0);
              }, 0);
            } else if (data.wishlists && Array.isArray(data.wishlists)) {
              totalCount = data.wishlists.reduce((total, wishlist) => {
                return total + (wishlist.items?.length || 0);
              }, 0);
            } else if (data && typeof data === 'object') {
              totalCount = data.items?.length || 0;
            } else if (data.data) {
              if (Array.isArray(data.data)) {
                totalCount = data.data.reduce((total, wishlist) => {
                  return total + (wishlist.items?.length || 0);
                }, 0);
              } else if (data.data.items) {
                totalCount = data.data.items.length || 0;
              }
            }

            setWishlistCount(totalCount);
          }
        } catch (error) {
          console.error("Error fetching wishlists on update:", error);
        }
      };

      fetchWishlistData();
    };

    if (mounted) {
      window.addEventListener("wishlistUpdated", handleWishlistUpdate);
      return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    }
  }, [user, mounted]);

  const loadUserFromStorage = () => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("user");
        console.log("Loading user from storage:", storedUser);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setLocalUser(userData);
        } else {
          setLocalUser(null);
        }
      } catch (error) {
        console.error("Error reading user from localStorage:", error);
        setLocalUser(null);
      }
    }
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    console.log("Logging out user...");
    
    if (user?.source === "session") {
      await signOut({
        redirect: false,
        callbackUrl: "/",
      });
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setLocalUser(null);
    }

    setUserDropdownOpen(false);
    setWishlistCount(0);
    setDefaultWishlistId(null);
    
    // Dispatch events to sync across components
    window.dispatchEvent(new Event("authChange"));
    window.dispatchEvent(new Event("wishlistUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));
    
    router.push("/");
  }, [user, router]);

  // Handle user dashboard navigation
  const handleUserDashboard = useCallback(() => {
    router.push("/UserProfile");
    setUserDropdownOpen(false);
  }, [router]);

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

  const toggleUserDropdown = useCallback(() => {
    setUserDropdownOpen((prev) => !prev);
  }, []);

  // Close dropdowns when clicking outside
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

  // Handle search submission
  const handleSearchSubmit = useCallback(
    (e) => {
      if (e) e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchFocused(false);
        setIsMobileSearchOpen(false);
      }
    },
    [searchQuery, router]
  );

  const popularSearches = [
    { term: "Rolex Daytona", path: "/search?q=rolex+daytona" },
    { term: "Omega Seamaster", path: "/search?q=omega+seamaster" },
    { term: "Patek Philippe", path: "/search?q=patek+philippe" },
    { term: "Audemars Piguet", path: "/search?q=audemars+piguet" },
    { term: "Luxury Watches for Men", path: "/search?q=luxury+watches+men" },
  ];

  // Show loading state while checking authentication
  if (status === "loading" || !mounted) {
    return (
      <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

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
                  priority
                />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative">
              <form
                onSubmit={handleSearchSubmit}
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
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 md:px-5 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <FaSearch className="text-sm md:text-base" />
                </button>
              </form>

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
              {/* Wishlist Link */}
              <Link
                href={
                  user && defaultWishlistId
                    ? `/wishlist/${defaultWishlistId}`
                    : "/wishlist"
                }
                className={`hover:text-[#1e518e] transition-colors p-2 rounded-full relative ${
                  user ? "hover:bg-gray-100" : "cursor-not-allowed opacity-50"
                }`}
                aria-label="Wishlist"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    onSignUpClick();
                  }
                }}
              >
                <FaHeart className="text-lg md:text-xl" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="flex items-center justify-center rounded-full bg-gradient-to-br text-gray-700 hover:text-[#1e518e] p-2.5 hover:shadow-md transition-all hover:scale-105"
                aria-label="Shopping cart"
              >
                <FaShoppingCart className="text-lg md:text-xl" />
              </Link>

              {/* User Account Section */}
              {user ? (
                <div className="relative user-dropdown-container">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-all duration-200"
                    aria-label="User account menu"
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
                      <div className="w-8 h-8 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium max-w-[100px] truncate">
                      {user.name ? user.name.split(" ")[0] : "User"}
                    </span>
                    <FaChevronDown
                      size={12}
                      className={`transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
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
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <FaUser size={14} />
                        My Dashboard
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
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
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 md:px-4 py-2 md:py-1.5 rounded-full flex items-center gap-2 text-sm md:text-base hover:shadow-lg transition-all hover:scale-105"
                  aria-label="Sign in or register"
                >
                  <FaUser />
                  <span>Sign In</span>
                </button>
              )}
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

              {/* Mobile Wishlist Link */}
              <Link
                href={
                  user && defaultWishlistId
                    ? `/wishlist/${defaultWishlistId}`
                    : "/wishlist"
                }
                className={`p-2.5 rounded-full hover:bg-gray-100 transition-colors relative ${
                  user ? "" : "cursor-not-allowed opacity-50"
                }`}
                aria-label="Wishlist"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    onSignUpClick();
                  }
                }}
              >
                <FaHeart size={18} className="text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Shopping cart"
              >
                <FaShoppingCart size={18} className="text-gray-700" />
              </Link>

              {/* Mobile User Account */}
              {user ? (
                <div className="relative user-dropdown-container">
                  <button
                    onClick={toggleUserDropdown}
                    className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white p-2 rounded-full flex items-center justify-center shadow hover:shadow-md transition-all"
                    aria-label="User account menu"
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
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email || ""}
                        </p>
                      </div>

                      <button
                        onClick={handleUserDashboard}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-100"
                      >
                        <FaUser size={14} />
                        My Dashboard
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
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
                  className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white p-2 rounded-full flex items-center justify-center shadow hover:shadow-md transition-all"
                  aria-label="Sign in"
                >
                  <FaUser className="text-sm" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search - Full Width */}
          {isMobileSearchOpen && (
            <div className="md:hidden mb-2 relative mobile-search-container">
              <form
                onSubmit={handleSearchSubmit}
                className="flex w-full border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm mb-1"
              >
                <input
                  type="search"
                  placeholder="Search luxury watches..."
                  className="flex-grow px-4 py-3 text-base outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#1e518e] text-white px-4 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <FaSearch size={16} />
                </button>
              </form>
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