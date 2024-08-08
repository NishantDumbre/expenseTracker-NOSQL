
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

const routes = require('./routes/routes')

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


// app.use(helmet({
//     contentSecurityPolicy: {
//       directives: {
//         'script-src': ["'self'", 'https://cdn.jsdelivr.net/npm/axios/dist/'],
//       }
//     }
//   }));



app.use(compression()) 
app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/public"))

app.use(routes)


// app.use((req,res)=>{
//     console.log('url', req.url)
//     if(req.url == '/'){
//         req.url = 'login/login.html'
//     }
//     res.sendFile(path.join(__dirname,`public/${req.url}`))
// })



mongoose.connect(process.env.MONGO_DB)
    .then(() => {
        app.listen(8080)
    })
    .catch((err) => console.log(err))

