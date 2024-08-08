const mongoose = require('mongoose')
const { Schema } = mongoose

const Order = new Schema({
    payment_id: {
        type: String
    },
    order_id: {
        type: String
    },
    status: {
        type: String
    },
})

module.exports = mongoose.model('order', Order)