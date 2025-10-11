"use client"; // ← important!
import PaymentSuccess from '@/features/checkout/paymentsuccess'
import React,{ Suspense }  from 'react'



const page = () => {
  return (
    <Suspense fallback={<div>Loading payment  Success details...</div>}>
      <PaymentSuccess/>
    </Suspense>
  )
}

export default page
