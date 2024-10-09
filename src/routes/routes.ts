import express, { Router } from "express";
import userRoutes from './user';
import orderRoutes from './order';
import premiumRoutes from './premium-feature';
import expenseRoutes from './expense';

const router: Router = express.Router();

router.use('/user', userRoutes);
router.use('/order', orderRoutes);
router.use('/premium', premiumRoutes);
router.use('/expense', expenseRoutes);

export default router;
