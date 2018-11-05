var mongoose = require('mongoose')
var Schema = mongoose.Schema

var role = new Schema({
  code: String,
  name: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'Users' }]
})

module.exports = mongoose.model('Roles', role)
