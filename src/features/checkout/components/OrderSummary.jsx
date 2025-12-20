import React from "react";
import Image from "next/image";

const OrderSummary = ({ checkoutProducts, orderSummary, language }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">
                {language === "en" ? "Order Summary" : "ملخص الطلب"}
            </h2>

            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {checkoutProducts.length > 0 ? (
                    checkoutProducts.map((item, index) => {
                        const product = item.productId || {};
                        const price = product.salePrice || product.regularPrice || 0;
                        const totalPrice = price * item.quantity;
                        const mainImage =
                            product.images?.find((img) => img.type === "main") ||
                            product.images?.[0];
                        const imageUrl = mainImage?.url || "/placeholder.png";
                        const productName = product.name || "Unnamed Product";

                        return (
                            <div
                                key={index}
                                className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0"
                            >
                                <div className="relative w-16 h-16 flex-shrink-0">
                                    <Image
                                        src={imageUrl}
                                        alt={productName}
                                        fill
                                        unoptimized
                                        className="rounded-lg object-cover"
                                        sizes="64px"
                                    />
                                    <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {item.quantity}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {productName}
                                    </h4>
                                    {item.color && (
                                        <p className="text-xs text-gray-500">
                                            {language === "en" ? "Color:" : "اللون:"} {item.color}
                                        </p>
                                    )}
                                    {item.size && (
                                        <p className="text-xs text-gray-500">
                                            {language === "en" ? "Size:" : "المقاس:"} {item.size}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {totalPrice.toFixed(2)} AED
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {price.toFixed(2)} AED {language === "en" ? "each" : "للقطعة"}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            {language === "en" ? "Your cart is empty" : "سلة التسوق فارغة"}
                        </p>
                        <a
                            href="/shop"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 inline-block"
                        >
                            {language === "en" ? "Continue Shopping" : "مواصلة التسوق"}
                        </a>
                    </div>
                )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">
                        {language === "en" ? "Subtotal" : "المجموع الفرعي"}
                    </span>
                    <span className="font-medium">
                        {orderSummary.subtotal.toFixed(2)} AED
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">
                        {language === "en" ? "Shipping" : "الشحن"}
                    </span>
                    <span
                        className={`font-medium ${orderSummary.shippingFee === 0 ? "text-green-600" : ""
                            }`}
                    >
                        {orderSummary.shippingFee === 0
                            ? language === "en"
                                ? "Free"
                                : "مجاناً"
                            : `${orderSummary.shippingFee.toFixed(2)} AED`}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">
                        {language === "en"
                            ? "VAT (5%) included"
                            : "ضريبة القيمة المضافة (٥٪) مشمولة"}
                    </span>
                    <span className="font-medium">
                        {language === "en" ? "Included" : "مشمولة"}
                    </span>
                </div>

                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3 mt-3">
                    <span>{language === "en" ? "Total" : "الإجمالي"}</span>
                    <span>{orderSummary.total.toFixed(2)} AED</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
