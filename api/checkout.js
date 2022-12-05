const {getAllOrders,getActiveOrders,getActiveOrdersById,getAllOrdersById,getOrderByOrderId,addToOrder} = require("../db/order")
const { attachObjectsToOrder } = require("../db/orderitem")
const express = require("express")
const checkoutRouter = express.Router()

//getting a cart

//orderid -> orderItems -> orderItemPrice -> OrderItem Quantity 


checkoutRouter.get("/me", async (req,res,next) => {
    const id = req.user.id
    console.log(id)
try {
   
   const totalorder = await attachObjectsToOrder(id)
   res.send(totalorder)
} catch (error) {
   console.log(error)
}
})
module.exports = checkoutRouter