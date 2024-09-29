import express, { Router } from "express";
import authenticate from "../middlewares/authenticate";
import {
  getUserLeaderboard,
  getDownloadExpenseList,
  getDownloadUrls,
} from "../controllers/premium-feature";

const router: Router = express.Router();

router.get("/leaderboard", authenticate, getUserLeaderboard);
router.get("/downloadExpenseList", authenticate, getDownloadExpenseList);
router.get("/downloadUrlList", authenticate, getDownloadUrls);

export default router;
