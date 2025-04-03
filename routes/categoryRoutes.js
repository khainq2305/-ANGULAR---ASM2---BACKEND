const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController');

router.get('/categories/list', CategoryController.get);
router.post('/categories/add', CategoryController.create);
router.put("/categories/:id", CategoryController.update);
router.delete("/categories/:id", CategoryController.delete);
module.exports = router;