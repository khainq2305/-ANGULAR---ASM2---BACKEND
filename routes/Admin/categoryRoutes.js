const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/Admin/categoryController');

router.get('/categories/list', CategoryController.get);
router.post('/categories/add', CategoryController.create);
router.put("/categories/update/:id", (req, res, next) => {
    console.log('Route hit: PUT /categories/update/:id');
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    next();
  }, CategoryController.update);
router.delete("/categories/delete/:id", CategoryController.delete);

module.exports = router;