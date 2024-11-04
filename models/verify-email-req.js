const mongoose = require('mongoose')
const { Schema } = mongoose

const VerifyEmailReq = new Schema({
    user_id: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
    }
})

module.exports = mongoose.model('verify-email-req', VerifyEmailReq)