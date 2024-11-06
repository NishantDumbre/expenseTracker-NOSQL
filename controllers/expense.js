const Expense = require('../models/expense')
const User = require('../models/user')



exports.postExpense = async (req, res, next) => {
    try {
        const { type } = req.params;
        const { title, money, description, category, date } = req.body;
        console.log(type, title, money, description, category, date);
        const { _id } = req.user;

        // Create a new expense instance
        const instance = new Expense({
            user_id: _id.toString(),
            type,
            title,
            money,
            description,
            category: category.toUpperCase(),
            date
        });
        const newExpensePromise = instance.save();
        const userPromise = User.findById(_id);

        const [newExpense, user] = await Promise.all([
            newExpensePromise,
            userPromise
        ])

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const propertyName = `total_${type.toLowerCase()}_${category.toLowerCase()}`;

        if (typeof user[propertyName] === 'undefined') {
            user[propertyName] = 0;
        }

        if (type.toUpperCase() === 'INCOME') {
            user.total_balance += Number(money);
            if (user.highest_income_value < Number(money)) {
                user.highest_income_value = Number(money);
            }
            user[propertyName] += Number(money);
        } else if (type.toUpperCase() === 'EXPENSE') {
            user.total_balance -= Number(money);
            if (user.highest_expense_value < Number(money)) {
                user.highest_expense_value = Number(money);
            }
            user[propertyName] += Number(money);
        }

        // Save the updated user object and exclude the password field in the response
        const updatedUser = await user.save();
        const { password, ...userCopy } = updatedUser.toObject();

        // Respond with the updated user object
        res.status(200).json({ success: true, message: 'Added record successfully', data: userCopy });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};




exports.getExpense = async (req, res, next) => {
    const LIMIT_PER_PAGE = parseInt(req.query.results)
    const page = parseInt(req.query.page) || 1;
    try {
        const totalNoRecordsPromise = Expense.countDocuments({ user_id: req.user._id })
        const recordsPromise = Expense.find({ user_id: req.user._id })
            .select('-__v -user_id')
            .sort({ date: -1 })
            .skip((page - 1) * LIMIT_PER_PAGE)
            .limit(LIMIT_PER_PAGE)

        const userDataPromise = User.findById(req.user._id)

        const [totalNoRecords, records, allUserData] = await Promise.all([
            totalNoRecordsPromise,
            recordsPromise,
            userDataPromise
        ]);

        const { verified, premium, name, email, profileUrl, _id, password, ...userData } = allUserData._doc
        console.log(records)

        res.status(200).json({
            records: records,
            currentPage: page,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            hasNextPage: LIMIT_PER_PAGE * page < totalNoRecords,
            nextPage: page + 1,
            lastPage: Math.ceil(totalNoRecords / LIMIT_PER_PAGE),
            userData: userData
        })
    }
    catch (error) {
        console.log(error)
        res.status(401).json(error)
    }
}


exports.deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params
        const { _id } = req.user

        const expensePromise = Expense.findById(id)
        const userPromise = User.findById(_id)
        const [expense, user] = await Promise.all([
            expensePromise,
            userPromise
        ])

        // if (expense.type == 'INCOME') {
        //     user.total_balance = Number(user.total_balance) - Number(expense.money);
        // }
        // else {
        //     user.total_balance = Number(user.total_balance) + Number(expense.money);
        // }
        // await user.save()
        // await expense.deleteOne({ _id: id })

        const { money, type, category } = expense
        const propertyName = `total_${type.toLowerCase()}_${category.toLowerCase()}`;

        if (typeof user[propertyName] === 'undefined') {
            user[propertyName] = 0;
        }

        if (expense.type === 'INCOME') {
            user.total_balance -= Number(money);
            user[propertyName] -= Number(money);
        } else if (expense.type === 'EXPENSE') {
            user.total_balance += Number(money);
            user[propertyName] += Number(money);
        }

        const [updatedUser] = await Promise.all([
            user.save(),
            expense.deleteOne({ _id: id })
        ])

        const { password, ...userCopy } = updatedUser.toObject();

        // Respond with the updated user object
        res.status(200).json({ success: true, message: 'Deleted record successfully', data: userCopy });
    }
    catch (error) {
        console.log(error)
        res.status(401).json({ success: false, message: `Couldn't delete expense` })
    }
}


