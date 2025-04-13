import {
  Box,
  FormLabel,
  NumberInput,
  NumberInputField,
  HStack,
  IconButton
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useProductStore } from "../store/product";

const LowStockSettings = () => {
  const currentThreshold = useProductStore((state) => state.lowStockThreshold);
  const setThreshold = useProductStore((state) => state.setLowStockThreshold);
  const [localValue, setLocalValue] = useState(currentThreshold);

  useEffect(() => {
    setLocalValue(currentThreshold);
  }, [currentThreshold]);

  const handleApply = () => {
    const parsed = parseInt(localValue, 10);
    if (!isNaN(parsed)) {
      setThreshold(parsed);
    } else {
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
