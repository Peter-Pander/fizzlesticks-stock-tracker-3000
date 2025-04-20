import React, { createContext, useContext, useState, useEffect } from "react";

const InventorySettingsContext = createContext();

// default fallback
const DEFAULT_THRESHOLD = 5;

export const InventorySettingsProvider = ({ children }) => {
  // Load initial showLowStockOnly from localStorage or default to false
  const storedShowOnly = localStorage.getItem("inventory_showLowStockOnly");
  const initialShowOnly = storedShowOnly === "true";

  const [showLowStockOnly, setShowLowStockOnly] = useState(initialShowOnly);

  // Save showLowStockOnly to localStorage automatically
  useEffect(() => {
    localStorage.setItem("inventory_showLowStockOnly", String(showLowStockOnly));
  }, [showLowStockOnly]);

  // Load initial sortOrder from localStorage or default to "lowToHigh"
  const initialSortOrder = localStorage.getItem("inventory_sortOrder") || "lowToHigh";
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  // Save sortOrder to localStorage automatically
  useEffect(() => {
    localStorage.setItem("inventory_sortOrder", sortOrder);
  }, [sortOrder]);

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
