"use client";

import React from 'react'
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import UserProfile from '@/features/user/UserProfile';

const page = () => {
  return (
    <div>
    <Navbar/>
    <UserProfile/>
    <Footer/>
    </div>
  )
}

export default page