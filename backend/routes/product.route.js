// backend/routes/product.route.js

import express from 'express';
import requireAuth from '../middleware/auth.js';
import multer from 'multer';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller.js';

const router = express.Router();

// Protect all routes in this router with authentication
router.use(requireAuth);

// Set up Multer to handle multipart/form-data
const upload = multer({ dest: 'uploads/' }); // files temporarily go to /uploads

router.get("/", getProducts);

// Multer parses the file and puts it on req.file, then hands off to createProduct
router.post(
  "/",
  upload.single("image"), // Field name must match FormData.append("image", ...)
  createProduct
);

// Use the updated controller logic for updating a product,
// now also parsing an image file if one is sent
router.put(
  "/:id",
  upload.single("image"), // here too, so req.file is populated on updates
  updateProduct
);

router.delete("/:id", deleteProduct);

export default router;
