"use client";
import React, { useState,useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Landing from "@/components/shared/BannerPage";
import Home from "@/pages/Home";
import WatchBrand from "@/layouts/WatchBrand";
import Form from "@/components/ui/WatheForm";
import JustforyouWatch from "@/components/ui/JustforyouWatch";
import PremiumBrands from "@/layouts/PremiumBrands";
import Services from "@/components/ui/Services";
import Footer from "@/components/shared/Footer";
import ChatRobot from "@/components/ui/ChatRobot";
import Watch from "@/layouts/Watch";
import "../Mobile/responsive.css";
import NewsletterModal from "@/components/modals/newsletterModal";
import CategorySectionWithImages from "@/components/CategorySection";

export default function IndexPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [authAction, setAuthAction] = useState("login");
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAuthAction = (action) => {
    setAuthAction(action);
    setModalIsOpen(true);
  };

  //   // Auto-open modal after 3 seconds (optional)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsModalOpen(true)
  //   }, 6000)
  //   return () => clearTimeout(timer)
  // }, [])



  return (
    <div>
      <Navbar
        onSignUpClick={() => handleAuthAction("register")}
        onLoginClick={() => handleAuthAction("login")}
      />
{/* 
      <AuthModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        defaultAction={authAction}
      /> */}

     <NewsletterModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <Landing />
      <div className="flex md:hidden justify-center">
       <CategorySectionWithImages/> 
      </div>
      <Home />
      <WatchBrand />
      <Form id="watch-form" />
      <JustforyouWatch />
      <PremiumBrands />
      <Watch />
      <Services />
      <Footer />
    </div>
  );
}
