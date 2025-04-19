import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useProductStore } from "../store/product";

const CreatePage = () => {
  // State for text fields
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
  });
  // State for the selected image file
  const [imageFile, setImageFile] = useState(null);

  const fileInputRef = useRef(null); // Ref to reset file input

  const toast = useToast();
  const { createProduct } = useProductStore();

  // Handle form submission to add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Build FormData payload
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", parseFloat(newProduct.price));
    formData.append("quantity", parseInt(newProduct.quantity, 10));

    if (imageFile) {
      formData.append("image", imageFile);
    } else {
      console.log("⚠️ No image file selected.");
    }

    // Send FormData to the server (no JSON headers)
    const { success, message } = await createProduct(formData);

    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      isClosable: true,
    });

    // Only clear the form if the product was successfully created
    if (success) {
      setNewProduct({ name: "", price: "", quantity: "" });
      setImageFile(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Container maxW={"container.sm"}>
      <VStack spacing={8}>
        <Heading
          as={"h1"}
          size={"2xl"}
          textAlign={"center"}
          mt={20} // Add margin-top to avoid overlapping with icons
          mb={0}
        >
          Create New Product
        </Heading>
        <Box
          as="form"
          w={{ base: "full", md: "container.sm" }}
          bg={useColorModeValue("white", "gray.800")}
          p={6}
          rounded={"lg"}
          shadow={"md"}
          onSubmit={handleAddProduct}
        >
          <VStack spacing={4}>
            <Input
              placeholder="Product Name"
              name="name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <Input
              placeholder="Quantity"
              name="quantity"
              type="number"
              min="0"
              value={newProduct.quantity}
              onChange={(e) =>
                setNewProduct({ ...newProduct, quantity: e.target.value })
              }
            />

            {/* Styled file input */}
            <Box textAlign="center" w="full">
              <Input
                type="file"
                accept="image/*"
                name="image"
                onChange={(e) => setImageFile(e.target.files[0])}
                ref={fileInputRef} // Hook up the ref
                display="none"
                id="imageUpload"
              />
              <Button
                as="label"
                htmlFor="imageUpload"
                variant="outline"
                colorScheme="blue"
                w="full"
                cursor="pointer"
              >
                {imageFile ? imageFile.name : "Choose Image"}
              </Button>
            </Box>

            <Button colorScheme="blue" type="submit" w="full">
              Add Product
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default CreatePage;
