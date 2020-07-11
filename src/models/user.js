'use strict'

var mongose = require("mongoose")
var Schema = mongose.Schema;

var UserSchema = Schema({
    name: String,
    lastName: String,
    userName: String,
    email: String,
    password: String,
    role: String,

    buys: [{
        product: String,
        amount: Number,
        priceUnitary: Number,
        subTotal: Number,
        date: Date,
    }]

})


module.exports = mongose.model('user', UserSchema);