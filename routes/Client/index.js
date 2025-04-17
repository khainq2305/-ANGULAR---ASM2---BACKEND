const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes'); // ✅ THÊM
const orderRoutes = require('./orderRoutes'); // ✅ THÊM DÒNG NÀY
const commentRoutes = require('./commentRoutes');
const categoryRoutes = require('./categoryRoutes');
const ghnRoutes = require('./ghn');
// Route đăng nhập, đăng ký
router.use('/', authRoutes);


// Route sản phẩm
router.use('/', productRoutes); // ✅ THÊM NÀY


router.use('/ghn', ghnRoutes); // ✅ GẮN VÀO

// ✅ Gắn route giỏ hàng
router.use('/cart', cartRoutes);
// ✅ Route đơn hàng
router.use('/orders', orderRoutes); // 👈 GẮN VÀO

router.use('/categories', categoryRoutes);

router.use('/comments', commentRoutes); // ✅ THÊM DÒNG NÀY



module.exports = router;
