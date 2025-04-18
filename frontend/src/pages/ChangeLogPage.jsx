import React, { useEffect, useState, useContext } from "react";
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
import { AuthContext } from "../context/AuthContext";

function ChangeLogPage() {
  const [logs, setLogs] = useState([]);
  const toast = useToast();
  const { token } = useContext(AuthContext);

  if (!token) return <Text>Loading...</Text>;

  const fetchLogs = () => {
    if (!token) return; // skip if token not available yet

    axios
      .get("/api/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Error fetching full changelog:", err));
  };

  useEffect(fetchLogs, [token]); // re-run when token becomes available

  const handleDeleteConfirmed = () => {
    if (!token) return; // skip if token not available

    axios
      .delete("/api/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setLogs([]);
        toast.closeAll();
        toast({
          title: "Inventory History Deleted",
          description:
            "The full history of inventory changes has been cleared.",
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

          // determine changeText based on action: created, deleted, restocked, or sold
          const before = log.previousQuantity;
          const after = log.newQuantity;
          let changeText;

          if (log.action === "created") {
            changeText = `created (was 0 → now ${after})`;
          } else if (log.action === "deleted") {
            changeText = `deleted (was ${before} → now 0)`;
          } else if (log.action === "restocked") {
            const added = after - before;
            changeText = `was ${before}, ${added} restocked → now ${after}`;
          } else {
            const sold = before - after;
            changeText = `was ${before}, ${sold} sold → now ${after}`;
          }

          return (
            <Box key={log._id}>
              🕒 {date} – {log.itemName} {changeText}
            </Box>
          );
        })}
      </VStack>

      {/* Only render the delete button if there is history */}
      {logs.length > 0 && (
        <Button colorScheme="red" mt={4} onClick={handleDeleteHistory}>
          Delete Full History
        </Button>
      )}
    </Box>
  );
}

export default ChangeLogPage;
