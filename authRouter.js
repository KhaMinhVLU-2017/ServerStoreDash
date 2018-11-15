const express = require('express')
const authRouter = express.Router()
// Model
const Bills = require('./api/models/bill')
const Payments = require('./api/models/payment')
const Users = require('./api/models/user')
// var NonControl = require('./api/controllers/nonController')
const authController = require('./api/controllers/authController')
const bodyParser = require('body-parser')
authRouter.use(bodyParser.json()) // support json encoded bodies
authRouter.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
// Decode
const bcrypt = require('bcrypt')
const saltRounds = 10

authRouter.use((req, res, next) => {
  console.log('Request to Middle API at ' + Date.now())
  next()
})

authRouter.get('/', (req, res) => {
  res.send('Welcome to API of JudasFate')
})

// Create Payment
authRouter.post('/createPayment', (req, res) => {
  let name = req.body.name
  let cost = req.body.cost
  let interestRate = req.body.interest
  let duration = req.body.duration
  let beginTime = req.body.begintime
  let store = '5bd2de667496b64ea0b41685' // Change ID with react Cookie
  Payments.create({ name, cost, interestRate, duration, beginTime, store }, (err, small) => {
    if (err) res.json(err)
    res.json('Create Complete')
  })
})
/**
 * Get invoice at day in current Month
 */
authRouter.get('/invoicecr', (req, res) => {
  let date = new Date()
  let yearCr = date.getFullYear()
  let monthCr = date.getMonth() + 1
  // let dayCr = date.getDate()
  async function doingGetinvoice() {
    let listInvoice = await Bills.find({})
    let fillmonth = listInvoice.map((item, index) => {
      let InYear = item.date.getFullYear()
      let InMonth = item.date.getMonth() + 1
      // let InDay = item.date.getDate()
      if (InYear === yearCr && monthCr === InMonth) {
        return item
      }
    })
    res.json({ 'InVoiceMonth': fillmonth })
  }
  doingGetinvoice()
})

/**
 * Get information User
 */
authRouter.get('/user:id', (req, res) => {
  let id = req.params.id
  authController.account(id).then(account => {
    res.json(account)
  }).catch(err => {
    res.json(err)
  })
})
/**
 * Get list payment
 */
authRouter.get('/payments', (req, res) => {
  Payments.find({}, (err, data) => {
    if (err) res.json(err)
    res.json(data)
  })
})
/**
 * Create Account of Staff
 */

authRouter.post('/AccountCr', (req, res) => {
  let {username, password, pwconfirm, email} = req.body
  let groups = req.body.id_group
  let role = req.body.id_roles
  if (password !== pwconfirm) {
    res.json({
      status: 500,
      message: 'Password with Pwconfirm not match'
    })
  }
  bcrypt.hash(password,saltRounds)
  .then(hash => {
    let user = new Users({username, password: hash, email, groups, role})
    console.log(user)
    user.save(err =>{
      if(err) res.json({status: 500, message: err})
      res.json({status:200, message: 'Create user complete'})
    })
  })
  .catch(err => {
    res.json({
      status:404,
      message: err
    })
  })
})
/**
 * Get user from Groups
 */

 authRouter.get('/UsersGroup:id', (req, res) => {
   let id_Groups = req.params.id
   console.log(id_Groups)

 })
 
module.exports = authRouter
