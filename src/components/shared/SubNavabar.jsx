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
} from "react-icons/fa";
import Link from "next/link";
import Rolex from '../../assets/Rolex Submariner.jpg'
import Omega from '../../assets/Omega Seamaster.jpg'
import WatchCollection from '../../assets/Watch Collection.jpg'
import LeatherWallet   from '../../assets/Leather Wallet.jpg'
import LeatherSale  from '../../assets/Leather Sale.jpg'
import LeatherBag  from  '../../assets/Leather Bag.jpg'
import SilverCufflinks from '../../assets/Silver Cufflinks.jpg'
import FountainPen from '../../assets/Fountain Pen.jpg'
import AccessoryDeals from '../../assets/Accessory Deals.jpg'
import Image from "next/image";

const SubNavbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [dropdown, setDropdown] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
    
    // Initial check
    checkScreenSize();
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScreenSize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Mega menu data for different categories
  const megaMenuData = {
    watches: {
      categories: [
        { name: "luxury/Classic Watches", path: "/watches/luxury" },
        { name: "Sports/casual Watches", path: "/watches/sports" },
        { name: "Classic/casual Watches", path: "/watches/classic" },
        { name: "Smart Watches", path: "/watches/smart" },
        { name: "Limited Edition", path: "/watches/limited-edition" },
      ],
      featuredProducts: [
        {
          id: 1,
          name: "Rolex Submariner",
          price: "AED8,500",
          image: Rolex,
          width: 80,
          height: 80
        },
        {
          id: 2,
          name: "Omega Seamaster",
          price: "AED4,200",
          image: Omega,
          width: 80,
          height: 80
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
          price: "AED299",
          image: LeatherBag,
          width: 80,
          height: 80
        },
        {
          id: 4,
          name: "Genuine Leather Wallet",
          price: "AED89",
          image: LeatherWallet,
          width: 80,
          height: 80
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
          price: "AED199",
          image: FountainPen,
          width: 80,
          height: 80
        },
        {
          id: 6,
          name: "Silver Cufflinks",
          price: "AED129",
          image: SilverCufflinks,
          width: 80,
          height: 80
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

  const toggleDropdown = useCallback(
    (name) => setDropdown((prev) => (prev === name ? null : name)),
    []
  );

  const toggleHelp = useCallback(() => setIsHelpOpen((prev) => !prev), []);
  const toggleLanguage = useCallback(() => setIsLanguageOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [setIsMobileMenuOpen]);

  // Function to render mega menu for desktop ONLY
  const renderMegaMenu = (megaMenuKey) => {
    if (!isDesktop) return null; // Only render on desktop

    const data = megaMenuData[megaMenuKey];

    return (
      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-screen max-w-6xl bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Column 1: Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Categories</h3>
              <ul className="space-y-3">
                {data.categories.map((category) => (
                  <li key={category.name}>
                    <Link
                      href={category.path}
                      className="text-gray-600 hover:text-amber-600 transition-colors duration-200 block py-1"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Featured Products */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">Featured Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={product.width}
                      height={product.height}
                      className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-amber-600 font-semibold">{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Promotion & Newsletter */}
            <div className="space-y-6">
              {/* Promotion Banner */}
              <div className="relative group overflow-hidden rounded-lg">
                <Image
                  src={data.promotion.image}
                  alt={data.promotion.title}
                  width={data.promotion.width}
                  height={data.promotion.height}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h4 className="font-bold text-lg">{data.promotion.title}</h4>
                    <p className="text-sm mb-2">{data.promotion.description}</p>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      {data.promotion.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to render nested submenus for desktop
  const renderDesktopSubMenu = (subItems, level = 0) => {
    return (
      <div
        className={`absolute ${level === 0 ? "left-0 top-full" : "left-full top-0"} mt-0 w-52 bg-white shadow-xl rounded-b-md py-2 border-t-2 border-amber-300 z-50`}
      >
        {subItems.map((sub) => (
          <div key={sub.name} className="relative group">
            <Link
              href={sub.path}
              className="block px-4 py-2 text-gray-800 hover:bg-amber-50 text-sm border-b border-gray-100 transition-colors flex justify-between items-center"
            >
              {sub.name}
              {sub.subMenu && <FaChevronRight size={12} className="text-gray-400" />}
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
            {renderMobileSubMenu(sub.subMenu, `${parentName}-${sub.name}`, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  // Function to render mobile menu content (without mega menu layout)
  const renderMobileMenuContent = (megaMenuKey) => {
    const data = megaMenuData[megaMenuKey];

    return (
      <div className="pl-4 pb-4 space-y-4">
        {/* Categories */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Categories</h4>
          <ul className="space-y-2">
            {data.categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={category.path}
                  className="text-gray-600 hover:text-amber-600 block py-1"
                  onClick={closeMobileMenu}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Featured Products */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Featured</h4>
          <div className="space-y-3">
            {data.featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
                onClick={closeMobileMenu}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-amber-600 text-sm font-semibold">{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Promotion */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-1">{data.promotion.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{data.promotion.description}</p>
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm w-full transition-colors">
            {data.promotion.cta}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop SubNavbar */}
      <header
        className={`w-full bg-white sticky top-14 md:top-16 z-40 transition-all duration-300 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        } hidden md:block`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center h-12 md:h-14">
          {/* Centered Main Menu */}
          <nav className="flex-1 flex justify-center">
            <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 h-full">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group h-full flex items-center"
                  onMouseEnter={() => setDropdown(item.name)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <Link
                    href={item.path || "#"}
                    className="block text-gray-800 font-medium hover:text-amber-700 transition-colors text-sm md:text-base whitespace-nowrap py-2"
                  >
                    {item.name}
                  </Link>

                  {/* Mega Menu for specific items - DESKTOP ONLY */}
                  {item.hasMegaMenu && dropdown === item.name && renderMegaMenu(item.megaMenuKey)}

                  {/* Regular Submenu for other items */}
                  {item.subMenu && !item.hasMegaMenu && dropdown === item.name && renderDesktopSubMenu(item.subMenu)}
                </div>
              ))}
            </div>
          </nav>

          {/* Help & Language - Right side */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Help */}
            <div className="relative">
              <button
                onClick={toggleHelp}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 text-sm"
              >
                <FaPhone className="text-[#1e518e]" />
                <span>Support</span>
                <FaChevronDown className={`transition-transform ${isHelpOpen ? "rotate-180" : ""}`} />
              </button>
              {isHelpOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-200">
                  <a
                    href="tel:+97112345678"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-sm transition-colors"
                  >
                    <FaPhone className="text-[#1e518e]" />
                    <div>
                      <div>Call Support</div>
                      <div className="text-xs text-gray-500">+971 1234 5678</div>
                    </div>
                  </a>
                  <Link
                    href="/ContactForm"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-sm transition-colors"
                  >
                    <FaEnvelope className="text-[#1e518e]" />
                    Contact Form
                  </Link>
                  <Link
                    href="/LiveChat"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-sm transition-colors"
                  >
                    <FaComments className="text-[#1e518e]" />
                    Live Chat
                  </Link>
                  <Link
                    href="/Faq"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-sm transition-colors"
                  >
                    <FaQuestionCircle className="text-[#1e518e]" />
                    FAQs
                  </Link>
                </div>
              )}
            </div>

            {/* Language */}
            <div className="relative">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 text-sm"
              >
                <FaGlobe className="text-[#1e518e]" />
                <span>English</span>
                <FaChevronDown className={`transition-transform ${isLanguageOpen ? "rotate-180" : ""}`} />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-200">
                  <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm transition-colors">
                    🇬🇧 English
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm transition-colors">
                    🇦🇪 العربية
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-sm transition-colors">
                    🇮🇳 हिन्दी
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Half Screen */}
      <div
        className={`fixed inset-y-0 left-0 w-3/4 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Montres</h2>
          <button
            onClick={closeMobileMenu}
            className="p-9 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Mobile Items */}
        <div className="overflow-y-auto h-full pb-20">
          {menuItems.map((item) => (
            <div key={item.name} className="border-b border-gray-100">
              <button
                onClick={() => toggleDropdown(item.name)}
                className="w-full flex justify-between items-center px-5 py-3 text-left text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-700 hover:text-yellow-600 transition">{item.name}</span>
                {(item.subMenu || item.hasMegaMenu) && (
                  <span className="text-gray-400">
                    {dropdown === item.name ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                  </span>
                )}
              </button>

              {/* Mobile Menu Content (simplified layout for mobile) */}
              {(item.hasMegaMenu || item.subMenu) && dropdown === item.name && (
                <div className="bg-gray-50 pl-5">
                  {item.hasMegaMenu 
                    ? renderMobileMenuContent(item.megaMenuKey)
                    : renderMobileSubMenu(item.subMenu, item.name)
                  }
                </div>
              )}
            </div>
          ))}

          {/* Mobile Help */}
          <div className="border-b border-gray-100">
            <button
              onClick={toggleHelp}
              className="w-full flex justify-between items-center px-5 py-3 text-left text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FaPhone className="text-[#1e518e]" />
                <span className="font-medium text-base">Help & Support</span>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform ${isHelpOpen ? "rotate-180" : ""}`} />
            </button>
            {isHelpOpen && (
              <div className="bg-gray-50 pl-5">
                <a
                  href="tel:+97112345678"
                  className="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-100 text-sm border-t border-gray-100 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaPhone className="text-[#1e518e]" />
                  Call Support
                </a>
                <Link
                  href="/ContactForm"
                  className="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-100 text-sm border-t border-gray-100 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaEnvelope className="text-[#1e518e]" />
                  Contact Form
                </Link>
                <Link
                  href="/live-chat"
                  className="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-100 text-sm border-t border-gray-100 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaComments className="text-[#1e518e]" />
                  Live Chat
                </Link>
                <Link
                  href="/Faq"
                  className="flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-100 text-sm border-t border-gray-100 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <FaQuestionCircle className="text-[#1e518e]" />
                  FAQs
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Language */}
          <div className="border-b border-gray-100">
            <button
              onClick={toggleLanguage}
              className="w-full flex justify-between items-center px-5 py-3 text-left text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FaGlobe className="text-[#1e518e]" />
                <span className="font-medium text-base">Language</span>
              </div>
              <FaChevronDown className={`text-gray-400 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`} />
            </button>
            {isLanguageOpen && (
              <div className="bg-gray-50 pl-5">
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-100 text-sm border-t border-gray-100 transition-colors"
                  onClick={() => {
                    setIsLanguageOpen(false);
                    closeMobileMenu();
                  }}
                >
                  🇬🇧 English
                </button>
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-100 text-sm border-t border-gray-100 transition-colors"
                  onClick={() => {
                    setIsLanguageOpen(false);
                    closeMobileMenu();
                  }}
                >
                  🇦🇪 العربية
                </button>
                <button
                  className="w-full flex items-center gap-3 px-5 py-3 text-gray-600 hover:bg-gray-100 text-sm border-t border-gray-100 transition-colors"
                  onClick={() => {
                    setIsLanguageOpen(false);
                    closeMobileMenu();
                  }}
                >
                  🇮🇳 हिन्दी
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMobileMenu}></div>
      )}
    </>
  );
};

export default SubNavbar;