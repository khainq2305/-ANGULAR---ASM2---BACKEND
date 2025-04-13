const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/Client/CategoryController');

router.get('/', CategoryController.getAll);

module.exports = router;
