import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';

import productRoutes from './routes/product.route.js';
import changelogRoutes from './routes/changelog.route.js';
import authRoutes from './routes/auth.route.js'; // Import the auth routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// __dirname workaround in ES module
const __dirname = path.resolve();

app.use(express.json()); // Allows us to accept JSON data in the req.body

// Mount routes
app.use("/api/products", productRoutes);
app.use("/api/logs", changelogRoutes);
app.use("/api/auth", authRoutes); // Mount the authentication routes

// Serve static frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB(); // Connect to MongoDB
  console.log("Server started at http://localhost:" + PORT);
});
