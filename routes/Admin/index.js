const express = require('express');
const router = express.Router();

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