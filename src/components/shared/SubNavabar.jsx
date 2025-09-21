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

import Image from "next/image";

const SubNavbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [dropdown, setDropdown] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      name: "SHOP BY BRANDS",
      path: "/shop-by-brands"
    },
    {
      name: "EXCLUSIVE COLLECTION",
      path: "/exclusive-collection"
    },
    {
      name: "WATCHES",
      path: "/watches"
    },
    {
      name: "CLOCKS",
      path: "/clocks"
    },
    {
      name: "LEATHERS",
      path: "/leathers",
      subMenu: [
        { name: "Wallets", path: "/leathers/wallets" },
        { name: "Bags", path: "/leathers/belts" },
      ],
    },
    {
      name: "ACCESSORIES",
      path: "/accessories",
      subMenu: [
        { name: "Pens", path: "/accessories/pens" },
        { name: "Cufflinks", path: "/accessories/cufflinks" },
        { name: "Cards", path: "/accessories/cards" },
        { name: "Scarfs", path: "/accessories/scarfs" },
        { name: "Bracelets", path: "/accessories/bracelets" },
        { name: "Umbrellas", path: "/accessories/umbrellas" }
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
  const toggleLanguage = useCallback(
    () => setIsLanguageOpen((prev) => !prev),
    []
  );
  const closeMobileMenu = useCallback(
    () => setIsMobileMenuOpen(false),
    [setIsMobileMenuOpen]
  );

  return (
    <>
      {/* Desktop SubNavbar */}
      <header
        className={`w-full bg-white sticky top-14 md:top-16 z-40 transition-all duration-300 ${
          isScrolled ? "shadow-md" : "shadow-sm"
        } hidden md:block`}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 flex justify-center items-center h-12 md:h-14">
          {/* Centered Main Menu */}
          <nav className="flex items-center justify-center gap-4 md:gap-6 h-full" style={{marginLeft:"-223px"}}>
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

                {item.subMenu && (
                  <div 
                    className={`absolute left-0 top-full mt-0 w-52 bg-white shadow-xl rounded-b-md py-2 border-t-2 border-amber-300 z-50 ${
                      dropdown === item.name ? 'block' : 'hidden'
                    }`}
                  >
                    {item.subMenu.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.path}
                        className="block px-4 py-2 text-gray-800 hover:bg-amber-50 text-sm border-b border-gray-100 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Help & Language - Moved to the right */}
          <div className="absolute right-4 flex items-center gap-4 md:gap-6">
            {/* Help */}
            <div className="relative">
              <button
                onClick={toggleHelp}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 text-sm"
              >
                <FaPhone className="text-[#1e518e]" />
                <span>Support</span>
                <FaChevronDown
                  className={`transition-transform ${
                    isHelpOpen ? "rotate-180" : ""
                  }`}
                />
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
                      <div className="text-xs text-gray-500">
                        +971 1234 5678
                      </div>
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
                <FaChevronDown
                  className={`transition-transform ${
                    isLanguageOpen ? "rotate-180" : ""
                  }`}
                />
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
                <span className="font-medium text-base">{item.name}</span>
                {item.subMenu && (
                  <span className="text-gray-400">
                    {dropdown === item.name ? (
                      <FaChevronDown size={14} />
                    ) : (
                      <FaChevronRight size={14} />
                    )}
                  </span>
                )}
              </button>

              {item.subMenu && dropdown === item.name && (
                <div className="bg-gray-50 pl-5">
                  {item.subMenu.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.path}
                      className="block px-5 py-3 text-gray-600 hover:bg-gray-100 text-sm border-t border-gray-100 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {sub.name}
                    </Link>
                  ))}
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
              <FaChevronDown
                className={`text-gray-400 transition-transform ${
                  isHelpOpen ? "rotate-180" : ""
                }`}
              />
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
              <FaChevronDown
                className={`text-gray-400 transition-transform ${
                  isLanguageOpen ? "rotate-180" : ""
                }`}
              />
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  );
};

export default SubNavbar;