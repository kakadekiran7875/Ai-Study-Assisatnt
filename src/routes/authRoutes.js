const express = require('express');
const {
    register,
    login,
    googleLogin,
    guestLogin,
    getProfile,
    logout,
    refreshToken,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
    registerValidation,
    loginValidation,
    googleLoginValidation,
    validate,
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/google', googleLoginValidation, validate, googleLogin);
router.post('/guest', guestLogin);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logout);

module.exports = router;
