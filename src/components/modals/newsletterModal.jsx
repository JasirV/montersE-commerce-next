"use client"
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NewsLterr from '../../assets/box-marke.jpg'

const NewsletterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    acceptPolicy: false,
    acceptWhatsapp: false
  })

  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '15px'
      setTimeout(() => setIsVisible(true), 50)
    } else {
      setIsVisible(false)
      setTimeout(() => {
        document.body.style.overflow = 'unset'
        document.body.style.paddingRight = '0'
      }, 300)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.paddingRight = '0'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.acceptPolicy || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      // API call using axios
      const response = await axios.post('https://api.montres.ae/api/Auth/newsletter/subscribe', {
        name: formData.name,
        email: formData.email,
        acceptWhatsapp: formData.acceptWhatsapp
      })

      // Success handling
      toast.success('Thank you for subscribing! You will be the first to know about our new products.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
      
      onClose()
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        acceptPolicy: false,
        acceptWhatsapp: false
      })
    } catch (error) {
      console.error('Subscription failed:', error)
      toast.error('Subscription failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  if (!isOpen) return null

  return (
    <>
      <ToastContainer />
      <div 
        className={`fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50 transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-title"
      >
        <div 
          className={`bg-white rounded-lg shadow-xl max-w-4xl w-full mx-auto flex flex-col md:flex-row transform transition-all duration-300 max-h-[90vh] overflow-hidden ${
            isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}
        >
          
          {/* Banner Image Section - Side */}
          <div className="hidden md:flex md:w-2/5 relative bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="relative w-full h-full">
              <Image 
                src={NewsLterr}
                alt="Join our newsletter community"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 0px, 40vw"
                placeholder="blur"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8">
                <div className="text-white w-full">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 leading-tight">Join Our Community</h3>
                  <p className="text-white text-opacity-90 mb-4 text-sm leading-relaxed">
                    Be the first to discover new products and exclusive offers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full md:w-3/5 flex flex-col max-h-[90vh] overflow-y-auto">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 p-6 text-center md:text-left">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
                aria-label="Close newsletter modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 id="newsletter-title" className="text-2xl font-bold text-gray-900 mb-2">
                Join our Newsletter
              </h2>
              <p className="text-gray-600 text-sm">
                Find out first about our new product drops!
              </p>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900"
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-900"
                    placeholder="your.email@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Communication Preferences */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptPolicy"
                      name="acceptPolicy"
                      checked={formData.acceptPolicy}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                    />
                    <label htmlFor="acceptPolicy" className="text-sm text-gray-700 flex-1 leading-relaxed">
                      Keep me up to date on news and offers by email
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptWhatsapp"
                      name="acceptWhatsapp"
                      checked={formData.acceptWhatsapp}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="mt-1 w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 flex-shrink-0"
                    />
                    <label htmlFor="acceptWhatsapp" className="text-sm text-gray-700 flex-1 leading-relaxed">
                      Keep me up to date on news and offers by WhatsApp
                    </label>
                  </div>
                </div>

                {/* Privacy Policy Link */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    For more information on how we process your data for marketing communication.{' '}
                    <a 
                      href="/privacy-policy" 
                      className="text-blue-600 underline hover:no-underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Check our Privacy policy.
                    </a>
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!formData.acceptPolicy || isSubmitting}
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base relative"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'SUBSCRIBE'
                  )}
                </button>
              </form>
            </div>

            {/* Footer Trust Indicators */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>No Spam</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>1-Click Unsubscribe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewsletterModal