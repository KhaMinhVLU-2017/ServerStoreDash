var mongoose = require('mongoose')
var Schema = mongoose.Schema

var user = new Schema({
  username: String,
  password: String,
  avatar: String,
  email: String,
  status: String,
  role: { type: Schema.Types.ObjectId, ref: 'Roles' },
  groups: [{ type: Schema.Types.ObjectId, ref: 'Groups' }],
  infoUser: { type: Schema.Types.ObjectId, ref: 'infoUsers' }
})

module.exports = mongoose.model('Users', user)
