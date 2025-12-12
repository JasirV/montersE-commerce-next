"use client"
import axios from "axios"
import React, { useState, useEffect } from "react"
import { 
  FiPackage, 
  FiCreditCard, 
  FiClock, 
  FiTruck,
  FiChevronRight,
  FiInfo,
  FiX,
  FiLoader,
  FiCheck,
  FiAlertCircle
} from "react-icons/fi"

const OrdersSection = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem("accessToken")
      
      if (!accessToken) {
        setError("Please login to view orders")
        setLoading(false)
        return
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/MyOrders/myorders`,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      )

      // Ensure we always have an array
      setOrders(response.data?.orders || [])
      setError("")
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError(
        err.response?.data?.message || 
        err.message || 
        "Failed to load orders. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const getOrderStatusInfo = (status) => {
    const statusMap = {
      "Pending": { progress: 25, step: 0, label: "Confirmed", color: "bg-yellow-100 text-yellow-800" },
      "Confirmed": { progress: 25, step: 0, label: "Confirmed", color: "bg-blue-100 text-blue-800" },
      "Processing": { progress: 50, step: 1, label: "Preparing", color: "bg-purple-100 text-purple-800" },
      "Shipped": { progress: 75, step: 2, label: "Shipped", color: "bg-indigo-100 text-indigo-800" },
      "Delivered": { progress: 100, step: 3, label: "Delivered", color: "bg-green-100 text-green-800" },
      "Cancelled": { progress: 0, step: -1, label: "Cancelled", color: "bg-red-100 text-red-800" }
    }
    return statusMap[status] || { progress: 0, step: 0, label: status, color: "bg-gray-100 text-gray-800" }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
      
      // Format for older dates
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  const formatCurrency = (amount, currency = "USD") => {
    if (!amount && amount !== 0) return `${currency} 0.00`
    return `${currency} ${parseFloat(amount).toFixed(2)}`
  }

  const statusSteps = ["Confirmed", "Preparing", "Shipped", "Delivered"]

  const upcomingOrders = orders.filter(order => 
    !["Delivered", "Cancelled"].includes(order.orderStatus)
  )

  const previousOrders = orders.filter(order => 
    ["Delivered", "Cancelled"].includes(order.orderStatus)
  )

  const displayedOrders = activeTab === "upcoming" ? upcomingOrders : previousOrders

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return
    
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        alert("Please login to cancel orders")
        return
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"}/api/MyOrders/cancel/${orderId}`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      )

      // Refresh orders list
      fetchOrders()
    } catch (err) {
      alert("Failed to cancel order: " + (err.response?.data?.message || err.message))
    }
  }

  const handleViewDetails = (orderId) => {
    // Navigate to order details page or show modal
    alert(`View details for order: ${orderId}`)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <FiLoader className="animate-spin text-[#0061b0ee] text-3xl" />
          <span className="text-gray-600">Loading your orders...</span>
        </div>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="text-center py-12">
          <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-4" />
          <div className="text-red-500 text-lg font-medium mb-4">Error loading orders</div>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
          <button 
            onClick={fetchOrders}
            className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600 text-sm sm:text-base">Track and manage your orders</p>
      </div>

      {/* Tabs - Mobile Scrollable */}
      <div className="flex overflow-x-auto pb-2 mb-6 sm:mb-8 hide-scrollbar">
        <div className="flex gap-4 sm:gap-8 border-b border-gray-200 min-w-max">
          <button 
            onClick={() => setActiveTab("upcoming")}
            className={`pb-4 border-b-2 transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeTab === "upcoming" 
                ? "border-[#0061b0ee] text-[#0061b0ee] font-semibold" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming Orders ({upcomingOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab("previous")}
            className={`pb-4 border-b-2 transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
              activeTab === "previous" 
                ? "border-[#0061b0ee] text-[#0061b0ee] font-semibold" 
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Previous Orders ({previousOrders.length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      {displayedOrders.length === 0 ? (
        <div className="text-center py-12">
          <FiPackage className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {activeTab === "upcoming" 
              ? "You don't have any upcoming orders" 
              : "You don't have any previous orders"}
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {displayedOrders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.orderStatus)
            
            return (
              <div
                key={order._id}
                className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white hover:shadow-lg transition-shadow duration-300"
              >
                {/* Top Row */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
                  <div className="w-full lg:w-auto">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      Order #{order._id?.slice(-8).toUpperCase() || 'N/A'}
                    </h2>
                    <p className="text-xl sm:text-2xl font-bold text-[#0061b0ee] mt-1">
                      {formatCurrency(order.total, order.currency)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-3 w-full lg:w-auto justify-end">
                    <button 
                      onClick={() => handleViewDetails(order._id)}
                      className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 shadow-md text-sm sm:text-base flex items-center gap-2"
                    >
                      <FiInfo size={16} />
                      <span className="hidden sm:inline">Order Details</span>
                      <span className="sm:hidden">Details</span>
                    </button>
                    
                    {activeTab === "upcoming" && order.orderStatus !== "Cancelled" && (
                      <button 
                        onClick={() => handleCancelOrder(order._id)}
                        className="border border-red-500 text-red-500 px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200 text-sm sm:text-base flex items-center gap-2"
                      >
                        <FiX size={16} />
                        <span className="hidden sm:inline">Cancel Order</span>
                        <span className="sm:hidden">Cancel</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mb-4 sm:mb-6">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    {order.orderStatus === "Delivered" && <FiCheck className="mr-2" size={14} />}
                    {order.orderStatus === "Cancelled" && <FiX className="mr-2" size={14} />}
                    {statusInfo.label}
                  </div>
                </div>

                {/* Items List */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Items:</h3>
                  <div className="space-y-3">
                    {(order.items || []).map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FiPackage className="text-gray-400" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                            {item.name || `Item ${itemIndex + 1}`}
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Qty: {item.quantity || 1} • {formatCurrency(item.price, order.currency)}
                          </p>
                        </div>
                        <FiChevronRight className="text-gray-400 flex-shrink-0" size={16} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Bar - Only for upcoming non-cancelled orders */}
                {activeTab === "upcoming" && order.orderStatus !== "Cancelled" && order.orderStatus !== "Delivered" && (
                  <div className="mb-4 sm:mb-6">
                    <div className="flex justify-between relative mb-3">
                      {statusSteps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mb-2 ${
                              statusInfo.step >= stepIndex
                                ? "bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {stepIndex + 1}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-medium text-center px-1 ${
                              statusInfo.step >= stepIndex
                                ? "text-[#0061b0ee]"
                                : "text-gray-400"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      ))}
                      
                      {/* Connecting Line */}
                      <div className="absolute top-3 sm:top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                        <div 
                          className="h-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] transition-all duration-500"
                          style={{ width: `${statusInfo.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <FiPackage className="text-[#0061b0ee] flex-shrink-0" size={16} />
                    <span className="truncate">{(order.items?.length || 0)} Item{(order.items?.length || 0) > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCreditCard className="text-[#0061b0ee] flex-shrink-0" size={16} />
                    <span className="truncate capitalize">{order.paymentMethod || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-[#0061b0ee] flex-shrink-0" size={16} />
                    <span className="truncate">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiTruck className="text-[#0061b0ee] flex-shrink-0" size={16} />
                    <span className="truncate">
                      {order.shippingAddress?.city || "N/A"}, {order.shippingAddress?.country || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Mobile Action Button */}
                <div className="sm:hidden mt-4">
                  <button 
                    onClick={() => handleViewDetails(order._id)}
                    className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 shadow-md flex items-center justify-center gap-2"
                  >
                    <FiInfo size={18} />
                    View Full Details
                    <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Load More Button */}
      {displayedOrders.length > 0 && displayedOrders.length < orders.length && (
        <div className="flex justify-center mt-8">
          <button className="border border-[#0061b0ee] text-[#0061b0ee] px-8 py-3 rounded-lg font-medium hover:bg-[#0061b011] transition-colors duration-200">
            Load More Orders
          </button>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default OrdersSection