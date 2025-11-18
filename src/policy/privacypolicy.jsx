"use client";

import Image from "next/image";
import React, { useState } from "react";
import heroImg from "../assets/privacyPloicy.jpg";
import { Shield, Lock, Eye, Mail, Phone, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

export default function PrivacyPolicy() {
  const [openSections, setOpenSections] = useState(new Set([0, 1]));

  const toggleSection = (index) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(index)) {
      newOpenSections.delete(index);
    } else {
      newOpenSections.add(index);
    }
    setOpenSections(newOpenSections);
  };

  const privacySections = [
    {
      title: "Information We Collect",
      icon: <Eye className="w-5 h-5" />,
      content: "We collect information you provide directly (name, email, shipping and billing address, phone number), information from your transactions (order history, payment confirmations) and information collected automatically (IP address, device information, cookies)."
    },
    {
      title: "How We Use Your Information",
      icon: <Shield className="w-5 h-5" />,
      content: (
        <ul className="space-y-2 mt-3">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            To process and manage your orders, payments and refunds.
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            To communicate order status, customer support, and marketing (with your consent).
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            To improve our website, detect fraud, and personalize your experience.
          </li>
        </ul>
      )
    },
    {
      title: "Cookies & Tracking",
      icon: <Lock className="w-5 h-5" />,
      content: "We use cookies and similar technologies to remember your preferences, enable shopping cart functionality, and deliver analytics. You can control cookies via your browser or device settings."
    },
    {
      title: "Third-Party Services",
      content: "We share necessary data with third parties such as payment processors, shipping partners, and analytics providers. These partners process data under their own privacy policies."
    },
    {
      title: "Payment Information",
      content: "We do not store full payment card details on our servers. Payment information is processed securely by our payment providers (e.g., Stripe, PayPal). Please review their policies for details."
    },
    {
      title: "Data Security",
      content: "We implement reasonable security measures to protect personal information. However, no method of transmission or storage is 100% secure—if you suspect a breach, contact us immediately."
    },
    {
      title: "Your Rights",
      content: "Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact us using the details below."
    },
    {
      title: "Children's Privacy",
      content: "Our services are not directed to children under 13. We do not knowingly collect personal information from children."
    },
    {
      title: "Changes to This Policy",
      content: "We may update this policy from time to time. We will post the updated policy on this page with a new 'Last updated' date."
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
          <Image
            src={heroImg}
            alt="Privacy and Security"
            className="object-cover w-full h-full"
            priority
          />
        </div>
        
        <div className="relative z-20 -mt-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-sm text-gray-600 font-medium">Last updated: October 17, 2025</p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              This Privacy Policy describes how Montres ("we", "us", "our") collects, uses, and shares your
              personal information when you visit or make a purchase from our e‑commerce site.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Privacy Policy Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Your Privacy Matters</h2>
                
                {/* Accordion Sections */}
                <div className="space-y-4">
                  {privacySections.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
                      <button
                        onClick={() => toggleSection(index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-2xl transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          {section.icon && (
                            <div className="p-2 bg-blue-50 rounded-lg">
                              {section.icon}
                            </div>
                          )}
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {section.title}
                          </h3>
                        </div>
                        {openSections.has(index) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      
                      {openSections.has(index) && (
                        <div className="px-6 pb-6">
                          <div className="text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                            {section.content}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-6 shadow-sm border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Quick Summary</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>We collect order, account and usage data</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Payments handled by secure third parties</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>You can request access, correction or deletion</span>
                </li>
              </ul>
              
              <div className="mt-6 flex flex-col gap-3">
                <a 
                  href="/support" 
                  className="inline-flex items-center justify-center px-4 py-3 bg-white border border-gray-300 rounded-xl hover:shadow-md transition-all font-medium text-gray-700 hover:text-gray-900"
                >
                  Privacy Support
                </a>
                <a 
                  href="/contact-us" 
                  className="inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Privacy Issue Contact Card */}
            <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-3xl p-6 shadow-sm border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Report Privacy Issue</h3>
              </div>
              
              <p className="text-sm text-gray-700 mb-4">
                Found a security vulnerability or privacy concern? Contact our development team directly.
              </p>
              
              <div className="space-y-3">
                <a 
                  href="mailto:security@montres.ae"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-200 hover:shadow-md transition-all text-gray-700 hover:text-gray-900"
                >
                  <Mail className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">security@montres.ae</span>
                </a>
                
                <a 
                  href="mailto:monterodeveloper82@gmail.com"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-200 hover:shadow-md transition-all text-gray-700 hover:text-gray-900"
                >
                  <Mail className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">monterodeveloper82@gmail.com</span>
                </a>
                
                <a 
                  href="tel:+971800668687"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-200 hover:shadow-md transition-all text-gray-700 hover:text-gray-900"
                >
                  <Phone className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">+971 4 267 1124</span>
                </a>
              </div>
              
              <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
                <p className="text-xs text-red-700 text-center">
                  For urgent security matters, please include "URGENT" in your email subject.
                </p>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Additional Resources</h3>
              <div className="space-y-3">
                <a href="/terms" className="block p-3 rounded-xl border border-gray-200 hover:shadow-md transition-all text-gray-700 hover:text-gray-900 text-sm font-medium">
                  Terms of Service
                </a>
                <a href="/cookies" className="block p-3 rounded-xl border border-gray-200 hover:shadow-md transition-all text-gray-700 hover:text-gray-900 text-sm font-medium">
                  Cookie Policy
                </a>
                <a href="/data-request" className="block p-3 rounded-xl border border-gray-200 hover:shadow-md transition-all text-gray-700 hover:text-gray-900 text-sm font-medium">
                  Data Request Form
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    
    </main>
  );
}