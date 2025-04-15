import React, { useEffect } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import ChangeLogPage from "./pages/ChangeLogPage"; // Import the changelog page
import Navbar from "./components/Navbar";
import { useProductStore } from "./store/product";
// Import providers for InventorySettings and Auth
import { InventorySettingsProvider } from "./context/InventorySettingsContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <AuthProvider>
      <InventorySettingsProvider>
        <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/changelog" element={<ChangeLogPage />} />
          </Routes>
        </Box>
      </InventorySettingsProvider>
    </AuthProvider>
  );
}

export default App;
