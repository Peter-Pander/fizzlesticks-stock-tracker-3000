// backend/server.js

import dotenv from 'dotenv';
dotenv.config();    // ← loads .env (including CLOUDINARY_URL) before anything else

import express from 'express';
import path from 'path';
import { connectDB } from './config/db.js';

import productRoutes from './routes/product.route.js';
import changelogRoutes from './routes/changelog.route.js';
import authRoutes from './routes/auth.route.js'; // Import the auth routes

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

// ✅ Start server *after* DB connection
const startServer = async () => {
  try {
    await connectDB(); // Wait until DB is connected
    app.listen(PORT, () => {
      console.log("🚀 Server started at http://localhost:" + PORT);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1); // Exit with failure code if DB fails
  }
};

startServer();
