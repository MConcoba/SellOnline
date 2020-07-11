'use strict'

var express = require("express")
var Product = require("../controllers/productController")
var md_auth = require('../middleware/autentificated')

var api = express.Router();



api.post('/new-product', md_auth.ensureAuth, Product.newProduct)
api.post('/asignar-categoria', md_auth.ensureAuth, Product.asignarCategory)

api.get('/get-product', md_auth.ensureAuth, Product.getProduct)
api.get('/get-products', md_auth.ensureAuth, Product.listarProducts)

api.put('/update-product/:id', md_auth.ensureAuth, Product.updateProduct)

api.delete('/delete-product/:id', md_auth.ensureAuth, Product.deleteProduct)


module.exports = api