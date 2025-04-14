// src/App.jsx
import React, { useEffect } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import { useProductStore } from "./store/product";
// NEW: Import the provider from our InventorySettingsContext
import { InventorySettingsProvider } from "./context/InventorySettingsContext";

function App() {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    // Wrap the existing app with the InventorySettingsProvider so all components can share settings.
    <InventorySettingsProvider>
      <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
        </Routes>
      </Box>
    </InventorySettingsProvider>
  );
}

export default App;
