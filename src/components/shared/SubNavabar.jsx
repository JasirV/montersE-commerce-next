import React, { useState, useEffect, useCallback } from "react";
import {
  FaTimes,
  FaChevronRight,
  FaChevronDown,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaComments,
  FaQuestionCircle,
  FaDollarSign,
  FaEuroSign,
  FaPoundSign,
  FaRupeeSign,
} from "react-icons/fa";
import Link from "next/link";
import { useCurrency } from "@/app/CurrencyContext";
import newCurrency from "../../assets/newSymbole.png";
import Image from "next/image";
import axios from "axios";

// Import the MegaMenu components
import WatchMegaMenu from "./MegaMenu";
import ShopeBrandsMegaMenu from "./BrandsMegaMenu";
import HandBagMegaMenu from "./HnadBagMegaMenu";
import JewelryMegaMenu from "./JewelryMegaMenu";
import AccessoriesMegaMenu from "./AccessoriesMegaMenu";

const SubNavbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { currency, setCurrency, setRate } = useCurrency();
  const [dropdown, setDropdown] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    flag: "🇦🇪",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Menu Items with mega menu data
  const menuItems = [
    {
      name: "SHOP BY BRANDS",
      path: "/shop",
      hasMegaMenu: true,
      megaMenuType: "brands",
      megaMenuData: {}, // Add your actual data here
    },
    {
      name: "EXCLUSIVE COLLECTION",
      path: "/exclusive-collection",
    },
    {
      name: "WATCHES",
      path: "/watches/Watches",
      hasMegaMenu: true,
      megaMenuType: "watches",
      megaMenuData: {}, // Add your actual data here
    },
    {
      name: "HANDBAGS",
      path: "/leathers/bags",
      hasMegaMenu: true,
      megaMenuType: "handbags",
      megaMenuData: {}, // Add your actual data here
    },
      {
      name: "LEATHER GOODS",
      path: "/leathers/LeatherGoodsAll",
      // hasMegaMenu: true,
      // megaMenuType: "handbags",
      megaMenuData: {}, // Add your actual data here
    },
    {
      name: "ACCESSORIES",
      path: "/accessories/Accessories",
      hasMegaMenu: true,
      megaMenuType: "accessories",
      megaMenuData: {}, // Add your actual data here
    },
    // {
    //   name: "JEWELRY",
    //   path: "/jewelry",
    //   hasMegaMenu: true,
    //   megaMenuType: "jewelry",
    //   megaMenuData: {}, // Add your actual data here
    // },
    {
      name: "BRAND NEW",
      path: "/BrandNew",
    },
  ];

  // Currency options
  const currencyOptions = [
    { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪" },
    { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
    { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
    { code: "INR", symbol: "₹", name: "Indian Rupee", flag: "🇮🇳" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦" },
  ];

  // Handle currency change
  const handleCurrencyChange = async (currency) => {
    setIsLoading(true);
    setSelectedCurrency(currency);
    setCurrency(currency.code);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASEURL}/Auth/convert-price`,
        {
          params: {
            amount: 1,
            from: "AED",
            to: currency.code,
          },
        }
      );

      if (res.data && res.data.converted !== undefined) {
        setRate(res.data.converted);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Conversion failed", err.response?.data || err.message);
      const fallbackRates = {
        USD: 0.27,
        EUR: 0.25,
        GBP: 0.21,
        INR: 22.5,
        SAR: 1.02,
        AED: 1,
      };
      setRate(fallbackRates[currency.code] || 1);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize currency from context on component mount
  useEffect(() => {
    const initialCurrency =
      currencyOptions.find((opt) => opt.code === currency) ||
      currencyOptions[0];
    setSelectedCurrency(initialCurrency);
  }, [currency]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper functions
  const toggleDropdown = useCallback(
    (name) => setDropdown((prev) => (prev === name ? null : name)),
    []
  );

  const toggleHelp = useCallback(() => setIsHelpOpen((prev) => !prev), []);
  const toggleLanguage = useCallback(
    () => setIsLanguageOpen((prev) => !prev),
    []
  );
  const toggleCurrency = useCallback(
    () => setIsCurrencyOpen((prev) => !prev),
    []
  );

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setDropdown(null);
    setIsHelpOpen(false);
    setIsLanguageOpen(false);
    setIsCurrencyOpen(false);
  }, [setIsMobileMenuOpen]);

  const handleMobileLinkClick = useCallback(() => {
    closeMobileMenu();
  }, [closeMobileMenu]);

  const handleCurrencySelect = useCallback((currency) => {
    handleCurrencyChange(currency);
    setIsCurrencyOpen(false);
  }, []);

  const getCurrencyIcon = (code) => {
    switch (code) {
      case "USD":
        return <FaDollarSign className="text-green-600" />;
      case "EUR":
        return <FaEuroSign className="text-blue-600" />;
      case "GBP":
        return <FaPoundSign className="text-red-600" />;
      case "INR":
        return <FaRupeeSign className="text-orange-600" />;
      case "AED":
        return (
          <Image
            src={newCurrency}
            alt="AED"
            width={16}
            height={16}
            className="inline-block"
          />
        );
      default:
        return (
          <span className="text-amber-600 font-bold">
            {selectedCurrency.symbol}
          </span>
        );
    }
  };

  // Function to render the appropriate mega menu for desktop
  const renderMegaMenu = (item) => {
    if (!item.hasMegaMenu || !item.megaMenuData) return null;

    const megaMenuProps = {
      data: item.megaMenuData,
      isMobile: false,
      onItemClick: closeMobileMenu,
    };

    switch (item.megaMenuType) {
      case "brands":
        return <ShopeBrandsMegaMenu {...megaMenuProps} />;
      case "watches":
        return <WatchMegaMenu {...megaMenuProps} />;
      case "handbags":
        return <HandBagMegaMenu {...megaMenuProps} />;
      case "jewelry":
        return <JewelryMegaMenu {...megaMenuProps} />;
      case "accessories":
        return <AccessoriesMegaMenu {...megaMenuProps} />;
      default:
        return null;
    }
  };

  // Function to render mobile menu items with proper routing
  const renderMobileMenuItem = (item) => (
    <div key={item.name} className="border-b border-gray-200">
      {!item.hasMegaMenu ? (
        // Simple menu item with direct link
        <Link
          href={item.path}
          className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 hover:bg-gray-50 transition-colors bg-white"
          onClick={handleMobileLinkClick}
        >
          <span className="font-semibold text-gray-700 text-base">
            {item.name}
          </span>
        </Link>
      ) : (
        // Menu item with mega menu
        <>
          <button
            onClick={() => toggleDropdown(item.name)}
            className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 hover:bg-gray-50 transition-colors bg-white"
          >
            <span className="font-semibold text-gray-700 text-base">
              {item.name}
            </span>
            <span className="text-gray-400">
              {dropdown === item.name ? (
                <FaChevronDown size={16} />
              ) : (
                <FaChevronRight size={16} />
              )}
            </span>
          </button>

          {/* Mega Menu Content */}
          {dropdown === item.name && item.hasMegaMenu && (
            <div className="bg-gray-50 border-t border-gray-200">
              <div className="px-6 py-3">
                <Link
                  href={item.path}
                  className="block w-full text-center py-2 px-4 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors mb-3"
                  onClick={handleMobileLinkClick}
                >
                  View All {item.name}
                </Link>

                {/* Render appropriate mega menu component */}
                {renderMobileMegaMenuContent(item)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Function to render mobile mega menu content
  const renderMobileMegaMenuContent = (item) => {
    if (!item.hasMegaMenu || !item.megaMenuData) return null;

    const megaMenuProps = {
      data: item.megaMenuData,
      isMobile: true,
      onItemClick: handleMobileLinkClick,
    };

    switch (item.megaMenuType) {
      case "brands":
        return <ShopeBrandsMegaMenu {...megaMenuProps} />;
      case "watches":
        return <WatchMegaMenu {...megaMenuProps} />;
      case "handbags":
        return <HandBagMegaMenu {...megaMenuProps} />;
      case "jewelry":
        return <JewelryMegaMenu {...megaMenuProps} />;
      case "accessories":
        return <AccessoriesMegaMenu {...megaMenuProps} />;
      default:
        return (
          <div className="text-center py-4 text-gray-500">
            Menu content coming soon
          </div>
        );
    }
  };

  // Function to render currency selector for desktop
  const renderDesktopCurrencySelector = () => (
    <div className="relative">
      <button
        onClick={toggleCurrency}
        disabled={isLoading}
        className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          getCurrencyIcon(selectedCurrency.code)
        )}
        <span className="font-medium">{selectedCurrency.code}</span>
        <FaChevronDown
          className={`transition-transform duration-200 ${
            isCurrencyOpen ? "rotate-180" : ""
          }`}
          size={12}
        />
      </button>

      {isCurrencyOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-200">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
            SELECT CURRENCY
          </div>
          {currencyOptions.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencySelect(currency)}
              disabled={isLoading}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors ${
                selectedCurrency.code === currency.code
                  ? "bg-amber-50 text-amber-700"
                  : "hover:bg-gray-50 text-gray-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span className="text-base">{currency.flag}</span>
              <span className="flex-1 text-left">{currency.name}</span>
              <span
                className={`font-medium ${
                  selectedCurrency.code === currency.code
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
              >
                {currency.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Function to render currency selector for mobile
  const renderMobileCurrencySelector = () => (
    <div className="border-b border-gray-200">
      <button
        onClick={toggleCurrency}
        disabled={isLoading}
        className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            getCurrencyIcon(selectedCurrency.code)
          )}
          <span className="font-medium text-base">Currency</span>
        </div>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-200 ${
            isCurrencyOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isCurrencyOpen && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="px-6 py-2 text-xs font-semibold text-gray-500">
            SELECT CURRENCY
          </div>
          {currencyOptions.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencySelect(currency)}
              disabled={isLoading}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                selectedCurrency.code === currency.code
                  ? "bg-amber-50 text-amber-700"
                  : "text-gray-600 hover:bg-gray-100"
              } disabled:opacity-50`}
            >
              <span className="text-base">{currency.flag}</span>
              <span className="flex-1 text-left">
                {currency.name} ({currency.code})
              </span>
              {selectedCurrency.code === currency.code && (
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Function to render mobile help section
  const renderMobileHelpSection = () => (
    <div className="border-b border-gray-200">
      <button
        onClick={toggleHelp}
        className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <FaPhone className="text-[#1e518e]" size={18} />
          <span className="font-semibold text-base">Help & Support</span>
        </div>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-200 ${
            isHelpOpen ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>

      {isHelpOpen && (
        <div className="bg-gray-50 border-t border-gray-200">
          <a
            href="tel:+97142671124"
            className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-100 text-sm border-b border-gray-200 transition-colors"
            onClick={handleMobileLinkClick}
          >
            <FaPhone className="text-[#1e518e]" size={16} />
            <div>
              <div className="font-medium">Call Support</div>
              <div className="text-xs text-gray-600">+971 4 267 1124</div>
            </div>
          </a>
          <Link
            href="/contact-us"
            className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-100 text-sm border-b border-gray-200 transition-colors"
            onClick={handleMobileLinkClick}
          >
            <FaEnvelope className="text-[#1e518e]" size={16} />
            <span className="font-medium">Contact Form</span>
          </Link>
          <Link
            href="/LiveChat"
            className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-100 text-sm border-b border-gray-200 transition-colors"
            onClick={handleMobileLinkClick}
          >
            <FaComments className="text-[#1e518e]" size={16} />
            <span className="font-medium">Live Chat</span>
          </Link>
          <Link
            href="/Faq"
            className="flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-100 text-sm transition-colors"
            onClick={handleMobileLinkClick}
          >
            <FaQuestionCircle className="text-[#1e518e]" size={16} />
            <span className="font-medium">FAQs</span>
          </Link>
        </div>
      )}
    </div>
  );

  // Function to render mobile language section
  const renderMobileLanguageSection = () => (
    <div className="border-b border-gray-200">
      <button
        onClick={toggleLanguage}
        className="w-full flex justify-between items-center px-6 py-4 text-left text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <FaGlobe className="text-[#1e518e]" size={18} />
          <span className="font-semibold text-base">Language</span>
        </div>
        <FaChevronDown
          className={`text-gray-400 transition-transform duration-200 ${
            isLanguageOpen ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>

      {isLanguageOpen && (
        <div className="bg-gray-50 border-t border-gray-200">
          <button
            className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-100 text-sm border-b border-gray-200 transition-colors"
            onClick={() => {
              setIsLanguageOpen(false);
              handleMobileLinkClick();
            }}
          >
            <span className="text-lg">🇬🇧</span>
            <span className="font-medium">English</span>
          </button>
          <button
            className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-100 text-sm border-b border-gray-200 transition-colors"
            onClick={() => {
              setIsLanguageOpen(false);
              handleMobileLinkClick();
            }}
          >
            <span className="text-lg">🇦🇪</span>
            <span className="font-medium">العربية</span>
          </button>
          <button
            className="w-full flex items-center gap-4 px-6 py-3 text-gray-700 hover:bg-gray-100 text-sm transition-colors"
            onClick={() => {
              setIsLanguageOpen(false);
              handleMobileLinkClick();
            }}
          >
            <span className="text-lg">🇮🇳</span>
            <span className="font-medium">हिन्दी</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop SubNavbar */}
      <header
        className={`w-full bg-white sticky top-[80px] z-40 transition-all duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-sm"
        } hidden lg:block`}
      >
        <div className="container mx-auto px-5 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Main Navigation */}
            <nav className="flex-1 flex justify-center">
              <div className="flex items-center justify-center gap-6 xl:gap-8 h-full">
                {menuItems.map((item) => (
                  <div
                    key={item.name}
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => setDropdown(item.name)}
                    onMouseLeave={() => setDropdown(null)}
                  >
                    <Link
                      href={item.path}
                      className="block text-gray-800 font-semibold hover:text-amber-700 transition-colors text-sm xl:text-base whitespace-nowrap py-2 px-1 border-b-2 border-transparent hover:border-amber-500"
                    >
                      {item.name}
                    </Link>

                    {/* Mega Menu for specific items */}
                    {item.hasMegaMenu &&
                      dropdown === item.name &&
                      renderMegaMenu(item)}
                  </div>
                ))}
              </div>
            </nav>

            {/* Right side items - Currency, Help & Language */}
            <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
              {/* Currency Selector */}
              {renderDesktopCurrencySelector()}

              {/* Help */}
              <div className="relative">
                <button
                  onClick={toggleHelp}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition-colors duration-200 border border-gray-200"
                >
                  <FaPhone className="text-[#1e518e]" size={16} />
                  <span className="font-semibold text-gray-700">Support</span>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      isHelpOpen ? "rotate-180" : ""
                    } text-gray-500`}
                    size={12}
                  />
                </button>
                {isHelpOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg py-3 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 bg-gray-50">
                      HELP & SUPPORT
                    </div>
                    <a
                      href="tel:+97142671124"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-100"
                    >
                      <FaPhone className="text-[#1e518e]" size={16} />
                      <div>
                        <div className="font-medium">Call Support</div>
                        <div className="text-xs text-gray-500">
                          +971 4 267 1124
                        </div>
                      </div>
                    </a>
                    <Link
                      href="/contact-us"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-100"
                    >
                      <FaEnvelope className="text-[#1e518e]" size={16} />
                      <span className="font-medium">Contact Form</span>
                    </Link>
                    <Link
                      href="/LiveChat"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-100"
                    >
                      <FaComments className="text-[#1e518e]" size={16} />
                      <span className="font-medium">Live Chat</span>
                    </Link>
                    <Link
                      href="/Faq"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm transition-colors"
                    >
                      <FaQuestionCircle className="text-[#1e518e]" size={16} />
                      <span className="font-medium">FAQs</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Language */}
              <div className="relative">
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition-colors duration-200 border border-gray-200"
                >
                  <FaGlobe className="text-[#1e518e]" size={16} />
                  <span className="font-semibold text-gray-700">English</span>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      isLanguageOpen ? "rotate-180" : ""
                    } text-gray-500`}
                    size={12}
                  />
                </button>
                {isLanguageOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100 bg-gray-50">
                      SELECT LANGUAGE
                    </div>
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-100">
                      <span className="text-lg">🇬🇧</span>
                      <span className="font-medium">English</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-100">
                      <span className="text-lg">🇦🇪</span>
                      <span className="font-medium">العربية</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm transition-colors">
                      <span className="text-lg">🇮🇳</span>
                      <span className="font-medium">हिन्दी</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Fixed for better responsiveness */}
      <div
        className={`fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Montres Store</h2>
          <button
            onClick={closeMobileMenu}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="h-full overflow-y-auto pb-20">
          {/* Main Menu Items */}
          {menuItems.map(renderMobileMenuItem)}

          {/* Currency Selector for Mobile */}
          {renderMobileCurrencySelector()}

          {/* Help Section */}
          {renderMobileHelpSection()}

          {/* Language Section */}
          {renderMobileLanguageSection()}
        </div>
      </div>

      {/* Overlay for mobile menu - Fixed background */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  );
};

export default SubNavbar;
