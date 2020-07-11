'use strict'

var express = require("express")
var Category = require("../controllers/categoryController")
var md_auth = require('../middleware/autentificated')

var api = express.Router();


api.get('/default',  Category.defaultCategory)

api.post('/new-category',md_auth.ensureAuth, Category.newCategory)

api.get('/get-categories', md_auth.ensureAuth, Category.getCategories)

api.put('/update-category/:id', md_auth.ensureAuth, Category.updateCategory)

api.delete('/delete-categoria/:id', md_auth.ensureAuth, Category.deleteCategory)




module.exports = api