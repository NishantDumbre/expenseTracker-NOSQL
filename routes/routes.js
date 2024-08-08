const express = require('express');
const router = express.Router();

const userRoutes = require('./user');
const orderRoutes = require('./order');
const premiumRoutes = require('./premium-feature');
const expenseRoutes = require('./expense');

router.use('/user', userRoutes);
router.use('/order', orderRoutes);
router.use('/premium', premiumRoutes);
router.use('/expense', expenseRoutes);

module.exports = router;
