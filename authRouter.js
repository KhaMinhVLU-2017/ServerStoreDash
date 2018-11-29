const express = require('express')
const authRouter = express.Router()
var mongoose = require('mongoose')
// Model
const Bills = require('./api/models/bill')
const Payments = require('./api/models/payment')
const Users = require('./api/models/user')
const BillDetails = require('./api/models/billDetail')
const InfoUsers = require('./api/models/infoUser')
const Roles = require('./api/models/role')
const Groups = require('./api/models/group')
// var NonControl = require('./api/controllers/nonController')
const authController = require('./api/controllers/authController')
const bodyParser = require('body-parser')
authRouter.use(bodyParser.json()) // support json encoded bodies
authRouter.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
// Decode
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const saltRounds = 10
var jwt = require('jsonwebtoken')
const { myEmail, api } = require('./config')

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
authRouter.get('/invoicecr:id_store', (req, res) => {
  let id_store = req.params.id_store
  let date = new Date()
  let yearCr = date.getFullYear()
  let monthCr = date.getMonth() + 1
  // let dayCr = date.getDate()
  async function doingGetinvoice(id_store) {
    let listInvoice = await Bills.find({ store: id_store }).populate('billDetails')
    let fillmonth = listInvoice.filter((item, index) => {
      let InYear = item.date.getFullYear()
      let InMonth = item.date.getMonth() + 1
      // let InDay = item.date.getDate()
      if (InYear === yearCr && monthCr === InMonth) {
        return item
      }
    })
    res.json({ 'InVoiceMonth': fillmonth })
  }
  doingGetinvoice(id_store)
})

/**
 * Get information User
 */
authRouter.get('/user:id', (req, res) => {
  let id = req.params.id
  authController.account(id).then(account => {
    res.json({
      status: 200,
      account
    })
  }).catch(err => {
    res.json(err)
  })
})
/**
 * Remove account
 */
authRouter.delete('/user', (req, res) => {
  console.log(req.body)
  let { _id } = req.body
  Users.findByIdAndDelete({ _id }, (err, data) => {
    if (err) res.json({
      status: 500,
      message: err
    })
    res.json({
      status: 200,
      message: 'Remove complete user'
    })
  })
})
/**
 * Get list payment
 */
authRouter.get('/payments:id_store', (req, res) => {
  let id_store = req.params.id_store
  Payments.find({ store: id_store }, (err, data) => {
    if (err) res.json(err)
    res.json(data)
  })
})
/**
 * Delete Payment
 */
authRouter.delete('/payments', (req, res) => {
  // ID Store Save Avability
  let { _id, id_store } = req.body
  Payments.findByIdAndDelete({ _id }, (err, data) => {
    if (err) res.json({
      status: 500,
      message: err
    })
    res.json({
      status: 200,
      message: 'Remove complete user'
    })
  })
})
/**
 * Create Account of Staff
 */

authRouter.post('/AccountCr', (req, res) => {
  let { username, password, pwconfirm, email } = req.body
  let groups = req.body.id_group
  let role = req.body.id_roles
  if (username.length === 0 || email.length === 0) {
    res.json({
      status: 500,
      message: 'Please fill username and password'
    })
  }
  if (password !== pwconfirm) {
    res.json({
      status: 500,
      message: 'Password with Pwconfirm not match'
    })
  }
  if (username.length > 0 && email.length > 0 && password === pwconfirm) {
    let token = jwt.sign({ email, username }, api.keyToken, { expiresIn: '1h' })
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) res.json({
        message: 'Hash error',
        status: 500
      })
      let userOld = await Users.findOne({ email: email })
      if (userOld) {
        res.json({
          message: 'Email is exist',
          status: 500
        })
      } else {
        let user = new Users()
        user.email = email
        user.username = username
        user.password = hash
        user.groups = groups
        user.role = role
        user.status = 'inactive'
        user.save()
        nodemailer.createTestAccount(() => {
          let transporter = nodemailer.createTransport(myEmail)
          let subject = 'Hello ' + username + ' ✔'
          let url = api.local + '/api/verify' + token
          let text = '<p>You are check url verify account from Nhicosmetics: ' + url + '</p>'
          let mailOptions = {
            from: 'Store Nhicosmetics <nhicosmetics2019@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: text // html body
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error)
            }
            console.log('Send email complete ' + email)
          })
          res.json({
            message: 'complete',
            status: 200
          })
        })
      }
    })
  }
})
/**
 * Get user from Groups
 */

authRouter.get('/GroupUsers:id', (req, res) => {
  let id_Groups = req.params.id
  async function doing(id_Groups) {
    let listdata = await authController.getUserGroups(id_Groups)
    res.json({
      status: 200,
      listdata
    })
  }
  doing(id_Groups)
})

/**
 * Get list bill for revenue
 */

authRouter.get('/bills:id_store', (req, res) => {
  let { id_store } = req.params
  async function doing(id_store) {
    let bills = await authController.getListBillRe(id_store)
    res.json({
      status: 200,
      bills
    })
  }
  doing(id_store)
})
/**
 * Verify Account
 */
authRouter.get('/verify:token', (req, res) => {
  let token = req.params.token
  jwt.verify(token, api.keyToken, function (err, decoded) {
    if (err) res.json({
      message: 'Token error',
      status: 500
    })
    let emailCr = decoded.email
    Users.findOneAndUpdate({ email: emailCr }, { status: 'active' }, (err) => {
      if (err) res.json({
        message: 'Token error',
        status: 500
      })
      res.redirect(api.urlClient)
    })
  })
})
/**
 * Create Bill for Staff
 */
authRouter.post('/crBill',async (req, res) => {
  let { data, id_store, id_user } = req.body
  let _idBill = mongoose.Types.ObjectId()
  function listIdDetail() {
    let arrIdDetail = []
    for (let [index, item] of data.entries()) {
      let count = index + 1
      let billDetail = new BillDetails()
      billDetail.code = count
      billDetail.name = item.idpd
      billDetail.quantity = item.idqt
      billDetail.price = item.idpc
      billDetail.bill = _idBill
      arrIdDetail.push(billDetail)
    }
    return arrIdDetail
  }
  function saveBill(countCr, listDetail) {
    let countTotal = countCr + 1
    BillDetails.insertMany(listDetail, (err, docs) => {
      if (err) res.json({
        status: 500,
        message: 'Failed save billDetail'
      })
      let arr_Id = docs.map(item => item._id)
      Bills.create({
        _id: _idBill,
        billDetails: [...arr_Id],
        code: 'B' + countTotal,
        title: 'Hóa đơn bán lẻ',
        date: new Date(),
        store: id_store,
        user: id_user
      }, (err) => {
        if (err) res.json({
          status: 500,
          message: 'Failed save bill'
        })
        res.json({
          status: 200,
          message: 'Save Complete'
        })
      })
    })
  }
  let countCr = await Bills.count({})
  await saveBill(countCr, listIdDetail())
})
module.exports = authRouter
