"use client";
import React, { createContext, useContext, useState } from "react";


// Add default values here
const CurrencyContext = createContext({
  currency: "AED",
  setCurrency: () => {},
  rate: 1,
  setRate: () => {},
});

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("AED"); // default AED
  const [rate, setRate] = useState(1); // default conversion rate

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, setRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
