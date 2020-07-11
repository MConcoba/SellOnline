'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema


var ProductSchema = Schema({
    nameProduct: String,
    amount: Number,
    priceUnitary: Number,
    nameCategory: String,
    amountBuy: Number,

})

module.exports = mongoose.model('product', ProductSchema)
