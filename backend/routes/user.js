const express = require('express');
const router = express.Router()

//const authenticationMiddleware = require('../middlewares/authenticate')
const userController = require('../controllers/user')


router.post('/check-signup-creds', userController.checkUserExists)
router.post('/signup', userController.createUser)
router.post('/login', userController.postLogin)
// router.post('/forgot-password', userController.postForgotPassword)
// router.get('/reset-password/:id', userController.getResetPassword)
// router.get('/updatepassword/:resetpasswordid', userController.updatePassword)
//router.get('/check-premium', authenticationMiddleware.authenticate, userController.getCheckPremium)


module.exports = router