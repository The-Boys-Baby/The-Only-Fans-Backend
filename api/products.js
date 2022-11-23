const express = require("express")
const productRouter = express.Router()
const { getAllProducts } = require("../db/products")

productRouter.get("/", async (req,res,next) => {
    try {

        const allproducts = await getAllProducts()
        
        res.send(allproducts)
    } catch ({name, message}) {
        next({name, message})
    }
})


module.exports = productRouter