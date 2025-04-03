const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/Admin/productController');

router.get('/products/list', ProductController.get);

module.exports = router;
