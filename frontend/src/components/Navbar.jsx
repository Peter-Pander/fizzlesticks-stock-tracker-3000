import { Button, Container, Flex, HStack, Text, useColorMode, Input, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaCog } from "react-icons/fa";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuDivider,
  MenuItem,
  Checkbox,
  Select,
} from '@chakra-ui/react';
import { useInventorySettings } from "../context/InventorySettingsContext";
import { useToast } from "@chakra-ui/react";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const {
    showLowStockOnly,
    setShowLowStockOnly,
    sortOrder,
    setSortOrder,
    lowStockThreshold,
    setLowStockThreshold,
  } = useInventorySettings();

  // Optional function to confirm threshold change with a toast message.
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

        <HStack spacing={2} alignItems={"center"}>
          <Link to={"/create"}>
            <Button>
              <PlusSquareIcon fontSize={20} />
            </Button>
          </Link>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
          </Button>
          {/* Gear icon dropdown for inventory settings */}
          <Menu closeOnSelect={false}>
            <MenuButton as={Button}>
              <FaCog />
            </MenuButton>
            <MenuList>
              <MenuGroup title="Inventory Settings">
                <MenuItem onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    isChecked={showLowStockOnly}
                    onChange={(e) => setShowLowStockOnly(e.target.checked)}
                  >
                    Show low stock only
                  </Checkbox>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    width="full"
                  >
                    <option value="lowToHigh">Sort by Quantity: Low → High</option>
                    <option value="highToLow">Sort by Quantity: High → Low</option>
                  </Select>
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={(e) => e.stopPropagation()}>
                  <VStack spacing={2} w="full">
                    <Text fontSize="sm">Low Stock Threshold</Text>
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
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      Confirm
                    </Button>
                  </VStack>
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
