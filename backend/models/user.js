const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema('users', {
    username: {
        type: STRING,
        required: true
    },
    name: {
        type: STRING,
        required: true
    },
    password: {
        type: STRING,
        required: true
    },
    email:{
        type: STRING,
        required: true
    },
    isPremium: Sequelize.BOOLEAN,
    totalExpense: {
        type: INTEGER,
        defaultValue: 0
    }
})

module.exports = mongoose.model('user', User)