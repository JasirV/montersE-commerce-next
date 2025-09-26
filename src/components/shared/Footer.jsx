import React, { useState } from "react";
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { RiCustomerService2Fill } from "react-icons/ri";
import montreslogo from "../../assets/montreslogo.png";
import visa from "../../assets/visa-logo-visa-icon-free-free-vector.jpg";
import master from "../../assets/mastercard-icon-lg.png";
import paypl from "../../assets/images (2).png";
import amex from "../../assets/images (3).png";
import Image from "next/image";

const Footer = () => {
 


  return (
    <footer className="bg-gradient-to-b from-[#0d111c] to-[#111827] text-gray-300 px-4 md:px-16 py-10 md:py-12">
      

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {/* Logo + Contact Info */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <Image
              src={montreslogo}
              alt="Montres Logo"
              className="h-10 w-auto filter brightness-0 invert"
              width={160}
              height={40}
            />
          </div>

          <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
            Luxury watches and accessories for those who appreciate the art of time.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MdLocationOn className="text-xl mt-1 text-blue-400" />
              <p className="text-gray-300 text-sm md:text-base">
                Shop 5, Moza Plaza 1, Al Khor Street, Deira Waterfront, Dubai, UAE
              </p>
            </div>

            <div className="flex items-center gap-3">
              <MdPhone className="text-xl text-blue-400" />
              <p className="text-gray-300 text-sm md:text-base">+97142671124</p>
            </div>

            <div className="flex items-center gap-3">
              <FaWhatsapp className="text-xl text-green-400" />
              <p className="text-gray-300 text-sm md:text-base">+97142671124</p>
            </div>

            <div className="flex items-center gap-3">
              <MdEmail className="text-xl text-blue-400" />
              <p className="text-gray-300 text-sm md:text-base">sales@montres.ae</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-white text-sm font-semibold mb-3">Follow Us</h4>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/montres.ae" 
                className="bg-gray-800 hover:bg-pink-600 p-2 rounded-full transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-blue-400 p-2 rounded-full transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a 
                href="#" 
                className="bg-gray-800 hover:bg-green-500 p-2 rounded-full transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Shop Categories */}
        <div>
          <h3 className="text-white text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
            <RiCustomerService2Fill className="text-blue-400" />
            Shop By Categories
          </h3>
          <ul className="space-y-3 text-sm md:text-base">
            {["Watches", "Bags", "Wallets", "Jewellery", "Clocks", "Pocket Watches", "Personal Accessories", "Cufflinks", "Pens"].map((item) => (
              <li key={item} className="hover:text-white transition-colors duration-300 cursor-pointer group">
                {item}
                <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
            <RiCustomerService2Fill className="text-blue-400" />
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm md:text-base">
            {[
              "Privacy Policy", 
              "Authentication & Watch Grading", 
              "Frequently Asked Questions (FAQ)", 
              "Refund And Returns Policy", 
              "Terms And Conditions", 
              "Warranty Policy", 
              "About Us", 
              "Contact Us", 
              "Request Item"
            ].map((item) => (
              <li key={item} className="hover:text-white transition-colors duration-300 cursor-pointer group">
                {item}
                <span className="inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Google Map */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="text-white text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
            <MdLocationOn className="text-blue-400" />
            Our Location
          </h3>
          <div className="w-full h-48 sm:h-56 md:h-64 rounded-lg overflow-hidden border border-gray-700 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d110942.72228082338!2d55.21420366975388!3d25.27417092315784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x3e5f435ad7cce631%3A0x7bb62949cfd4ba39!2s77FW%2BMJV%20Moza%20Plaza%20-%201%20Al%20Khor%20St%20-%20Deira%20-%20Dubai!3m2!1d25.2741938!2d55.296605199999995!5e1!3m2!1sen!2sae!4v1754506903484!5m2!1sen!2sae"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Montre's Dubai Showroom Location"
              className="rounded-lg"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <MdLocationOn className="text-blue-400" />
            <p>Shop 5, Moza Plaza 1, Al Khor Street, Deira Waterfront, Dubai, UAE</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 mt-10 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm md:text-base">
        <p className="text-gray-400 text-center md:text-left">
          © 2025 All rights reserved by{" "}
          <span className="text-blue-400 font-medium">
            Montres Trading L.L.C – The Art Of Time
          </span>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">We accept:</span>
            <div className="flex gap-2">
              <Image src={visa} alt="Visa" className="h-6 w-auto grayscale hover:grayscale-0 transition-all duration-300" width={40} height={24} />
              <Image src={amex} alt="Amex" className="h-6 w-auto grayscale hover:grayscale-0 transition-all duration-300" width={40} height={24} />
              <Image src={master} alt="Mastercard" className="h-6 w-auto grayscale hover:grayscale-0 transition-all duration-300" width={40} height={24} />
              <Image src={paypl} alt="Paypal" className="h-6 w-auto grayscale hover:grayscale-0 transition-all duration-300" width={40} height={24} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;