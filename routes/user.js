const express = require('express');
const router = express.Router()

const authenticationMiddleware = require('../middlewares/authenticate')
const userController = require('../controllers/user')


// router.post('/check-signup-creds', userController.checkUserExists)
router.post('/signup', userController.createUser)
router.post('/login', userController.login)
router.post('/forgot-password', userController.sendForgotPwdEmail)
router.get('/reset-password/:id', userController.newPasswordURL)
router.get('/update-password/:resetpasswordid', userController.updatePassword)
router.get('/verify-premium', authenticationMiddleware.authenticate, userController.getCheckPremium)
router.post('/update-user', authenticationMiddleware.authenticate, userController.updateUserDetails)
router.get('/verify-email', authenticationMiddleware.authenticate, userController.verifyEmail)
router.get('/verify-user-email/:id', userController.verifyUserEmail)
router.get('/get-user-data', authenticationMiddleware.authenticate, userController.getUserData)


module.exports = router