"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaTimesCircle, FaRedo, FaArrowLeft } from "react-icons/fa";

const FailureContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order");
    // const errorMessage = searchParams.get("message"); // Future use if backend sends message

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                        <FaTimesCircle className="h-12 w-12 text-red-600" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-gray-500 mb-8">
                        We couldn't process your payment. Please try again or use a different payment method.
                    </p>

                    <div className="bg-red-50 rounded-xl p-6 mb-8 text-left border border-red-100">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-red-700 font-medium text-sm uppercase tracking-wide">Error Details</span>
                        </div>
                        <p className="text-red-900 font-semibold mb-2">Transaction could not be completed.</p>
                        {orderId && (
                            <div className="mt-4 pt-3 border-t border-red-200">
                                <span className="text-red-600 text-sm font-medium">Order Reference:</span>
                                <span className="ml-2 text-red-800 font-mono text-sm">{orderId}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/checkout"
                            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 md:text-lg transition-all duration-200 shadow-lg hover:shadow-red-500/30 group"
                        >
                            <FaRedo className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
                            Try Again
                        </Link>

                        <Link
                            href="/contact-us"
                            className="w-full flex items-center justify-center px-8 py-3 text-base font-medium text-gray-600 bg-transparent hover:text-gray-900 transition-colors duration-200"
                        >
                            <FaArrowLeft className="mr-2 text-sm" />
                            Contact Support
                        </Link>
                    </div>
                </div>
                <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        Need help? <Link href="/contact-us" className="text-blue-600 hover:underline">Contact our support team</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

const CheckoutFailurePage = () => {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
            }
        >
            <FailureContent />
        </Suspense>
    );
};

export default CheckoutFailurePage;
