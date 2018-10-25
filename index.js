const express = require('express')
const app = express()
const port = 4444
const authRouter = require('./authRouter')
const router = require('./router')

app.use(express.static('public')) // follow path default was Public's folder

app.use('/',router) //Not authen allow visit anyone 

app.use('/api',authRouter) //Authen middleware allow user handler

app.listen(port, () => console.log(`Server Listening to port ${port}`))