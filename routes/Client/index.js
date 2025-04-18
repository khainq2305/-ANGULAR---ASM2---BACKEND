const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes'); 
const commentRoutes = require('./commentRoutes');
const categoryRoutes = require('./categoryRoutes');
const ghnRoutes = require('./ghn');

router.use('/', authRoutes);



router.use('/', productRoutes); 


router.use('/ghn', ghnRoutes); 


router.use('/cart', cartRoutes);

router.use('/orders', orderRoutes); 

router.use('/categories', categoryRoutes);

router.use('/comments', commentRoutes); 



module.exports = router;
