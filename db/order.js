const client = require("./client");

async function createOrder(customerid, active = false) {
  try {
    const {rows: [createdOrder]} = await client.query(
      `
        INSERT INTO "order"(customerid, orderstatus)
        VALUES ($1, $2)
        RETURNING *;`,
      [customerid, active]
    );
    console.log("This is our createdOrder: ", createdOrder)
    return createdOrder;
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
  console.log("This is active orders by customer id: ", id);
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
      console.log("this is it boys", typeof el.orderprice);
      if (typeof el.orderprice == "String") {
        let orderPrice = el.orderprice.slice(1);
        let test = Number.parseFloat("21.21");
        console.log("Your mom", test, typeof test);
        orderPrice = parseFloat(orderPrice.split(",").join("")).toFixed(2);
        const subtotal = orderPrice * el.quantity;
        totalprice += subtotal;
      } else {
        const subtotal = el.orderprice * el.quantity;
        totalprice += subtotal;
      }
    });
    console.log("Total Price: ", totalprice);
    const {
      rows: [updatedOrder],
    } = await client.query(
      `
        UPDATE "order"
        SET totalamount = $1
        WHERE "id" = $2
        RETURNING *
        ORDER BY "id" ASC;`,
      [totalprice, orderId]
    );
    return updatedOrder;
  } catch (error) {
    console.log(error);
  }
}
async function getOrderItemsByOrderNumber({ id }) {
  try {
    const { rows } = await client.query(
      `
        SELECT * FROM orderitem
        WHERE "orderid" = $1
        ORDER BY "id" ASC;`,
      [id]
    );
    // console.log(rows)
    if (rows.length == 0) return []
    return rows;
  } catch (error) {
    console.log(error);
  }
}
async function changeOrderStatus({ order: id }) {
  try {
    console.log("this is our order: ", id);
    const {rows: [updatedOrder]} = await client.query(
      `
        UPDATE "order"
        SET "orderstatus" = true
        WHERE "id" = $1
        RETURNING *
        ;`,
      [id]
    );
    console.log("This is changeOrderStatus updatedOrder: ", updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getAllOrders,
  getOrderItemsByOrderNumber,
  getActiveOrders,
  getActiveOrdersByCustomerId,
  getAllOrdersByCustomerId,
  getOrderByOrderId,
  createOrder,
  updateOrderTotal,
  changeOrderStatus,
};
