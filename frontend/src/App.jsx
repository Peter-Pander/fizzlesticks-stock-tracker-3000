import React, { useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";           // ← Added AboutPage import
import ChangeLogPage from "./pages/ChangeLogPage";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Navbar from "./components/Navbar";
import { useProductStore } from "./store/product";
// Import providers for InventorySettings and Auth
import { InventorySettingsProvider } from "./context/InventorySettingsContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <InventorySettingsProvider>
        <AppContent />
      </InventorySettingsProvider>
    </AuthProvider>
  );
}

// This inner component runs inside AuthProvider, so AuthContext is defined here
function AppContent() {
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [fetchProducts, user]);

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.100", "gray.900")}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/changelog" element={<ChangeLogPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Box>
  );
}

export default App;
