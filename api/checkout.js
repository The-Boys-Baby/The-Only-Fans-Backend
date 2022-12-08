const {
  getAllOrders,
  getActiveOrders,
  getActiveOrdersById,
  getAllOrdersById,
  getOrderByOrderId,
  addToOrder,
  updateOrderTotal,
  getOrderItemsByOrderNumber,
  getActiveOrdersByCustomerId,
  changeOrderStatus,
  createOrder
} = require("../db/order");
const {
  attachObjectsToOrder,
  removeOrderItem,
  updateQuantity,
} = require("../db/orderitem");
const express = require("express");
const checkoutRouter = express.Router();

//getting a cart

//orderid -> orderItems -> orderItemPrice -> OrderItem Quantity

checkoutRouter.get("/me", async (req, res, next) => {
  const id = req.user.id;
  // console.log(id);
  try {
    const totalorder = await attachObjectsToOrder(id);
    const total = await updateOrderTotal({ id: id });
    res.send({ order: totalorder, total: total });
  } catch (error) {
    // console.log(error);
    next(error);
  }
});
checkoutRouter.post("/submit", async (req, res, next) => {
  console.log("I'm in the checkout submit")
  const id = req.user.id;
  const { name, address, zipcode, aptNumber, creditCard, expiration, cvvCode } =
    req.body;
  console.log(
    name,
    address,
    zipcode,
    aptNumber,
    creditCard,
    expiration,
    cvvCode
  );

  console.log(
    name,
    address,
    zipcode,
    aptNumber,
    creditCard,
    expiration,
    cvvCode
  );
  try {
    const activeOrder = await getActiveOrdersByCustomerId({ id });
    console.log("activeOrder", activeOrder)
    const activeOrderItems = await getOrderItemsByOrderNumber({ id: activeOrder.id})
    if (activeOrderItems.length){
      if (activeOrder.id) {
          const rowsOfChangedOrders = await changeOrderStatus({ order: activeOrder.id });
          if (rowsOfChangedOrders.id){
            const order = await createOrder(id)
            res.send({ message: "success", order });
          } else {
            res.send({ message: "message" });
          }
        }
      } else {
        res.status(400).send({message: "noItems"})
      }
  } catch (error) {
      console.log(error);
      next(error);
  }
});
checkoutRouter.delete("/:orderitem", async (req, res, next) => {
  const id = Number(req.user.id);
  // console.log("id:", id);
  const removingItem = Number(req.params.orderitem);
  // console.log("id", removingItem);
  try {
    const order = await getActiveOrdersByCustomerId({ id: id });
    // console.log(order);
    const removal = await removeOrderItem({
      productid: removingItem,
      orderId: order.id,
    });
    if (removal?.rowCount > 0) {
      res.send({ message: "You have successfully removed the item" });
    }
    // console.log("this is", removal);
  } catch (error) {
    next(error);
  }
});
checkoutRouter.post("/:orderitem", async (req, res, next) => {
  const id = Number(req.user.id);
  const quantity = Number(req.body.quantity);
  // console.log("this is Quantity", quantity);
  // console.log("This is UserId:", id);
  const ChangingItem = Number(req.params.orderitem);
  // console.log("This is OrderItemId", ChangingItem);
  try {
    const order = await getActiveOrdersByCustomerId({ id: id });
    // console.log("this is the order:", order);
    const row = await updateQuantity({
      productid: ChangingItem,
      orderId: order.id,
      Quantity: quantity,
    });
    console.log(row);
    if (row > 0) {
      res.send({ message: "Changed Order Quantity" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
module.exports = checkoutRouter;
