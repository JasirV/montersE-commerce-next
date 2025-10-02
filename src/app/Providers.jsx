"use client";

import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "./CurrencyContext";


export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CurrencyProvider>{children}</CurrencyProvider>
    </SessionProvider>
  );
}
