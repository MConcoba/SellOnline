'use strict'

var Category = require('../models/category')
var Product = require('../models/product')
var User = require('../models/user')


function defaultCategory() {
    var category = new Category();
    var nameCategory = "Almacen"

    if(nameCategory){
        category.nameCategory = nameCategory
    }

    category.save((err, categoriaGuardada)=>{
        //if(err) return res.status(500).send({menssage: 'Error en la peticion de categorias'})
        //if(!categoriaGuardada) return res.status(404).send({menssage: 'Error al crear la categoria'})
            //return res.status(202).send({Categoria: categoriaGuardada})
    })
}

function newCategory(req, res) {
    var category = new Category();
    var params = req.body

    

    if(params.nameCategory){
        category.nameCategory = params.nameCategory

        Category.find({$or: [
            {nameCategory: category.nameCategory}
        ]})
        .exec((err, categorias)=>{
            if(err) return res.status(500).send({menssage: 'Error en la peticion de categorias'})
            if(categorias && categorias.length >= 1){
                return res.status(404).send({menssage: 'La categoria ya existe'})
            }else{
                category.save((err, categoriaGuardada)=>{
                    if(err) return res.status(500).send({menssage: 'Error en la peticion de categorias'})
                    if(!categoriaGuardada) return res.status(404).send({menssage: 'Error al crear la categoria'})
                        return res.status(202).send({Categoria: categoriaGuardada})
                })
            }
        })

    }else{
        return res.status(404).send({menssage: 'Rellene los datos necesarios'})
    }
}

function deleteCategory(req, res) {
    var categoryId = req.params.id


    Category.findOne({_id: categoryId}, (err, categorySelect)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticon de categorias'})
        if(!categorySelect){
            return res.status(404).send({menssage: 'Error al buscar la categoria'})
        }else if(categorySelect.nameCategory === "Almacen"){
            return res.status(404).send({menssage: 'Esta categoria no se puede eliminar'})
        }else{
            for (let x = 0; x < categorySelect.products.length; x++) {
                console.log(categorySelect.products[x])
                var todo = categorySelect.products[x];

                Category.findOneAndUpdate({nameCategory: 'Almacen'}, {$push: {products: todo}}, {new: true}, (err, categoriaActualizada)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticon de categorias'})
                if(!categoriaActualizada){
                    return res.status(404).send({menssage: 'Error al buscar la categoria'})
                }
                }) 
            }
            Category.findOneAndDelete({_id: categoryId}, (err, categoriaEliminada)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticon de categorias'})
                 if(!categoriaEliminada){
                    return res.status(404).send({menssage: 'Error al eliminar la categoria'})
                }else{
                    Product.updateMany({nameCategory : categoriaEliminada.nameCategory}, {"nameCategory" : 'Almacen'},(err, productoAcualizado)=>{
                        if(err) return res.status(500).send({menssage: 'Error en la peticion de producto'})
                        if(!productoAcualizado) return res.status(404).send({menssage: 'Error al editar el producto'})
                    })
                    return res.status(202).send({menssage: 'La categoira ' + categoriaEliminada.nameCategory + ' fue eliminada exitosamente' })
                }
            })
           
        }
    })
}

function getCategories(req, res) {
    
    Category.find((err, listaCategoria)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de categorias'})
        if(!listaCategoria) return res.status(404).send({menssage: 'Error al mostrar las categorias'})
        return res.status(202).send({Categorias: listaCategoria})
    })
}


function updateCategory(req, res) {
    var categoryId = req.params.id
    var params = req.body

    Category.findOne({_id: categoryId}, (err, categoriaSelect)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de categoria'})
        if(!categoriaSelect){
            return res.status(404).send({menssage: 'Error al editar la categoria'})
        }else if(categoriaSelect.nameCategory === 'Almacen'){
            return res.status(404).send({menssage: 'Esta categoria no se puede editar'})
        }else{
            Category.findByIdAndUpdate(categoryId, params, {new: true}, (err, categoriaActualizada)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticion de categoria'})
                if(!categoriaActualizada){
                    return res.status(404).send({menssage: 'Error al editar la categoria'})
                }else{
                    Product.updateMany({nameCategory: categoriaSelect.nameCategory}, {"nameCategory": params.nameCategory},
                    (err, productoAcualizado)=>{
                        if(err) return res.status(500).send({menssage: 'Error en la peticion de producto'})
                        if(!productoAcualizado) return res.status(404).send({menssage: 'Error al actulaizar el producto'})
                        return res.status(200).send({Producto: categoriaActualizada})
                    })
                        
                }
               
                
            })
        }
    })
    
    
}




module.exports = {
    defaultCategory,
    newCategory,
    deleteCategory,
    getCategories,
    updateCategory
    
}