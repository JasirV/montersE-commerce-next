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
import Rolex from "../../assets/Rolex Submariner.jpg";
import Omega from "../../assets/Omega Seamaster.jpg";
import WatchCollection from "../../assets/Watch Collection.jpg";
import LeatherWallet from "../../assets/Leather Wallet.jpg";
import LeatherSale from "../../assets/Leather Sale.jpg";
import LeatherBag from "../../assets/Leather Bag.jpg";
import SilverCufflinks from "../../assets/Silver Cufflinks.jpg";
import FountainPen from "../../assets/Fountain Pen.jpg";
import AccessoryDeals from "../../assets/Accessory Deals.jpg";
import { useCurrency } from "@/app/CurrencyContext";
import newCurrency from '../../assets/newSymbole.png';
import Image from "next/image";
import axios from "axios";

// Import the MegaMenu component
import MegaMenu from "./MegaMenu";
import api from "@/api/axiosIntespter";

const SubNavbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { currency, setCurrency, setRate } = useCurrency();
  const [dropdown, setDropdown] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({
    code: "AED",
    symbol: "د.إ",
    name: "UAE Dirham",
    flag: "🇦🇪",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mega Menu Data
  const megaMenuData = {
    watches: {
      categories: [
        { name: "luxury Watches", path: "/watches/luxury" },
        { name: "Sports Watches", path: "/watches/sports" },
        { name: "Classic Watches", path: "/watches/classic" },
      ],
      featuredProducts: [
        {
          id: 1,
          name: "Rolex Submariner",
          price: "8,500",
          image: Rolex,
          width: 80,
          height: 80,
        },
        {
          id: 2,
          name: "Omega Seamaster",
          price: "4,200",
          image: Omega,
          width: 80,
          height: 80,
        },
      ],
      promotion: {
        title: "Watch Collection",
        description: "Premium timepieces 30% off",
        image: WatchCollection,
        width: 300,
        height: 128,
        cta: "Shop Watches",
      },
    },
    leathers: {
      categories: [
        { name: "Bags", path: "/leathers/bags" },
        { name: "Wallets", path: "/leathers/wallets" },
        { name: "Belts", path: "/leathers/belts" },
        { name: "Briefcases", path: "/leathers/briefcases" },
        { name: "Accessories", path: "/leathers/accessories" },
      ],
      featuredProducts: [
        {
          id: 3,
          name: "Premium Leather Bag",
          price: "299",
          image: LeatherBag,
          width: 80,
          height: 80,
        },
        {
          id: 4,
          name: "Genuine Leather Wallet",
          price: "89",
          image: LeatherWallet,
          width: 80,
          height: 80,
        },
      ],
      promotion: {
        title: "Leather Sale",
        description: "Genuine leather items 25% off",
        image: LeatherSale,
        width: 300,
        height: 128,
        cta: "Shop Leather",
      },
    },
    accessories: {
      categories: [
        { name: "Pens", path: "/accessories/pens" },
        { name: "Cufflinks", path: "/accessories/cufflinks" },
        { name: "Bracelets", path: "/accessories/bracelets" },
        { name: "Scarves", path: "/accessories/scarves" },
        { name: "Umbrellas", path: "/accessories/umbrellas" },
      ],
      featuredProducts: [
        {
          id: 5,
          name: "Premium Fountain Pen",
          price: "199",
          image: FountainPen,
          width: 80,
          height: 80,
        },
        {
          id: 6,
          name: "Silver Cufflinks",
          price: "129",
          image: SilverCufflinks,
          width: 80,
          height: 80,
        },
      ],
      promotion: {
        title: "Accessory Deals",
        description: "Luxury accessories up to 40% off",
        image: AccessoryDeals,
        width: 300,
        height: 128,
        cta: "Shop Accessories",
      },
    },
  };

  // Menu Items
  const menuItems = [
    {
      name: "SHOP BY BRANDS",
      path: "/shop-by-brands",
    },
    {
      name: "EXCLUSIVE COLLECTION",
      path: "/exclusive-collection",
    },
    {
      name: "WATCHES",
      path: "/watches",
      hasMegaMenu: true,
      megaMenuKey: "watches",
      subMenu: [
        { name: "Women", path: "/watches/women" },
        { name: "Men/Unisex", path: "/watches/men-unisex" },
      ],
    },
    {
      name: "CLOCKS",
      path: "/clocks",
    },
    {
      name: "LEATHERS",
      path: "/leathers",
      hasMegaMenu: true,
      megaMenuKey: "leathers",
      subMenu: [
        {
          name: "Bags",
          path: "/leathers/bags",
          subMenu: [
            { name: "Women", path: "/leathers/bags/women" },
            { name: "Men/Unisex", path: "/leathers/bags/men-unisex" },
          ],
        },
        { name: "Wallets", path: "/leathers/wallets" },
        { name: "Belts", path: "/leathers/belts" },
      ],
    },
    {
      name: "ACCESSORIES",
      path: "/accessories",
      hasMegaMenu: true,
      megaMenuKey: "accessories",
      subMenu: [
        { name: "Pens", path: "/accessories/pens" },
        { name: "Cufflinks", path: "/accessories/cufflinks" },
        { name: "Cards", path: "/accessories/cards" },
        { name: "Scarfs", path: "/accessories/scarfs" },
        { name: "Bracelets", path: "/accessories/bracelets" },
        { name: "Umbrellas", path: "/accessories/umbrellas" },
      ],
    },
    {
      name: "JEWELRY",
      path: "/jewelry",
      subMenu: [
        { name: "Rings", path: "/jewelry/rings" },
        { name: "Ear Rings", path: "/jewelry/ear-rings" },
      ],
    },
    {
      name: "BRAND NEW",
      path: "/brand-new",
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
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);

    checkScreenSize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScreenSize);
    };
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
  const closeMobileMenu = useCallback(
    () => setIsMobileMenuOpen(false),
    [setIsMobileMenuOpen]
  );

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
        return <span className="text-amber-600 font-bold">{selectedCurrency.symbol}</span>;
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
    <div className="border-b border-gray-100">
      <button
        onClick={toggleCurrency}
        disabled={isLoading}
        className="w-full flex justify-between items-center px-5 py-3 text-left text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50"
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
        <div className="bg-gray-50 pl-5">
          <div className="px-5 py-2 text-xs font-semibold text-gray-500 border-t border-gray-200">
            SELECT CURRENCY
          </div>
          {currencyOptions.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencySelect(currency)}
              disabled={isLoading}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm border-t border-gray-100 transition-colors ${
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

  // Function to render nested submenus for desktop
  const renderDesktopSubMenu = (subItems, level = 0) => {
    return (
      <div
        className={`absolute ${
          level === 0 ? "left-0 top-full" : "left-full top-0"
        } mt-0 w-52 bg-white shadow-xl rounded-b-md py-2 border-t-2 border-amber-300 z-50`}
      >
        {subItems.map((sub) => (
          <div key={sub.name} className="relative group">
            <Link
              href={sub.path}
              className="block px-4 py-2 text-gray-800 hover:bg-amber-50 text-sm border-b border-gray-100 transition-colors flex justify-between items-center"
            >
              {sub.name}
              {sub.subMenu && (
                <FaChevronRight size={12} className="text-gray-400" />
              )}
            </Link>

            {sub.subMenu && (
              <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {renderDesktopSubMenu(sub.subMenu, level + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Function to render nested submenus for mobile
  const renderMobileSubMenu = (subItems, parentName, level = 0) => {
    return subItems.map((sub) => (
      <div key={sub.name}>
        <div className="flex justify-between items-center">
          <Link
            href={sub.path}
            className="block px-5 py-3 text-gray-600 hover:bg-gray-100 text-sm border-t border-gray-100 transition-colors flex-1"
            onClick={closeMobileMenu}
          >
            {sub.name}
          </Link>
          {sub.subMenu && (
            <button
              onClick={() => toggleDropdown(`${parentName}-${sub.name}`)}
              className="px-4 py-3 text-gray-400"
            >
              {dropdown === `${parentName}-${sub.name}` ? (
                <FaChevronDown size={14} />
              ) : (
                <FaChevronRight size={14} />
              )}
            </button>
          )}
        </div>

        {sub.subMenu && dropdown === `${parentName}-${sub.name}` && (
          <div className="bg-gray-100 pl-5">
            {renderMobileSubMenu(
              sub.subMenu,
              `${parentName}-${sub.name}`,
              level + 1
            )}
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      {/* Desktop SubNavbar */}
      <header
        className={`w-full bg-white sticky top-14 lg:top-16 z-40 transition-all duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-sm"
        } hidden lg:block`}
      >
        <div className="container mx-auto px-4 lg:px-8">
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
                      href={item.path || "#"}
                      className="block text-gray-800 font-semibold hover:text-amber-700 transition-colors text-sm xl:text-base whitespace-nowrap py-2 px-1 border-b-2 border-transparent hover:border-amber-500"
                    >
                      {item.name}
                    </Link>

                    {/* Mega Menu for specific items */}
                    {item.hasMegaMenu &&
                      dropdown === item.name && (
                        <MegaMenu 
                          data={megaMenuData[item.megaMenuKey]} 
                          megaMenuKey={item.megaMenuKey}
                          isMobile={false}
                        />
                      )}

                    {/* Regular Submenu for other items */}
                    {item.subMenu &&
                      !item.hasMegaMenu &&
                      dropdown === item.name &&
                      renderDesktopSubMenu(item.subMenu)}
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
                      href="tel:+97112345678"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm transition-colors border-b border-gray-100"
                    >
                      <FaPhone className="text-[#1e518e]" size={16} />
                      <div>
                        <div className="font-medium">Call Support</div>
                        <div className="text-xs text-gray-500">+971 1234 5678</div>
                      </div>
                    </a>
                    <Link
                      href="/ContactForm"
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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-full sm:w-4/5 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-bold text-gray-800">Montres Boutique</h2>
          <button
            onClick={closeMobileMenu}
            className="p-3 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="overflow-y-auto h-full pb-32">
          {/* Main Menu Items */}
          {menuItems.map((item) => (
            <div key={item.name} className="border-b border-gray-200">
              {!item.subMenu && !item.hasMegaMenu ? (
                <Link
                  href={item.path}
                  className="w-full flex justify-between items-center px-6 py-5 text-left text-gray-800 hover:bg-gray-50 transition-colors bg-white"
                  onClick={closeMobileMenu}
                >
                  <span className="font-semibold text-gray-700 text-base hover:text-amber-600 transition">
                    {item.name}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left text-gray-800 hover:bg-gray-50 transition-colors bg-white"
                >
                  <span className="font-semibold text-gray-700 text-base">
                    {item.name}
                  </span>
                  <span className="text-gray-400">
                    {dropdown === item.name ? (
                      <FaChevronDown size={18} />
                    ) : (
                      <FaChevronRight size={18} />
                    )}
                  </span>
                </button>
              )}

              {/* Mobile Menu Content */}
              {(item.hasMegaMenu || item.subMenu) && dropdown === item.name && (
                <div className="bg-white">
                  {item.hasMegaMenu ? (
                    <MegaMenu 
                      data={megaMenuData[item.megaMenuKey]} 
                      megaMenuKey={item.megaMenuKey}
                      isMobile={true}
                    />
                  ) : (
                    renderMobileSubMenu(item.subMenu, item.name)
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Currency Selector for Mobile */}
          {renderMobileCurrencySelector()}

          {/* Mobile Help */}
          <div className="border-b border-gray-200">
            <button
              onClick={toggleHelp}
              className="w-full flex justify-between items-center px-6 py-5 text-left text-gray-800 hover:bg-gray-50 transition-colors bg-white"
            >
              <div className="flex items-center gap-4">
                <FaPhone className="text-[#1e518e]" size={20} />
                <span className="font-semibold text-base">Help & Support</span>
              </div>
              <FaChevronDown
                className={`text-gray-400 transition-transform duration-200 ${
                  isHelpOpen ? "rotate-180" : ""
                }`}
                size={18}
              />
            </button>
            {isHelpOpen && (
              <div className="bg-gray-50 border-t border-gray-200">
                <a
                  href="tel:+97112345678"
                  className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-100 text-base border-b border-gray-200 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaPhone className="text-[#1e518e]" size={18} />
                  <div>
                    <div className="font-medium">Call Support</div>
                    <div className="text-sm text-gray-600">+971 1234 5678</div>
                  </div>
                </a>
                <Link
                  href="/ContactForm"
                  className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-100 text-base border-b border-gray-200 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaEnvelope className="text-[#1e518e]" size={18} />
                  <span className="font-medium">Contact Form</span>
                </Link>
                <Link
                  href="/LiveChat"
                  className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-100 text-base border-b border-gray-200 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaComments className="text-[#1e518e]" size={18} />
                  <span className="font-medium">Live Chat</span>
                </Link>
                <Link
                  href="/Faq"
                  className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-100 text-base transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaQuestionCircle className="text-[#1e518e]" size={18} />
                  <span className="font-medium">FAQs</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Language */}
          <div className="border-b border-gray-200">
            <button
              onClick={toggleLanguage}
              className="w-full flex justify-between items-center px-6 py-5 text-left text-gray-800 hover:bg-gray-50 transition-colors bg-white"
            >
              <div className="flex items-center gap-4">
                <FaGlobe className="text-[#1e518e]" size={20} />
                <span className="font-semibold text-base">Language</span>
              </div>
              <FaChevronDown
                className={`text-gray-400 transition-transform duration-200 ${
                  isLanguageOpen ? "rotate-180" : ""
                }`}
                size={18}
              />
            </button>
            {isLanguageOpen && (
              <div className="bg-gray-50 border-t border-gray-200">
                <button
                  className="w-full flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-100 text-base border-b border-gray-200 transition-colors"
                  onClick={() => {
                    setIsLanguageOpen(false);
                    closeMobileMenu();
                  }}
                >
                  <span className="text-xl">🇬🇧</span>
                  <span className="font-medium">English</span>
                </button>
                <button
                  className="w-full flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-100 text-base border-b border-gray-200 transition-colors"
                  onClick={() => {
                    setIsLanguageOpen(false);
                    closeMobileMenu();
                  }}
                >
                  <span className="text-xl">🇦🇪</span>
                  <span className="font-medium">العربية</span>
                </button>
                <button
                  className="w-full flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-100 text-base transition-colors"
                  onClick={() => {
                    setIsLanguageOpen(false);
                    closeMobileMenu();
                  }}
                >
                  <span className="text-xl">🇮🇳</span>
                  <span className="font-medium">हिन्दी</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/20 z-40 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  );
};

export default SubNavbar;