var Users = require('../models/user')
var InfoUsers = require('../models/infoUser')
var Roles = require('../models/role')
var Groups = require('../models/group')
var Bills = require('../models/bill')
var BillDetails = require('../models/billDetail')

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
    let user = await Users.find({ groups: id_group }, '_id username email status').populate({ path: 'role', match: { code: 2 } }).populate({path: 'infoUser', select: 'phonenumber'})
    return user.filter(item => item.role !== null)
  },
  getListBillRe: async (id_store) => {
    let bills = await Bills.find({ store: id_store }).populate('billDetails').populate({ path: 'user', select: 'username _id' })
    return bills
  }
}
// data 7 - 24


