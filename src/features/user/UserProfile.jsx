import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import OrdersSection from "./OrdersSection";
import ProfileInformation from "./UserAccount/ProfileInformation";
import ProfileUpdate from "./UserAccount/ProfileUpdate";
import PasswordSection from "./PasswordSection";
import TrackingSection from "./OrderTracking/TrackingMap";
import { 
  FiPackage, 
  FiTruck, 
  FiUser, 
  FiLock
} from "react-icons/fi";

const UserProfile = () => {
  const [activeSection, setActiveSection] = useState("orders");
  const [isMobile, setIsMobile] = useState(false);
  const [userData, setUserData] = useState({
    name: "Alex John",
    email: "alexjohn@gmail.com",
    phone: "+1 234 567 8900",
    address: "123 Main St, New York, NY 10001",
    profilePicture: "",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial state
    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "orders":
        return <OrdersSection setActiveSection={setActiveSection} />;
      case "profile":
        return isEditingProfile ? (
          <ProfileUpdate
            userData={userData}
            setUserData={setUserData}
            onCancel={() => setIsEditingProfile(false)}
          />
        ) : (
          <ProfileInformation
            userData={userData}
            onEdit={() => setIsEditingProfile(true)}
          />
        );
      case "password":
        return <PasswordSection />;
      case "tracking":
        return <TrackingSection/>;
      default:
        return <OrdersSection setActiveSection={setActiveSection} />;
    }
  };

  // Mobile bottom navigation items
  const mobileNavItems = [
    { id: "orders", label: "Orders", icon: FiPackage, count: 3 },
    { id: "tracking", label: "Tracking", icon: FiTruck },
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "password", label: "Security", icon: FiLock },
  ];

  return (
    <div className="bg-gray-100 min-h-screen pb-16 md:pb-0">
      {/* Mobile Header - Simplified without hamburger menu */}
      {isMobile && (
        <div className="bg-white shadow-sm p-4 flex items-center justify-center sticky top-0 z-20">
          <h1 className="text-xl font-bold">Your Account</h1>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-xl shadow p-4 md:p-6 mt-4 md:mt-6">
          {/* Header Section for Desktop */}
          {!isMobile && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Your Account</h1>
              <p className="text-gray-600">
                {userData.name}, Email: {userData.email}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar for Desktop Only */}
            {!isMobile && (
              <div className="md:col-span-1">
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
              </div>
            )}

            {/* Main Content */}
            <div className="md:col-span-3">
              {isMobile && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm text-center">
                    {userData.name}, Email: {userData.email}
                  </p>
                </div>
              )}
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
          <div className="flex justify-around items-center">
            {mobileNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex flex-col items-center py-3 px-2 flex-1 min-w-0 transition-all duration-200 ${
                    activeSection === item.id
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="relative">
                    <IconComponent size={20} />
                    {item.count && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-1 font-medium truncate max-w-full">
                    {item.label}
                  </span>
                  {activeSection === item.id && (
                    <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;