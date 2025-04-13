import { Container, SimpleGrid, Text, VStack, Checkbox, Stack, Select } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/product';
import ProductCard from '../components/ProductCard';
import LowStockNotifications from '../components/LowStockNotifications';

const HomePage = () => {
  const { fetchProducts, products, lowStockThreshold } = useProductStore();
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("lowToHigh");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter by "low stock" if selected and then sort by quantity
  const sortedFilteredProducts = products
    .filter(product =>
      showLowStockOnly ? product.quantity < lowStockThreshold : true
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") {
        return a.quantity - b.quantity;
      }
      // sortOrder is "highToLow"
      return b.quantity - a.quantity;
    });

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
          <LowStockNotifications />
        </VStack>

        {/* Filter and Sort Controls */}
        <Stack direction={["column", "row"]} w="full" justify="space-between" align="center">
          <Checkbox
            isChecked={showLowStockOnly}
            onChange={(e) => setShowLowStockOnly(e.target.checked)}
          >
            Show low stock only
          </Checkbox>
          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            width="auto"
          >
            <option value="lowToHigh">Sort by Quantity: Low → High</option>
            <option value="highToLow">Sort by Quantity: High → Low</option>
          </Select>
        </Stack>

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
          {sortedFilteredProducts.map(product => (
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
            No products found 😢{" "}
            <Link to={"/create"}>
              <Text
                as="span"
                color="blue.500"
                _hover={{ textDecoration: "underline" }}
              >
                Create a product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
