const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/Client/AuthController');
const { checkJWT } = require('../../middlewares/authMiddleware'); // Middleware xác thực JWT

// Đăng ký người dùng mới
router.post('/register', UserController.register);

// Đăng nhập người dùng
router.post('/login', UserController.login);

module.exports = router;
