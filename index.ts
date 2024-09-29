
import express = require('express')
import bodyParser = require('body-parser')
import cors = require('cors')

import mongoose = require('mongoose')
import helmet = require('helmet')
import compression = require('compression')
import morgan = require('morgan')
import fs = require('fs')
import path = require('path')
require('dotenv').config()

const app = express()

import routes from './routes/routes'

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



mongoose.connect(process.env.MONGO_DB as string)
    .then(() => {
        app.listen(8080)
    })
    .catch((err) => console.log(err))

