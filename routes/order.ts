import express, { Router } from "express";
import authenticate from "../middlewares/authenticate";
import {getPurchasePremium, postUpdateTransactionStatus} from '../controllers/order'

const router: Router = express.Router();


router.get('/buy-premium', authenticate, getPurchasePremium)
router.post('/update-transaction-status', authenticate, postUpdateTransactionStatus)


export default router