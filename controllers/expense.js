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
        const newExpense = await instance.save();

        // Fetch the user from the database
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Build the dynamic property name
        const propertyName = `total_${type.toLowerCase()}_${category.toLowerCase()}`;

        // Initialize the property if it doesn't exist to prevent NaN issues
        if (typeof user[propertyName] === 'undefined') {
            user[propertyName] = 0;
        }

        // Update the user's balance and specific category total
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
        console.log(true)
        const { id } = req.params
        const { _id } = req.user

        const expense = await Expense.findById(id)
        const user = await User.findById(_id)
        if (expense.type == 'INCOME') {
            user.total_balance = Number(user.total_balance) - Number(expense.money);
        }
        else {
            user.total_balance = Number(user.total_balance) + Number(expense.money);
        }
        await user.save()
        await expense.deleteOne({ _id: id })

        res.status(200).json({ success: true, message: 'Deleted successfully' })
    }
    catch (error) {
        console.log(error)
        res.status(401).json({ success: false, message: `Couldn't delete expense` })
    }
}


