const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/upload');
const userController = require('../../controllers/Admin/userController');

router.get('/', userController.list);
router.post('/', upload.single('avatar'), userController.postAdd);
router.put('/:id', userController.postEdit);
router.delete('/:id', userController.delete);
router.patch('/:id/status', userController.toggleStatus);
router.patch('/:id/reset-password', userController.resetPassword);

module.exports = router;
console.log("🧪 userController:", userController);
