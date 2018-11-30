const express = require('express')
const router = express.Router()
var mongoose = require('mongoose')
const BillDetails = require('./api/models/billDetail')
const Bills = require('./api/models/bill')
const bodyParser = require('body-parser')
router.use(bodyParser.json()) // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })) 


router.get('/', (req, res) => {
  res.send('Welcome to Server')
})
/**
 * Create Bill for Staff
 */
router.post('/crBill',async (req, res) => {
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
  let {id_user, id_store} = req.params
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
    res.json({status: 200 ,'InVoiceDaily': fillday })
  }
  doingGetinvoice(id_store, id_user)
})

module.exports = router
