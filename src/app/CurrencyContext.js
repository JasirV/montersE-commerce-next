"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CurrencyContext = createContext({
  currency: "AED",
  setCurrency: () => {},
  rate: 1,
  setRate: () => {}, // Add this
  convertPrice: () => {},
  getCurrencySymbol: () => {},
});

export const CurrencyProvider = ({ children }) => {
  const BASE_CURRENCY = "AED";

  const [currency, setCurrency] = useState("AED");
  const [rate, setRate] = useState(1);

  // 🔁 Fetch exchange rate when currency changes
  useEffect(() => {
    const fetchRate = async () => {
      if (currency === BASE_CURRENCY) {
        setRate(1);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:9000/api/Auth/CurrencyAPI", // Make sure this endpoint matches your backend
          {
            params: {
              amount: 1,
              from: BASE_CURRENCY,
              to: currency,
            },
          }
        );

        // Adjust based on your API response structure
        if (res.data && res.data.rate !== undefined) {
          setRate(res.data.rate);
        } else if (res.data && res.data.converted !== undefined) {
          setRate(res.data.converted);
        } else {
          setRate(1);
        }
      } catch (error) {
        console.error("Currency fetch error:", error);
        setRate(1);
      }
    };

    fetchRate();
  }, [currency]);

  // 💰 Convert prices
  const convertPrice = (price) => {
    return Number(price * rate).toFixed(2);
  };

  // 💱 Currency symbols
  const getCurrencySymbol = (currencyCode = currency) => {
    const symbols = {
      AED: "AED",
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      CAD: "CA$",
      AUD: "A$",
      INR: "₹",
      SAR: "﷼",
      QAR: "﷼",
      KWD: "د.ك",
      EGP: "E£",
      ERN: "Nfk",
      ETB: "Br",
      FJD: "FJ$",
      FKP: "FK£",
      GEL: "₾",
      GGP: "GGP£",
      GHS: "GH₵",
      GIP: "GI£",
      GMD: "D",
      GNF: "FG",
    };

    return symbols[currencyCode] || "AED";
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rate,
        setRate, // Expose setRate
        convertPrice,
        getCurrencySymbol,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);