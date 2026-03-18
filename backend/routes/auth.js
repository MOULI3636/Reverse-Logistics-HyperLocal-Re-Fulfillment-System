const express = require('express');
const router = express.Router();
const { signup, login, getMe, googleAuth, googleAuthCallback } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);
router.get('/me', protect, getMe);

module.exports = router;
