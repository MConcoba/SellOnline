'use strict'

var Category = require('../models/category')
var Product = require('../models/product')
var CategoryController = require('../controllers/categoryController')
var User = require('../models/user')

function newProduct(req, res) {
    var product = new Product()
    var params = req.body

    Category.findOne({"nameCategory": 'Almacen'}, (err, categoriaAlmacen)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticon de catergia'})
        if(!categoriaAlmacen){
            return CategoryController.defaultCategory()
        }else{

            if(params.nameProduct && params.amount && params.priceUnitary){
                product.nameProduct = params.nameProduct
                product.amount = params.amount
                product.priceUnitary = params.priceUnitary
                product.nameCategory = categoriaAlmacen.nameCategory
                product.amountBuy = 0

                Product.find({"nameProduct" : params.nameProduct}, (err, verProductos)=>{
                    if(err) return res.status(500).send({menssage: 'Error en la peticion de productos'})
                    if(verProductos && verProductos.length){
                        Product.findOneAndUpdate({id: verProductos.id, nameProduct: params.nameProduct}, {$inc: {amount: params.amount}},
                            {new: true}, (err, productoActualizado)=>{
                                if(err) return res.status(500).send({menssage: 'Error en la peticion de productos'})
                                if(!productoActualizado) return res.status(404).send({menssage: 'Error al actualizar el producto'})
                        Category.findOneAndUpdate({"products.nameProduct": params.nameProduct}, {$inc: {'products.$.amount': params.amount}},
                            {new: true}, (err, categoriaActualizada)=>{
                                if(err) return res.status(500).send({menssage: 'Error en la peticion de categiria ' +err})
                                if(!categoriaActualizada) return res.status(404).send({menssage: 'Error al actualizar la categoria ' + err })
                                return res.status(202).send({Producto: productoActualizado})
                                })
                        
                            })
                    }else{
                        product.save((err, newProduct)=>{
                            if(err) return res.status(500).send({menssage: 'Error en la peticion de productos'})
                        if(!newProduct){
                            return res.status(404).send({menssage: 'Error al guardar el producto' + err})
                        }else{         
                            Category.findOneAndUpdate({nameCategory: 'Almacen'}, {$push: {products: {nameProduct: newProduct.nameProduct,
                                amount: newProduct.amount, priceUnitary: newProduct.priceUnitary}}}, {new: true}, (err, categoriaActualizada)=>{
                                    if(err) return res.status(500).send({menssage: 'Error en la peticon de catergia'})
                                    if(!categoriaActualizada) return res.status(404).send({menssage: 'Error al editar la categiria'})   

                            })
                            return res.status(202).send({Producto: newProduct})
                        }
                        })  
                    }
                })
               
        
            }else{
                return res.status(404).send({menssage: 'Rellene todos los datos necesarios'})
            }

        }
    })


}


function asignarCategory(req, res) {

    var categoryId = req.params.cId
    var params = req.body
    var productId = req.params.pId


    if(params.nameProduct && params.nameCategory){

        Category.findOne({nameCategory: params.nameCategory}, (err, categoriaSelet)=>{
            if(err) return res.status(500).send({menssage: 'Error el la peticion de categoria'})
            if(!categoriaSelet){
                return res.status(404).send({menssage: 'Error de categoria'})
            }else{
                for (let x = 0; x < categoriaSelet.products.length; x++) {
                    if(categoriaSelet.products[x].nameProduct == params.nameProduct){
                        return res.status(404).send({menssage: 'El producto ya existe en esta categoria'})  
                    }
                }
                Product.findOne({nameProduct : params.nameProduct}, (err, productSelect)=>{
                    if(err) return res.status(500).send({menssage: 'Error en la peticion de productos'})
                    if(!productSelect){
                        return res.status(404).send({menssage: 'Error al encontrar el producto'})
                    }else{
                        Category.findOne({nameCategory: 'Almacen'}, (err, categoriaOriginal)=>{
                            if(err) return res.status(500).send({menssage: 'Error en la peticion de categorias'})
                                if(!categoriaOriginal){
                                    return res.status(404).send({menssage: 'Error de categoria ' + err})
                                }else{
                                    for (let x = 0; x < categoriaOriginal.products.length; x++) {
                                       if(categoriaOriginal.products[x].nameProduct == params.nameProduct){
                                           var idProducto = categoriaOriginal.products[x]._id
                                           console.log(idProducto)
                                           Category.findOneAndUpdate({nameCategory: 'Almacen'}, {$pull: {products: {_id: idProducto}}}, (err, categoriaAntigua)=>{
                                            if(err) return res.status(500).send({menssage: 'Error en la peticion de categorias'})
                                                if(!categoriaAntigua){
                                                    return res.status(404).send({menssage: 'Error al asignar el producto a la categoria'})
                                                }else{
                                                    Category.findOneAndUpdate({nameCategory: params.nameCategory}, {$push: {products: {nameProduct: productSelect.nameProduct, 
                                                        amount: productSelect.amount, priceUnitary: productSelect.priceUnitary}}}, {new: true}, (err, productoAsignado)=>{
                                                            if(err) return res.status(500).send({menssage: 'Error en la peticion de categorias'})
                                                            if(!productoAsignado){
                                                                return res.status(404).send({menssage: 'Error al asignar el producto a la categoria'})
                                                            }else{
                                                                console.log(productSelect.id)
                                                                Product.findOneAndUpdate({_id: productSelect.id}, {"nameCategory" : params.nameCategory}, {new: true}, (err, productoA)=>{
                                                                    if(err) return res.status(505).send({menssage: 'Error en la peticion de producto'})
                                                                    if(!productoA) return res.status(404).send({menssage: 'Error al acualizar el producto'})
                                                                    
                                                                })
                                                                return res.status(202).send({Producto_Categoria: productoAsignado})
                                                            }
                                                            
                                                        })
                                                }
                        
                                        })
        
                                       }
                                        
                                    }
                                    
                                    
                                }
        
                        })
                        
                        
                    }
                })
            }

        })
        

    }else{
        return res.status(404).send({menssage: 'Rellene todos los datos necesarios'})
    }

}


function getProduct(req, res) {
    
    var params = req.body;
   
    Product.find({nameProduct: {$regex: params.nameProduct, $options: 'i'}}, (err, productoVisualizado)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de producto'})
        if(!productoVisualizado) return res.status(404).send({menssage: 'Error al mostrar el producto'})
        else return res.status(200).send({Producto: productoVisualizado})
    })
}


function listarProducts(req, res) {
    
        Product.find((err, listaProductos)=>{
            if(err) return res.status(500).send({menssage: 'Error en la peticion de prodcutos'})
            if(!listaProductos) return res.status(404).send({menssage: 'Error al mostrar los productos'})
            return res.status(202).send({Productos: listaProductos})
        })

}


function updateProduct(req, res) {
    var produtoId = req.params.id
    var params = req.body

    Product.findOne({_id: produtoId}, (err, productSelect)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de producto'})
        console.log(productSelect)
        if(!productSelect){
            return res.sta(404).send({menssage: 'Error al encontrar el producto'})
        }else{
            Category.findOne({nameCategory: productSelect.nameCategory}, (err, categoriaSelet)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticion de categoria'})
                console.log(categoriaSelet)
                if(!categoriaSelet){
                    return res.status(404).send({menssage: 'Error al buscar la categoria ' + err})
                }else{
                    Category.findOneAndUpdate({nameCategory: productSelect.nameCategory}, {$pull: {products: {nameProduct: productSelect.nameProduct}}},
                        (err, categoriaAntigua)=>{
                        if(err) return res.status(500).send({menssage: 'Error en la peticion de categorias'})
                        if(!categoriaAntigua){
                          return res.status(404).send({menssage: 'Error al asignar el producto a la categoria'})  
                        }else{
                            Category.findOneAndUpdate({nameCategory: productSelect.nameCategory}, {$push: {products: {nameProduct: params.nameProduct,
                                amount: params.amount, priceUnitary: params.priceUnitary}}}, {new: true},
                                (err, productA)=>{
                                if(err) return res.status(500).send({menssage: 'Error en la peticion de categorias'})
                                if(!productA) return res.status(404).send({menssage: 'Error al asignar el producto a la categoria'})
                                
                            })
                        }  
                    })
                    Product.findByIdAndUpdate(produtoId, params, {new: true}, (err, productoActualizado)=>{
                        if(err) return res.status(500).send({menssage: 'Error en la peticion de producto'})
                        if(!productoActualizado){
                            return res.status(404).send({menssage: 'Error al editar el producto'})
                        }else{
                                return res.status(200).send({Producto: productoActualizado})
                        }
                        
                    })
                }
            })
            
        }
        
    })
    
}


function deleteProduct(req, res) {

    var produtoId = req.params.id

    Product.findOne({_id: produtoId}, (err, productSelect)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de producto'})
        if(!productSelect){
            return res.status(404).send({menssage: 'Error al buscar el producto'})
        }else{
            Category.findOneAndUpdate({nameCategory: productSelect.nameCategory, "products.nameProduct" : productSelect.nameProduct}, {$pull: {products: {nameProduct: productSelect.nameProduct}}},
                (err, categoriaActualizada)=>{
                    if(err) return res.status(500).send({menssage: 'Error en la peticion de categoria'})
                    if(!categoriaActualizada) return res.status(404).send({menssage: 'Error al editar la categoria'})
                  })

                  Product.findOneAndDelete({_id: produtoId},  (err, productoEliminado)=>{
                    if(err) return res.status(500).send({menssage: 'Error en la peticion de producto'})
                    if(!productoEliminado) return res.status(404).send({menssage: 'Error al eliminar el producto'})
                    return res.status(200).send({menssage: 'El producto: ' + productoEliminado.nameProduct  + '  a sido eliminado exitosamente'})
                })
        }
    })
    
}

module.exports = {
    newProduct,
    asignarCategory,
    getProduct,
    listarProducts,
    updateProduct,
    deleteProduct
}