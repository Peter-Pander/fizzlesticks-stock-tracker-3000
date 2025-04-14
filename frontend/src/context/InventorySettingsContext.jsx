import React, { createContext, useContext, useState } from "react";

const InventorySettingsContext = createContext();

export const InventorySettingsProvider = ({ children }) => {
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("lowToHigh");

  return (
    <InventorySettingsContext.Provider
      value={{ showLowStockOnly, setShowLowStockOnly, sortOrder, setSortOrder }}
    >
      {children}
    </InventorySettingsContext.Provider>
  );
};

export const useInventorySettings = () => useContext(InventorySettingsContext);
