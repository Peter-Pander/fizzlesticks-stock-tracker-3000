import React, { useEffect, useState } from "react";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Text,
} from "@chakra-ui/react";
import { FaRegClock } from "react-icons/fa6";
import axios from "axios";

function ChangeLogDropdown() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get("/api/logs")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  return (
    <Flex align="center" gap={2}>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FaRegClock />}
          aria-label="Changelog"
        />
        <MenuList>
          <Box px={3} py={2}>
            <Text fontWeight="bold">Recent Inventory Changes</Text>
          </Box>
          {logs.slice(0, 5).map((log) => {
            const date = new Date(log.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            });
            const changeText =
              log.previousQuantity === 0
                ? `restocked: 0 → ${log.newQuantity}`
                : `${log.previousQuantity} → ${log.newQuantity}`;

            return (
              <MenuItem
                key={log._id}
                _hover={{ bg: "transparent" }}
                _focus={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
              >
                🕒 {date} – {log.itemName} {changeText}
              </MenuItem>
            );
          })}

          <MenuItem
            as="a"
            href="/changelog"
            _hover={{ bg: "gray.600", color: "white" }}
          >
            View Full History →
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default ChangeLogDropdown;
