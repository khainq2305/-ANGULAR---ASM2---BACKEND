const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/admin/productController');
const upload = require('../../middlewares/uploads'); 

router.get('/products/list', ProductController.get);


router.get('/products/:id', ProductController.getById);


router.post(
  '/products/add',
  upload.fields([
    { name: 'image', maxCount: 1 }, 
  ]),
  ProductController.create
);
  

router.put(
  '/products/:id',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 }, // tên này phải đúng với tên append ở frontend
    { name: 'media', maxCount: 10 }     // nếu có phần media (ảnh chi tiết)
  ]),
  ProductController.update
);

router.delete("/products/delete-multiple", ProductController.deleteMultiple);


router.delete('/products/:id', ProductController.delete);
router.delete('/products/permanent/:id', ProductController.forceDelete);
router.delete('/products/permanent-delete-multiple', ProductController.forceDeleteMultiple);


router.get('/products/trash/list', ProductController.trash);


router.patch('/products/restore/:id', ProductController.restore);


router.patch('/products/restore-multiple', ProductController.restoreMultiple);

module.exports = router;
