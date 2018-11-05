const express = require('express')
const router = express.Router()
// Model
const Bills = require('./api/models/bill')
// var NonControl = require('./api/controllers/nonController')
var NonControl = require('./api/controllers/nonController')

router.get('/', (req, res) => {
  res.send('Welcome to Server')
})
router.get('/user:id', (req, res) => {
  let param = req.params.id
  let message = NonControl.account(454)
  res.send(message)
})
/**
 * Get invoice at day in current Month
 */
router.get('/invoicecr', (req, res) => {
  let date = new Date()
  let yearCr = date.getFullYear()
  let monthCr = date.getMonth() + 1
  // let dayCr = date.getDate()
  async function doingGetinvoice () {
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

module.exports = router
