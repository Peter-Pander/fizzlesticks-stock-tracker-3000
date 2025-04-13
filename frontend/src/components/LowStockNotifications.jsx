import React from 'react';
import {
  Box,
  Container,
  Heading,
  List,
  ListItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { getLowStockItems } from '../utils/utility';

const LowStockNotifications = ({ inventory, threshold = 5 }) => {
  const lowStockItems = getLowStockItems(inventory, threshold);

  if (lowStockItems.length === 0) {
    return null; // All items are sufficiently stocked.
  }

  // Adaptive colors for light/dark mode
  const bgColor = useColorModeValue("yellow.100", "yellow.300");
  const textColor = useColorModeValue("gray.800", "gray.900");
  const borderColor = useColorModeValue("yellow.300", "yellow.400");

  return (
    <Container>
      <Box
        bg={bgColor}
        color={textColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={4}
        mt={6}
        mb={6}
      >
        <Heading as="h3" size="md" mb={2}>
          Low Stock Notifications
        </Heading>
        <List spacing={2}>
          {lowStockItems.map((item) => (
            <ListItem key={item.id}>
              <Text>
                {item.name} is low on stock: Only {item.quantity} left.
              </Text>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default LowStockNotifications;
