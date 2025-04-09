// routes/Admin/orderRoutes.js
const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/Admin/orderController');

// Danh sách đơn hàng
router.get('/orders/list', OrderController.get);

// Chi tiết đơn hàng
router.get('/orders/:id', OrderController.getById);

// ✅ Hủy đơn hàng
router.put('/orders/:id/cancel', OrderController.cancel);

// ✅ Cập nhật trạng thái đơn hàng
router.put('/orders/:id/update-status', OrderController.updateStatus);
// Lấy form chỉnh sửa (giao diện web)
router.get('/orders/:id/edit', OrderController.getEditForm);

module.exports = router;
