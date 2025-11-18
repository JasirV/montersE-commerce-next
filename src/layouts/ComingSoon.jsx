"use client"

import React, { useState } from 'react';

const ComingSoon = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email submission here
    console.log('Email submitted:', email);
    setEmail('');
    alert('Thank you! We will notify you when we are back.');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Simple Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Minimal background elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-blue-50 rounded-full opacity-40"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-50 rounded-full opacity-40"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gray-100 rounded-full opacity-30"></div>
      </div>

      {/* Main Content */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Maintenance Image */}
          <div className="mb-8">
            <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center">
              <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          {/* Maintenance Badge */}
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-600 rounded-full text-sm font-semibold tracking-wider">
              UNDER MAINTENANCE
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            We'll be back <span className="text-blue-600">soon!</span>
          </h1>

          {/* Description */}
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Sorry for the inconvenience. We're performing some maintenance at the moment. 
              We'll be back up and running as fast as possible.
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" sales@montres.ae"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Notify Me
              </button>
            </div>
          </form>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="mb-2 flex justify-between text-sm text-gray-600">
              <span>Maintenance Progress</span>
              <span>80%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Need immediate assistance?</h3>
            <p className="text-gray-600 mb-3">Contact us at:</p>
            <a 
              href="mailto: sales@montres.ae" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              sales@montres.ae
            </a>
          </div>
        </div>
      </section>

  


    </div>
  );
};

export default ComingSoon;