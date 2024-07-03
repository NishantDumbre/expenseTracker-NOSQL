const Sequelize = require('sequelize')
require('dotenv').config()

console.log(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,process.env.DB_HOST)

const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    dialect:'mysql',
    host:process.env.DB_HOST
})

module.exports = sequelize