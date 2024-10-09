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
exports.postUpdateTransactionStatus = exports.getPurchasePremium = void 0;
const order_1 = __importDefault(require("../models/order"));
const razorpay_1 = __importDefault(require("razorpay"));
const getPurchasePremium = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rzp = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEYID,
            key_secret: process.env.RAZORPAY_KEYSECRET
        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            const instance = new order_1.default({
                order_id: order.id,
                status: 'PENDING',
                user_id: req.user._id
            });
            const newOrder = yield instance.save();
            return res.status(201).json({ order, key_id: rzp.key_id });
        }));
    }
    catch (error) {
        res.status(401).json({ message: 'Something went wrong', error });
    }
});
exports.getPurchasePremium = getPurchasePremium;
const postUpdateTransactionStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order_id, payment_id, success } = req.body;
        console.log(order_id, payment_id);
        console.log(req.body);
        const order = yield order_1.default.findOne({ order_id });
        if (success === true) {
            const promise1 = order.updateOne({ $set: { payment_id: payment_id, status: 'SUCCESSFUL' } });
            const promise2 = req.user.updateOne({ $set: { premium: true } });
            Promise.all([promise1, promise2])
                .then(() => {
                return res.status(200).json({ success: true, message: 'Transaction successful' });
            })
                .catch((error) => {
                throw new Error(error);
            });
        }
        else {
            yield order.updateOne({ payment_id: payment_id, status: 'FAILED' });
            return res.status(400).json({ success: false, message: 'Transaction failed' });
        }
    }
    catch (error) {
        res.status(400).json({ success: false, message: 'Transaction failed', error });
    }
});
exports.postUpdateTransactionStatus = postUpdateTransactionStatus;
