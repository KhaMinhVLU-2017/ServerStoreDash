var mongoose = require('mongoose')
var Schema = mongoose.Schema
var model = mongoose.model

var billDetail = new Schema({
    code: String,
    name: String,
    quantity: Number,
    price: Number,
    bill: {type: Schema.Types.ObjectId, ref: 'Bills'}
})

module.exports = model('BillDetails', billDetail)