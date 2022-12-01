const express = require("express")
const productRouter = express.Router()
const { getAllProducts, createProduct, updateProduct,getProductById } = require("../db/products")
const {createOrderItem} = require("../db/orderItem")
const {getActiveOrdersByCustomerId}= require("../db/order")

productRouter.get("/", async (req,res,next) => {
    try {

        const allproducts = await getAllProducts()
        res.send(allproducts)
    } catch ({name, message}) {
        next({name, message})
    }
})

productRouter.get("/:productId", async (req,res,next) => {
    const params = req.params.productId
    try {
        
        const product = await getProductById(params) 
        // console.log(product)
        if(!!product){
            res.send(product) 
        } else {
            res.send({name: "invalidProductError",
            message: "There is no product with this name"})
        }
    } catch (error) {
           next(error)
    }
})
productRouter.post("/:productId", async (req, res,next)=> {
    const userId = req.user.id
    const productId = req.params.productId
    const { quantity } = req.body
    // console.log(userId)
    try {
        const userOrder = await getActiveOrdersByCustomerId({id: userId})
        console.log("this is use order:", userOrder.id)
        if(userOrder.id){
            await createOrderItem({orderId: userOrder.id, productId: productId, quantity})
        }
        next()
    } catch (error) {
        console.log(error)
    }
})

productRouter.post("/", async (req, res, next)=>{
    const {name, price, description} = req.body
    try {
        const post = await createProduct ({name, price, description})

        if (post){
            res.send(post)
        } else {
            next({
                name: "CreatePostError",
                message: "Creating a post error has occurred"
            })
        }
    } catch (error) {
        console.log(error)
    }
}) 
productRouter.post("/:post", async (req, res, next)=>{
    
    const id = req.params.post
    const fields = {}
    if(req.body.name){
        fields.name = req.body.name

    }
    if(req.body.price){
        fields.price = req.body.price

    }
    if(req.body.description){
        fields.description = req.body.description

    }

    try {
        const post = await updateProduct (id, fields)

        if (post){
            res.send(post)
        } else {
            next({
                name: "CreatePostError",
                message: "Creating a post error has occurred"
            })
        }
    } catch (error) {
        console.log(error)
    }
}) 


module.exports = productRouter