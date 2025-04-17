// backend/controllers/product.controller.js

import mongoose from 'mongoose';
import fs from 'fs';
import Product from '../models/product.model.js';
import ChangeLog from '../models/changelog.model.js';
import cloudinary from '../config/cloudinary.js';

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    // Only fetch products for the authenticated user
    const products = await Product.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error in Get Products:', error); // ← log full error
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  const productData = req.body; // Data sent by the client

  // Validate required fields (image comes via req.file now)
  if (
    !productData.name ||
    !productData.price ||
    productData.quantity == null ||
    !req.file
  ) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, price, quantity, and an image file',
    });
  }

  try {
    // 1. Upload the image file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products', // optional folder in your Cloudinary account
    });

    // 2. Remove temp file from server
    fs.unlinkSync(req.file.path);

    // 3. Create a new Product, storing the Cloudinary URL
    const newProduct = new Product({
      ...productData,
      imageUrl: result.secure_url, // ✅ store uploaded image URL
      user: req.user._id,
    });

    await newProduct.save();

    // Log creation event
    await ChangeLog.create({
      user: req.user._id,
      itemName: newProduct.name,
      previousQuantity: 0,
      newQuantity: newProduct.quantity,
      action: 'created',
    });

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    console.error('Error in Create Product:', error); // ← log full error
    res.status(500).json({
      success: false,
      message: 'Upload failed',
    });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validate the product ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: 'Invalid Product ID',
    });
  }

  try {
    // Find product by ID
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Ensure the product belongs to the authenticated user
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    // If the update includes a change in quantity, record the change in the ChangeLog
    if (
      updateData.quantity !== undefined &&
      updateData.quantity !== product.quantity
    ) {
      const before = product.quantity;
      const after  = updateData.quantity;
      const action = after > before ? 'restocked' : 'sold';

      await ChangeLog.create({
        user: req.user._id,          // <-- associate log with current user
        itemName: product.name,
        previousQuantity: before,
        newQuantity: after,
        action,
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
    console.error('Error in Update Product:', error); // ← log full error
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  // Validate the product ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: 'Invalid Product ID',
    });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Ensure the product belongs to the authenticated user
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    // Log deletion as quantity -> 0
    await ChangeLog.create({
      user: req.user._id,          // <-- associate log with current user
      itemName: product.name,
      previousQuantity: product.quantity,
      newQuantity: 0,
      action: 'deleted',
    });

    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error in Deleting Product:', error); // ← log full error
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
