const jwt = require('jsonwebtoken')
const Users = require('../models/user')


exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        const tokenData = jwt.verify(token, process.env.TOKEN_SECRET_KEY)
        console.log(tokenData)
        let result = await Users.findUserById(tokenData.userId)
        req.user = result
        console.log('Authenticated')
        next()
    } 
    catch (error) {
        res.status(401).json({success:'Not authenticated'})
    }
}