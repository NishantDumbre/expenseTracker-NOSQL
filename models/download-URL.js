const mongoose = require('mongoose')
const { Schema } = mongoose

const DownloadURL = new Schema({
    url: {
        type: String,
        required: true,
    },
    date:{
        type: Date,
        required: true
    },
    user_id:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('download_url', DownloadURL)