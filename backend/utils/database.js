const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let _db

const mongoConnect = async (callback) =>{
    try {
        const client = await MongoClient.connect(process.env.MONGO_DB)
        console.log('Connected')
        _db = client.db()
    } catch (error) {
        console.log(error)
    }
}

const getDb = () =>{
    if(_db){
        return _db
    }
    throw 'No database found'
}

module.exports = {mongoConnect, getDb}