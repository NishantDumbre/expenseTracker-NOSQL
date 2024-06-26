
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const app = express()


// const routes = require('./backend/routes/routes')
const { mongoConnect } = require('./backend/utils/database')
// const user = require('./backend/models/userModel')
// const expenses = require('./backend/models/expensesModel')
// const orders = require('./backend/models/ordersModel')
// const forgotPasswordRequests = require('./backend/models/forgotPasswordrRequestsMode')
// const downloadURLs = require('./backend/models/downloadURLModel')


const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })



app.use(helmet())
app.use(compression())
app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors())
app.use(bodyParser.json({ extended: false }));

//app.use(routes)


// app.get('/',(req,res)=>{
//     console.log('url for 1sts', req.url)
//     res.sendFile(path.join(__dirname,`frontend/views/login.html`))
// })

// app.use((req,res)=>{
//     console.log('url', req.url)
//     res.sendFile(path.join(__dirname,`frontend/${req.url}`))
// })



mongoConnect(() => {
    app.listen(8080)
})