var mongoose = require('mongoose')
var Schema = mongoose.Schema

var group = new Schema({
  code: String,
  name: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
  store: { type: Schema.Types.ObjectId }
})

module.exports = mongoose.model('Groups', group)
