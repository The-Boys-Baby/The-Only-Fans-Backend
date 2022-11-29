const client = require("./seed")


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
        console.log(rows)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createOrderItem, getOrderByOrderNumber }