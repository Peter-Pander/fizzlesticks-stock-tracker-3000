import React, { createContext, useContext, useState, useEffect } from "react";

const InventorySettingsContext = createContext();

// default fallback
const DEFAULT_THRESHOLD = 5;

export const InventorySettingsProvider = ({ children }) => {
  // ─────────────── Low‑stock‑only toggle ───────────────
  const storedShowOnly = localStorage.getItem("inventory_showLowStockOnly");
  const initialShowOnly = storedShowOnly === "true";
  const [showLowStockOnly, setShowLowStockOnly] = useState(initialShowOnly);

  useEffect(() => {
    localStorage.setItem("inventory_showLowStockOnly", String(showLowStockOnly));
  }, [showLowStockOnly]);

  // ─────────────── NEW: Low‑stock alerts toggle ───────────────
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
  const initialSortOrder =
    localStorage.getItem("inventory_sortOrder") || "lowToHigh";
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  useEffect(() => {
    localStorage.setItem("inventory_sortOrder", sortOrder);
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
    setSortOrder("lowToHigh");
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

        // NEW: alerts toggle
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
