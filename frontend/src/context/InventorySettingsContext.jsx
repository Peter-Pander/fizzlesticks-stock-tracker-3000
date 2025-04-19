import React, { createContext, useContext, useState, useEffect } from "react";

const InventorySettingsContext = createContext();

export const InventorySettingsProvider = ({ children }) => {
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("lowToHigh");

  // Load initial threshold from localStorage or default to "5"
  const initialThreshold = localStorage.getItem("lowStockThreshold") || "5";
  const [lowStockThreshold, setLowStockThreshold] = useState(initialThreshold);

  // Save to localStorage manually
  const saveLowStockThreshold = () => {
    localStorage.setItem("lowStockThreshold", lowStockThreshold);
  };

  // Load initial currency label from localStorage or default to "gold"
  const initialCurrency = localStorage.getItem("preferredCurrency") || "gold";
  const [preferredCurrency, setPreferredCurrency] = useState(initialCurrency);

  // Save preferred currency to localStorage
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
        saveLowStockThreshold,

        // new currency settings
        preferredCurrency,
        setPreferredCurrency,
      }}
    >
      {children}
    </InventorySettingsContext.Provider>
  );
};

export const useInventorySettings = () => useContext(InventorySettingsContext);
