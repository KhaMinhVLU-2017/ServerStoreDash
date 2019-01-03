var Users = require('../models/user')
var InfoUsers = require('../models/infoUser')
var Roles = require('../models/role')
var Groups = require('../models/group')
var Bills = require('../models/bill')
var BillDetails = require('../models/billDetail')

module.exports = {
  account: async (id) => {
    let userMeo = await Users.findOne({_id: id}).populate('infoUser').populate('groups')
    return userMeo
  },
  getUserGroups: async (id_group) => {
    // Inner join table and get employee
    let user = await Users.find({ groups: id_group }, '_id username email status').populate({ path: 'role', match: { code: 2 } }).populate({path: 'infoUser', select: 'phonenumber'})
    return user.filter(item => item.role !== null)
  },
  getListBillRe: async (id_store) => {
    let bills = await Bills.find({ store: id_store }).sort([['date', -1]]).populate('billDetails').populate({ path: 'user', select: 'username _id' })
    return bills
  }
}
// data 7 - 24


