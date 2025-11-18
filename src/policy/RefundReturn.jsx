"use client";
import React from "react";
import { FaArrowLeft, FaShieldAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const RefundReturn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Care Policies
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your satisfaction is our priority. Learn about our refund, return, and warranty policies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Refund & Return Policy Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <FaArrowLeft className="text-white text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-white">Refund & Return Policy</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                We want you to be fully satisfied with your purchase.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Return Period:</span>
                    <p className="text-gray-700">You may return any product within <strong className="text-blue-600">7 days</strong> of receiving it.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Conditions:</span>
                    <p className="text-gray-700">Item must be in original condition, unworn, with all tags and packaging.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Non-refundable:</span>
                    <p className="text-gray-700">Items that have been used or altered are not eligible for return.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Return Shipping:</span>
                    <p className="text-gray-700">Return shipping costs are customer's responsibility unless due to our error.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 text-sm">
                  To initiate a return, please contact us first via{" "}
                  <a
                    href="mailto:sales@montres.ae"
                    className="text-blue-600 hover:text-blue-700 font-semibold underline transition-colors"
                  >
                    sales@montres.ae
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Warranty Policy Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-emerald-600 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <FaShieldAlt className="text-white text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-white">Warranty Policy</h2>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Your timepiece is protected by our comprehensive warranty coverage.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-sm font-bold">1</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Coverage Period:</span>
                    <p className="text-gray-700">Each watch is covered by a <strong className="text-emerald-600">1-year international warranty</strong> against manufacturing defects from purchase date.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-sm font-bold">2</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">What's Not Covered:</span>
                    <p className="text-gray-700">Damage from misuse, accidents, water exposure beyond rating, or unauthorized repairs.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-sm font-bold">3</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Service Points:</span>
                    <p className="text-gray-700">Available at any authorized Montres service center with original invoice.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-sm font-bold">4</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">After Warranty:</span>
                    <p className="text-gray-700">Paid service and parts replacement available upon request.</p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-emerald-800 text-sm font-medium">
                  For warranty claims, please contact us with your purchase details and original invoice.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Need Assistance?</h3>
          <p className="text-gray-700 mb-4">Our customer service team is here to help you with any questions.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <a
              href="mailto:sales@montres.ae"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaEnvelope className="mr-2" />
              sales@montres.ae
            </a>
            <div className="inline-flex items-center text-gray-600 font-medium">
              <FaPhone className="mr-2" />
            +971 4 267 1124
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundReturn;