const { getDb } = require('../utils/database')
const { ObjectId } = require('mongodb')

class ForgotPasswordRequests {
    constructor(userId, isActive) {
        this.userId = userId,
        this.isActive = true
    }

    async saveForgotPwdReq() {
        try {
            const db = getDb()
            const result = await db.collection('forgot_pwd_req').insertOne(this)
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static async findForgotPwdReqActive(pwdId) {
        try {
            console.log('find hit')
            const db = getDb()
            const result = await db.collection('forgot_pwd_req').find({ _id: new ObjectId(pwdId), isActive: true }).toArray()
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static async findForgotPwdReq(pwdId) {
        try {
            console.log('find hit')
            const db = getDb()
            const result = await db.collection('forgot_pwd_req').find({ _id: new ObjectId(pwdId) }).toArray()
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static async updateForgotPwdReq(pwdId) {
        try {
            const db = getDb()
            const result = await db.collection('forgot_pwd_req').updateOne(
                { _id: new ObjectId(pwdId) },
                { $set: { isActive: false } }
            )
            console.log('completed')
            return result
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = ForgotPasswordRequests