"use client" 
import React from 'react'
import '../../app/globals.css'

const ResetPassword = () => {
  // CSS variables for consistent color scheme
  const colorVariables = {
    primary: '#2d5582',
    primaryHover: '#2d5587',
    primaryLight: '#3b6da0',
    primaryLighter: '#e8edf3',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    background: '#f9fafb'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Progress Bar Section */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 flex items-center">
            <div className="flex-1 bg-gray-200 h-1 rounded-full">
              <div 
                className="h-1 rounded-full transition-all duration-300" 
                style={{ 
                  width: '25%', 
                  backgroundColor: colorVariables.primary 
                }}
              ></div>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="relative flex justify-between">
            <div className="flex flex-col items-center">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{ backgroundColor: colorVariables.primary }}
              >
                <span className="text-white text-sm font-medium">1</span>
              </div>
              <span 
                className="text-xs font-medium mt-1"
                style={{ color: colorVariables.primary }}
              >
                Reset password
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">2</span>
              </div>
              <span className="text-xs font-medium text-gray-500 mt-1">Login</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">3</span>
              </div>
              <span className="text-xs font-medium text-gray-500 mt-1">Finish</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-200"
              style={{ backgroundColor: colorVariables.primaryLighter }}
            >
              <img 
                src="https://static.stayjapan.com/assets/top/icon/values-7dd5c8966d7a6bf57dc4bcd11b2156e82a4fd0da94a26aecb560b6949efad2be.svg" 
                alt="Password reset" 
                className="w-8 h-8"
              />
            </div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: colorVariables.textPrimary }}
            >
              Reset your password
            </h2>
            <p style={{ color: colorVariables.textSecondary }}>
              Your password needs to be at least 8 characters.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div>
              <label 
                htmlFor="new_password" 
                className="block text-sm font-medium mb-2"
                style={{ color: colorVariables.textPrimary }}
              >
                New password
              </label>
              <input
                type="password"
                id="new_password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200"
                style={{ 
                  focusRingColor: colorVariables.primary,
                  focusBorderColor: colorVariables.primary
                }}
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label 
                htmlFor="confirm_password" 
                className="block text-sm font-medium mb-2"
                style={{ color: colorVariables.textPrimary }}
              >
                Confirm new password
              </label>
              <input
                type="password"
                id="confirm_password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 transition duration-200"
                style={{ 
                  focusRingColor: colorVariables.primary,
                  focusBorderColor: colorVariables.primary
                }}
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-200"
              style={{ 
                backgroundColor: colorVariables.primary
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = colorVariables.primaryHover}
              onMouseLeave={(e) => e.target.style.backgroundColor = colorVariables.primary}
            >
              Set new password
            </button>
          </form>

          {/* Company Info */}
          <p className="text-center text-sm mt-6" style={{ color: colorVariables.textSecondary }}>
            Montres Trading L.L.C – The Art Of Time
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
