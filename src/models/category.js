'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CategorySchema = Schema({
    nameCategory: String,
        products: [{
            nameProduct: String,
            amount: Number,
            priceUnitary: Number,
        }]
    
    
})

module.exports = mongoose.model('category', CategorySchema)