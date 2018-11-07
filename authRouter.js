const express = require('express')
const authRouter = express.Router()
const bodyParser = require('body-parser')
authRouter.use(bodyParser.json()) // support json encoded bodies
authRouter.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies

authRouter.use((req, res, next) => {
  console.log('Request to Middle API at ' + Date.now())
  next()
})

authRouter.get('/', (req, res) => {
  res.send('Welcome to API of JudasFate')
})

// Create Payment
authRouter.post('/createPayment', (req, res) => {
  console.log(req.body)
  res.json('Da nhan dc post')
})

module.exports = authRouter
