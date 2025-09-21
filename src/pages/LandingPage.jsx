"use client";

import React, { useEffect, useState } from "react";
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
import { LandingPageProduct } from "@/service/productService";



export default function IndexPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [authAction, setAuthAction] = useState("login");
   const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const { data, error } = await LandingPageProduct();
      if (error) {
        setError(error.message || "Failed to fetch products");
      } else {
        setProducts(data);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  // if (loading) return <p className="text-center py-10">⏳ Loading products...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;

  // Function to open modal with specific action      
  const handleAuthAction = (action) => {
    setAuthAction(action);
    setModalIsOpen(true);
  };
LandingPageProduct()

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

      {/* Home Page Sections */}
      <Landing />
      <Home />
      <AddSection />
    <WatchBrand products={products?.brandNew} loading={loading}/>
      <Form />
      {/* <ChatRobot /> */}
      <JustforyouWatch productsGrid1Data={products?.newArrivals} productsGrid2Data={products?.montresTrusted} loading={loading}/>
      <PremiumBrands />
      <BrandNewAdded  products={products?.lastBrandNew} loading={loading}/>
      <Services />
    
      <Footer />
    </div>
  );
}
