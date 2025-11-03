import React from "react";

const ServicesTermsCondition = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-16 px-6 md:px-20 lg:px-32">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">
          Terms & Conditions
        </h1>
        <p className="mt-3 text-lg text-gray-600 italic">
          Montres Trading LLC - The Art of Time
        </p>
      </div>

      {/* Content Section */}
      <div className="bg-white shadow-lg rounded-2xl p-8 md:p-12 space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Montres Trading LLC. By accessing or using our services,
            you agree to comply with and be bound by the following Terms and
            Conditions. Please read them carefully before using our website or
            purchasing any product.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            2. Products & Services
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We specialize in the trade of luxury watches, offering only
            authentic and high-quality timepieces. All descriptions, images, and
            prices are provided in good faith, but we do not guarantee that all
            product information is error-free.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            3. Payment & Pricing
          </h2>
          <p className="text-gray-700 leading-relaxed">
            All payments must be made through the available secure payment
            gateways on our website. Prices are listed in AED unless stated
            otherwise and may change without prior notice.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            4. Returns & Refunds
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Due to the luxury nature of our products, returns are accepted only
            under certain conditions. Please contact our customer service within
            7 days of purchase for eligibility verification.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            5. Privacy Policy
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. We collect and use personal
            information only to enhance your shopping experience and ensure
            secure transactions. We do not share your data with third parties
            without consent.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            6. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Montres Trading LLC is not liable for any indirect, incidental, or
            consequential damages arising from the use of our products or
            website.
          </p>
        </section>

       
      </div>

    
    </div>
  );
};

export default ServicesTermsCondition;
