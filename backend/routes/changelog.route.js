import express from 'express';
import ChangeLog from '../models/changelog.model.js';

const router = express.Router();

// GET all changelog entries sorted by most recent (descending order)
router.get('/', async (req, res) => {
  try {
    const logs = await ChangeLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
