const express = require('express');
const router = express.Router()

const authenticationMiddleware = require('../middlewares/authenticate')
const premiumFeatures = require('../controllers/premium-feature')

router.get('/leaderboard', authenticationMiddleware.authenticate, premiumFeatures.getUserLeaderboard)
router.get('/downloadExpenseList', authenticationMiddleware.authenticate, premiumFeatures.getDownloadExpenseList)
router.get('/downloadUrlList', authenticationMiddleware.authenticate, premiumFeatures.getDownloadUrls)


module.exports = router