// frontend/src/pages/AboutPage.jsx
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
} from "@chakra-ui/react";

const AboutPage = () => (
  <Container maxW="container.md" py={10}>
    <VStack spacing={8} align="start">
      <Heading as="h1" size="2xl">
        🧙‍♂️ About Fizzlestick’s Stock Tracker 3000
      </Heading>

      <Box>
        <Text>
          Welcome, brave merchant! This magical tool helps you track and manage your
          shop’s wares with ease. Here’s what you can do:
        </Text>
      </Box>

      {/* 📦 Product Management */}
      <Box>
        <Heading as="h2" size="lg" mb={2}>
          📦 Product Management
        </Heading>
        <VStack as="ul" pl={4} spacing={1}>
          <Text as="li">
            Create new products with a name, price, quantity, and an optional image.
          </Text>
          <Text as="li">Upload a custom image to give each item some flair.</Text>
          <Text as="li">
            Edit any detail at any time using a smooth, styled modal.
          </Text>
          <Text as="li">
            Use quick Sell and Restock buttons to update your stock instantly.
          </Text>
          <Text as="li">Delete products that are no longer for sale.</Text>
        </VStack>
      </Box>

      {/* 📉 Low Stock Warnings */}
      <Box>
        <Heading as="h2" size="lg" mb={2}>
          📉 Low Stock Warnings
        </Heading>
        <VStack as="ul" pl={4} spacing={1}>
          <Text as="li">
            Products below your chosen threshold are marked with a warning icon.
          </Text>
          <Text as="li">
            Set your own threshold in the Inventory Settings.
          </Text>
        </VStack>
      </Box>

      {/* ⚙️ Inventory Settings */}
      <Box>
        <Heading as="h2" size="lg" mb={2}>
          ⚙️ Inventory Settings
        </Heading>
        <VStack as="ul" pl={4} spacing={1}>
          <Text as="li">
            Set your currency label — use symbols like 💰, $, €, ¥, words like
            “Dollar”, “Yen”, or even emojis like 💎.
          </Text>
          <Text as="li">
            Toggle low stock only to focus on what needs restocking.
          </Text>
          <Text as="li">
            Choose how your products are sorted:
            <Box as="ul" pl={6} mt={1}>
              <Text as="li">Quantity (Low → High / High → Low)</Text>
              <Text as="li">Name (A → Z / Z → A)</Text>
              <Text as="li">Price (Low → High / High → Low)</Text>
            </Box>
          </Text>
          <Text as="li">
            Your preferences are saved locally and remembered after refresh.
          </Text>
          <Text as="li">Use “Reset to Defaults” to start fresh.</Text>
        </VStack>
      </Box>

      {/* 🧙‍♀️ Magic Touches */}
      <Box>
        <Heading as="h2" size="lg" mb={2}>
          🧙‍♀️ Magic Touches
        </Heading>
        <VStack as="ul" pl={4} spacing={1}>
          <Text as="li">
            Instant toast messages (e.g. “Product renamed!” or “New price set!”).
          </Text>
          <Text as="li">
            Fully responsive layout that works beautifully on desktop and mobile.
          </Text>
          <Text as="li">
            Styled with care and Chakra UI wizardry.
          </Text>
        </VStack>
      </Box>

      {/* 🔒 Account Features */}
      <Box>
        <Heading as="h2" size="lg" mb={2}>
          🔒 Account Features
        </Heading>
        <VStack as="ul" pl={4} spacing={1}>
          <Text as="li">Create an account and log in securely.</Text>
          <Text as="li">
            Your inventory is private and stored safely under your account.
          </Text>
          <Text as="li">
            Click the top-right user icon to log out when finished.
          </Text>
        </VStack>
      </Box>
    </VStack>
  </Container>
);

export default AboutPage;
