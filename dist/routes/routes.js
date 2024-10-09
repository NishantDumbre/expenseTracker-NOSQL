"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./user"));
const order_1 = __importDefault(require("./order"));
const premium_feature_1 = __importDefault(require("./premium-feature"));
const expense_1 = __importDefault(require("./expense"));
const router = express_1.default.Router();
router.use('/user', user_1.default);
router.use('/order', order_1.default);
router.use('/premium', premium_feature_1.default);
router.use('/expense', expense_1.default);
exports.default = router;
