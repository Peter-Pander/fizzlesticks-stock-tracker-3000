import React, { useEffect, useState } from 'react';
import { Box, Heading, VStack, Button, useToast } from '@chakra-ui/react';
import axios from 'axios';

function ChangeLogPage() {
  const [logs, setLogs] = useState([]);
  const toast = useToast();

  // Fetch logs on mount
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    axios
      .get('/api/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error('Error fetching full changelog:', err));
  };

  // Deletes all changelogs
  const handleDeleteHistory = () => {
    if (!window.confirm("Are you sure you want to delete ALL history? This cannot be undone.")) {
      return;
    }
    axios
      .delete('/api/logs')
      .then(() => {
        setLogs([]);
        toast({
          title: "History Deleted",
          description: "All logs have been removed.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(err => {
        console.error('Error deleting logs:', err);
        toast({
          title: "Error",
          description: "Could not delete logs.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box p="6">
      <Heading mb="4">Full History</Heading>

      <VStack spacing="3" align="start">
        {logs.map(log => {
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

      {/* Delete Button */}
      <Button
        colorScheme="red"
        mt={6}
        onClick={handleDeleteHistory}
      >
        Delete Full History
      </Button>
    </Box>
  );
}

export default ChangeLogPage;
