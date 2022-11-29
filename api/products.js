const express = require("express")
const productRouter = express.Router()
const { getAllProducts, createProduct } = require("../db/products")

productRouter.get("/", async (req,res,next) => {
    try {

        const allproducts = await getAllProducts()

        res.send(allproducts)
    } catch ({name, message}) {
        next({name, message})
    }
})

productRouter.post("/", async (req, res, next)=>{ // jeremy: needs admin protection
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
productRouter.post("/:post", async (req, res, next)=>{ // jeremy: what is :post? :productId?
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

// jeremy: productRouter.delete('path', callback)


module.exports = productRouter