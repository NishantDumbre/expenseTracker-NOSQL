const mongoose = require('mongoose')
const { Schema } = mongoose 

const User = new Schema({
  username: {
    type: String, 
    required: true
  },
  name: {
    type: String,
    required: true
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
  premium: {
    type: Boolean,
    default: false
  },
  total_expense: {
    type: Number, 
    default: 0
  }
})

module.exports = mongoose.model('user', User)
