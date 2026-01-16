const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  createUser,
} = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

// Admin only routes
router.post('/create-user', protect, adminOnly, createUser);

module.exports = router;
