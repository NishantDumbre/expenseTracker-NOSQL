import express, { Router } from "express";
import authenticate from "../middlewares/authenticate";
import {checkUserExists, createUser, login, sendForgotPwdEmail, newPasswordURL, updatePassword, getCheckPremium} from '../controllers/user'

const router: Router = express.Router();


router.post('/check-signup-creds', checkUserExists)
router.post('/signup', createUser)
router.post('/login', login)
router.post('/forgot-password', sendForgotPwdEmail)
router.get('/reset-password/:id', newPasswordURL)
router.get('/update-password/:resetpasswordid', updatePassword)
router.get('/check-premium', authenticate, getCheckPremium)


export default router