import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import ChangeLog from '../models/changelog.model.js';

export const getProducts = async (req, res) => {
  try {
    // Only fetch products for the authenticated user
    const products = await Product.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error in Get Products:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const createProduct = async (req, res) => {
  const productData = req.body; // user sends product data

  if (!productData.name || !productData.price || !productData.image || productData.quantity == null) {
    return res.status(400).json({
      success: false,
      message: "Please provide all fields",
    });
  }

  // Attach the authenticated user's ID to the product
  const newProduct = new Product({ ...productData, user: req.user._id });

  try {
    await newProduct.save();
    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error("Error in Create Product:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Product ID",
    });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Ensure the product belongs to the logged-in user
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // If quantity is being updated, record the change
    if (updateData.quantity !== undefined && updateData.quantity !== product.quantity) {
      await ChangeLog.create({
        itemName: product.name,
        previousQuantity: product.quantity,
        newQuantity: updateData.quantity,
      });
    }

    // Update product fields
    Object.assign(product, updateData);
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error in Update Product:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "Invalid Product ID",
    });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Ensure the product belongs to the logged-in user
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error in Deleting Product:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
