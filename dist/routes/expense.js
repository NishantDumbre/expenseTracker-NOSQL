"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const expense_1 = require("../controllers/expense");
const router = express_1.default.Router();
router.post("/add-record", authenticate_1.default, expense_1.postExpense);
router.get("/get-record", authenticate_1.default, expense_1.getExpense);
router.delete("/delete-record/:id", authenticate_1.default, expense_1.deleteExpense);
exports.default = router;
