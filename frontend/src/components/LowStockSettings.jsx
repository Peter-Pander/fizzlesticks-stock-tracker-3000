import {
  Box,
  FormLabel,
  NumberInput,
  NumberInputField,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useInventorySettings } from "../context/InventorySettingsContext"; // ✅ updated

const LowStockSettings = () => {
  const {
    lowStockThreshold,
    setLowStockThreshold,
    saveLowStockThreshold,
  } = useInventorySettings(); // ✅ using context now

  const [localValue, setLocalValue] = useState(lowStockThreshold);

  useEffect(() => {
    setLocalValue(lowStockThreshold);
  }, [lowStockThreshold]);

  const handleApply = () => {
    const parsed = parseInt(localValue, 10);
    if (!isNaN(parsed)) {
      setLowStockThreshold(parsed); // ✅ update context
      saveLowStockThreshold();     // ✅ persist it
    } else {
      setLocalValue(lowStockThreshold); // reset to current
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
