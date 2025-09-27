"use client";
import ShoppingWishlist from '@/components/ui/ShoppingWishlist'
import React from 'react'
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const page = () => {
  return (
    <div>
    <Navbar/>
    <ShoppingWishlist/>
    <Footer/>
    </div>
  )
}

export default page