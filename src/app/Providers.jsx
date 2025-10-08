"use client";

import { SessionProvider } from "next-auth/react";
import { CurrencyProvider } from "./CurrencyContext";
import { Provider } from "react-redux";
import store from "@/lib/store/store";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <Provider store={store}>
      <CurrencyProvider>{children}</CurrencyProvider>
      </Provider>
    </SessionProvider>
  );
}
