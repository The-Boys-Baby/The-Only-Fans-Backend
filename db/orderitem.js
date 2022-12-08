const {
  getActiveOrdersByCustomerId,
  getProductById,
  getOrderItemsByOrderNumber,
} = require("./index");
const client = require("./client");

async function createOrderItem({ orderId, productId, quantity }) {
  try {
    console.log(Number(productId));
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

async function removeOrderItem({ productid, orderId }) {
  try {
    const row = await client.query(
      `
        DELETE FROM orderitem
        WHERE "id" = $1 AND "orderid" = $2;`,
      [productid, orderId]
    );
    console.log(row);
    return row;
  } catch (error) {
    console.log(error);
  }
}
async function updateQuantity({ productid, orderId, Quantity }) {
  try {
    console.log("quantity:", Quantity);
    const { rowCount } = await client.query(
      `
  UPDATE orderitem
  SET "quantity" = $1
  WHERE "id" = $2 AND "orderid" = $3
  RETURNING *;`,
      [Quantity, productid, orderId]
    );
    console.log(!!rowCount);
    return rowCount;
  } catch (error) {
    console.log(error);
  }
}

async function attachObjectsToOrder(id) {
  try {
    const customerOrder = await getActiveOrdersByCustomerId({ id: id });
    // console.log(customerOrder.id)
    customerOrder.items = await getOrderItemsByOrderNumber({
      id: customerOrder.id,
    });
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

module.exports = {
  createOrderItem,
  attachObjectsToOrder,
  attachObjectsToOrder,
  removeOrderItem,
  updateQuantity,
};
