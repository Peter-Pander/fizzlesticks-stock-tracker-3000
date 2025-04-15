import React, { useState } from "react";
import {
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useColorMode,
  Input,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
  MenuItem,
  Checkbox,
  Select,
  useToast,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PlusSquareIcon, EditIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaCog } from "react-icons/fa";

// Import your context & the ChangelogDropdown
import { useInventorySettings } from "../context/InventorySettingsContext";
import ChangeLogDropdown from "./ChangeLogDropdown"; // <--- Add this

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  // Inventory settings from context
  const {
    showLowStockOnly,
    setShowLowStockOnly,
    sortOrder,
    setSortOrder,
    lowStockThreshold,
    setLowStockThreshold,
  } = useInventorySettings();

  // Helper to confirm threshold
  const confirmThresholdChange = (e) => {
    e.stopPropagation();
    toast({
      title: "Threshold updated",
      description: `Low stock threshold is now ${lowStockThreshold}`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Container maxW={"1140px"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{ base: "column", sm: "row" }}
      >
        {/* --- App Title --- */}
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
        >
          <Link to={"/"}> ✨ Fizzlestick's Stock Tracker 3000 🔮✨ </Link>
        </Text>

        {/* --- Right side icons: create, color mode, settings, changelog --- */}
        <HStack spacing={2} alignItems={"center"}>
          {/* Create new product button */}
          <Link to={"/create"}>
            <Button>
              <PlusSquareIcon fontSize={20} />
            </Button>
          </Link>

          {/* Toggle light/dark mode */}
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
          </Button>

          {/* Gear icon: Inventory Settings */}
          <Menu closeOnSelect={false}>
            <MenuButton as={Button}>
              <FaCog />
            </MenuButton>
            <MenuList>
              <MenuGroup>
                {/* Inventory Settings Title */}
                <Text fontSize="lg" fontWeight="bold" px={4} py={2}>
                  Inventory Settings
                </Text>

                {/* 1. Low Stock Threshold */}
                <MenuItem
                  onClick={(e) => e.stopPropagation()}
                  _hover={{ bg: "transparent" }}
                  tabIndex={-1}
                >
                  <VStack spacing={2} w="full">
                    <Text fontSize="md" alignSelf="flex-start">
                      Low Stock Threshold
                    </Text>
                    <Input
                      placeholder="Threshold"
                      type="number"
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      width="full"
                    />
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={confirmThresholdChange}
                    >
                      Confirm
                    </Button>
                  </VStack>
                </MenuItem>

                <MenuDivider />

                {/* 2. Show low stock only */}
                <MenuItem
                  onClick={(e) => e.stopPropagation()}
                  _hover={{ bg: "transparent" }}
                  tabIndex={-1}
                >
                  <Checkbox
                    isChecked={showLowStockOnly}
                    onChange={(e) => setShowLowStockOnly(e.target.checked)}
                  >
                    Show low stock only
                  </Checkbox>
                </MenuItem>

                <MenuDivider />

                {/* 3. Sort Order Dropdown */}
                <MenuItem
                  onClick={(e) => e.stopPropagation()}
                  _hover={{ bg: "transparent" }}
                  tabIndex={-1}
                >
                  <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    width="full"
                  >
                    <option value="lowToHigh">
                      Sort by Quantity: Low → High
                    </option>
                    <option value="highToLow">
                      Sort by Quantity: High → Low
                    </option>
                  </Select>
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>

          {/* Changelog icon: separate from gear, use EditIcon */}
          <ChangeLogDropdown />
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
