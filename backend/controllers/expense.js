const Expense = require('../models/expense')
const User = require('../models/user')



exports.postExpense = async (req, res, next) => {
    try {
        const { money, description, category, type } = req.body
        const { _id } = req.user
        const instance = new Expense({
            money,
            description,
            category,
            user_id: _id.toString(),
            type
        })
        const newExpense = await instance.save()

        const user = await User.findById(_id)
        if (!user) return res.status(404).json({ success: false, message: 'user not found' })

        if (type == 'INCOME') {
            user.total_expense = Number(user.total_expense) + Number(money);
        }
        else {
            user.total_expense = Number(user.total_expense) - Number(money);
        }

        await user.save()

        res.status(200).json(instance)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}



exports.getExpense = async (req, res, next) => {
    const LIMIT_PER_PAGE = parseInt(req.query.results)
    const page = parseInt(req.query.page) || 1;
    try {
        const totalNoExpenses = await Expense.countDocuments({ user_id: req.user._id })
        const expenses = await Expense.find({ user_id: req.user._id })
            .skip((page - 1) * LIMIT_PER_PAGE)
            .limit(LIMIT_PER_PAGE)
            .sort({ _id: -1 })
        res.status(200).json({
            expenses: expenses,
            currentPage: page,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            hasNextPage: LIMIT_PER_PAGE * page < totalNoExpenses,
            nextPage: page + 1,
            lastPage: Math.ceil(totalNoExpenses / LIMIT_PER_PAGE)
        })
    }
    catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
}


exports.deleteExpense = async (req, res, next) => {
    try {
        console.log(true)
        const { id } = req.params
        const { _id } = req.user

        const expense = await Expense.findById(id)
        const user = await User.findById(_id)
        if (expense.type == 'INCOME') {
            user.total_expense = Number(user.total_expense) - Number(expense.money);
        }
        else {
            user.total_expense = Number(user.total_expense) + Number(expense.money);
        }
        await user.save()
        await expense.deleteOne({_id:id})

        res.status(200).json({ success: true, message: 'Deleted successfully' })
    }
    catch (error) {
        console.log(error)
        res.status(401).json({ success: false, message: `Couldn't delete expense` })
    }
}


