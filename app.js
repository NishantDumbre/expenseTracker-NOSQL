
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const app = express()

const routes = require('./backend/routes/routes')


const user = require('./backend/models/user')
const expense = require('./backend/models/expense')
const order = require('./backend/models/order')
const forgotPwdReq = require('./backend/models/forgot-pwd-req')
const downloadURL = require('./backend/models/download-URL')


const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


app.use(helmet())
app.use(compression())
app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors())
app.use(bodyParser.json());

app.use(routes)



app.get('/',(req,res)=>{
    console.log('url for 1sts', req.url)
    res.sendFile(path.join(__dirname,`frontend/views/login.html`))
})

app.use((req,res)=>{
    console.log('url', req.url)
    res.sendFile(path.join(__dirname,`frontend/${req.url}`))
})


user.hasMany(expense)
user.hasMany(order)
order.belongsTo(user)
user.hasMany(forgotPwdReq)
user.hasMany(downloadURL)

mongoose.connect(process.env.MONGO_DB)
    .then(() => {
        app.listen(8080)
    })
    .catch((err) => console.log(err))

