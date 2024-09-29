import express, { Router } from "express";
import userRoutes = require('./user');
import orderRoutes = require('./order');
import premiumRoutes = require('./premium-feature');
import expenseRoutes = require('./expense');

const router: Router = express.Router();

router.use('/user', userRoutes);
router.use('/order', orderRoutes);
router.use('/premium', premiumRoutes);
router.use('/expense', expenseRoutes);

module.exports = router;
