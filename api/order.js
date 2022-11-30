const {getAllOrders,getActiveOrders,getActiveOrdersById,getAllOrdersById,getOrderByOrderId,addToOrder} = require("../db/order")
const express = require("express")
const orderRouter = express.Router()

//getting a cart

//orderid -> orderItems -> orderItemPrice -> OrderItem Quantity 