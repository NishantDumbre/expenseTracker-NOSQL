const express = require('express');
const router = express.Router()

//const authenticationMiddleware = require('../middlewares/authenticate')
const userController = require('../controllers/user')


router.post('/check-signup-creds', userController.checkUserExists)
router.post('/signup', userController.createUser)
router.post('/login', userController.login)
router.post('/forgot-password', userController.sendForgotPwdEmail)
router.get('/reset-password/:id', userController.newPasswordURL)
router.get('/update-password/:resetpasswordid', userController.updatePassword)
//router.get('/check-premium', authenticationMiddleware.authenticate, userController.getCheckPremium)


module.exports = router