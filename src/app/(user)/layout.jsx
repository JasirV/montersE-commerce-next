'use client';
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useState } from "react";


export default function UserLayout({ children }) {
     const [modalIsOpen, setModalIsOpen] = useState(false);
        const [authAction, setAuthAction] = useState("login");
      
        const handleAuthAction = (action) => {
          setAuthAction(action);
          setModalIsOpen(true);
        };
    
  return (
    <div className="min-h-screen flex flex-col">
      {/* ✅ Top Nav */}
      <Navbar
        onSignUpClick={() => handleAuthAction("register")}
        onLoginClick={() => handleAuthAction("login")}
      />

      {/* ✅ Page Content */}
      <main >
        {children}
      </main>

      {/* ✅ Footer */}
      <Footer/>
    </div>
  )
}
