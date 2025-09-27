"use client";
import React from 'react'
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import EcommerceContactForm from '@/layouts/ContactForm';

const page = () => {
  return (
    <div>
    <Navbar/>
    <EcommerceContactForm/>
    <Footer/>
    </div>
  )
}

export default page