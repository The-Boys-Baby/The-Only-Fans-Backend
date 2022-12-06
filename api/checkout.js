const {getAllOrders,getActiveOrders,getActiveOrdersById,getAllOrdersById,getOrderByOrderId,addToOrder,updateOrderTotal,getActiveOrdersByCustomerId} = require("../db/order")
const { attachObjectsToOrder,removeOrderItem } = require("../db/orderitem")
const express = require("express")
const checkoutRouter = express.Router()

//getting a cart

//orderid -> orderItems -> orderItemPrice -> OrderItem Quantity 


checkoutRouter.get("/me", async (req,res,next) => {
    const id = req.user.id
    console.log(id)
try {
   const totalorder = await attachObjectsToOrder(id)
   const total = await updateOrderTotal({id: id})
   res.send({order: totalorder, total: total})
} catch (error) {
   console.log(error)
   next(error)
}
})
checkoutRouter.delete("/:orderitem", async (req, res, next) => {
   const id = req.user.id
   const removingItem = req.params.orderitem
   
   try{
      const order = await getActiveOrdersByCustomerId({id:id})
      await removeOrderItem({productid: removingItem, orderId: order.id})
   }catch(error){
      console.log(error)
   }
})
module.exports = checkoutRouter