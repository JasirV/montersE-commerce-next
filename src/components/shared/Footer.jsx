"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";

import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";

import montreslogo from "../../assets/montreslogo.png";
import visa from "../../assets/visa-logo-visa-icon-free-free-vector.jpg";
import master from "../../assets/mastercard-icon-lg.png";
import amex from "../../assets/images (3).png";
import paypal from "../../assets/images (2).png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0d111c] to-[#111827] text-gray-300 px-4 md:px-16 py-12">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* LOGO + CONTACT */}
        <div>
          {/* CLICKABLE LOGO */}
          <Link href="/" aria-label="Go to homepage">
            <Image
              src={montreslogo}
              alt="Montres Logo"
              width={160}
              height={40}
              className="mb-4 filter brightness-0 invert cursor-pointer"
            />
          </Link>

          <p className="text-sm leading-relaxed mb-6">
            Luxury watches and accessories for those who appreciate the art of time.
          </p>

          <div className="space-y-3 text-sm">
            {/* CLICKABLE LOCATION */}
            <a
              href="https://www.google.com/maps?q=Moza+Plaza+Dubai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Montres Trading LLC location in Google Maps"
              className="flex gap-3 items-center hover:text-white transition cursor-pointer"
            >
              <MdLocationOn className="text-blue-400 text-xl" />
              <span>Shop 5, Moza Plaza 1, Al Khor Street, Deira Waterfront, Dubai, UAE</span>
            </a>

            {/* CLICKABLE PHONE */}
            <a
              href="tel:+97142671124"
              aria-label="Call Montres Trading LLC"
              className="flex gap-3 items-center hover:text-white transition cursor-pointer"
            >
              <MdPhone className="text-blue-400 text-xl" />
              <span>+971 4 267 1124</span>
            </a>

            {/* CLICKABLE EMAIL */}
            <a
              href="mailto:sales@montres.ae"
              className="flex gap-3 items-center hover:text-white transition"
            >
              <MdEmail className="text-blue-400 text-xl" />
              <span>sales@montres.ae</span>
            </a>
          </div>

          {/* SOCIAL MEDIA */}
          <div className="mt-6">
            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/montres.ae/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-pink-600 p-2 rounded-full"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.facebook.com/Montres.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://www.tiktok.com/@montres.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-black p-2 rounded-full"
              >
                <FaTiktok />
              </a>

              <a
                href="https://wa.me/97142671124"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-green-500 p-2 rounded-full"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>

        {/* SHOP COLLECTION LINKS */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 flex gap-2">
            <RiCustomerService2Fill className="text-blue-400" />
            Shop Collections
          </h3>

          <ul className="space-y-3 text-sm">
            <li><Link href="/exclusive-collection" className="hover:text-white">Exclusive Collection</Link></li>
            <li><Link href="/shop" className="hover:text-white">Shop All</Link></li>
            <li><Link href="/watches" className="hover:text-white">Watches</Link></li>
            <li><Link href="/leathers" className="hover:text-white">Leather Collection</Link></li>
            <li><Link href="/leathers/LeatherGoodsAll" className="hover:text-white">Leather Goods</Link></li>
            <li><Link href="/accessories/Accessories" className="hover:text-white">Accessories</Link></li>
            <li><Link href="/BrandNew" className="hover:text-white">Brand New</Link></li>
          </ul>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 flex gap-2">
            <RiCustomerService2Fill className="text-blue-400" />
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm">
            <li><Link href="/about-us" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact-us" className="hover:text-white">Contact Us</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/Faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/TermsCondition" className="hover:text-white">Terms & Conditions</Link></li>
            <li><Link href="/ReturnPolicy" className="hover:text-white">RefundReturn Policy</Link></li>
          </ul>
        </div>

        {/* GOOGLE MAP */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4 flex gap-2">
            <MdLocationOn className="text-blue-400" />
            Our Location
          </h3>

          <iframe
            className="w-full h-56 rounded-lg border border-gray-700"
            loading="lazy"
            src="https://www.google.com/maps?q=Moza+Plaza+Dubai&output=embed"
          />
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="text-gray-400">
          © 2026 Montres Trading L.L.C – The Art Of Time
        </p>

        <div className="flex gap-2 mt-4 md:mt-0">
          <Image src={visa} alt="Visa" width={40} height={24} />
          <Image src={master} alt="Mastercard" width={40} height={24} />
          <Image src={amex} alt="Amex" width={40} height={24} />
          <Image src={paypal} alt="Paypal" width={40} height={24} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
