const mongoose = require('mongoose')
const { Schema } = mongoose

const User = new Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profileUrl: {
    type: String,
  },
  premium: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  total_balance: {
    type: Number,
    default: 0
  },
  highest_expense_value: {
    type: Number,
    default: 0
  },
  highest_income_value: {
    type: Number,
    default: 0
  },
  best_income_source: {
    type: String
  },
  worst_expense_source: {
    type: String
  },
  total_income_business: {
    type: Number,
    default: 0
  },
  total_income_fc: {
    type: Number,
    default: 0
  },
  total_income_gifts: {
    type: Number,
    default: 0
  },
  total_income_mf: {
    type: Number,
    default: 0
  },
  total_income_other: {
    type: Number,
    default: 0
  },
  total_income_salary: {
    type: Number,
    default: 0
  },
  total_income_stocks: {
    type: Number,
    default: 0
  },
  total_expense_entertainment: {
    type: Number,
    default: 0
  },
  total_expense_food: {
    type: Number,
    default: 0
  },
  total_expense_groceries: {
    type: Number,
    default: 0
  },
  total_expense_healthcare: {
    type: Number,
    default: 0
  },
  total_expense_home: {
    type: Number,
    default: 0
  },
  total_expense_luxury: {
    type: Number,
    default: 0
  },
  total_expense_travel: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('user', User)
