const mongoose = require('mongoose')
const { Schema } = mongoose

const ForgotPwdReq = new Schema({
    user_id: {
        type: String,
        required: true
    },
    is_active: {
        type: Boolean,
    }
})

module.exports = mongoose.model('forgot_pwd_req', ForgotPwdReq)