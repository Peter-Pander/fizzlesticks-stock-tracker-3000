import {
  Box,
  FormLabel,
  NumberInput,
  NumberInputField,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useState, useEffect, useRef } from "react";
import { useInventorySettings } from "../context/InventorySettingsContext";

// NOTE: accept `isOpen` so we can reset on dropdown open
const LowStockSettings = ({ isOpen }) => {
  const toast = useToast();
  const {
    lowStockThreshold,
    setLowStockThreshold,
  } = useInventorySettings(); // using context now

  // local copy for the NumberInput
  const [localValue, setLocalValue] = useState(lowStockThreshold);

  // keep in sync if user saved elsewhere or threshold changed externally
  useEffect(() => {
    setLocalValue(lowStockThreshold);
  }, [lowStockThreshold]);

  // track previous open state
  const prevIsOpenRef = useRef(isOpen);

  // whenever the dropdown opens (transition false → true), reset to saved threshold
  useEffect(() => {
    const wasClosed = !prevIsOpenRef.current;
    if (isOpen && wasClosed) {
      setLocalValue(lowStockThreshold);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, lowStockThreshold]);

  const handleApply = () => {
    const parsed = parseInt(localValue, 10);
    if (!isNaN(parsed)) {
      setLowStockThreshold(parsed); // update context
      toast({
        title: "Threshold updated",
        description: `Low stock threshold is now ${parsed}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      setLocalValue(lowStockThreshold); // reset to current if invalid
    }
  };

  return (
    <Box mb={4}>
      <HStack align="center" spacing={2}>
        <FormLabel fontWeight="bold" mb={0}>
          Low Stock Threshold
        </FormLabel>

        <NumberInput
          min={1}
          value={localValue}
          onChange={(valueString) => setLocalValue(valueString)}
          maxW="100px"
        >
          <NumberInputField
            borderColor="black"
            _hover={{ borderColor: "black" }}
            _focus={{ borderColor: "black", boxShadow: "none" }}
          />
        </NumberInput>

        <IconButton
          aria-label="Apply Threshold"
          icon={<CheckIcon color="black" />}
          size="sm"
          onClick={handleApply}
          variant="outline"
          border="1px"
          borderColor="black"
          h="38px"
          minW="38px"
          _hover={{ borderColor: "black", bg: "transparent" }}
          _active={{ borderColor: "black", bg: "transparent" }}
          _focus={{ borderColor: "black", boxShadow: "none" }}
        />
      </HStack>
    </Box>
  );
};

export default LowStockSettings;
