const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const requireAuth = require('../middleware/auth');

// Registration route
router.post('/register', authController.register);
// Login route
router.post('/login', authController.login);
// Optional: Get current user info
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
