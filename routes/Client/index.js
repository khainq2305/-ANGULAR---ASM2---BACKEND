const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const ProductController = require('../../controllers/Client/ProductController');
const cartRoutes = require('./cartRoutes'); // ✅ THÊM
const orderRoutes = require('./orderRoutes'); // ✅ THÊM DÒNG NÀY
// Route đăng nhập, đăng ký
router.use('/', authRoutes);

// Route sản phẩm cho client
router.get('/:id', ProductController.getById);

// ✅ Gắn route giỏ hàng
router.use('/cart', cartRoutes);
// ✅ Route đơn hàng
router.use('/orders', orderRoutes); // 👈 GẮN VÀO
module.exports = router;
