"use client";
import { CurrencyProvider } from "./CurrencyContext";
import AuthProvider from "../components/AuthProvider";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CurrencyProvider>{children}</CurrencyProvider>
    </AuthProvider>
  );
}