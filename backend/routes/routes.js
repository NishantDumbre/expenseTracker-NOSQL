const express = require('express');
const router = express.Router();

const orderRoutes = require('./backend/routes/order');
const userRoutes = require('./backend/routes/user');
const premiumRoutes = require('./backend/routes/premium-feature');
const expenseRoutes = require('./backend/routes/expense');

router.use('/order', orderRoutes);
router.use('/user', userRoutes);
router.use('/premium', premiumRoutes);
router.use('/expense', expenseRoutes);

module.exports = router;
