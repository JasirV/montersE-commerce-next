"use client";
import { CurrencyProvider } from "./CurrencyContext";

export default function Providers({ children }) {
  return (
    <CurrencyProvider>{children}</CurrencyProvider>
  );
}