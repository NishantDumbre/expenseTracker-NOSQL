const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoConnect = async (callback) =>{
    try {
        const client = await MongoClient.connect(process.env.MONGO_DB)
        const callbackExecuter = (client) =>{
            console.log('Connected')
            callback(client)
        }
        callbackExecuter(client)
    } catch (error) {
        console.log(error)
    }
}

module.exports = mongoConnect