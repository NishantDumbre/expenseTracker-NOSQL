"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const order_1 = require("../controllers/order");
const router = express_1.default.Router();
router.get('/buy-premium', authenticate_1.default, order_1.getPurchasePremium);
router.post('/update-transaction-status', authenticate_1.default, order_1.postUpdateTransactionStatus);
exports.default = router;
