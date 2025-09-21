import React from "react";
import { FaTags, FaTruck, FaLock, FaShieldAlt, FaHeadset } from "react-icons/fa";

const services = [
  {
    id: 1,
    icon: <FaTags className="text-white" />,
    title: "Great Value",
    desc: "Most Popular Brands With Widest Range Of Selection At Best Prices.",
  },
  {
    id: 2,
    icon: <FaTruck className="text-white" />,
    title: "Nationwide Delivery",
    desc: "Over 20,000 Pincodes Serviceable Across India.",
  },
  {
    id: 3,
    icon: <FaLock className="text-white" />,
    title: "Secure Payment",
    desc: "Partnered With India's Most Popular And Secure Payment Solutions.",
  },
  {
    id: 4,
    icon: <FaShieldAlt className="text-white" />,
    title: "Buyer Protection",
    desc: "Committed To Buyer Interests To Provide A Smooth Shopping Experience.",
  },
  {
    id: 5,
    icon: <FaHeadset className="text-white" />,
    title: "365 Days Help Desk",
    desc: "Most Popular Brands With Widest Range Of Selection At Best Prices.",
  },
];

const Services = () => {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] bg-clip-text text-transparent">Premium</span> Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Experience exceptional service with our comprehensive watch care solutions
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative bg-white rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-100 group-hover:opacity-0 transition-opacity duration-500 rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e518e] to-[#0061b0ee] opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"></div>
              
              {/* Icon Container */}
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-70 group-hover:opacity-90"></div>
                <div className="relative bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] p-3 rounded-full flex items-center justify-center w-14 h-14 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-lg">
                    {service.icon}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-gray-800 font-semibold text-lg mb-3 relative z-10 group-hover:text-[#1e518e] transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed relative z-10">
                {service.desc}
              </p>
              
              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#1e518e]/10 transition-all duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom Decoration */}
        <div className="flex justify-center mt-12 sm:mt-16">
          <div className="h-1 w-16 bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Services;