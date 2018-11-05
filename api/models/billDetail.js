var mongoose = require('mongoose')
var Schema = mongoose.Schema

var billDetail = new Schema({
  code: String,
  name: String,
  quantity: Number,
  price: Number,
  bill: { type: Schema.Types.ObjectId, ref: 'Bills' }
})

module.exports = mongoose.model('BillDetails', billDetail)