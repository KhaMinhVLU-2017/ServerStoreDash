const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const BillDetails = require('./api/models/billDetail')
const Bills = require('./api/models/bill')
const Users = require('./api/models/user')
const bodyParser = require('body-parser')
router.use(bodyParser.json()) // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true }))
const bcrypt = require('bcrypt')
const saltRounds = 10
const nodemailer = require('nodemailer')
const { myEmail, api } = require('./config')
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
  res.send('Welcome to Server')
})
/**
 * Create Bill for Staff
 */
router.post('/crBill', async (req, res) => {
  let { data, id_store, id_user } = req.body
  let _idBill = mongoose.Types.ObjectId()
  function listIdDetail() {
    let arrIdDetail = []
    for (let [index, item] of data.entries()) {
      let count = index + 1
      let billDetail = new BillDetails()
      billDetail.code = count
      billDetail.name = item.idpd.trim()
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
/**
 * Get Invoice daily of Staff
 */
router.get('/invoice/:id_user/:id_store', (req, res) => {
  let { id_user, id_store } = req.params
  let date = new Date()
  let yearCr = date.getFullYear()
  let monthCr = date.getMonth() + 1
  let dayCr = date.getDate()
  async function doingGetinvoice(id_store, id_user) {
    let listInvoice = await Bills.find({ store: id_store, user: id_user }).populate('billDetails')
    let fillday = listInvoice.filter((item, index) => {
      let InYear = item.date.getFullYear()
      let InMonth = item.date.getMonth() + 1
      let InDay = item.date.getDate()
      if (InYear === yearCr && monthCr === InMonth && InDay === dayCr) {
        return item
      }
    })
    res.json({ status: 200, 'InVoiceDaily': fillday })
  }
  doingGetinvoice(id_store, id_user)
})
/**
 * Forget Password Staff
 */
router.post('/forgetpw', (req, res) => {
  let { email, phone } = req.body
  // Find email of staff forgetpass
  Users.findOne({ email }).populate('infoUser', 'phonenumber').exec((err, data) => {
    if (data === null) {
      res.json({
        status: 404,
        message: 'Not found your\'s email or Phone Number'
      })
    } else
      if (data.infoUser.phonenumber !== phone) {
        res.json({
          status: 404,
          message: 'Not found your\'s email or Phone Number'
        })
      } else {
        // random password new
        let passNew = randoomLength()
        // hash password
        bcrypt.hash(passNew, saltRounds, (err, hash) => {
          if (err) {
            res.json({
              status: 500,
              message: 'Hash password is faile'
            })
          }
          // save password
          data.password = hash
          data.save((err) => {
            if (err) {
              res.json({
                status: 500,
                message: 'Update password is faile'
              })
            } else {
              // send email
              nodemailer.createTestAccount(() => {
                let transporter = nodemailer.createTransport(myEmail)
                let subject = 'Hello ' + data.username + ' ✔'
                let url = api.urlClient
                let text = '<h3>You have requested a password change</h3>'
                  + '<p>Your\'s new password: <strong>' + passNew + '</strong> </p>'
                  + '<p>You can login with new password at the moment </p>'
                  + '<p> That\'s link: ' + url + '</p>'
                let mailOptions = {
                  from: 'Store Nhicosmetics <nhicosmetics2019@gmail.com>', // sender address
                  to: email, // list of receivers
                  subject: subject, // Subject line
                  text: text, // plain text body
                  html: text // html body
                }
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    res.json(error)
                  }
                  console.log('Send email complete ' + info)
                  res.json({
                    message: 'Send email complete',
                    status: 200
                  })
                })
              })
            }
          })
        })
      }
  })
})
/**
 * ChangePassword
 */
router.post('/changepw', (req, res) => {
  let { oldpass, newpass, cfnewpass, id_user } = req.body
  console.log(req.body)
  // TOdo write code
})
/**
 * Login
 */
router.post('/login', (req, res) => {
  let { email, password } = req.body
  Users.findOne({ email }, (err, user) => {
    let opt = {
      path: 'role',
      select: 'name code'
    }
    if (!user) {
      res.json({ status: 404, message: 'Account not exist' })
    } else {
      Users.populate(user, opt, (err, user) => {
        if (err) {
          res.json({ status: 404, message: 'Account not exist' })
        }
        if (!user) {
          res.json({ status: 404, message: 'Email or password is wrong' })
        }
        if (user.role.code !== '2') {
          res.json({ status: 404, message: 'Email or password is wrong' })
        } else {
          bcrypt.compare(password, user.password)
            .then(check => {
              if (!check) {
                res.json({ status: 404, message: 'Email or password is wrong' })
              }
              let { _id, username, email, infoUser } = user
              jwt.sign({ username, email, infoUser, _id }, api.keyToken, { expiresIn: '1h' }, (err, token) => {
                res.json({ status: 200, token, username, email, _id })
              })
            })
        }
      })
    }
  })
})


/**
 * Randoom Length
 */
function randoomLength() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = router
