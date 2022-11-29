const {getAllOrders,getActiveOrders,getActiveOrdersById,getAllOrdersById,getOrderByOrderId,addToOrder} = require("../db/order")
const express = require("express")
const orderRouter = express.Router()