const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

module.exports = router; // ✅ phải là router chứ không phải object hay function khác
