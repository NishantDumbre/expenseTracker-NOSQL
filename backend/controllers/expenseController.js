const Expenses = require('../models/expense')
const Users = require('../models/user')
const jwt = require('jsonwebtoken')



exports.postExpense = async (req, res, next) => {
    try {
        const { money, description, category, type } = req.body
        const userId = req.user[0]._id.toString()
        const result = new Expenses(money, description, category, userId, type)
        result.saveExpense()
        let user = await Users.findUserById(userId)
        user = user[0]
        if (type == 'income') {
            user.totalExpense = Number(user.totalExpense) + Number(money);
        }
        else {
            user.totalExpense = Number(user.totalExpense) - Number(money);
        }
        console.log(user)
        const updatedUser = new Users(user.name, user.username, user.password, user.email, userId, user.totalExpense)
        console.log('<<<<<<<<<<<<<<<<<<<<<')
        console.log(updatedUser)
        updatedUser.saveUser()
        res.status(200).json(result)
    }
    catch (error) {
        res.status(500).json(error)
    }
}



exports.getExpense = async (req, res, next) => {
    const LIMIT_PER_PAGE = parseInt(req.query.results)
    const page = parseInt(req.query.page) || 1;
    try {
        const totalNoExpenses = await Expenses.count({ where: { userId: req.user.dataValues.id } })
        const result = await Expenses.findAll({
            where: { userId: req.user.dataValues.id },
            offset: (page - 1) * LIMIT_PER_PAGE,
            limit: LIMIT_PER_PAGE
        })
        const arr = []
        for (let data of result) {
            arr.push(data.dataValues)
        }

        res.status(200).json({
            expenses: arr,
            currentPage: page,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            hasNextPage: LIMIT_PER_PAGE * page < totalNoExpenses,
            nextPage: page + 1,
            lastPage: Math.ceil(totalNoExpenses / LIMIT_PER_PAGE)
        })
    }
    catch (error) {
        res.status(401).json(error)
    }
}


exports.deleteExpense = async (req, res, next) => {
    try {
        const t = await Sequelize.transaction()
        const id = req.params.id
        const userId = req.user.dataValues.id
        const expense = await Expenses.findAll({ where: { id } })
        const user = await Users.findByPk(userId)
        if (expense[0].type == 'income') {
            user.totalExpense = Number(user.totalExpense) - Number(expense[0].money);
        }
        else {
            user.totalExpense = Number(user.totalExpense) + Number(expense[0].money);
        }
        await Users.update({
            totalExpense: user.totalExpense
        }, {
            where: { id: userId },
            transaction: t
        })

        await Expenses.destroy({ where: { id, userId }, transaction: t })
        t.commit()
        res.status(200).json('Deleted successfully')
    }
    catch (error) {
        t.rollback()
        res.status(401).json(error)
    }
}


