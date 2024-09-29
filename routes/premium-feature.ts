import express, { Router } from "express";
import authenticate from "../middlewares/authenticate";
import premiumFeatures = require('../controllers/premium-feature')

const router: Router = express.Router();

router.get('/leaderboard', authenticate, premiumFeatures.getUserLeaderboard)
router.get('/downloadExpenseList', authenticate, premiumFeatures.getDownloadExpenseList)
router.get('/downloadUrlList', authenticate, premiumFeatures.getDownloadUrls)


module.exports = router