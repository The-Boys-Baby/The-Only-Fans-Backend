const {getAllOrders,getActiveOrders,getActiveOrdersById,getAllOrdersById,getOrderByOrderId,addToOrder} = require("../db/order")
const express = require("express")
const orderRouter = express.Router()

//getting a cart

//orderid -> orderitems -> orderItemPrice -> OrderItem Quantity 


orderRouter.get("/", async (req,res,next) => {
    try {
        
    } catch (error) {
        console.log(error)
    }
})