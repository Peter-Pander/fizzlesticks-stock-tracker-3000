// backend/models/product.model.js

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // Image is now OPTIONAL; falls back to a placeholder graphic
    imageUrl: {
      type: String,
      required: false,                 // ← no longer mandatory
      default: '/placeholder_crate.png', // ← serves from /public
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    // Associate the product with a specific user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Product = mongoose.model('Product', productSchema); // Creates the model

export default Product;
