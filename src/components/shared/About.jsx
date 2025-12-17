"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
import watchstore from "../../assets/watch-store new.png"; // Ensure this path is correct

const About = () => {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-20 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          Montres Trading L.L.C – The Art Of Time
        </h1>
        <p className="text-gray-600 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
          Welcome to <span className="font-semibold">Montres</span>, your ultimate destination for luxury watches in Dubai.
        </p>
      </section>

      {/* About Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-20 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left: Image */}
          <div className="w-full lg:w-1/2">
            <Image
              src={watchstore}
              alt="Montres Luxury Watches"
              className="rounded-xl shadow-lg"
              width={600}       // Adjust width as needed
              height={400}      // Adjust height as needed
              quality={100}
              priority
            />
          </div>

          {/* Right: Text */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
              About Montres
            </h2>
            <p className="text-gray-700 mb-6">
              We offer a curated selection of classic and modern watches, along with exceptional services to meet all your luxury watch needs. At Montres, quality, authenticity, and style are at the heart of everything we do.
            </p>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                Luxury watch sales
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                Authentication to ensure originality
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                Comprehensive maintenance and repair
              </li>
              <li className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                Premium accessories to complete your style
              </li>
            </ul>

            <p className="text-gray-700 mb-6">
              Visit us in Dubai for a unique experience and discover the art of time.
            </p>

            {/* Shop Now Button */}
            <div className="text-center lg:text-left">
              <a
                href="/shop"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
