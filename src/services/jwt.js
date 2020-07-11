'use strict'

var jwt = require('jwt-simple')
var momonet = require('moment')
var secret = 'encryt_password'
//cuantiti

exports.createToken = function(user){
    var playload = {
        sub: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        iat: momonet().unix(),
        exp: momonet().day(30, 'days').unix()

    }
    return jwt.encode(playload, secret)
}