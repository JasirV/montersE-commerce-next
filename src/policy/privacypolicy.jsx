"use client";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="w-full bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-gray-800">
        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-center sm:text-left">
          Privacy Policy
        </h1>

        {/* Introduction */}
        <p className="mb-6 text-sm sm:text-base leading-relaxed">
          Welcome to <strong>Montres Trading LLC – The Art of Time</strong>. Your
          privacy is extremely important to us. This Privacy Policy explains how
          we collect, use, store, and protect your personal information when you
          visit our website, browse our collections, or make a purchase from our
          online store.
        </p>

        <p className="mb-8 text-sm sm:text-base leading-relaxed">
          By using our website and services, you agree to the practices described
          in this policy. We are committed to handling your data transparently,
          securely, and in compliance with applicable laws.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
            <li>
              Personal information such as name, email address, phone number,
              billing address, and shipping address
            </li>
            <li>
              Payment details (securely processed by trusted third-party payment
              providers — we do not store card details)
            </li>
            <li>Order history, product selections, and transaction records</li>
            <li>
              Technical data including IP address, browser type, device
              information, and site usage data
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            2. How We Use Your Information
          </h2>
          <p className="mb-2 text-sm sm:text-base">
            We use your information to:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
            <li>Process, confirm, and deliver your orders</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Send order confirmations, updates, and service notifications</li>
            <li>
              Improve our website, services, and overall shopping experience
            </li>
            <li>
              Send promotional or marketing communications (only if you opt in)
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            3. Cookies & Tracking Technologies
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Our website uses cookies and similar tracking technologies to enhance
            functionality, analyze traffic, and personalize your experience. You
            may disable cookies through your browser settings; however, some
            features of the website may not function properly.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            4. Sharing of Information
          </h2>
          <p className="mb-2 text-sm sm:text-base">
            We do not sell or rent your personal information. We may share your
            data only with:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
            <li>Payment processors and shipping partners</li>
            <li>Service providers supporting our business operations</li>
            <li>Legal or regulatory authorities when required by law</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            5. Data Security
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            We take appropriate technical and organizational measures to protect
            your personal information against unauthorized access, misuse, or
            disclosure. While we strive to protect your data, no online system is
            completely secure.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            6. Your Rights
          </h2>
          <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base">
            <li>Request access to your personal information</li>
            <li>Request correction or deletion of your data</li>
            <li>Opt out of marketing communications at any time</li>
            <li>Request a copy of the data we store about you</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            7. Third-Party Links
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Our website may contain links to third-party websites. Montres Trading
            LLC is not responsible for the privacy practices or content of those
            external sites.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            8. Changes to This Policy
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            We may update this Privacy Policy periodically. Any changes will be
            posted on this page, and the revised date will be updated
            accordingly.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-lg sm:text-xl font-semibold mb-3">
            9. Contact Us
          </h2>
          <p className="text-sm sm:text-base">
            If you have any questions or concerns regarding this Privacy Policy,
            please contact us:
          </p>
          <p className="mt-3 text-sm sm:text-base">
            📧 Email:{" "}
            <strong>support@montresdeveloper.com</strong>
          </p>
        </section>

        {/* Footer */}
        <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
