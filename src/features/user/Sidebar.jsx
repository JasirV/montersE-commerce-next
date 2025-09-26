import React from "react";
import { FiPackage, FiTruck, FiUser, FiLock, FiHelpCircle } from "react-icons/fi";

// Sidebar component for Desktop only
const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "orders", label: "My Orders", icon: FiPackage, count: 3 },
    { id: "tracking", label: "Order Tracking", icon: FiTruck },
    { id: "profile", label: "Profile Info", icon: FiUser },
    { id: "password", label: "Password & Security", icon: FiLock },
  ];

  return (
    <div className="p-4">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <IconComponent size={18} className="flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
              {item.count && (
                <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      
      {/* Additional Info Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center mb-2">
          <FiHelpCircle size={16} className="text-gray-600 mr-2" />
          <h3 className="font-medium text-gray-900">Need Help?</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">We're here to assist you with any questions.</p>
        <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Sidebar;