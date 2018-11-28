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
    let bill = new Bills()
    let target = false
    async function listIdDetail () {
      let arrIdDetail = []
      for (let [index, item] of data.entries()) {
        // count can't incre [Complete]
        let count = index + 1
        await BillDetails.create({
          code: 'BD' + count,
          name: item.idpd,
          quantity: item.idqt,
          price: item.idpc,
          bill: bill._id
        }, (err, data) => {
          if (err) return err
          count++
          arrIdDetail.push(data._id)
          return data
        })
      }
      return arrIdDetail
    }
    function checkTarget(target) {
      if(target) {
        return {
          status:200,
          message: 'Save Complete'
        }
      }else {
        return {
          status:500,
          message: 'Failed save bill'
        }
      }
    }
    async function saveBill(countCr, listDetail) {
      let countTotal = countCr + 1
      bill.billDetails = [...listDetail]
      console.log(listDetail)
      bill.code = 'B' + countTotal
      bill.title = 'Hoa don ban le'
      bill.date = new Date()
      bill.store = id_store
      bill.user = id_user
      await bill.save(err => {
        if(err) console.log(err)
        target = true
      })
    }
    /**
     * Fix create Bill with async await not save multiple
     */
    let listDetail = await listIdDetail()
    let countCr = await Bills.count({})
    let save = await saveBill(countCr, listDetail)
    return await checkTarget(target)
  }
}
// data 7 - 24


