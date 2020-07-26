const express = require('express');
const {
   getTour,
   getOverview,
   getLogin,
   getMe,
} = require('../controllers/viewController');

const { isLoggedIn, protect } = require('../controllers/authController.js');

const router = express.Router();
router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLogin);
router.get('/me', protect, getMe);

module.exports = router;
