import React, { useState, useCallback, lazy, Suspense } from "react";
import Modal from "react-modal";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import Authentication from "../../assets/52_MjExMC53MDEyLm4wMDEuMTHQoS5wNi4xMQ.jpg";

// Lazy load form components
const LoginForm = lazy(() => import("./LoginForm"));
const RegisterForm = lazy(() => import("./Registerpage"));
const ForgotPasswordForm = lazy(() => import("./Forgotyourpassword"));

// Loader for lazy components
const FormLoading = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Responsive Modal Styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    padding: "0",
    border: "none",
    borderRadius: "12px",
    overflow: "hidden",
    width: "90%", // mobile width
    maxWidth: "700px", // desktop max width
    height: "auto",
    maxHeight: "90vh", // scrollable if content too tall
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

// Left Banner (Hidden on mobile)
const ImageBanner = ({ onRequestClose }) => (
  <div className="hidden md:flex md:w-2/5 relative overflow-hidden rounded-l-lg">
    <button
      onClick={onRequestClose}
      className="absolute top-4 right-4 text-white hover:text-gray-200 z-10 transition-colors bg-black bg-opacity-40 rounded-full p-2"
      aria-label="Close modal"
    >
      <FaTimes size={18} />
    </button>

    <Image
      src={Authentication}
      alt="Luxury Watch Banner"
      width={1100}
      height={400}
      className="object-cover h-full w-full"
      loading="lazy"
    />
  </div>
);

// Tabs
const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "login", label: "LOGIN" },
    { id: "register", label: "REGISTER" },
  ];

  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-2 px-4 font-medium transition-colors flex-1 text-sm md:text-base ${
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

// Main Auth Modal
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
      <div className="flex flex-col md:flex-row h-full min-h-[400px] max-h-[90vh]">
        {/* Left Banner */}
        <ImageBanner onRequestClose={handleClose} />

        {/* Right Content */}
        <div
          className={`${
            activeTab == "login" ? "md:mb-11 md:mt-11" : ""
          } w-full md:w-3/5 bg-white p-5 md:p-8 relative overflow-y-auto rounded-r-lg`}
        >
          {/* Mobile Close Button */}
          <button
            onClick={handleClose}
            className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors bg-gray-100 rounded-full p-2"
            aria-label="Close modal"
          >
            <FaTimes size={18} />
          </button>

          {/* Tabs */}
          <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />

          {/* Lazy Loaded Forms */}
          <Suspense fallback={<FormLoading />}>
            {activeTab === "login" && (
              <LoginForm
                setActiveTab={handleTabChange}
                onRequestClose={handleClose}
              />
            )}
            {activeTab === "register" && (
              <RegisterForm
                setActiveTab={handleTabChange}
                onRequestClose={handleClose}
              />
            )}
            {activeTab === "forgot" && (
              <ForgotPasswordForm
                setActiveTab={handleTabChange}
                onRequestClose={handleClose}
              />
            )}
          </Suspense>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
