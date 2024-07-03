const mongoose = require('mongoose')
const { Schema } = mongoose

const Expense = new Schema({
    money: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    user_id:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        required: true,
    }
    
})

module.exports = mongoose.model('expense', Expense)