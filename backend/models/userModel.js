const { getDb } = require('../utils/database')
const uuidv4 = require('uuid').v4

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    name: {
        allowNull: false,
        type: Sequelize.STRING
    },
    password: {
        allowNull: false,
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    isPremium: Sequelize.BOOLEAN,
    totalExpense: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
})



class Users{
    constructor(id, name, username, password, email){
        this.id = id,
        this.name = name,
        this.username = username,
        this.password = password,
        this.email = email,
        this.isPremium = false,
        this.totalExpense = 0
    }

    async save(){
        const db = getDb()
        try {
           const result = await db.collection('users').insertOne(this)
           console.log(result)
           return result
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Users