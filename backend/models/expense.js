const { getDb } = require('../utils/database')
const { ObjectId } = require('mongodb')


class Expenses{
    constructor(money, description, category, userId, type, id){
        this.money = money,
        this.description = description,
        this.category = category,
        this.userId = userId,
        this.type = type,
        this._id = id
    }

    async saveExpense(){
        try {
            const db = getDb()
            const result = await db.collection('expense').insertOne(this)
            return result
        } catch (error) {
            console.log(error)
        }
    }


}

module.exports = Expenses