import React from "react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import montreslogo from "../../assets/montreslogo.png";
import visa from "../../assets/visa-logo-visa-icon-free-free-vector.jpg";
import master from "../../assets/mastercard-icon-lg.png";
import paypl from "../../assets/images (2).png";
import amex from "../../assets/images (3).png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-300 px-4 md:px-16 py-10 md:py-12">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {/* Logo + Contact Info */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Image
              src={montreslogo}
              alt="Montres Logo"
              className="h-[100%] w-[100%] sm:h-12 md:h-14 filter brightness-0 invert"
             
            />
          </div>

          <h3 className="text-white text-lg md:text-xl font-semibold mb-3">
            Contact Info
          </h3>

          <p className="text-gray-300 text-sm md:text-base mb-2 leading-relaxed">
            <span className="font-medium">Address:</span> Shop 5, Moza Plaza 1, Al Khor Street, Deira Waterfront, Dubai, UAE
          </p>

          <p className="flex items-center gap-2 text-sm md:text-base mb-2">
            <MdPhone className="text-lg md:text-xl" /> +97142671124
          </p>

          <p className="flex items-center gap-2 text-sm md:text-base mb-2">
            <FaWhatsapp className="text-lg md:text-xl" /> +97142671124
          </p>

          <p className="flex items-center gap-2 text-sm md:text-base mb-2">
            <MdEmail className="text-lg md:text-xl" /> sales@montres.ae
          </p>

          <p className="flex items-center gap-2 text-sm md:text-base">
            <FaInstagram className="text-lg md:text-xl" /> @montres.ae
          </p>
        </div>

        {/* Shop Categories */}
        <div>
          <h3 className="text-white text-lg md:text-xl font-semibold mb-3">
            Shop By Categories
          </h3>
          <ul className="space-y-2 text-sm md:text-base">
            <li className="hover:text-white transition-colors cursor-pointer">Watch</li>
            <li className="hover:text-white transition-colors cursor-pointer">Bags</li>
            <li className="hover:text-white transition-colors cursor-pointer">Wallets</li>
            <li className="hover:text-white transition-colors cursor-pointer">Jewellery</li>
            <li className="hover:text-white transition-colors cursor-pointer">Clocks</li>
            <li className="hover:text-white transition-colors cursor-pointer">Pocket Watch</li>
            <li className="hover:text-white transition-colors cursor-pointer">Personal Accessories</li>
            <li className="hover:text-white transition-colors cursor-pointer">Cufflinks</li>
            <li className="hover:text-white transition-colors cursor-pointer">Pens</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg md:text-xl font-semibold mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm md:text-base">
            <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Authentication & Watch Grading</li>
            <li className="hover:text-white transition-colors cursor-pointer">Frequently Asked Questions (FAQ)</li>
            <li className="hover:text-white transition-colors cursor-pointer">Refund And Returns Policy</li>
            <li className="hover:text-white transition-colors cursor-pointer">Terms And Conditions</li>
            <li className="hover:text-white transition-colors cursor-pointer">Warranty Policy</li>
            <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
            <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
            <li className="hover:text-white transition-colors cursor-pointer">Request Item</li>
          </ul>
        </div>

        {/* Google Map */}
        <div className="sm:col-span-2 lg:col-span-1 w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden border border-gray-600">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d110942.72228082338!2d55.21420366975388!3d25.27417092315784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3e5f435ad7cce631%3A0x7bb62949cfd4ba39!2s77FW%2BMJV%20Moza%20Plaza%20-%201%20Al%20Khor%20St%20-%20Deira%20-%20Dubai!3m2!1d25.2741938!2d55.296605199999995!5e1!3m2!1sen!2sae!4v1754506903484!5m2!1sen!2sae"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Montre's Dubai Showroom Location"
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 mt-8 md:mt-10 pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm md:text-base">
        <p className="text-gray-400 text-center md:text-left">
          All rights reserved by{" "}
          <span className="text-blue-400 font-medium">
            Montres Trading L.L.C – The Art Of Time
          </span>{" "}
          © 2025.
        </p>

        <div className="flex gap-3 md:gap-4 items-center">
          <Image src={visa} alt="Visa" className="h-6 md:h-7 w-auto" width={40} height={24} />
          <Image src={amex} alt="Amex" className="h-6 md:h-7 w-auto" width={40} height={24} />
          <Image src={master} alt="Mastercard" className="h-6 md:h-7 w-auto" width={40} height={24} />
          <Image src={paypl} alt="Paypal" className="h-6 md:h-7 w-auto" width={40} height={24} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;