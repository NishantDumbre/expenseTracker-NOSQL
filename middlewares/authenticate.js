const jwt = require('jsonwebtoken')
const User = require('../models/user')


exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        console.log(token)
        const tokenData = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        const result = await User.findById(tokenData.user_id)
        req.user = result
        console.log('Authenticated')
        next()
    } 
    catch (error) {
        console.log('not authenticated')
        res.status(401).json({success:'Not authenticated'})
    }
}