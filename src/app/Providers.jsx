"use client";

import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "./CurrencyContext";
import { WishlistProvider } from "@/components/shared/context/WishlistContext";


export default function Providers({ children }) {
  return (
    <SessionProvider>
    <WishlistProvider>
      <CurrencyProvider>{children}</CurrencyProvider>
      </WishlistProvider>
    </SessionProvider>
  );
}
