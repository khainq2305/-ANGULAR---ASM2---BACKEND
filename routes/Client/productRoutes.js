const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/Client/ProductController');

// ✅ Route đặc biệt phải đặt TRƯỚC
router.get('/products/featured', ProductController.getFeatured);

// Sau đó mới tới routes động
router.get('/products/:id', ProductController.getById);
router.get('/products', ProductController.getAllActive);

module.exports = router;
