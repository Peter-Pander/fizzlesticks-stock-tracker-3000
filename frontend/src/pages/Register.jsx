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
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const { setUser, setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const { data } = await axios.post("/api/auth/register", {
        email,
        password,
      });

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box
        as="form"
        onSubmit={submitHandler}
        bg="white"
        p={8}
        rounded="md"
        boxShadow="md"
        width="100%"
        maxW="400px"
      >
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">
            Sign up
          </Text>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            Register
          </Button>

          <Text fontSize="sm" textAlign="center">
            Already have an account?{" "}
            <ChakraLink as={Link} to="/login" color="blue.500">
              Log in
            </ChakraLink>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;
