"use client"
import React, { useEffect, useState, Suspense } from "react";
import { X, AlertTriangle, RefreshCw, Home, ShoppingBag, Mail, CreditCard, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const TabbyPaymentCancelContent = () => {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [cartPreserved, setCartPreserved] = useState(true);

  // Bilingual content
  const content = {
    en: {
      title: "Payment Cancelled",
      subtitle: "Your Tabby payment was not completed",
      warningTitle: "Don't worry, you haven't been charged",
      warningText: "Your payment was cancelled before completion. No amount has been deducted from your account.",
      orderSummary: "Order Summary",
      commonIssues: "Common Issues",
      amount: "Amount",
      items: "Items",
      date: "Date",
      customer: "Customer",
      paymentStatus: "Payment Status",
      statusCancelled: "Cancelled",
      statusNotCharged: "Not Charged",
      retryPayment: "Retry Payment",
      reviewCart: "Review Cart",
      continueShopping: "Continue Shopping",
      getHelp: "Get Help",
      needAssistance: "Need immediate assistance?",
      supportAvailable: "Our support team is available 24/7",
      tipsTitle: "Tips for Successful Payment",
      tip1: "Ensure your card details are correct and up to date",
      tip2: "Check your internet connection stability",
      tip3: "Verify with your bank if there are any restrictions",
      tip4: "Try using a different payment method if issues persist",
      stillNeedHelp: "Still Need Help?",
      helpText: "Our customer support team is here to help you complete your purchase.",
      cancellationReason: "You aborted the payment. Please retry or choose another payment method.",
      cartPreserved: "Your cart has been preserved with all items",
      tryDifferentMethod: "Try Different Payment Method"
    },
    ar: {
      title: "تم إلغاء الدفع",
      subtitle: "لم يتم اكتمال عملية الدفع عبر تبي",
      warningTitle: "لا تقلق، لم يتم خصم أي مبلغ",
      warningText: "تم إلغاء عملية الدفع قبل اكتمالها. لم يتم خصم أي مبلغ من حسابك.",
      orderSummary: "ملخص الطلب",
      commonIssues: "المشاكل الشائعة",
      amount: "المبلغ",
      items: "المنتجات",
      date: "التاريخ",
      customer: "العميل",
      paymentStatus: "حالة الدفع",
      statusCancelled: "ملغى",
      statusNotCharged: "لم يتم الخصم",
      retryPayment: "إعادة محاولة الدفع",
      reviewCart: "مراجعة السلة",
      continueShopping: "مواصلة التسوق",
      getHelp: "الحصول على المساعدة",
      needAssistance: "هل تحتاج إلى مساعدة فورية؟",
      supportAvailable: "فريق الدعم متاح 24/7",
      tipsTitle: "نصائح للدفع الناجح",
      tip1: "تأكد من صحة وتحديث بيانات بطاقتك",
      tip2: "تحقق من استقرار اتصال الإنترنت",
      tip3: "تحقق مع البنك إذا كانت هناك أي قيود",
      tip4: "جرب استخدام طريقة دفع مختلفة إذا استمرت المشاكل",
      stillNeedHelp: "ما زلت بحاجة إلى مساعدة؟",
      helpText: "فريق دعم العملاء لدينا هنا لمساعدتك في إكمال عملية الشراء.",
      cancellationReason: "لقد ألغيت الدفعة. فضلاً حاول مجددًا أو اختر طريقة دفع أخرى.",
      cartPreserved: "تم الحفاظ على سلة التسوق الخاصة بك مع جميع العناصر",
      tryDifferentMethod: "جرب طريقة دفع مختلفة"
    }
  };

  const commonIssues = {
    en: [
      "Insufficient funds in your account",
      "Card expiration date passed",
      "Incorrect CVV code",
      "Daily transaction limit exceeded",
      "Bank declined the transaction",
      "Network connectivity issues",
      "Tabby account verification pending",
      "Installment plan not approved"
    ],
    ar: [
      "رصيد غير كاف في حسابك",
      "انتهت صلاحية البطاقة",
      "رمز CVV غير صحيح",
      "تم تجاوز الحد اليومي للمعاملات",
      "البنك رفض المعاملة",
      "مشاكل في اتصال الشبكة",
      "تحقق حساب تبي قيد الانتظار",
      "خطة التقسيط غير معتمدة"
    ]
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const orderId = searchParams.get("orderId");
        const cancelReason = searchParams.get("reason");

        // Check if cart is preserved
        const cart = localStorage.getItem('cart');
        setCartPreserved(!!cart);

        if (!orderId) {
          setError("Order ID not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASEURL}/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setOrderDetails(response.data.order);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    // Detect user language preference
    const userLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    setLanguage(userLang);
  }, [searchParams]);

  const handleRetryPayment = () => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      window.location.href = `/checkout?orderId=${orderId}&retry=true`;
    } else {
      window.location.href = "/checkout";
    }
  };

  const handleContinueShopping = () => {
    window.location.href = "/";
  };

  const handleViewCart = () => {
    window.location.href = "/cart";
  };

  const handleContactSupport = () => {
    window.location.href = "/contact-us";
  };

  const handleTryDifferentMethod = () => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      window.location.href = `/checkout?orderId=${orderId}&changeMethod=true`;
    } else {
      window.location.href = "/checkout";
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cancellation details...</p>
        </div>
      </div>
    );
  }

  const currentContent = content[language];
  const currentIssues = commonIssues[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-4 px-3 sm:px-4 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto">
        
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center px-3 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <Globe className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        {/* Cancellation Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          
          {/* Header with Warning Icon */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 sm:p-8 text-center relative">
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-orange-100">
                <X className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {currentContent.title}
            </h1>
            <p className="text-orange-100 text-xs sm:text-sm">
              {currentContent.subtitle}
            </p>
          </div>

          {/* Content */}
          <div className="pt-8 sm:pt-10 px-4 sm:px-6 pb-4 sm:pb-6">
            
            {/* Cancellation Reason */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-800 text-sm font-medium">
                    {currentContent.cancellationReason}
                  </p>
                </div>
              </div>
            </div>

            {/* Cart Preservation Message */}
            {cartPreserved && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <ShoppingBag className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-green-800 text-sm">
                    {currentContent.cartPreserved}
                  </span>
                </div>
              </div>
            )}

            {/* Warning Message */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-orange-800 text-sm mb-1">
                    {currentContent.warningTitle}
                  </h3>
                  <p className="text-orange-700 text-xs">
                    {currentContent.warningText}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                  {currentContent.orderSummary}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{currentContent.amount}</span>
                    <span className="font-semibold text-gray-900">
                      {orderDetails.currency} {orderDetails.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">{currentContent.date}</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(orderDetails.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">{currentContent.paymentStatus}</span>
                    <span className="font-semibold text-red-600 capitalize">
                      {currentContent.statusCancelled}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Common Issues */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                {currentContent.commonIssues}
              </h3>
              <div className="space-y-2">
                {currentIssues.map((issue, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                <X className="w-3 h-3 mr-1" />
                {currentContent.statusCancelled}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                {currentContent.statusNotCharged}
              </span>
              {orderDetails && (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                  #{orderDetails._id.slice(-8)}
                </span>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 sm:space-y-3 mb-4">
              <button
                onClick={handleRetryPayment}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {currentContent.retryPayment}
              </button>
              
              <button
                onClick={handleTryDifferentMethod}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-semibold text-sm sm:text-base"
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {currentContent.tryDifferentMethod}
              </button>

              <button
                onClick={handleViewCart}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 font-semibold text-sm sm:text-base"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {currentContent.reviewCart}
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={handleContinueShopping}
                className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm"
              >
                <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {currentContent.continueShopping}
              </button>
              <button
                onClick={handleContactSupport}
                className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-xs sm:text-sm"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {currentContent.getHelp}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
            <p className="text-center text-gray-500 text-xs">
              {currentContent.needAssistance}{" "}
              <a href="tel:+97142671124" className="text-blue-600 hover:underline font-semibold">
                +971 4 267 1124
              </a>
            </p>
            <p className="text-center text-gray-400 text-xs mt-1">
              {currentContent.supportAvailable}
            </p>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4">
          {/* Tips Card */}
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
              {currentContent.tipsTitle}
            </h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>{currentContent.tip1}</span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>{currentContent.tip2}</span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>{currentContent.tip3}</span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>{currentContent.tip4}</span>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
              {currentContent.stillNeedHelp}
            </h3>
            <p className="text-blue-800 text-xs sm:text-sm mb-3">
              {currentContent.helpText}
            </p>
            <div className="space-y-2 text-xs sm:text-sm">
              <a 
                href="mailto:sales@montres.ae" 
                className="flex items-center text-blue-700 hover:text-blue-800 transition-colors"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                sales@montres.ae
              </a>
              <a 
                href="/help" 
                className="flex items-center text-blue-700 hover:text-blue-800 transition-colors"
              >
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {language === 'en' ? 'Visit Help Center' : 'زيارة مركز المساعدة'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component that wraps with Suspense
const TabbyPaymentCancel = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <TabbyPaymentCancelContent />
    </Suspense>
  );
};

export default TabbyPaymentCancel;