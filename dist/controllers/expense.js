"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.getExpense = exports.postExpense = void 0;
const expense_1 = __importDefault(require("../models/expense"));
const user_1 = __importDefault(require("../models/user"));
const postExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { money, description, category, type } = req.body;
        const { _id } = req.user;
        const instance = new expense_1.default({
            money,
            description,
            category,
            user_id: _id.toString(),
            type,
        });
        const newExpense = yield instance.save();
        const user = yield user_1.default.findById(_id);
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: "user not found" });
        if (type == "INCOME") {
            user.total_expense = Number(user.total_expense) + Number(money);
        }
        else {
            user.total_expense = Number(user.total_expense) - Number(money);
        }
        yield user.save();
        res.status(200).json(instance);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});
exports.postExpense = postExpense;
const getExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const LIMIT_PER_PAGE = parseInt(req.query.results);
    const page = parseInt(req.query.page) || 1;
    try {
        const totalNoExpenses = yield expense_1.default.countDocuments({
            user_id: req.user._id,
        });
        const expenses = yield expense_1.default.find({ user_id: req.user._id })
            .skip((page - 1) * LIMIT_PER_PAGE)
            .limit(LIMIT_PER_PAGE)
            .sort({ _id: -1 });
        res.status(200).json({
            expenses: expenses,
            currentPage: page,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            hasNextPage: LIMIT_PER_PAGE * page < totalNoExpenses,
            nextPage: page + 1,
            lastPage: Math.ceil(totalNoExpenses / LIMIT_PER_PAGE),
        });
    }
    catch (error) {
        console.log(error);
        res.status(401).json(error);
    }
});
exports.getExpense = getExpense;
const deleteExpense = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(true);
        const { id } = req.params;
        const { _id } = req.user;
        const expense = yield expense_1.default.findById(id);
        if (!expense) {
            return res
                .status(404)
                .json({ success: false, message: "Expense not found" });
        }
        const user = yield user_1.default.findById(_id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        if (expense.type == "INCOME") {
            user.total_expense = Number(user.total_expense) - Number(expense.money);
        }
        else {
            user.total_expense = Number(user.total_expense) + Number(expense.money);
        }
        yield user.save();
        yield expense.deleteOne({ _id: id });
        res.status(200).json({ success: true, message: "Deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res
            .status(401)
            .json({ success: false, message: `Couldn't delete expense` });
    }
});
exports.deleteExpense = deleteExpense;
