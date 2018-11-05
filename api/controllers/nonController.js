var Users = require('../models/user')
var mongoose = require('mongoose')

module.exports = {
  account: (id) => {
    var user = new Users()
    console.log(new mongoose.Types.ObjectId)
    return 'Hello world ' + id
  }
}
