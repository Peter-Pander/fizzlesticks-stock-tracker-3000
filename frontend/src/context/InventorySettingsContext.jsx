import React, { createContext, useContext, useState, useEffect } from "react";

const InventorySettingsContext = createContext();

// default fallback values
const DEFAULT_THRESHOLD = 5;

// recognised sort‑order keys (canonical only)
const VALID_SORT_ORDERS = [
  "qtyLowHigh",     // Quantity: Low → High
  "qtyHighLow",     // Quantity: High → Low
  "nameAZ",         // Name: A → Z
  "nameZA",         // Name: Z → A
  "priceLowHigh",   // Price: Low → High
  "priceHighLow",   // Price: High → Low
];

export const InventorySettingsProvider = ({ children }) => {
  // ─────────────── Low‑stock‑only toggle ───────────────
  const storedShowOnly = localStorage.getItem("inventory_showLowStockOnly");
  const initialShowOnly = storedShowOnly === "true";
  const [showLowStockOnly, setShowLowStockOnly] = useState(initialShowOnly);

  useEffect(() => {
    localStorage.setItem("inventory_showLowStockOnly", String(showLowStockOnly));
  }, [showLowStockOnly]);

  // ─────────────── Low‑stock alerts toggle ───────────────
  const storedAlerts = localStorage.getItem("inventory_showLowStockAlerts");
  // default = true when key not present
  const initialAlerts = storedAlerts !== "false";
  const [showLowStockAlerts, setShowLowStockAlerts] = useState(initialAlerts);

  useEffect(() => {
    localStorage.setItem(
      "inventory_showLowStockAlerts",
      String(showLowStockAlerts)
    );
  }, [showLowStockAlerts]);

  // ─────────────── Sort order ───────────────
  // if the stored value isn’t valid (or missing) fall back to qtyLowHigh
  const storedSort = localStorage.getItem("inventory_sortOrder");
  const initialSortOrder = VALID_SORT_ORDERS.includes(storedSort)
    ? storedSort
    : "qtyLowHigh";

  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  useEffect(() => {
    // only persist if the value is valid — avoids junk keys
    if (VALID_SORT_ORDERS.includes(sortOrder)) {
      localStorage.setItem("inventory_sortOrder", sortOrder);
    }
  }, [sortOrder]);

  // ─────────────── Low‑stock threshold ───────────────
  const storedThreshold = localStorage.getItem("lowStockThreshold");
  const initialThreshold =
    storedThreshold !== null ? parseInt(storedThreshold, 10) : DEFAULT_THRESHOLD;
  const [lowStockThreshold, setLowStockThreshold] = useState(initialThreshold);

  useEffect(() => {
    localStorage.setItem("lowStockThreshold", String(lowStockThreshold));
  }, [lowStockThreshold]);

  // ─────────────── Preferred currency ───────────────
  const initialCurrency = localStorage.getItem("preferredCurrency") || "gold";
  const [preferredCurrency, setPreferredCurrency] = useState(initialCurrency);

  useEffect(() => {
    localStorage.setItem("preferredCurrency", preferredCurrency);
  }, [preferredCurrency]);

  // ─────────────── Reset all settings ───────────────
  const resetSettings = () => {
    setLowStockThreshold(DEFAULT_THRESHOLD);
    setPreferredCurrency("gold");

    // reset to canonical default (Quantity: Low → High)
    setSortOrder("qtyLowHigh");

    setShowLowStockOnly(false);
    setShowLowStockAlerts(true); // default ON

    localStorage.removeItem("lowStockThreshold");
    localStorage.removeItem("preferredCurrency");
    localStorage.removeItem("inventory_sortOrder");
    localStorage.removeItem("inventory_showLowStockOnly");
    localStorage.removeItem("inventory_showLowStockAlerts");
  };

  return (
    <InventorySettingsContext.Provider
      value={{
        showLowStockOnly,
        setShowLowStockOnly,

        // alerts toggle
        showLowStockAlerts,
        setShowLowStockAlerts,

        sortOrder,
        setSortOrder,
        lowStockThreshold,
        setLowStockThreshold,

        // currency settings
        preferredCurrency,
        setPreferredCurrency,

        // reset all settings
        resetSettings,
      }}
    >
      {children}
    </InventorySettingsContext.Provider>
  );
};

export const useInventorySettings = () => useContext(InventorySettingsContext);
