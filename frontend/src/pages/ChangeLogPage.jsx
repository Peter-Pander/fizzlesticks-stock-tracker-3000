import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Button,
  useToast,
  useColorModeValue,
  Flex,
  Text,
} from "@chakra-ui/react";
import axios from "axios";

function ChangeLogPage() {
  const [logs, setLogs] = useState([]);
  const toast = useToast();

  const fetchLogs = () => {
    axios
      .get("/api/logs")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Error fetching full changelog:", err));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDeleteConfirmed = () => {
    axios
      .delete("/api/logs")
      .then(() => {
        setLogs([]);
        toast.closeAll();
        toast({
          title: "Inventory History Deleted",
          description: "The full history of inventory changes has been cleared.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error("Error deleting logs:", err);
        toast({
          title: "Error",
          description: "Could not delete logs.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleDeleteHistory = () => {
    toast.closeAll();
    toast({
      position: "top",
      duration: null,
      render: ({ onClose }) => {
        const bg = useColorModeValue("white", "gray.700");
        const color = useColorModeValue("black", "white");
        const borderColor = useColorModeValue("gray.200", "gray.600");
        return (
          <Box
            bg={bg}
            color={color}
            p={5}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
            shadow="md"
          >
            <Text fontWeight="bold" mb={2}>
              Are you sure you want to delete ALL history?
            </Text>
            <Flex justify="flex-end" gap={2}>
              <Button colorScheme="red" onClick={handleDeleteConfirmed}>
                Delete
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </Flex>
          </Box>
        );
      },
    });
  };

  return (
    <Box p="6">
      <Heading mb="4">Full History</Heading>

      <VStack spacing="3" align="start" mb="6">
        {logs.map((log) => {
          const date = new Date(log.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
          });
          const changeText =
            log.previousQuantity === 0
              ? `restocked: 0 → ${log.newQuantity}`
              : `${log.previousQuantity} → ${log.newQuantity}`;

          return (
            <Box key={log._id}>
              🕒 {date} – {log.itemName} {changeText}
            </Box>
          );
        })}
      </VStack>

      <Button colorScheme="red" mt={4} onClick={handleDeleteHistory}>
        Delete Full History
      </Button>
    </Box>
  );
}

export default ChangeLogPage;
