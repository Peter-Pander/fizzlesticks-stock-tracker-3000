import React, { useEffect, useState } from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react';
import axios from 'axios';

function ChangeLogPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/api/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error('Error fetching full changelog:', err));
  }, []);

  return (
    <Box p="6">
      <Heading mb="4">Full History</Heading>
      <VStack spacing="3" align="start">
        {logs.map(log => {
          const date = new Date(log.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
          });
          const changeText = log.previousQuantity === 0
            ? `restocked: 0 → ${log.newQuantity}`
            : `${log.previousQuantity} → ${log.newQuantity}`;
          return (
            <Box key={log._id}>
              🕒 {date} – {log.itemName} {changeText}
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}

export default ChangeLogPage;
