import express, { Router } from "express";
import authenticate from "../middlewares/authenticate";
import userController = require('../controllers/user')

const router: Router = express.Router();


router.post('/check-signup-creds', userController.checkUserExists)
router.post('/signup', userController.createUser)
router.post('/login', userController.login)
router.post('/forgot-password', userController.sendForgotPwdEmail)
router.get('/reset-password/:id', userController.newPasswordURL)
router.get('/update-password/:resetpasswordid', userController.updatePassword)
router.get('/check-premium', authenticate, userController.getCheckPremium)


module.exports = router