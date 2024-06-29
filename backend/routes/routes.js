const userController = require('../controllers/userController')
// const expenseController = require('../controllers/expenseController')
// const orderController = require('../controllers/orderController')
// const premiumFeatures = require('../controllers/premiumFeatures')
// const authenticationMiddleware = require('../middlewares/authenticate')
const express = require('express');
const router = express.Router()

router.post('/signup', userController.postCreateUsers)
router.get('/signup/:username', userController.getSearchUsers)
router.post('/login', userController.postLogin)

// router.post('/add-expense', expenseController.postExpense)
// router.get('/get-expense', authenticationMiddleware.authenticate ,expenseController.getExpense)
// router.delete('/delete-expense/:id', authenticationMiddleware.authenticate, expenseController.deleteExpense)

// router.post('/add-income', expenseController.postExpense)

// router.get('/purchases/buy-premium', authenticationMiddleware.authenticate, orderController.getPurchasePremium)
// router.post('/purchases/update-transaction-status', authenticationMiddleware.authenticate, orderController.postUpdateTransactionStatus)
// router.get('/check-premium', authenticationMiddleware.authenticate, userController.getCheckPremium)
// router.get('/premium/leaderboard', authenticationMiddleware.authenticate, premiumFeatures.getUserLeaderboard)
// router.get('/premium/downloadExpenseList', authenticationMiddleware.authenticate, premiumFeatures.getDownloadExpenseList)
// router.get('/premium/downloadUrlList', authenticationMiddleware.authenticate, premiumFeatures.getDownloadUrls)

router.post('/password/forgot-password', userController.postForgotPassword)
router.get('/password/reset-password/:id', userController.getResetPassword)
router.get('/password/updatepassword/:resetpasswordid', userController.updatePassword)
module.exports = router