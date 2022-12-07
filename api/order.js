// const {getAllOrders,getActiveOrders,getActiveOrdersById,getAllOrdersById,getOrderByOrderId,addToOrder, getActiveOrdersByCustomerId} = require("../db/order")
// const { getOrderItemsByOrderNumber,attachObjectsToOrder } = require("../db/orderitem")
// const express = require("express")
// const userRouter = require("./users")
// const orderRouter = express.Router()

// //getting a cart

// //orderid -> orderItems -> orderItemPrice -> OrderItem Quantity

// orderRouter.get("/me", async (req,res,next) => {
//          const id = req.user.id
//     try {
//         const totalorder = attachObjectsToOrder(id)
//         res.send(totalorder)
//     } catch (error) {
//         console.log(error)
//     }
// })

// jeremy: still want to have order for a profile check of previous orders, order history.
