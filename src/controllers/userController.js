'use sticit'

var User = require('../models/user')
var Product = require('../models/product')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../services/jwt')



function newUser(req, res){
    var user = new User();
    var params = req.body

    if(params.name && params.lastName && params.userName && params.password && params.email && (params.role == 'Administrador')){
        user.name = params.name
        user.lastName = params.lastName
        user.userName = params.userName
        user.email = params.email
        user.role = 'Administrador'
        


        User.find({$and: [
                    {role: user.role},
                {$or: [
                    {userName: user.userName},
                    {email: user.email},
            ]}
        ]
            
        }).exec((err, users)=>{
            if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
            if(users && users.length >= 1){
                return res.status(500).send({menssage: 'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err, hash)=>{
                    user.password = hash;

                    user.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({menssage: 'Error al guardar el usuario'})
                        if(usuarioGuardado){
                            res.status(200).send({user: usuarioGuardado})
                        }else{
                            res.status(404).send({menssage: 'No se ha podido resgistrar al usuario'})
                        }
                    })
                })
            }
                
        })
    }else if(params.name && params.lastName && params.userName && params.password && params.email){

        user.name = params.name
        user.lastName = params.lastName
        user.userName = params.userName
        user.email = params.email
        user.role = 'Cliente'


        User.find({$and: [
            {role: user.role},
        {$or: [
            {userName: user.userName},
            {email: user.email},
    ]}
]
            
        }).exec((err, users)=>{
            if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
            if(users && users.length >= 1){
                return res.status(500).send({menssage: 'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err, hash)=>{
                    user.password = hash;

                    user.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({menssage: 'Error al guardar el usuario'})
                        if(usuarioGuardado){
                            res.status(200).send({user: usuarioGuardado})
                        }else{
                            res.status(404).send({menssage: 'No se ha podido resgistrar al usuario'})
                        }
                    })
                })
            }
                
        })

    }else{
        res.status(200).send({menssage: 'Rellene todos los datos necesarios'})
    }
}


function login(req, res) {
    var params = req.body


    User.findOne({userName: params.userName, email: params.email}, (err, usuario)=>{
        if(err) return res.status(500).send({menssage: "Error en la peticion"})
        if(usuario){
            bcrypt.compare(params.password, usuario.password, (err, check)=>{
                if(check){
                    if(params.gettoken){
                        return res.status(200).send({
                            token: jwt.createToken(usuario)
                        })
                    }else{
                        usuario.password = undefined
                        return res.status(200).send({user: usuario})
                    }
                }else{
                    return res.status(404).send({menssage: 'El Usuario no se a podido identificar'})
                }
            })
        }else{
            return res.status(404).send({menssage: 'El Usuario no se a podidio logear'})
        }
    })
}

function getUser(req, res) {
    var userLogin = req.user.sub

    User.findById(userLogin, (err, usuarioVisualizado)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuario'})
        if(!usuarioVisualizado) return res.status(404).send({menssage: 'Error al mostrar el usuario'})
        return res.status(202).send({Usuario: usuarioVisualizado})
    })
}

function getUsers(req, res) {
    var userLogin = req.user.sub

    User.findById(userLogin, (err, usuarioLogiado)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
        if(!usuarioLogiado) return res.status(404).send({menssage: 'Error al encontra el usuario'})
        if(usuarioLogiado.role == 'Administrador'){
            User.find((err, listarUsuarios)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticion de usuarios'})
                if(!listarUsuarios) return res.status(404).send({menssage: 'Error al mostrar los usuarios'})
                return res.status(202).send({Usuario: listarUsuarios})
            })
        }else{
            return res.status(404).send({menssage: 'No cuenta con los permisos requeridos para esta operacion'})
        }
    })

    
}

function updateUser(req, res) {
    var userLogin = req.user.sub
    var params = req.body

    User.find(userLogin, (err, userL)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuario'})
        if(userL.role == 'Cliente'){
            User.findByIdAndUpdate(userLogin, params, {new: true}, (err, usuarioActulizado)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticion de usuario'})
                if(!usuarioActulizado) return res.status(404).send({menssage: 'Error al editar el usuario'})
                return res.status(200).send({Usuario: usuarioActulizado})
            })
        }else{
            return res.status(404).send({menssage: 'Este usuario no se puede editar'})
        }
    })
    
}

function deleteUser(req, res) {
    var userLogin = req.user.sub


    User.find(userLogin, (err, userL)=>{
        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuario'})
        if(userL.role == 'Cliente'){
            User.findOneAndDelete(userLogin,  (err, usuarioEliminado)=>{
                if(err) return res.status(500).send({menssage: 'Error en la peticion de usuario'})
                if(!usuarioEliminado) return res.status(404).send({menssage: 'Error al eliminar el usuario'})
                return res.status(200).send({menssage: 'El Usuario: ' + usuarioEliminado.name + ' ' + usuarioEliminado.lastName + ' a sido eliminado exitosamente'})
            })
        }else{
            return res.status(404).send({menssage: 'Este usuario no se puede eliminar'})
        }
    })


    
}

function carBuy(req, res) {
    var userLogin = req.user.sub
    var params = req.body

    if(params.nameProduct && params.amount){
        Product.findOne({nameProduct: params.nameProduct}, (err, productoSelect)=>{
            if(err) return res.status(500).send({menssage: 'Error en la peticon de producto'})
            if(!productoSelect){
                return res.status(404).send({menssage: 'Error al buscar el producto'})
            }else{
                if(productoSelect.amount >= params.amount){
                    User.findOne({_id: userLogin}, (err, userLog)=>{
                        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuario'})
                        if(!userLog){
                            return res.status(404).send({menssage: 'No se ha pidio identificar al usuario'})
                        }else{
                            for (let x = 0; x < userLog.buys.length; x++) {
                                if(userLog.buys[x].product == productoSelect.nameProduct){
                                    var productUser = userLog.buys[x].product
                                    var totalS = productoSelect.priceUnitary * params.amount
                                    User.findOneAndUpdate({"buys.product" : productUser}, {$inc: {'buys.$.amount' : params.amount, 
                                    'buys.$.subTotal' : totalS}}, (err, userActualizado)=>{
                                        if(err) return res.status(500).send({menssage: 'Error en la peticion de usuario'})
                                        if(!userActualizado) return res.status(404).send({menssage: 'Error en la busqueda'})
                                    })
                                }
                            }
                           
                        }
                        var subT = params.amount * productoSelect.priceUnitary
                    User.findOneAndUpdate({_id: userLogin}, {$push: {buys: {product: productoSelect.nameProduct, 
                    amount: params.amount, priceUnitary: productoSelect.priceUnitary, 
                    subTotal: subT}}}, {new: true}, (err, productoAgregado)=>{
                        if(err) return res.status(500).send({menssage: 'Error en la petion de usuario'})
                        if(!productoAgregado) return res.status(404).send({menssage: 'Error al agregar el producto'})
                        return res.status(202).send({Productos_Agregados: productoAgregado.buys})
                })
                    })
                    
                    
                }else{
                    return res.status(404).send({menssage: 'Solo se cuenta con ' + productoSelect.amount + ' ' + productoSelect.nameProduct + ' existentes'})
                }
            }

        })
    }else{
        return res.status(404).send({menssage: 'Rellene todos los datos necesarios'})
    }
    

}

module.exports = {
    newUser,
    login,
    getUser,
    getUsers,
    updateUser,
    deleteUser,
    carBuy
}