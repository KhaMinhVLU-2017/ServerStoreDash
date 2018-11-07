var mongoose = require('mongoose')
var Schema = mongoose.Schema

var store = new Schema({
  code: String,
  name: String,
  avatar: String,
  foundingDate: Date,
  groups: [{ type: Schema.Types.ObjectId, ref: 'Groups' }],
  payments: [{ type: Schema.Types.ObjectId, ref: 'Payments' }],
  bills: [{ type: Schema.Types.ObjectId, ref: 'Bills' }]
})

module.exports = mongoose.model('Stores', store)
