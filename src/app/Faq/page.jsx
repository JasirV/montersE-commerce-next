"use client";

import React from 'react'
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Faq from '@/layouts/Faq';

const page = () => {
  return (
    <div>
    <Navbar/>
    <Faq/>
    <Footer/>
    </div>
  )
}

export default page