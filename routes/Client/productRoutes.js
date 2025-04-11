const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/ProductController');

router.get('/products/:id', ProductController.getById);

module.exports = router;
