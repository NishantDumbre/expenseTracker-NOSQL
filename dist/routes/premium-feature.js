"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const premium_feature_1 = require("../controllers/premium-feature");
const router = express_1.default.Router();
router.get("/leaderboard", authenticate_1.default, premium_feature_1.getUserLeaderboard);
router.get("/downloadExpenseList", authenticate_1.default, premium_feature_1.getDownloadExpenseList);
router.get("/downloadUrlList", authenticate_1.default, premium_feature_1.getDownloadUrls);
exports.default = router;
