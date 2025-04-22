// src/pages/Login.jsx
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  useToast,
  FormControl,
  FormLabel,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { setUser, setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // NOTE: endpoint changed from "/api/auth/login" → "/api/login"
      const { data } = await axios.post("/api/login", { email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/"); // Go to homepage after login
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // adapt card & input bg to light/dark
  const formBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const linkColor = useColorModeValue("blue.500", "blue.300");

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box
        as="form"
        onSubmit={submitHandler}
        bg={formBg}
        p={8}
        rounded="md"
        boxShadow="md"
        width="100%"
        maxW="400px"
      >
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Log in
          </Text>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              bg={inputBg}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              bg={inputBg}
            />
          </FormControl>

          <Button
            colorScheme="blue"
            variant="solid"
            type="submit"
            width="full"
          >
            Log in
          </Button>

          <Text fontSize="sm" textAlign="center">
            Don't have an account?{" "}
            <ChakraLink as={Link} to="/register" color={linkColor}>
              Register
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
