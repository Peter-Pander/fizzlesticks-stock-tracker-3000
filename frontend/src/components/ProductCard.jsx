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
import { FaPlus, FaMinus, FaUndo } from 'react-icons/fa';
import { useProductStore } from '../store/product';
import { useState, useEffect, useRef } from 'react';          // ← added useRef
// import your inventory settings context
import { useInventorySettings } from "../context/InventorySettingsContext";

const ProductCard = ({ product }) => {
  const textColor = useColorModeValue("gray.600", "gray.200");
  const bg = useColorModeValue("white", "gray.800");
  // Set countdown text color: black in light mode, white in dark mode.
  const countdownColor = useColorModeValue("black", "white");

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  // pull preferredCurrency from context
  const { preferredCurrency } = useInventorySettings();

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
  const [restockAmount, setRestockAmount] = useState(""); // starts empty
  const [sellAmount, setSellAmount] = useState("");       // starts empty

  // New local states for Undo deletion and countdown
  const [pendingDelete, setPendingDelete] = useState(false);
  const [deleteTimer, setDeleteTimer] = useState(null);
  const [countdownTimer, setCountdownTimer] = useState(null);
  const [countdown, setCountdown] = useState(0);

  // **NEW**: hold chosen file & ref to reset
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef();

  // Sync local form state whenever the product prop changes
  useEffect(() => {
    setUpdatedProduct(product);
  }, [product]);

  // Reset form to latest product values, then open edit modal
  const handleEditOpen = () => {
    setUpdatedProduct(product);
    // clear file selection
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onEditOpen();
  };

  // Called after the timer expires (or on immediate-delete second click).
  const handleDeleteProduct = async (pid) => {
    // clear any pending timers / UI
    clearTimeout(deleteTimer);
    clearInterval(countdownTimer);
    setPendingDelete(false);
    setCountdown(0);

    const { success, message } = await deleteProduct(pid);
    toast({
      title: success ? 'Success' : 'Error',
      description: message,
      status: success ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  // Single function for first‑ and second‑click delete behavior
  const onDeleteClick = (pid) => {
    if (pendingDelete) {
      // second click: immediate deletion
      handleDeleteProduct(pid);
      return;
    }

    // first click: start countdown + Undo UI
    setPendingDelete(true);
    setCountdown(5); // start at 5 seconds

    // schedule real delete in 5s
    const timer = setTimeout(() => {
      clearInterval(countdownInterval);
      handleDeleteProduct(pid);
    }, 5000);
    setDeleteTimer(timer);

    // update countdown display every second
    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    setCountdownTimer(countdownInterval);
  };

  // Undo deletion – clear timers and reset state.
  const handleUndoDelete = () => {
    clearTimeout(deleteTimer);
    clearInterval(countdownTimer);
    setDeleteTimer(null);
    setCountdownTimer(null);
    setCountdown(0);
    setPendingDelete(false);
    toast({
      title: "Deletion cancelled",
      description: "The product is still in your inventory.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateProduct = async () => {
    const changes = [];
    if (updatedProduct.name !== product.name) {
      changes.push("Product renamed successfully");
    }
    if (updatedProduct.price !== product.price) {
      changes.push("New price set successfully");
    }
    if (imageFile) {
      changes.push("Image changed successfully");
    }

    // build FormData only if a new image was chosen
    let payload = updatedProduct;
    if (imageFile) {
      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("price", updatedProduct.price);
      formData.append("quantity", updatedProduct.quantity);
      formData.append("image", imageFile);
      payload = formData;
    }

    const { success, message } = await updateProduct(product._id, payload);
    onEditClose();
    toast({
      title: success ? 'Success' : 'Error',
      description: success
        ? changes.length > 0
          ? changes.join(" · ")
          : message
        : message,
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
      const { success, message } = await updateProduct(product._id, {
        quantity: newQuantity,
      });
      if (success) {
        setUpdatedProduct((prev) => ({
          ...prev,
          quantity: newQuantity,
        }));
      }
      setRestockAmount(""); // clear after success
      onRestockClose();
      toast({
        title: success ? "Success" : "Error",
        description: success
          ? `Restocked ${amount} items`
          : message,
        status: success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
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
      const { success, message } = await updateProduct(product._id, {
        quantity: newQuantity,
      });
      if (success) {
        setUpdatedProduct((prev) => ({
          ...prev,
          quantity: newQuantity,
        }));
      }
      setSellAmount(""); // clear after success
      onSellClose();
      toast({
        title: success ? "Success" : "Error",
        description: success
          ? `Sold ${amount} items`
          : message,
        status: success ? "success" : "error",
        duration: 3000,
        isClosable: true,
      });
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
        src={product.imageUrl}
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
          {product.price} {preferredCurrency}
        </Text>

        <Text fontSize='md' color={textColor} mb={4}>
          In Stock: {product.quantity}
        </Text>

        <HStack spacing={2}>
          {/* restock, sell, edit, delete buttons unchanged */}
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
            onClick={handleEditOpen}
            size='sm'
          />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => onDeleteClick(product._id)}
            colorScheme='red'
            size='sm'
          />
          {pendingDelete && (
            <>
              <IconButton
                icon={<FaUndo />}
                aria-label="Undo Delete"
                onClick={handleUndoDelete}
                colorScheme='yellow'
                size='sm'
              />
              <Text fontSize="sm" color={countdownColor}>
                Deleting in {countdown}s...
              </Text>
            </>
          )}
        </HStack>
      </Box>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={1}>Product Name</Text>
                <Input
                  name='name'
                  value={updatedProduct.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
              </Box>
              <Box>
                <Text mb={1}>Price</Text>
                <Input
                  name='price'
                  type='number'
                  value={updatedProduct.price}
                  onChange={handleInputChange}
                  placeholder="Enter price (uses your preferred currency)"
                />
              </Box>
              <Box>
                <Text mb={1}>Quantity</Text>
                <Input
                  name='quantity'
                  type='number'
                  min="0"
                  value={updatedProduct.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity in stock"
                />
              </Box>
              <Box>
                <Text mb={1}>Image</Text>
                <Input
                  type="file"
                  accept="image/*"
                  display="none"
                  ref={fileInputRef}
                  onChange={(e) => setImageFile(e.target.files[0])}
                  id={`edit-image-${product._id}`}
                />
                <Button
                  as="label"
                  htmlFor={`edit-image-${product._id}`}
                  variant="outline"
                  colorScheme="blue"
                  w="full"
                  cursor="pointer"
                >
                  {imageFile ? imageFile.name : "Choose New Image"}
                </Button>
              </Box>
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
