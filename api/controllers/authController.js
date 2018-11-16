var Users = require('../models/user')
var InfoUsers = require('../models/infoUser')
var Roles = require('../models/role')

module.exports = {
  account: async (id) => {
    let user = await Users.findOne({ _id: id })
    let infoUser = await InfoUsers.findOne({ _id: user.infoUser })
    if (!user) return ('No user found')
    if (!infoUser) return ('No user found')
    user.infoUser = infoUser
    return user
  },
  getUserGroups: async (id_group) => {
    // Inner join table and get employee
    let user = await Users.find({ groups: id_group },'_id username email').populate({path: 'role', match: {code: 2}})
    return user.filter(item => item.role!== null)
  }
}
