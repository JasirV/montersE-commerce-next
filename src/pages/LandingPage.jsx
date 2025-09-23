"use client";

import React, { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import AuthModal from "@/features/auth/AuthModal";
import Landing from "@/components/shared/Landing";
import Home from "@/pages/Home"; // careful: rename to avoid clash
import AddSection from "@/layouts/addsSection";
import WatchBrand from "@/layouts/WatchBrand";
import Form from "@/components/ui/WatheForm";
import ChatRobot from "@/components/ui/ChatRobot";
import JustforyouWatch from "@/components/ui/JustforyouWatch";
import PremiumBrands from "@/layouts/PremiumBrands";
import BrandNewAdded from "@/layouts/WatchBrand";
import Services from "@/components/ui/Services";
import Footer from "@/components/shared/Footer";
import "../Mobile/responsive.css";

export default function IndexPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [authAction, setAuthAction] = useState("login");

  const handleAuthAction = (action) => {
    setAuthAction(action);
    setModalIsOpen(true);
  };

  return (
    <div>
      <Navbar
        onSignUpClick={() => handleAuthAction("register")}
        onLoginClick={() => handleAuthAction("login")}
      />
      <AuthModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        defaultAction={authAction}
      />


      <Landing />
      <Home />
      <AddSection />
      <WatchBrand />
      <Form />
      {/* <ChatRobot /> */}
      <JustforyouWatch />
      <PremiumBrands />
      <BrandNewAdded />
      <Services />

      <Footer />
    </div>
  );
}
