const express = require('express');
const router = express.Router();
const registerUser = require('../controllers/registeruser');
const loginUser = require('../controllers/loginuser');
const dashBoard = require('../controllers/dash_board');
const authMiddleware =require('../middleware/auth');

// router
router.post('/login', loginUser);
router.post('/signup', registerUser);
router.get('/dashboard',authMiddleware ,dashBoard);

module.exports = router;
