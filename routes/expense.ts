import express, {Router} from 'express';
import authenticationMiddleware = require('../middlewares/authenticate')
import expenseController = require('../controllers/expense')


const router: Router = express.Router()

router.post('/add-record', authenticationMiddleware.authenticate, expenseController.postExpense)
router.get('/get-record', authenticationMiddleware.authenticate ,expenseController.getExpense)
router.delete('/delete-record/:id', authenticationMiddleware.authenticate, expenseController.deleteExpense)


module.exports = router