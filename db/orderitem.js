const client = require("./seed");
const { getActiveOrdersByCustomerId } = require("./order");
const { getProductById } = require("./products");
console.log(typeof getProductById)

async function createOrderItem({ orderId, productId, quantity }) {
  try {
    console.log(typeof getProductById);
    const product = await getProductById(Number(productId));
    const { rows } = await client.query(
      `
        INSERT INTO orderitem(orderid,productid,quantity,orderprice)
        VALUES ($1,$2,$3,$4)
        RETURNING *;
        `,
      [orderId, productId, quantity, product.price]
    );
    // console.log(rows)
  } catch (error) {
    console.log(error);
  }
}

async function getOrderByOrderNumber({ id }) {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM orderitem
        WHERE "orderid" = $1`,
      [id]
    );
    // console.log(rows)
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function attachObjectsToOrder(id) {
  try {
    const customerOrder = await getActiveOrdersByCustomerId({ id: id });
    // console.log(customerOrder.id)
    customerOrder.items = await getOrderByOrderNumber({ id: customerOrder.id });
    if (customerOrder.items) {
      return customerOrder;
    } else {
      customerOrder.items = [];
      return customerOrder;
    }
  } catch (error) {
    console.log(error);
  }
}

createOrderItem(1)

module.exports = {
  createOrderItem,
  getOrderByOrderNumber,
  attachObjectsToOrder,
  attachObjectsToOrder,
};
