"use client";
import React from "react";

const RefundReturn = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-16 px-6">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8 md:p-12 border border-gray-100">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Refund & Return Policy
        </h1>

        <p className="text-gray-600 mb-4">
          We want you to be fully satisfied with your purchase.
        </p>

        <ul className="list-disc list-inside text-gray-700 space-y-3">
          <li>
            <span className="font-medium text-gray-800">Return Period:</span> You
            may return any product within <strong>7 days</strong> of receiving it.
          </li>
          <li>
            <span className="font-medium text-gray-800">Conditions:</span> The
            item must be in the same condition as received, unworn, with all tags
            and original packaging.
          </li>
          <li>
            <span className="font-medium text-gray-800">Non-refundable:</span>{" "}
            Items that have been used or altered will not be eligible for a return
            or refund.
          </li>
          <li>
            <span className="font-medium text-gray-800">Return Shipping:</span>{" "}
            Return shipping costs are the responsibility of the customer unless
            the return is due to a product defect or error from our side.
          </li>
        </ul>

        <div className="mt-8 text-gray-700">
          <p>
            To initiate a return, please contact us first via{" "}
            <a
              href="mailto:sales@montres.ae"
              className="text-blue-600 hover:underline"
            >
              sales@montres.ae
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundReturn;
