var mongoose = require('mongoose')
var Schema = mongoose.Schema

var bill = new Schema({
  code: String,
  title: String,
  date: Date,
  store: { type: Schema.Types.ObjectId, ref: 'Stores' },
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  billDetails: [{ type: Schema.Types.ObjectId, ref: 'BillDetails' }]
})

module.exports = mongoose.model('Bills', bill)
