import {
  Box,
  Heading,
  Image,
  Text,
  HStack,
  IconButton,
  useColorModeValue,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useProductStore } from '../store/product';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose
  } = useDisclosure();

  const {
    isOpen: isRestockOpen,
    onOpen: onRestockOpen,
    onClose: onRestockClose
  } = useDisclosure();

  const {
    isOpen: isSellOpen,
    onOpen: onSellOpen,
    onClose: onSellClose
  } = useDisclosure();

  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [restockAmount, setRestockAmount] = useState(""); // changed from 0
  const [sellAmount, setSellAmount] = useState("");       // changed from 0

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    toast({
      title: success ? 'Success' : 'Error',
      description: message,
      status: success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateProduct = async () => {
    const { success, message } = await updateProduct(product._id, updatedProduct);
    onEditClose();
    toast({
      title: success ? 'Success' : 'Error',
      description: message,
      status: success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value, 10) : value,
    }));
  };

  const handleRestock = async () => {
    const amount = parseInt(restockAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      const newQuantity = product.quantity + amount;
      await updateProduct(product._id, { quantity: newQuantity });
      setRestockAmount(""); // clear after success
      onRestockClose();
    }
  };

  const handleSell = async () => {
    const amount = parseInt(sellAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      const newQuantity = product.quantity - amount;
      if (newQuantity < 0) {
        alert("Not enough stock to sell that many!");
        return;
      }
      await updateProduct(product._id, { quantity: newQuantity });
      setSellAmount(""); // clear after success
      onSellClose();
    }
  };

  return (
    <Box
      shadow='lg'
      rounded='lg'
      overflow='hidden'
      transition='all 0.3s'
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        h={48}
        w='full'
        objectFit='cover'
      />

      <Box p={4}>
        <Heading as='h3' size='md' mb={2}>
          {product.name}
        </Heading>

        <Text fontWeight='bold' fontSize='xl' color={textColor} mb={2}>
          {product.price} gold
        </Text>

        <Text fontSize='md' color={textColor} mb={4}>
          In Stock: {product.quantity}
        </Text>

        <HStack spacing={2}>
          <IconButton
            icon={<FaPlus />}
            aria-label="Restock"
            onClick={onRestockOpen}
            colorScheme='green'
            size='sm'
          />
          <IconButton
            icon={<FaMinus />}
            aria-label="Record Sold"
            onClick={onSellOpen}
            colorScheme='orange'
            size='sm'
          />
          <IconButton
            icon={<EditIcon />}
            colorScheme='blue'
            onClick={onEditOpen}
            size='sm'
          />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => handleDeleteProduct(product._id)}
            colorScheme='red'
            size='sm'
          />
        </HStack>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder='Product Name'
                name='name'
                value={updatedProduct.name}
                onChange={handleInputChange}
              />
              <Input
                placeholder='Price'
                name='price'
                type='number'
                value={updatedProduct.price}
                onChange={handleInputChange}
              />
              <Input
                placeholder='Image URL'
                name='image'
                value={updatedProduct.image}
                onChange={handleInputChange}
              />
              <Input
                placeholder='Quantity'
                name='quantity'
                type='number'
                min="0"
                value={updatedProduct.quantity}
                onChange={handleInputChange}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleUpdateProduct}>
              Update
            </Button>
            <Button variant='ghost' onClick={onEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Restock Modal */}
      <Modal isOpen={isRestockOpen} onClose={onRestockClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How many to restock?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder='Amount to restock'
              type='number'
              min="1"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={handleRestock}>
              Restock
            </Button>
            <Button variant='ghost' onClick={onRestockClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Sold Modal */}
      <Modal isOpen={isSellOpen} onClose={onSellClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How many sold?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder='Amount sold'
              type='number'
              min="1"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='orange' mr={3} onClick={handleSell}>
              Sold
            </Button>
            <Button variant='ghost' onClick={onSellClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;
