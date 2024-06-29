const { getDb } = require('../utils/database')
const { ObjectId } = require('mongodb')


class Users {
    constructor(name, username, password, email) {
        this.name = name,
            this.username = username,
            this.password = password,
            this.email = email,
            this.isPremium = false,
            this.totalExpense = 0
    }

    async saveUser() {
        const db = getDb()
        try {
            const result = await db.collection('users').insertOne(this)
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static async findUserByUsername(findUsername) {
        const db = getDb()
        try {
            const result = await db.collection('users').find({ username: findUsername }).toArray()
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static async findUserByEmail(findEmail) {
        const db = getDb()
        try {
            const result = await db.collection('users').find({ email: findEmail }).toArray()
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static async findUserById(findId) {
        const db = getDb()
        try {
            const result = await db.collection('users').find({ _id: ObjectId(findId) }).toArray()
            return result
        } catch (error) {
            console.log(error)
        }
    }


    static async updatePassword(id, password) {
        try {
            const db = getDb()
            const result = await db.collection('users').updateOne(
                { _id: new ObjectId(id) },
                { $set: { password } }
            )
            return result
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Users