"use client";
import React from "react";

const TermsandCondition = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-16 px-6">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8 md:p-12 border border-gray-100">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Terms & Conditions
        </h1>

        <p className="text-gray-600 mb-4 text-center">
          Please read carefully before using our services.
        </p>

        <p className="text-gray-700 mb-6">
          By using the <span className="font-medium text-gray-800">Montres</span> website or
          purchasing from our store, you agree to the following terms:
        </p>

        <ul className="list-disc list-inside text-gray-700 space-y-3">
          <li>
            <span className="font-medium text-gray-800">Product Availability:</span> All products are subject to availability and prior sale.
          </li>
          <li>
            <span className="font-medium text-gray-800">Pricing:</span> Prices may change without prior notice.
          </li>
          <li>
            <span className="font-medium text-gray-800">Authenticity:</span> We guarantee authenticity for every product sold unless clearly stated otherwise.
          </li>
          <li>
            <span className="font-medium text-gray-800">Customer Responsibility:</span> Customers are responsible for reading the product description and condition grading before purchase.
          </li>
          <li>
            <span className="font-medium text-gray-800">Returns:</span> Returns are accepted within <strong>7 days</strong> only if the product is in its original condition.
          </li>
          <li>
            <span className="font-medium text-gray-800">Warranty:</span> Any misuse, damage caused after delivery, or unauthorized repair voids any warranty or return claim.
          </li>
          <li>
            <span className="font-medium text-gray-800">Updates:</span> Montres reserves the right to update these terms at any time.
          </li>
        </ul>

        <div className="mt-8 text-gray-600 text-sm text-center">
          <p>
            © {new Date().getFullYear()} Montres. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsandCondition;
