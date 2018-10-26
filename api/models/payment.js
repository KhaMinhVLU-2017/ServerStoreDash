var mongoose = require('mongoose')
var Schema = mongoose.Schema
var model = mongoose.model

var payment = new Schema ({
    cost: Number,
    interestRate: Number,
    timeBegin: Date,
    duration: Number,
    store: {type: Schema.Types.ObjectId, ref: 'Stores'}
})

module.exports = model('Payments', payment)