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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDownloadUrls = exports.getDownloadExpenseList = exports.getUserLeaderboard = void 0;
const User = require('../models/user');
const Expense = require('../models/expense');
const S3Services = require('../services/S3Services');
const DownloadURLs = require('../models/download-URL');
const getUserLeaderboard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find({}, ['username', 'total_expense']);
        console.log(users);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({ message: 'Something went wrong', err: error });
    }
});
exports.getUserLeaderboard = getUserLeaderboard;
const getDownloadExpenseList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // earlier implementation by saving files on the server
    // try {
    // const fs = require('fs').promises
    // const path = require('path')
    //     console.log(req.user.id)
    //     const user = await Users.findAll({where:{id:req.user.id}})
    //     const result = await Expenses.findAll({where:{userId:req.user.id}})
    //     const arr = []
    //     for (let data of result) {
    //         arr.push(`${data.dataValues.money} ${data.dataValues.description} ${data.dataValues.category}`)
    //     }
    //     arr.push(`Total balance is ${user[0].totalExpense}`)
    //     console.log(arr)
    //     const p = path.join(path.dirname(require.main.filename),'backend','files',`${req.user.name}.txt`)
    //     await fs.writeFile(p, arr, (err) => {
    //         if (err) {
    //             console.error('Error creating the file:', err);
    //             return;
    //         }
    //     });
    //     res.status(200).sendFile(p)
    // }
    // catch (error) {
    //     res.status(401).json(error)
    // }
    try {
        //const expenses = await req.user.getExpenses()
        const { _id } = req.user;
        const expenses = yield Expense.find({ user_id: _id }, { money: 1, description: 1, category: 1, _id: 0 });
        console.log(expenses);
        const stringifiedData = JSON.stringify(expenses);
        const fileName = `expenses${_id.toString()}/${new Date()}.txt`;
        const fileURL = yield S3Services.uploadToS3(stringifiedData, fileName);
        DownloadURLs.create({
            url: fileURL.Location,
            date: new Date(),
            user_id: _id.toString()
        });
        console.log(fileURL.Location);
        res.json(fileURL.Location);
    }
    catch (error) {
        res.status(500).json({ fileURL: '', success: false, err: error });
    }
});
exports.getDownloadExpenseList = getDownloadExpenseList;
const getDownloadUrls = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(true);
        const urls = yield DownloadURLs.find({ user_id: req.user._id }, { url: 1, date: 1, _id: 0 });
        console.log(urls);
        res.status(200).json({ data: urls, success: true });
    }
    catch (error) {
        res.status(500).json({ success: false });
    }
});
exports.getDownloadUrls = getDownloadUrls;
