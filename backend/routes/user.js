const express = require('express');
const router = express.Router()

const authenticationMiddleware = require('../middlewares/authenticate')
const userController = require('../controllers/userController')


router.post('/signup', userController.postCreateUsers)
router.get('/signup/:username', userController.getSearchUsers)
router.post('/login', userController.postLogin)
router.post('/forgot-password', userController.postForgotPassword)
router.get('/reset-password/:id', userController.getResetPassword)
router.get('/updatepassword/:resetpasswordid', userController.updatePassword)
router.get('/check-premium', authenticationMiddleware.authenticate, userController.getCheckPremium)


module.exports = router