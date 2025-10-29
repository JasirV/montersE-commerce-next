"use client";
import React, { createContext, useContext, useState } from "react";

// Create the context with proper default values
const CurrencyContext = createContext({
  currency: "AED",
  setCurrency: () => {},
  rate: 1,
  setRate: () => {},
  convertPrice: () => {},
  getCurrencySymbol: () => {},
});

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("AED"); // default AED
  const [rate, setRate] = useState(1); // default conversion rate

  // Function to convert prices
  const convertPrice = (price) => {
    return (price * rate).toFixed(2);
  };

  // Function to get currency symbol
  const getCurrencySymbol = () => {
    const symbols = {
      AED: "د.إ", // UAE Dirham
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "CA$",
      AUD: "A$",
      INR: "₹",
      SAR: "﷼", // Saudi Riyal
      QAR: "﷼", // Qatari Riyal
      KWD: "د.ك", // Kuwaiti Dinar
    };
    return symbols[currency] || "د.إ"; // Default to AED symbol
  };

  const value = {
    currency,
    setCurrency,
    rate,
    setRate,
    convertPrice,
    getCurrencySymbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);