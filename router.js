const express = require('express')
const router = express.Router()
// Model
const Bills = require('./api/models/bill')
// var NonControl = require('./api/controllers/nonController')
var NonControl = require('./api/controllers/nonController')

router.get('/', (req, res) => {
  res.send('Welcome to Server')
})
/**
 * Get invoice at day in current Month
 */
router.get('/invoicecr', (req, res) => {
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
router.get('/user:id', (req, res) => {
  let id = req.params.id
  NonControl.account(id).then(account => {
    res.json(account)
  }).catch(err => {
    res.json(err)
  })
})

module.exports = router
