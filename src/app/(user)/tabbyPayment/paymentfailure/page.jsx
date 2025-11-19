"use client"
import React, { useEffect, useState } from "react";
import { X, AlertTriangle, CreditCard, Home, ShoppingBag, Mail, Globe, Shield, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const TabbyPaymentFailure = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [cartPreserved, setCartPreserved] = useState(true);
  const [failureReason, setFailureReason] = useState('');

  // Bilingual content
  const content = {
    en: {
      title: "Payment Not Approved",
      subtitle: "Tabby couldn't approve this purchase",
      failureMessage: "Sorry, Tabby is unable to approve this purchase, please use an alternative payment method for your order.",
      warningTitle: "No charges were made",
      warningText: "Your payment was not processed. No amount has been deducted from your account.",
      whatHappened: "What happened?",
      whyRejected: "Tabby performs a quick check to ensure purchases can be paid back in installments. Sometimes, applications aren't approved.",
      nextSteps: "What can you do?",
      tryAgain: "You can still try Tabby again for future purchases",
      alternativeMethods: "Use alternative payment methods like credit/debit card or cash on delivery",
      contactSupport: "Contact Tabby support for more details",
      orderSummary: "Order Summary",
      amount: "Amount",
      items: "Items",
      status: "Status",
      statusRejected: "Rejected",
      tryDifferentMethod: "Try Different Payment Method",
      reviewCart: "Review Cart",
      continueShopping: "Continue Shopping",
      contactSupportBtn: "Contact Support",
      needAssistance: "Need immediate assistance?",
      supportAvailable: "Our support team is available 24/7",
      tipsTitle: "Why wasn't I approved?",
      tip1: "Recent changes to your financial situation",
      tip2: "Limited credit history in the region",
      tip3: "Order amount outside approved range",
      tip4: "Too many recent Tabby applications",
      tip5: "Information verification needed",
      tip6: "Regional payment restrictions",
      stillNeedHelp: "Still Need Help?",
      helpText: "Tabby support can provide more details about application decisions.",
      cartPreserved: "Your cart has been preserved with all items",
      tabbyStillAvailable: "Tabby will still be available for future purchases"
    },
    ar: {
      title: "لم يتم الموافقة على الدفع",
      subtitle: "تعذر على تبي الموافقة على هذه العملية",
      failureMessage: "نأسف، تابي غير قادرة على الموافقة على هذه العملية. الرجاء استخدام طريقة دفع أخرى.",
      warningTitle: "لم يتم خصم أي مبلغ",
      warningText: "لم تتم معالجة دفعتك. لم يتم خصم أي مبلغ من حسابك.",
      whatHappened: "ماذا حدث؟",
      whyRejected: "تقوم تبي بإجراء فحص سريع للتأكد من إمكانية سداد المشتريات على أقساط. في بعض الأحيان، لا يتم الموافقة على الطلبات.",
      nextSteps: "ماذا يمكنك أن تفعل؟",
      tryAgain: "لا يزال بإمكانك تجربة تبي مرة أخرى للمشتريات المستقبلية",
      alternativeMethods: "استخدم طرق الدفع البديلة مثل البطاقة الائتمانية/البطاقة المصرفية أو الدفع عند الاستلام",
      contactSupport: "اتصل بدعم تبي للحصول على مزيد من التفاصيل",
      orderSummary: "ملخص الطلب",
      amount: "المبلغ",
      items: "المنتجات",
      status: "الحالة",
      statusRejected: "مرفوض",
      tryDifferentMethod: "جرب طريقة دفع مختلفة",
      reviewCart: "مراجعة السلة",
      continueShopping: "مواصلة التسوق",
      contactSupportBtn: "الاتصال بالدعم",
      needAssistance: "هل تحتاج إلى مساعدة فورية؟",
      supportAvailable: "فريق الدعم متاح 24/7",
      tipsTitle: "لماذا لم يتم الموافقة علي؟",
      tip1: "تغييرات حديثة في وضعك المالي",
      tip2: "تاريخ ائتماني محدود في المنطقة",
      tip3: "مبلغ الطلب خارج النطاق المعتمد",
      tip4: "عدد كبير من طلبات تبي الحديثة",
      tip5: "تحقق المعلومات المطلوب",
      tip6: "قيود الدفع الإقليمية",
      stillNeedHelp: "ما زلت بحاجة إلى مساعدة؟",
      helpText: "يمكن لدعم تبي تقديم مزيد من التفاصيل حول قرارات الطلب.",
      cartPreserved: "تم الحفاظ على سلة التسوق الخاصة بك مع جميع العناصر",
      tabbyStillAvailable: "ستظل تبي متاحة للمشتريات المستقبلية"
    }
  };

  const rejectionReasons = {
    en: [
      "Recent financial activity changes",
      "Limited regional credit history",
      "Order value outside acceptable range",
      "Too many recent applications",
      "Additional verification required",
      "Regional payment restrictions apply",
      "Temporary system limitations",
      "Account review in progress"
    ],
    ar: [
      "تغييرات حديثة في النشاط المالي",
      "تاريخ ائتماني إقليمي محدود",
      "قيمة الطلب خارج النطاق المقبول",
      "عدد كبير من الطلبات الحديثة",
      "التحقق الإضافي المطلوب",
      "تطبق قيود الدفع الإقليمية",
      "قيود النظام المؤقتة",
      "مراجعة الحساب قيد التقدم"
    ]
  };

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Check if cart is preserved
        const cart = localStorage.getItem('cart');
        setCartPreserved(!!cart);

        // Get failure reason from URL parameters or use default
        const reason = searchParams.get('reason') || 'general_rejection';
        setFailureReason(reason);

        // You can fetch additional details from your backend here
        // const orderId = searchParams.get('orderId');
        // if (orderId) {
        //   await logFailedPayment(orderId, reason);
        // }

      } catch (err) {
        console.error('Error initializing failure page:', err);
      } finally {
        setLoading(false);
      }
    };

    initializePage();

    // Detect user language preference
    const userLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    setLanguage(userLang);
  }, [searchParams]);

  const handleTryDifferentMethod = () => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      window.location.href = `/checkout?orderId=${orderId}&changeMethod=true`;
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
    window.open("https://tabby.ai/support", "_blank");
  };

  const handleRetryTabby = () => {
    // Note: Tabby might have cooling period, but we allow retry
    const orderId = searchParams.get("orderId");
    if (orderId) {
      window.location.href = `/checkout?orderId=${orderId}&retryTabby=true`;
    } else {
      window.location.href = "/checkout";
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const currentContent = content[language];
  const currentReasons = rejectionReasons[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-4 px-3 sm:px-4 lg:px-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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

        {/* Failure Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          
          {/* Header with Warning Icon */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 sm:p-8 text-center relative">
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-red-100">
                <X className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {currentContent.title}
            </h1>
            <p className="text-red-100 text-xs sm:text-sm">
              {currentContent.subtitle}
            </p>
          </div>

          {/* Content */}
          <div className="pt-8 sm:pt-10 px-4 sm:px-6 pb-4 sm:pb-6">
            
            {/* Failure Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-red-800 text-sm font-medium">
                    {currentContent.failureMessage}
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

            {/* Tabby Availability Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 text-sm">
                  {currentContent.tabbyStillAvailable}
                </span>
              </div>
            </div>

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

            {/* Explanation Section */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                {currentContent.whatHappened}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {currentContent.whyRejected}
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                {currentContent.nextSteps}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                  <span>{currentContent.tryAgain}</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                  <span>{currentContent.alternativeMethods}</span>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                  <span>{currentContent.contactSupport}</span>
                </div>
              </div>
            </div>

            {/* Common Rejection Reasons */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                {currentContent.tipsTitle}
              </h3>
              <div className="space-y-2">
                {currentReasons.map((reason, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                <X className="w-3 h-3 mr-1" />
                {currentContent.statusRejected}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
                {currentContent.statusRejected}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
                Tabby
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 sm:space-y-3 mb-4">
              <button
                onClick={handleTryDifferentMethod}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {currentContent.tryDifferentMethod}
              </button>

              <button
                onClick={handleRetryTabby}
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 font-semibold text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                {language === 'en' ? 'Try Tabby Again' : 'جرب تبي مرة أخرى'}
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
                {currentContent.contactSupportBtn}
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
                href="https://tabby.ai/support" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-blue-700 hover:text-blue-800 transition-colors"
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {language === 'en' ? 'Contact Tabby Support' : 'اتصل بدعم تبي'}
              </a>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
              {language === 'en' ? 'Important Notes' : 'ملاحظات مهمة'}
            </h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>
                  {language === 'en' 
                    ? 'No order was created in the system' 
                    : 'لم يتم إنشاء أي طلب في النظام'
                  }
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>
                  {language === 'en'
                    ? 'Tabby will remain available for future purchases'
                    : 'ستظل تبي متاحة للمشتريات المستقبلية'
                  }
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                <span>
                  {language === 'en'
                    ? 'You can try different payment methods immediately'
                    : 'يمكنك تجربة طرق دفع مختلفة على الفور'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabbyPaymentFailure;