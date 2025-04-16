import express from "express";
import ChangeLog from "../models/changelog.model.js";
import requireAuth from "../middleware/auth.js";

const router = express.Router();

// Protect all changelog routes
router.use(requireAuth);

// GET all changelog entries sorted by most recent (descending order)
// (If logs should be user-specific, consider adding a filter such as:
//    ChangeLog.find({ user: req.user._id }).sort({ createdAt: -1 }) )
router.get("/", async (req, res) => {
  try {
    const logs = await ChangeLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE all logs
router.delete("/", async (req, res) => {
  try {
    await ChangeLog.deleteMany({});
    res.json({ message: "All logs have been deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
