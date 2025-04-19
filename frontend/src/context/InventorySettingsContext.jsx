import React, { createContext, useContext, useState, useEffect } from "react";

const InventorySettingsContext = createContext();

// default fallback
const DEFAULT_THRESHOLD = 5;

export const InventorySettingsProvider = ({ children }) => {
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("lowToHigh");

  // Load initial threshold from localStorage or fallback
  const storedThreshold = localStorage.getItem("lowStockThreshold");
  const initialThreshold =
    storedThreshold !== null ? parseInt(storedThreshold, 10) : DEFAULT_THRESHOLD;
  const [lowStockThreshold, setLowStockThreshold] = useState(initialThreshold);

  // Auto‑persist threshold whenever it changes
  useEffect(() => {
    localStorage.setItem("lowStockThreshold", String(lowStockThreshold));
  }, [lowStockThreshold]);

  // Load initial currency label from localStorage or default to "gold"
  const initialCurrency = localStorage.getItem("preferredCurrency") || "gold";
  const [preferredCurrency, setPreferredCurrency] = useState(initialCurrency);

  // Save preferred currency to localStorage automatically
  useEffect(() => {
    localStorage.setItem("preferredCurrency", preferredCurrency);
  }, [preferredCurrency]);

  return (
    <InventorySettingsContext.Provider
      value={{
        showLowStockOnly,
        setShowLowStockOnly,
        sortOrder,
        setSortOrder,
        lowStockThreshold,
        setLowStockThreshold,

        // currency settings
        preferredCurrency,
        setPreferredCurrency,
      }}
    >
      {children}
    </InventorySettingsContext.Provider>
  );
};

export const useInventorySettings = () => useContext(InventorySettingsContext);
