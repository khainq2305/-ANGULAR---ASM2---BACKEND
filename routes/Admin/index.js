const express = require('express');
const router = express.Router();

const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes'); 

router.use('/', categoryRoutes);
router.use('/', productRoutes);
router.use('/', orderRoutes); 

module.exports = router;
