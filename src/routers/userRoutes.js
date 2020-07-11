'use strict'

var express = require("express")
var UserController = require("../controllers/userController")
var Category = require("../controllers/categoryController")
var Product = require("../controllers/productController")
var md_auth = require('../middleware/autentificated')

var api = express.Router();


api.post('/new-user', UserController.newUser)
api.post('/login', UserController.login)

api.get('/get-user', md_auth.ensureAuth, UserController.getUser)
api.get('/get-users', md_auth.ensureAuth, UserController.getUsers)

api.put('/update-user', md_auth.ensureAuth, UserController.updateUser)
api.delete('/delete-user', md_auth.ensureAuth, UserController.deleteUser)


api.post('/agregar-compra', md_auth.ensureAuth, UserController.carBuy)


module.exports = api