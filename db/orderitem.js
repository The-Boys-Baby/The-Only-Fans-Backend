const client = require("./seed")
const { getActiveOrdersByCustomerId} = require("./order")


async function createOrderItem({orderId,productId,quantity}){
    try{
        const {rows} = await client.query(`
        INSERT INTO orderitem(orderid,productid,quantity)
        VALUES ($1,$2,$3)
        RETURNING *;
        `, [orderId,productId,quantity])
        // console.log(rows)
    }catch(error){
        console.log(error)
    }
}

async function getOrderByOrderNumber({id}){
    try {
        const { rows } = await client.query(`
        SELECT * FROM orderitem
        WHERE "orderid" = $1`, [id])
        // console.log(rows)
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function attachObjectsToOrder(id){
    try{
        const customerOrder = await getActiveOrdersByCustomerId({id:id})
        // console.log(customerOrder.id)
        customerOrder.items = await getOrderByOrderNumber({id: customerOrder.id})
        if (customerOrder.items){
            return customerOrder
        }else{
            return {name: "NoItemsInCart", message: "there is not item in your cart"}
        }
    }catch(error){
        console.log(error)
    }
}

module.exports = { createOrderItem, getOrderByOrderNumber, attachObjectsToOrder,attachObjectsToOrder }