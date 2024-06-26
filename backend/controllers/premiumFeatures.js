const Users = require('../models/userModel')
const Expenses = require('../models/expensesModel')
const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
// const fs = require('fs').promises
// const path = require('path')
const S3Services = require('../services/S3Services')
const DownloadURLs = require('../models/downloadURLModel')


exports.getUserLeaderboard = async (req, res, next) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'username', 'totalExpense']
        })

        res.status(200).json(users)

    }
    catch (error) {
        res.status(400).json({message:'Something went wrong', err:error})
    }
}



exports.getDownloadExpenseList = async (req, res, next) => {
    // try {
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
        const expenses = await req.user.getExpenses()
        const stringifiedData = JSON.stringify(expenses)
        const id = req.user.id
        const fileName = `expenses${id}/${new Date()}.txt`
        const fileURL = await S3Services.uploadToS3(stringifiedData, fileName)
        DownloadURLs.create({
            url:fileURL.Location,
            date:new Date(),
            userId: req.user.id
        })
        console.log(fileURL.Location)
        res.json(fileURL.Location)
    }
    catch (error) {
        res.status(500).json({fileURL:'', success:false, err:error})
    }
}


exports.getDownloadUrls = async(req,res,next) =>{
    try {
        const urls = await DownloadURLs.findAll({where:{userId:req.user.id}})
        console.log(urls)
        res.status(200).json({data:urls, success:true})    
    } 
    catch (error) {
        res.status(500).json({success:false})    
    }


}