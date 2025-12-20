import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
    FaCcVisa,
    FaCcMastercard,
    FaCcAmex,
    FaSpinner,
    FaExclamationCircle,
} from "react-icons/fa";
import TabbyLogo from "../../../assets/Tabby logo.png";
import TamaraLogo from "../../../assets/Tamara.jpeg";

const TabbyPromoSnippet = ({ amount, currency, language = "en" }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        // Clear any existing script
        const container = document.getElementById("tabby-promo-container");
        if (container) {
            container.innerHTML = "";
        }

        // Load Tabby promo script dynamically
        const script = document.createElement("script");
        script.src = "https://checkout.tabby.ai/tabby-promo.js";
        script.setAttribute("data-amount", amount.toString());
        script.setAttribute("data-currency", currency || "AED");
        script.setAttribute("data-lang", language);
        script.setAttribute(
            "data-public-key",
            process.env.NEXT_PUBLIC_TABBY_PUBLIC_KEY ||
            "pk_test_0194a887-5d2c-c408-94f4-65ee1ca745e8"
        );
        script.setAttribute(
            "data-merchant-code",
            process.env.NEXT_PUBLIC_TABBY_MERCHANT_CODE || "montres"
        );
        script.async = true;

        script.onload = () => setScriptLoaded(true);
        script.onerror = () => console.error("Tabby script failed to load");

        if (container) {
            container.appendChild(script);
        }

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [amount, currency, language]);

    return <div id="tabby-promo-container" className="mt-4" />;
};

const PaymentMethod = ({
    language,
    paymentMethod,
    setPaymentMethod,
    privacyAccepted,
    setPrivacyAccepted,
    handlePlaceOrder,
    isLoading,
    orderSummary,
    checkoutProducts,
    isCustomerEligibleForTabby,
    tabbyEligibility,
    showTabbySnippet,
    setIsShippingModalOpen,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">
                {language === "en" ? "Payment Method" : "طريقة الدفع"}
            </h2>

            <div className="space-y-3 mb-6">
                {/* Stripe/Card Payment */}
                <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "stripe"
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                >
                    <input
                        type="radio"
                        name="payment"
                        value="stripe"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                            <p className="font-medium">
                                {language === "en" ? "Credit/Debit Card" : "بطاقة ائتمان/مدين"}
                            </p>
                            <div className="flex items-center space-x-2">
                                <FaCcVisa className="w-6 h-6 text-blue-600" />
                                <FaCcMastercard className="w-6 h-6 text-red-600" />
                                <FaCcAmex className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {language === "en"
                                ? "Secure payment processed by Stripe"
                                : "دفع آمن تتم معالجته بواسطة Stripe"}
                        </p>
                    </div>
                </label>

                {/* Tamara Payment */}
                <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "tamara"
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                >
                    <input
                        type="radio"
                        name="payment"
                        value="tamara"
                        checked={paymentMethod === "tamara"}
                        onChange={() => setPaymentMethod("tamara")}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">
                                    {language === "en"
                                        ? "Pay Later with Tamara"
                                        : "الدفع لاحقاً مع Tamara"}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {language === "en"
                                        ? "Split your payment into 4 installments, 0% interest"
                                        : "قسّط دفعتك إلى 4 أقساط، بدون فائدة"}
                                </p>
                            </div>
                            <div className="w-16 h-8 relative">
                                <Image
                                    src={TamaraLogo}
                                    alt="Tamara"
                                    fill
                                    className="object-contain"
                                    sizes="64px"
                                />
                            </div>
                        </div>
                    </div>
                </label>

                {/* Tabby Payment - Conditionally shown for UAE/AED */}
                {isCustomerEligibleForTabby() && (
                    <label
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === "tabby"
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value="tabby"
                            checked={paymentMethod === "tabby"}
                            onChange={() => setPaymentMethod("tabby")}
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        {language === "en"
                                            ? "Pay in 4 with Tabby"
                                            : "الدفع بـ 4 دفعات مع Tabby"}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {language === "en"
                                            ? "Split your payment into 4 interest-free installments"
                                            : "قسّط دفعتك إلى 4 أقساط بدون فائدة"}
                                    </p>
                                    {tabbyEligibility === "rejected" && (
                                        <p className="text-sm text-red-600 mt-1">
                                            {language === "en"
                                                ? "Sorry, Tabby is unable to approve this purchase. Please use an alternative payment method."
                                                : "عذراً، Tabby غير قادر على الموافقة على هذه العملية. الرجاء استخدام طريقة دفع أخرى."}
                                        </p>
                                    )}
                                </div>
                                <div className="w-16 h-8 relative">
                                    <Image
                                        src={TabbyLogo}
                                        alt="Tabby"
                                        fill
                                        className="object-contain"
                                        sizes="64px"
                                    />
                                </div>
                            </div>

                            {/* Tabby Snippet when selected */}
                            {paymentMethod === "tabby" &&
                                showTabbySnippet &&
                                tabbyEligibility !== "rejected" && (
                                    <TabbyPromoSnippet
                                        amount={Math.round(orderSummary.total * 100)} // in smallest currency unit (fils)
                                        currency="AED"
                                        language={language}
                                    />
                                )}
                        </div>
                    </label>
                )}
            </div>

            {/* Shipping Terms */}
            <div className="mb-6">
                <button
                    onClick={() => setIsShippingModalOpen(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    {language === "en"
                        ? "View Shipping Terms & Conditions"
                        : "عرض شروط وأحكام الشحن"}
                </button>
            </div>

            {/* Privacy Policy */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start">
                    <input
                        type="checkbox"
                        id="privacy-policy"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <label
                        htmlFor="privacy-policy"
                        className="ml-2 text-sm text-gray-600"
                    >
                        {language === "en" ? (
                            <>
                                I agree to the{" "}
                                <a
                                    href="/privacy-policy"
                                    className="text-blue-600 hover:underline font-medium"
                                    target="_blank"
                                >
                                    privacy policy
                                </a>{" "}
                                and{" "}
                                <a
                                    href="/terms"
                                    className="text-blue-600 hover:underline font-medium"
                                    target="_blank"
                                >
                                    terms of service
                                </a>
                            </>
                        ) : (
                            <>
                                أوافق على{" "}
                                <a
                                    href="/privacy-policy"
                                    className="text-blue-600 hover:underline font-medium"
                                    target="_blank"
                                >
                                    سياسة الخصوصية
                                </a>{" "}
                                و{" "}
                                <a
                                    href="/terms"
                                    className="text-blue-600 hover:underline font-medium"
                                    target="_blank"
                                >
                                    شروط الخدمة
                                </a>
                            </>
                        )}
                    </label>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                onClick={handlePlaceOrder}
                disabled={
                    isLoading ||
                    !privacyAccepted ||
                    checkoutProducts.length === 0 ||
                    (paymentMethod === "tabby" && tabbyEligibility === "rejected")
                }
                className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${isLoading ||
                        !privacyAccepted ||
                        checkoutProducts.length === 0 ||
                        (paymentMethod === "tabby" && tabbyEligibility === "rejected")
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
                    }`}
            >
                {isLoading ? (
                    <>
                        <FaSpinner className="w-5 h-5 animate-spin mr-3" />
                        {language === "en" ? "Processing..." : "جاري المعالجة..."}
                    </>
                ) : (
                    `${language === "en" ? "Place Order" : "تأكيد الطلب"
                    } - ${orderSummary.total.toFixed(2)} AED`
                )}
            </button>

            {/* Security Notice */}
            <p className="text-xs text-gray-500 text-center mt-4">
                <FaExclamationCircle className="inline w-3 h-3 mr-1" />
                {language === "en"
                    ? "Your payment details are secure and encrypted"
                    : "تفاصيل الدفع الخاصة بك آمنة ومشفرة"}
            </p>
        </div>
    );
};

export default PaymentMethod;
