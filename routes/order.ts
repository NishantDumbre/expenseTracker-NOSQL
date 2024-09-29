import express, { Router } from "express";
import authenticate from "../middlewares/authenticate";
import orderController = require('../controllers/order')

const router: Router = express.Router();


router.get('/buy-premium', authenticate, orderController.getPurchasePremium)
router.post('/update-transaction-status', authenticate, orderController.postUpdateTransactionStatus)


module.exports = router