import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useToast,
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
  useColorModeValue,
  Tooltip,
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { PlusSquareIcon, CheckIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FaCog, FaUser, FaInfoCircle } from "react-icons/fa";

// Import your contexts & the ChangelogDropdown
import { useInventorySettings } from "../context/InventorySettingsContext";
import ChangeLogDropdown from "./ChangeLogDropdown";

// NEW: import AuthContext
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const emailColor = useColorModeValue("black", "white");
  const navigate = useNavigate();

  // NEW: pull user + logout
  const { user, logout } = useContext(AuthContext);

  // Inventory settings from context
  const {
    showLowStockOnly,
    setShowLowStockOnly,
    sortOrder,
    setSortOrder,
    lowStockThreshold,
    setLowStockThreshold,
    saveLowStockThreshold,

    // currency settings
    preferredCurrency,
    setPreferredCurrency,
    savePreferredCurrency,
  } = useInventorySettings();

  // track settings-dropdown open/close
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  // LOCAL INPUT STATES for threshold & currency, so we can reset them on-open
  const [thresholdInput, setThresholdInput] = useState(
    lowStockThreshold.toString()
  );
  const [currencyInput, setCurrencyInput] = useState(preferredCurrency);

  // keep locals in sync if context values change externally
  useEffect(() => {
    setThresholdInput(lowStockThreshold.toString());
  }, [lowStockThreshold]);

  useEffect(() => {
    setCurrencyInput(preferredCurrency);
  }, [preferredCurrency]);

  // detect closed→open transition to reset inputs
  const prevOpenRef = useRef(false);
  useEffect(() => {
    const wasClosed = !prevOpenRef.current;
    if (isSettingsOpen && wasClosed) {
      // dropdown just opened
      setThresholdInput(lowStockThreshold.toString());
      setCurrencyInput(preferredCurrency);
    }
    prevOpenRef.current = isSettingsOpen;
  }, [isSettingsOpen, lowStockThreshold, preferredCurrency]);

  // Helper to confirm threshold
  const confirmThresholdChange = (e, newValue) => {
    e.stopPropagation();
    toast({
      title: "Threshold updated",
      description: `Low stock threshold is now ${newValue}`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // helper to confirm currency change
  const confirmCurrencyChange = (e, newValue) => {
    e.stopPropagation();
    toast({
      title: "Currency updated",
      description: `Currency label set to "${newValue}"`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // NEW: logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
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

        {/* --- Right side icons: create, color mode, settings, changelog, user --- */}
        <HStack spacing={2} alignItems={"center"}>
          {/* Create new product button */}
          <Button
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
            <PlusSquareIcon fontSize={20} />
          </Button>

          {/* Toggle light/dark mode */}
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
          </Button>

          {/* Gear icon: Inventory Settings */}
          <Menu
            closeOnSelect={false}
            isOpen={isSettingsOpen}
            onOpen={onSettingsOpen}
            onClose={onSettingsClose}
          >
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
                  _focus={{ bg: "transparent" }}
                  _active={{ bg: "transparent" }}
                  tabIndex={-1}
                >
                  <VStack spacing={2} w="full">
                    <Text fontSize="md" alignSelf="flex-start">
                      Low Stock Threshold
                    </Text>
                    <Flex gap={2} w="full">
                      <Input
                        placeholder="Threshold"
                        type="number"
                        value={thresholdInput}                             // ← local state
                        onChange={(e) => setThresholdInput(e.target.value)}// ← local update
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        width="full"
                        bg="transparent"
                        _focus={{ bg: "transparent", boxShadow: "none" }}
                        _active={{ bg: "transparent" }}
                      />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          const parsed = parseInt(thresholdInput, 10);
                          if (!isNaN(parsed)) {
                            setLowStockThreshold(parsed);    // update context
                            saveLowStockThreshold();         // persist
                            confirmThresholdChange(e, parsed);
                          } else {
                            setThresholdInput(
                              lowStockThreshold.toString()
                            ); // reset if invalid
                          }
                        }}
                        size="sm"
                        variant="outline"
                        h="38px"
                        minW="38px"
                        px={2}
                        borderRadius="md"
                        borderColor={useColorModeValue(
                          "gray.300",
                          "gray.600"
                        )}
                        _hover={{
                          bg: useColorModeValue("gray.100", "gray.700"),
                          borderColor: useColorModeValue(
                            "gray.400",
                            "gray.500"
                          ),
                        }}
                        _focus={{ boxShadow: "none" }}
                      >
                        <CheckIcon
                          color={useColorModeValue("gray.700", "gray.100")}
                        />
                      </Button>
                    </Flex>
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
                    onChange={(e) =>
                      setShowLowStockOnly(e.target.checked)
                    }
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

                <MenuDivider />

                {/* 4. Currency Label */}
                <MenuItem
                  onClick={(e) => e.stopPropagation()}                  _hover={{ bg: "transparent" }}
                  tabIndex={-1}
                >
                  <VStack spacing={2} w="full">
                    <Flex align="center" gap={1} alignSelf="flex-start">
                      <Text fontSize="md">Currency Label</Text>
                      <Tooltip
                        label="You can use symbols (e.g. $), words (e.g. Dollar, Yen), or even emojis."
                        fontSize="sm"
                        hasArrow
                        placement="right"
                        bg={useColorModeValue("gray.700", "gray.300")}
                        color={useColorModeValue("white", "black")}
                      >
                        <Box cursor="help">
                          <FaInfoCircle />
                        </Box>
                      </Tooltip>
                    </Flex>

                    <Flex gap={2} w="full" align="center">
                      <Input
                        placeholder="Enter currency label"
                        value={currencyInput}                                        // ← local state
                        onChange={(e) => setCurrencyInput(e.target.value)}          // ← local update
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        width="full"
                        bg="transparent"
                        _focus={{ bg: "transparent", boxShadow: "none" }}
                        _active={{ bg: "transparent" }}
                      />
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreferredCurrency(currencyInput);   // update context
                          savePreferredCurrency();               // persist
                          confirmCurrencyChange(e, currencyInput);
                        }}
                        size="sm"
                        variant="outline"
                        h="38px"
                        minW="38px"
                        px={2}
                        borderRadius="md"
                        borderColor={useColorModeValue(
                          "gray.300",
                          "gray.600"
                        )}
                        _hover={{
                          bg: useColorModeValue("gray.100", "gray.700"),
                          borderColor: useColorModeValue(
                            "gray.400",
                            "gray.500"
                          ),
                        }}
                        _focus={{ boxShadow: "none" }}
                      >
                        <CheckIcon
                          color={useColorModeValue("gray.700", "gray.100")}
                        />
                      </Button>
                    </Flex>
                  </VStack>
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>

          {/* Changelog icon */}
          <ChangeLogDropdown />

          {/* NEW: User icon menu */}
          {user ? (
            <Menu>
              <MenuButton as={Button}>
                <FaUser />
              </MenuButton>
              <MenuList>
                {/* email text now black in light / white in dark */}
                <MenuItem
                  isDisabled
                  color={emailColor}
                  _disabled={{ color: emailColor, opacity: 1 }}
                >
                  {user.email}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={handleLogout}
                  bg="transparent"
                  _hover={{ bg: "gray.600", color: "white" }}
                  _active={{ bg: "transparent" }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button as={Link} to="/login" fontWeight="medium">
              Login
            </Button>
          )}
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
