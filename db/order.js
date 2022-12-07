const client = require("./client");
const { getOrderItemsByOrderNumber } = require("./orderitem"); // jeremy: take from index

async function createOrder(customerid, active = false) {
  try {
    const { rows } = await client.query(
      `
        INSERT INTO "order"(customerid, orderstatus)
        VALUES ($1, $2)
        RETURNING *;`,
      [customerid, active]
    );
    // console.log(rows)
    return rows;
  } catch (error) {
    console.log(error);
  }
}
async function getAllOrders() {
  try {
    const { rows } = await client.query(`
        SELECT * FROM "order";`);
    // console.log(rows)
    return rows;
  } catch (error) {
    console.log(error);
  }
}
async function getActiveOrders() {
  try {
    const { rows } = await client.query(`
        SELECT * FROM "order"
        WHERE "orderstatus" = false;`);
    // console.log(rows)
    return rows;
  } catch (error) {
    console.log(error);
  }
}
async function getActiveOrdersByCustomerId({ id }) {
  console.log(id);
  try {
    const {
      rows: [activeOrder],
    } = await client.query(
      `
        SELECT * FROM "order"
        WHERE "orderstatus" = false AND "customerid" = $1;`,
      [id]
    );
    // console.log(activeOrder)
    return activeOrder;
  } catch (error) {
    console.log(error);
  }
}
async function getAllOrdersByCustomerId({ id }) {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM "order"
        WHERE "customerid" = $1;`,
      [id]
    );
    // console.log(rows)
    return rows;
  } catch (error) {
    console.log(error);
  }
}
async function getOrderByOrderId(id) {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM "order"
        WHERE "id" = $1;`,
      [id]
    );
    // console.log(rows)
    return rows;
  } catch (error) {
    console.log(error);
  }
}
// Update order total amount
//step 1: get order itmes by order number
//step 2: loop through each order item and set a variable to added price times the quantity = total price
//setp 3: update our order and the total price will be caluculated from loop
async function updateOrderTotal({ orderId }) {
  try {
    const orderItems = await getOrderItemsByOrderNumber({ id: orderId });
    let totalprice = 0;
    orderItems.forEach((el) => {
      const subtotal = el.orderprice * el.quantity;
      totalprice += subtotal;
    });
    const { rows } = await client.query(
      `
        UPDATE order
        SET totalamount = ${totalprice}
        WHERE "id" = $1;`,
      [orderId]
    );
  } catch (error) {}
}

module.exports = {
  getAllOrders,
  getActiveOrders,
  getActiveOrdersByCustomerId,
  getAllOrdersByCustomerId,
  getOrderByOrderId,
  createOrder,
  updateOrderTotal,
};
