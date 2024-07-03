const express = require('express');
const router = express.Router()

const authenticationMiddleware = require('../middlewares/authenticate')
const orderController = require('../controllers/orderController')


router.get('/buy-premium', authenticationMiddleware.authenticate, orderController.getPurchasePremium)
router.post('/update-transaction-status', authenticationMiddleware.authenticate, orderController.postUpdateTransactionStatus)


module.exports = router