const express = require('express');
const router = express.Router()

const authenticationMiddleware = require('../middlewares/authenticate')
const expenseController = require('../controllers/expenseController')

router.post('/add-expense', authenticationMiddleware.authenticate, expenseController.postExpense)
router.get('/get-expense', authenticationMiddleware.authenticate ,expenseController.getExpense)
router.delete('/delete-expense/:id', authenticationMiddleware.authenticate, expenseController.deleteExpense)
router.post('/add-income', authenticationMiddleware.authenticate, expenseController.postExpense)


module.exports = router