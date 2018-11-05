var Users = require('../models/user')
var InfoUsers = require('../models/infoUser')

module.exports = {
  account: async (id) => {
    let user = await Users.findOne({ _id: id })
    let infoUser = await InfoUsers.findOne({_id: user.infoUser})
    if (!user) return ('No user found')
    if (!infoUser) return ('No user found')
    user.infoUser = infoUser
    return user
  }
}
