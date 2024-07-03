const sequelize = require('../utils/database')
const Sequelize = require('sequelize')

const DownloadURLs = sequelize.define('downloadurls', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    url: {
        allowNull: false,
        type: Sequelize.STRING
    },
    date:{
        type: Sequelize.DATE
    },
    userId:{
        allowNull:false,
        type: Sequelize.INTEGER
    }
})

module.exports = DownloadURLs