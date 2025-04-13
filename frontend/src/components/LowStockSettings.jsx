// src/components/LowStockSettings.jsx
import { Box, FormLabel, NumberInput, NumberInputField, HStack, IconButton } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useProductStore } from "../store/product";

const LowStockSettings = () => {
  // Get the global threshold and setter
  const currentThreshold = useProductStore((state) => state.lowStockThreshold);
  const setThreshold = useProductStore((state) => state.setLowStockThreshold);

  // Local state to manage the input value without immediately updating the global state
  const [localValue, setLocalValue] = useState(currentThreshold);

  // When the global threshold changes, update the local value as well
  useEffect(() => {
    setLocalValue(currentThreshold);
  }, [currentThreshold]);

  // When the Apply button is clicked, update the global threshold if the input is valid
  const handleApply = () => {
    const parsed = parseInt(localValue, 10);
    if (!isNaN(parsed)) {
      setThreshold(parsed);
    } else {
      // Revert to current global value if the input is invalid
      setLocalValue(currentThreshold);
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
          borderColor="black"
          focusBorderColor="black"
        >
          <NumberInputField borderColor="black" focusBorderColor="black" />
        </NumberInput>
        <IconButton
          aria-label="Apply Threshold"
          icon={<CheckIcon />}
          size="sm"
          onClick={handleApply}
        />
      </HStack>
    </Box>
  );
};

export default LowStockSettings;
