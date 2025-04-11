const express = require('express');
const router = express.Router();
const CartController = require('../../controllers/Client/cartController');

const { checkJWT } = require('../../middlewares/authMiddleware');

router.post('/add', checkJWT, CartController.addToCart);

router.get('/user/:id', CartController.getCartByUser);

module.exports = router;
