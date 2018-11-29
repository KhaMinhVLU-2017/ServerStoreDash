var Users = require('../models/user')
var InfoUsers = require('../models/infoUser')
var Roles = require('../models/role')
var Groups = require('../models/group')
var Bills = require('../models/bill')
var BillDetails = require('../models/billDetail')
var mongoose = require('mongoose')

module.exports = {
  account: async (id) => {
    let user = await Users.findOne({ _id: id })
    let infoUser = await InfoUsers.findOne({ _id: user.infoUser })
    let group = await Groups.findOne({ _id: user.groups })
    if (!user) return ('No user found')
    if (!group) return user
    user['groups'] = Object.create(group)
    if (!infoUser) return user
    user['infoUser'] = Object.create(infoUser)
    return user
  },
  getUserGroups: async (id_group) => {
    // Inner join table and get employee
    let user = await Users.find({ groups: id_group }, '_id username email status').populate({ path: 'role', match: { code: 2 } })
    return user.filter(item => item.role !== null)
  },
  getListBillRe: async (id_store) => {
    let bills = await Bills.find({ store: id_store }).populate('billDetails').populate({ path: 'user', select: 'username _id' })
    return bills
  },
  createBill: async (data, id_store, id_user) => {
    let _idBill = mongoose.Types.ObjectId()
    let target = false
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
    // console.log(listIdDetail())
    function checkTarget(target) {
      if (target) {
        return {
          status: 200,
          message: 'Save Complete'
        }
      } else {
        return {
          status: 500,
          message: 'Failed save bill'
        }
      }
    }
    function saveBill(countCr, listDetail) {
      let countTotal = countCr + 1
      BillDetails.insertMany(listDetail, (err, docs) => {
        if (err) console.log(err)
        let arr_Id = docs.map(item => item._id)
        Bills.create({
          _id: _idBill,
          billDetails: [...arr_Id],
          code: 'B' + countTotal,
          title: 'Hóa đơn bán lẻ',
          date: new Date(),
          store: id_store,
          user: id_user
        }, (err, data) => {
          if (err) console.log(err)
          target = true
        })
      })
    }
    /**
     * Fix create Bill with async await not save multiple
     */
    // let listDetail = await listIdDetail()
    let countCr = await Bills.count({})
    await saveBill(countCr, listIdDetail())
    /**
     * Fix async await for timeout return response
     */
    return checkTarget(target)
  }
}
// data 7 - 24


