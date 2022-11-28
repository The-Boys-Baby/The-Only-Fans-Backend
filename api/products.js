const express = require("express")
const productRouter = express.Router()
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../db/products")

productRouter.get("/", async (req,res,next) => {
    try {

        const allproducts = await getAllProducts()

        res.send(allproducts)
    } catch ({name, message}) {
        next({name, message})
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

productRouter.post("/:post/inactive", async (req, res, next) => {
 const id = req.params.post

 try {
    const post = await deleteProduct(id)
    console.log(id)
    console.log(post)
    if(post == true){
        res.send(post)
    }else{
        next({
            name:"inActiveError",
            message:"This post is not in the system or is already inactive"
        })
    }
 } catch (error) {
    console.log(error)
 }
})


module.exports = productRouter