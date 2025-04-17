const express = require('express');
const router = express.Router();
const { checkJWT, isAdmin } = require('../../middlewares/authMiddleware'); // ✅ import middleware

// 👉 TẤT CẢ route trong /admin đều đi qua middleware checkJWT + isAdmin
router.use(checkJWT, isAdmin); // ✅ CHẶN ở đây
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes'); 
const userRoutes = require('./userRoutes');
router.use('/', categoryRoutes);
router.use('/', productRoutes);
router.use('/', orderRoutes); 
router.use('/user', userRoutes);
router.use('/comment', require('./commentRoutes'));
module.exports = router;
