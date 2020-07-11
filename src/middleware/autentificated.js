'use strict'

var jwt = require('jwt-simple')
var momonet = require('moment')
var secret = 'encryt_password'


exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(403).send({menssage: 'La peticion no tien Autentificacion'})
    }

    var token = req.headers.authorization.replace(/['"']+/g, '')

    try {
        var playload = jwt.decode(token, secret)
        if(playload.exp <= momonet().unix()){
            return res.status(401).send({menssage: 'El token ha expirado'})
        }
    } catch (ex) {
        return res.status(404).send({menssage: 'El token no es valido'})
    }

    req.user = playload
    next()
}