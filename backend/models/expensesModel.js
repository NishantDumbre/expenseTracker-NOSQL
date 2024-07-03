const sequelize = require('../utils/database')
const Sequelize = require('sequelize')

const Expenses = sequelize.define('expenses', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    money: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    description: {
        allowNull: false,
        type: Sequelize.STRING
    },
    category: {
        allowNull: false,
        type: Sequelize.STRING
    },
    userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    type:{
        type: Sequelize.STRING
    }
    
})

module.exports = Expenses