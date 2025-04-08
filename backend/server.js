import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import productRoutes from './routes/product.route.js';

dotenv.config();

const app = express();

app.use(express.json()); // Allows us to accept JSON data in the req.body

ape.use("/api/products", productRoutes);

app.listen(5000, () => {
  connectDB(); // Make sure this connects to MongoDB
  console.log("Server started at http://localhost:5000");
});
