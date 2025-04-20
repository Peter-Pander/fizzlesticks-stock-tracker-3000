// src/pages/HomePage.jsx
import { Container, SimpleGrid, Text, VStack, useToast } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";
import LowStockNotifications from "../components/LowStockNotifications";
import { useInventorySettings } from "../context/InventorySettingsContext"; // Shared context

const HomePage = () => {
  const { fetchProducts, products } = useProductStore();
  const { showLowStockOnly, sortOrder, lowStockThreshold } =
    useInventorySettings();

  const { user } = useContext(AuthContext);
  const toast = useToast(); // ← hook for toasts
  const navigate = useNavigate(); // ← hook for navigation

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [fetchProducts, user]);

  // Helper: compare two products based on the current sortOrder
  const sortComparator = (a, b) => {
    switch (sortOrder) {
      // Quantity
      case "qtyLowHigh":
        return a.quantity - b.quantity;
      case "qtyHighLow":
        return b.quantity - a.quantity;

      // Name (case‑insensitive)
      case "nameAZ":
        return (a.name ?? a.title ?? "")
          .toLowerCase()
          .localeCompare((b.name ?? b.title ?? "").toLowerCase());
      case "nameZA":
        return (b.name ?? b.title ?? "")
          .toLowerCase()
          .localeCompare((a.name ?? a.title ?? "").toLowerCase());

      // Price
      case "priceLowHigh":
        return a.price - b.price;
      case "priceHighLow":
        return b.price - a.price;

      // Fallback (leave order unchanged)
      default:
        return 0;
    }
  };

  // 🔒 Only show products if there's a logged-in user
  const sortedFilteredProducts = user
    ? products
        .filter((product) =>
          showLowStockOnly
            ? product.quantity < Number(lowStockThreshold)
            : true
        )
        .sort(sortComparator)
    : [];

  return (
    <Container maxW={"container.xl"} py={12}>
      <VStack spacing={8}>
        {/* Heading and Low Stock Notifications */}
        <VStack spacing={4} w="full">
          <Text
            fontSize={"30"}
            fontWeight={"bold"}
            bgGradient={"linear(to-r, cyan.400, blue.500)"}
            bgClip={"text"}
            textAlign={"center"}
          >
            Inventory
          </Text>
          {/* only show notifications when user is logged in */}
          {user && <LowStockNotifications />}
        </VStack>

        {/* Product List */}
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
          }}
          spacing={10}
          w={"full"}
        >
          {sortedFilteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>

        {sortedFilteredProducts.length === 0 && (
          <Text
            fontSize="xl"
            textAlign={"center"}
            fontWeight="bold"
            color="gray.500"
          >
            Nothing in stock right now 😢{" "}
            <Text
              as="span"
              color="blue.500"
              cursor="pointer"
              _hover={{ textDecoration: "underline" }}
              onClick={() => {
                if (!user) {
                  toast({
                    title: "Unauthorized",
                    description: "You must be logged in to create a product.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                } else {
                  navigate("/create");
                }
              }}
            >
              Let's add your first product!
            </Text>
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
