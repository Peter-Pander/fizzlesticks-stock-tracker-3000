import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import requireAuth from '../middleware/auth.js';

const router = express.Router();

// Registration route
router.post('/register', authController.register);
// Login route
router.post('/login', authController.login);
// Demo login route
router.post('/demo-login', authController.demoLogin);
// Optional: Get current user info
router.get('/me', requireAuth, authController.getMe);

export default router;
