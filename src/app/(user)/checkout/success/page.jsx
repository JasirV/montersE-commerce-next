"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from "react-icons/fa";

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order");
    const paymentMethod = searchParams.get("payment");

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
                <div className="p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 animate-bounce-slow">
                        <FaCheckCircle className="h-12 w-12 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Thank you for your purchase. Your order has been placed successfully.
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left border border-gray-100">
                        <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                            <span className="text-gray-600 font-medium">Order Reference:</span>
                            <span className="text-gray-900 font-bold font-mono">
                                {orderId || "N/A"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Payment Method:</span>
                            <span className="text-gray-900 font-bold capitalize">
                                {paymentMethod || "Online Payment"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/shop"
                            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 md:text-lg transition-all duration-200 shadow-lg hover:shadow-green-500/30 group"
                        >
                            <FaShoppingBag className="mr-2 group-hover:animate-pulse" />
                            Continue Shopping
                        </Link>

                        <Link
                            href="/"
                            className="w-full flex items-center justify-center px-8 py-3 text-base font-medium text-gray-600 bg-transparent hover:text-gray-900 transition-colors duration-200"
                        >
                            Back to Home
                            <FaArrowRight className="ml-2 text-sm" />
                        </Link>
                    </div>
                </div>
                <div className="bg-green-50 px-8 py-4 text-center">
                    <p className="text-sm text-green-700 font-medium">
                        A confirmation email has been sent to you.
                    </p>
                </div>
            </div>
        </div>
    );
};

const CheckoutSuccessPage = () => {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            }
        >
            <SuccessContent />
        </Suspense>
    );
};

export default CheckoutSuccessPage;
