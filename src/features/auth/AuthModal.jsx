import React, { useState, useCallback } from "react";
import Modal from "react-modal";
import Image from "next/image";
import Authentication from "../../assets/authenticationMy.jpg";
import { FaTimes } from "react-icons/fa";

// Import forms normally (no lazy)
import LoginForm from "./LoginForm";
import RegisterForm from "./Registerpage";
import ForgotPasswordForm from "./Forgotyourpassword";

// Modal Styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: 0,
    border: "none",
    borderRadius: "12px",
    overflow: "hidden",
    width: "90%",
    maxWidth: "700px",
    maxHeight: "90vh",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 1000,
    backdropFilter: "blur(3px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

// Attach modal to root
if (typeof window !== "undefined") {
  Modal.setAppElement("body");
}

// Left Banner Component
const ImageBanner = () => (
  <div className="hidden md:flex md:w-2/5 relative">
    <Image
      src={Authentication}
      alt="Luxury Watch Banner"
      fill
      className="object-cover"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-end p-6">
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-sm opacity-90">Discover our exclusive collection</p>
      </div>
    </div>
  </div>
);

// Tabs Component
const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "login", label: "Login" },
    { id: "register", label: "Register" },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-4 md:mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-2 px-4 font-medium flex-1 text-sm md:text-base transition-colors ${
            activeTab === tab.id
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// Close Button
const CloseButton = ({ onClose, className = "" }) => (
  <button
    onClick={onClose}
    className={`text-gray-400 hover:text-gray-600 transition-colors z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg ${className}`}
    aria-label="Close modal"
  >
    <FaTimes size={18} />
  </button>
);

// Auth Modal
const AuthModal = ({ isOpen, onRequestClose }) => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleClose = useCallback(() => {
    setActiveTab("login");
    onRequestClose();
  }, [onRequestClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel="Authentication Modal"
      closeTimeoutMS={200}
      ariaHideApp={false}
    >
      <div className="flex flex-col md:flex-row h-full min-h-[450px] max-h-[90vh] relative">
        {/* Close Button */}
        <CloseButton
          onClose={handleClose}
          className="absolute top-3 right-3 md:top-4 md:right-4"
        />

        {/* Left Banner */}
        <ImageBanner />

        {/* Right Content */}
        <div className="w-full md:w-3/5 bg-white p-5 md:p-8 rounded-r-lg overflow-y-auto">
          {/* Tabs */}
          <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />

          {/* Form Rendering */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === "login" && (
              <LoginForm setActiveTab={handleTabChange} onRequestClose={handleClose} />
            )}
            {activeTab === "register" && (
              <RegisterForm setActiveTab={handleTabChange} onRequestClose={handleClose} />
            )}
            {activeTab === "forgot" && (
              <ForgotPasswordForm setActiveTab={handleTabChange} onRequestClose={handleClose} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
