"use client"; // ← important!
import React, { Suspense } from "react";
import PaymentCancel from "@/features/checkout/paymentcancel";

const Page = () => (
  <Suspense fallback={<div>Loading payment cancellation details...</div>}>
    <PaymentCancel />
  </Suspense>
);

export default Page;
