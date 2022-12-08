const {
  getAllOrders,
  getActiveOrders,
  getActiveOrdersById,
  getAllOrdersById,
  getOrderByOrderId,
  addToOrder,
  updateOrderTotal,
  getActiveOrdersByCustomerId,
} = require("../db/order");
const { attachObjectsToOrder, removeOrderItem } = require("../db/orderitem");
const express = require("express");
const checkoutRouter = express.Router();

//getting a cart

//orderid -> orderItems -> orderItemPrice -> OrderItem Quantity

checkoutRouter.get("/me", async (req, res, next) => {
  const id = req.user.id;
  console.log(id);
  try {
    const totalorder = await attachObjectsToOrder(id);
    const total = await updateOrderTotal({ id: id });
    res.send({ order: totalorder, total: total });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
checkoutRouter.delete("/:orderitem", async (req, res, next) => {
  const id = Number(req.user.id);
  console.log("id:", id);
  const removingItem = Number(req.params.orderitem);
  console.log("id", removingItem);
  try {
    const order = await getActiveOrdersByCustomerId({ id: id });
    console.log(order);
    const removal = await removeOrderItem({
      productid: removingItem,
      orderId: order.id,
    });
    console.log(removal);
  } catch (error) {
    console.log(error);
  }
});
module.exports = checkoutRouter;
