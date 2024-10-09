import { Request, Response, NextFunction } from "express";
const User = require('../models/user')
const Expense = require('../models/expense')
const S3Services = require('../services/S3Services')
const DownloadURLs = require('../models/download-URL')

interface AuthenticatedRequest extends Request {
    user?: any
  }


  export const getUserLeaderboard = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
        const users = await User.find({}, ['username', 'total_expense'])
        console.log(users)
        res.status(200).json(users)

    }
    catch (error) {
        res.status(400).json({ message: 'Something went wrong', err: error })
    }
}



export const getDownloadExpenseList = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
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
        const { _id } = req.user
        const expenses = await Expense.find({ user_id: _id }, { money: 1, description: 1, category: 1, _id: 0 })
        console.log(expenses)
        const stringifiedData = JSON.stringify(expenses)
        const fileName = `expenses${_id.toString()}/${new Date()}.txt`

        const fileURL = await S3Services.uploadToS3(stringifiedData, fileName)
        DownloadURLs.create({
            url: fileURL.Location,
            date: new Date(),
            user_id: _id.toString()
        })
        console.log(fileURL.Location)
        res.json(fileURL.Location)
    }
    catch (error) {
        res.status(500).json({ fileURL: '', success: false, err: error })
    }
}


export const getDownloadUrls = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
        console.log(true)
        const urls = await DownloadURLs.find({ user_id: req.user._id }, { url: 1, date: 1, _id: 0 })

        console.log(urls)
        res.status(200).json({ data: urls, success: true })
    }
    catch (error) {
        res.status(500).json({ success: false })
    }
}