// frontend/src/pages/AboutPage.jsx
import {
  Container,
  VStack,
  Heading,
  Text,
  Box,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";

const AboutPage = () => (
  <Container maxW="container.md" py={10}>
    <VStack spacing={10} align="start">
      {/* Title */}
      <Box mt={5}>
        <Heading as="h1" size="2xl" mb={2}>
          🧙‍♂️ About Fizzlestick’s Stock Tracker 3000
        </Heading>
        <Text>
          Welcome, brave merchant! This magical tool helps you track and manage your
          shop’s wares with ease. Here’s what you can do:
        </Text>
      </Box>

      {/* 📦 Product Management */}
      <Box>
        <Heading as="h2" size="lg" mb={3}>
          📦 Product Management
        </Heading>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>
            Create new products with a name, price, quantity, and an optional image.
          </ListItem>
          <ListItem>Upload a custom image to give each item some flair.</ListItem>
          <ListItem>Edit any detail at any time using a smooth, styled modal.</ListItem>
          <ListItem>
            Use quick Sell and Restock buttons to update your stock instantly.
          </ListItem>
          <ListItem>Delete products that are no longer for sale.</ListItem>
        </UnorderedList>
      </Box>

      {/* 📉 Low Stock Warnings */}
      <Box>
        <Heading as="h2" size="lg" mb={3}>
          📉 Low Stock Warnings
        </Heading>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>
            Products below your chosen threshold are marked with a warning icon.
          </ListItem>
          <ListItem>Set your own threshold in the Inventory Settings.</ListItem>
        </UnorderedList>
      </Box>

      {/* ⚙️ Inventory Settings */}
      <Box>
        <Heading as="h2" size="lg" mb={3}>
          ⚙️ Inventory Settings
        </Heading>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>
            Set your currency label — use symbols like $, €, ¥, words like
            “Dollar”, “Yen”, or even emojis like 💎.
          </ListItem>
          <ListItem>
            Toggle low stock only to focus on what needs restocking.
          </ListItem>
          <ListItem>
            Choose how your products are sorted:
            <UnorderedList spacing={1} pl={6} mt={1}>
              <ListItem>Quantity (Low → High / High → Low)</ListItem>
              <ListItem>Name (A → Z / Z → A)</ListItem>
              <ListItem>Price (Low → High / High → Low)</ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            Your preferences are saved locally and remembered after refresh.
          </ListItem>
          <ListItem>Use “Reset to Defaults” to start fresh.</ListItem>
        </UnorderedList>
      </Box>

      {/* 🧙‍♀️ Magic Touches */}
      <Box>
        <Heading as="h2" size="lg" mb={3}>
          🧙‍♀️ Magic Touches
        </Heading>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>
            Instant toast messages (e.g. “Product renamed!” or “New price set!”).
          </ListItem>
          <ListItem>
            Fully responsive layout that works beautifully on desktop and mobile.
          </ListItem>
          <ListItem>Styled with care and Chakra UI wizardry.</ListItem>
        </UnorderedList>
      </Box>

      {/* 🔒 Account Features */}
      <Box>
        <Heading as="h2" size="lg" mb={3}>
          🔒 Account Features
        </Heading>
        <UnorderedList spacing={2} pl={5}>
          <ListItem>Create an account and log in securely.</ListItem>
          <ListItem>
            Your inventory is private and stored safely under your account.
          </ListItem>
          <ListItem>
            Click the top-right user icon to log out when finished.
          </ListItem>
        </UnorderedList>
      </Box>
    </VStack>
  </Container>
);

export default AboutPage;
