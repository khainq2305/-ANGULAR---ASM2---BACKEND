const express = require('express');
const router = express.Router();
const OrderController = require('../../controllers/Client/OrderController');
const { checkJWT } = require('../../middlewares/authMiddleware');

router.post('/orders/create', checkJWT, OrderController.createOrder);
router.get('/orders/user', checkJWT, OrderController.getOrdersByUser);
router.post('/place', checkJWT, OrderController.placeOrder);


module.exports = router;
