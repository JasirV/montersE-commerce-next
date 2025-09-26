"use client" 
import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, CheckCircle, Lock, Clock, User, Check } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useParams, useRouter } from "next/navigation";

const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({ newPassword: '', confirmPassword: '' })
  const [currentStep, setCurrentStep] = useState(1) // 1: Reset Password, 2: Login, 3: Finish
  const [isLoading, setIsLoading] = useState(false)
  
  const { id, token } = useParams();
  const router = useRouter();

  console.log(id, token, "sensitive");

  // CSS variables for consistent color scheme
  const colorVariables = {
    primary: '#2d5582',
    primaryHover: '#2563eb',
    primaryLight: '#3b6da0',
    primaryLighter: '#e8edf3',
    success: '#10b981',
    error: '#ef4444',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    background: '#f9fafb',
    border: '#d1d5db'
  }

  // Password strength indicators
  const passwordRequirements = [
    { id: 1, text: 'At least 8 characters', met: newPassword.length >= 8 },
    { id: 2, text: 'Contains a number', met: /\d/.test(newPassword) },
    { id: 3, text: 'Contains a special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    { id: 4, text: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) }
  ]

  const allRequirementsMet = passwordRequirements.every(req => req.met)
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0

  // Progress steps configuration
  const progressSteps = [
    { 
      id: 1, 
      title: 'Reset Password', 
      description: 'Create a strong and secure password',
      icon: Lock,
      progress: 25
    },
    { 
      id: 2, 
      title: 'Login', 
      description: 'Sign in with your new password',
      icon: User,
      progress: 50
    },
    { 
      id: 3, 
      title: 'Finish', 
      description: 'Setup complete',
      icon: Check,
      progress: 100
    }
  ]

  // Update progress based on current step
  const currentProgress = progressSteps.find(step => step.id === currentStep)?.progress || 25

  const validateForm = () => {
    const newErrors = { newPassword: '', confirmPassword: '' }
    
    if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.values(newErrors).every(error => error === '')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `http://localhost:9000/api/Auth/reset-password/${id}/${token}`,
          { newPassword, confirmPassword }
        );

        setNewPassword("")
        setConfirmPassword("")
        
        // Move to step 2 (Login) after successful password reset
        setCurrentStep(2);
        
        toast.success("Password changed successfully");
        console.log(response.data);

        // Simulate login process and move to step 3 after 2 seconds
        setTimeout(() => {
          setCurrentStep(3);
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            router.push('/');
          }, 3000);
        }, 2000);

      } catch (error) {
        setNewPassword("")
        setConfirmPassword("")
        console.error(error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Reset failed");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Reset Your Password
              </h2>
              <p className="text-sm" style={{ color: colorVariables.textSecondary }}>
                Create a strong and secure password
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* New Password Field */}
              <div>
                <label 
                  htmlFor="new_password" 
                  className="block text-sm font-semibold mb-3"
                  style={{ color: colorVariables.textPrimary }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 pr-12"
                    style={{ 
                      borderColor: errors.newPassword ? colorVariables.error : colorVariables.border,
                    }}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ color: colorVariables.textSecondary }}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm mt-2 flex items-center" style={{ color: colorVariables.error }}>
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: colorVariables.textPrimary }}>
                      Password strength
                    </span>
                    {allRequirementsMet && (
                      <CheckCircle size={16} style={{ color: colorVariables.success }} />
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {passwordRequirements.map((requirement) => (
                      <div key={requirement.id} className="flex items-center space-x-2">
                        <div 
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            requirement.met ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        ></div>
                        <span 
                          className={`text-xs transition-colors duration-200 ${
                            requirement.met 
                              ? 'text-green-600 font-medium' 
                              : 'text-gray-500'
                          }`}
                        >
                          {requirement.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <div>
                <label 
                  htmlFor="confirm_password" 
                  className="block text-sm font-semibold mb-3"
                  style={{ color: colorVariables.textPrimary }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 pr-12"
                    style={{ 
                      borderColor: errors.confirmPassword ? colorVariables.error : 
                                 passwordsMatch ? colorVariables.success : colorVariables.border,
                    }}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ color: colorVariables.textSecondary }}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p 
                    className={`text-sm mt-2 flex items-center transition-all duration-200 ${
                      passwordsMatch ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        Passwords match
                      </>
                    ) : (
                      'Passwords do not match'
                    )}
                  </p>
                )}
                {errors.confirmPassword && (
                  <p className="text-sm mt-2 flex items-center" style={{ color: colorVariables.error }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!allRequirementsMet || !passwordsMatch || isLoading}
                className="w-full py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed font-semibold"
                style={{ 
                  backgroundColor: colorVariables.primary,
                  background: `linear-gradient(135deg, ${colorVariables.primary} 0%, ${colorVariables.primaryLight} 100%)`,
                  color: 'white'
                }}
              >
                {isLoading ? 'Processing...' : 'Set New Password'}
              </button>
            </form>
          </div>
        )

      case 2:
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-green-100">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Password Reset Successful!</h2>
            <p className="text-gray-600">Your password has been updated successfully.</p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-green-100">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Setup Complete!</h2>
            <p className="text-gray-600">You can now login with your new password.</p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecting to Home page...</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: colorVariables.background }}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Header with Logo */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
              style={{ 
                backgroundColor: colorVariables.primary,
                background: `linear-gradient(135deg, ${colorVariables.primary} 0%, ${colorVariables.primaryLight} 100%)`
              }}
            >
              <Clock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2"
          >
            Montres Trading
          </h1>
          <p className="text-sm" style={{ color: colorVariables.textSecondary }}>
            The Art Of Time
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: colorVariables.primary }}>
                Step {currentStep} of {progressSteps.length}
              </span>
              <span className="text-sm font-medium" style={{ color: colorVariables.textSecondary }}>
                {currentProgress}% Complete
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="relative">
              <div 
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: colorVariables.primaryLighter }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${currentProgress}%`, 
                    backgroundColor: colorVariables.primary,
                    background: `linear-gradient(90deg, ${colorVariables.primary} 0%, ${colorVariables.primaryLight} 100%)`
                  }}
                ></div>
              </div>
              
              {/* Progress Steps */}
              <div className="flex justify-between mt-4">
                {progressSteps.map((step) => {
                  const IconComponent = step.icon
                  const isCompleted = step.id < currentStep
                  const isCurrent = step.id === currentStep
                  
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCurrent ? 'scale-110 shadow-lg' : ''
                        }`}
                        style={{ 
                          backgroundColor: isCompleted || isCurrent ? colorVariables.primary : colorVariables.primaryLighter,
                          color: isCompleted || isCurrent ? 'white' : colorVariables.textSecondary
                        }}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                      </div>
                      <div className="text-center mt-2">
                        <span 
                          className={`text-xs font-medium block ${
                            isCurrent ? 'font-semibold' : ''
                          }`}
                          style={{ 
                            color: isCurrent ? colorVariables.primary : colorVariables.textSecondary
                          }}
                        >
                          {step.title}
                        </span>
                        <span 
                          className="text-xs mt-1 hidden sm:block"
                          style={{ color: colorVariables.textSecondary }}
                        >
                          {step.description}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div>
            {renderStepContent()}

            {/* Security Note - Only show on step 1 */}
            {currentStep === 1 && (
              <div 
                className="mt-6 p-4 rounded-lg text-center"
                style={{ backgroundColor: colorVariables.primaryLighter }}
              >
                <p className="text-sm" style={{ color: colorVariables.primary }}>
                  🔒 Your password is encrypted and securely stored
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs" style={{ color: colorVariables.textSecondary }}>
            © 2025 Montres Trading L.L.C – The Art Of Time
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword