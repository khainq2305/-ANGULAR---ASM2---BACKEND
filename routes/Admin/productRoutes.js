const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/Admin/productController');
const upload = require('../../middlewares/uploads'); // ✅ dùng đúng file uploads.js

router.get('/products/list', ProductController.get);


router.get('/products/:id', ProductController.getById);


router.post(
  '/products/add',
  upload.fields([
    { name: 'image', maxCount: 1 }, // ✅ đúng với field Angular gửi
  ]),
  ProductController.create
);
  

router.put('/products/:id', ProductController.update);

router.delete("/products/delete-multiple", ProductController.deleteMultiple);


router.delete('/products/:id', ProductController.delete);
router.delete('/products/permanent/:id', ProductController.forceDelete);
router.delete('/products/permanent-delete-multiple', ProductController.forceDeleteMultiple);


router.get('/products/trash/list', ProductController.trash);


router.patch('/products/restore/:id', ProductController.restore);


router.patch('/products/restore-multiple', ProductController.restoreMultiple);

module.exports = router;
