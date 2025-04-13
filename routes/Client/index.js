const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const ProductController = require('../../controllers/Client/ProductController');
const cartRoutes = require('./cartRoutes'); // ✅ THÊM
const orderRoutes = require('./orderRoutes'); // ✅ THÊM DÒNG NÀY
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
// Route đăng nhập, đăng ký
router.use('/', authRoutes);


// Route sản phẩm
router.use('/', productRoutes); // ✅ THÊM NÀY


// ✅ Gắn route giỏ hàng
router.use('/cart', cartRoutes);
// ✅ Route đơn hàng
router.use('/orders', orderRoutes); // 👈 GẮN VÀO

router.use('/categories', categoryRoutes);




module.exports = router;
