const express = require('express');
const router = express.Router()

const authenticationMiddleware = require('../middlewares/authenticate')
const expenseController = require('../controllers/expense')

router.post('/add-record', authenticationMiddleware.authenticate, expenseController.postExpense)
router.get('/get-record', authenticationMiddleware.authenticate ,expenseController.getExpense)
// router.delete('/delete-record/:id', authenticationMiddleware.authenticate, expenseController.deleteExpense)


module.exports = router