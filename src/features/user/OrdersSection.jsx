"use client"
import React from "react"
import { 
  FiPackage, 
  FiCreditCard, 
  FiClock, 
  FiTruck,
  FiChevronRight,
  FiInfo,
  FiX
} from "react-icons/fi"

const OrdersSection = () => {
  const orders = [
    {
      id: "#ORD-78451",
      amount: "AED 213.00",
      status: "Preparing",
      progress: 50,
      items: [
        { name: "Chicken Burger", image: "/burger.jpg", quantity: 1, price: "AED 45.00" },
        { name: "French Fries", image: "/fries.jpg", quantity: 1, price: "AED 18.00" }
      ],
      payment: "Cash on Delivery",
      ordered: "Ordered 2 mins ago",
      delivery: "Delivery within 25 mins",
      active: true
    },
    {
      id: "#ORD-78452",
      amount: "AED 350.00",
      status: "Confirmed",
      progress: 25,
      items: [
        { name: "Pepperoni Pizza", image: "/pizza.jpg", quantity: 1, price: "AED 120.00" },
        { name: "Caesar Salad", image: "/salad.jpg", quantity: 1, price: "AED 45.00" },
        { name: "Coca Cola", image: "/cola.jpg", quantity: 2, price: "AED 20.00" }
      ],
      payment: "Credit Card",
      ordered: "Ordered 10 mins ago",
      delivery: "Delivery within 45 mins",
      active: false
    },
    {
      id: "#ORD-78453",
      amount: "AED 189.00",
      status: "Picked up",
      progress: 75,
      items: [
        { name: "Sushi Platter", image: "/sushi.jpg", quantity: 1, price: "AED 189.00" }
      ],
      payment: "Cash on Delivery",
      ordered: "Ordered 30 mins ago",
      delivery: "Delivery within 15 mins",
      active: true
    }
  ]

  const statusSteps = ["Confirmed", "Preparing", "Picked up", "Delivered"]

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
          <button className="pb-4 border-b-2 border-[#0061b0ee] text-[#0061b0ee] font-semibold transition-all duration-200 whitespace-nowrap text-sm sm:text-base">
            Upcoming Orders (2)
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base">
            Previous Orders (0)
          </button>
          <button className="pb-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 whitespace-nowrap text-sm sm:text-base">
            Scheduled Orders (0)
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4 sm:space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white hover:shadow-lg transition-shadow duration-300"
          >
            {/* Top Row - Mobile Stacked */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
              <div className="w-full lg:w-auto">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">{order.id}</h2>
                <p className="text-xl sm:text-2xl font-bold text-[#0061b0ee] mt-1">{order.amount}</p>
              </div>
              <div className="flex gap-2 sm:gap-3 w-full lg:w-auto justify-end">
                <button className="bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 shadow-md text-sm sm:text-base flex items-center gap-2">
                  <FiInfo size={16} />
                  <span className="hidden sm:inline">Order Details</span>
                  <span className="sm:hidden">Details</span>
                </button>
                <button className="border border-red-500 text-red-500 px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200 text-sm sm:text-base flex items-center gap-2">
                  <FiX size={16} />
                  <span className="hidden sm:inline">Cancel Order</span>
                  <span className="sm:hidden">Cancel</span>
                </button>
              </div>
            </div>

            {/* Items List - Mobile Friendly */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Items:</h3>
              <div className="space-y-3">
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {/* Placeholder for item image */}
                      <FiPackage className="text-gray-400" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {item.name}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Qty: {item.quantity} • {item.price}
                      </p>
                    </div>
                    <FiChevronRight className="text-gray-400 flex-shrink-0" size={16} />
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar with Steps - Mobile Optimized */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between relative mb-3">
                {statusSteps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold mb-2 ${
                        statusSteps.indexOf(order.status) >= stepIndex
                          ? "bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {stepIndex + 1}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium text-center px-1 ${
                        statusSteps.indexOf(order.status) >= stepIndex
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
                    style={{ width: `${order.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Order Info - Mobile Stacked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <FiPackage className="text-[#0061b0ee] flex-shrink-0" size={16} />
                <span className="truncate">{order.items.length} Item{order.items.length > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiCreditCard className="text-[#0061b0ee] flex-shrink-0" size={16} />
                <span className="truncate">{order.payment}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-[#0061b0ee] flex-shrink-0" size={16} />
                <span className="truncate">{order.ordered}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="text-[#0061b0ee] flex-shrink-0" size={16} />
                <span className="truncate">{order.delivery}</span>
              </div>
            </div>

            {/* Mobile Action Button */}
            <div className="sm:hidden mt-4">
              <button className="w-full bg-gradient-to-r from-[#1e518e] to-[#0061b0ee] text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 shadow-md flex items-center justify-center gap-2">
                <FiInfo size={18} />
                View Full Order Details
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        <button className="border border-[#0061b0ee] text-[#0061b0ee] px-8 py-3 rounded-lg font-medium hover:bg-[#0061b011] transition-colors duration-200">
          Load More Orders
        </button>
      </div>

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