
const  client = require("./seed")

async function createOrder(customerid, active = false){
    try {
        const {rows} = await client.query(`
        INSERT INTO "order"(customerid, orderstatus)
        VALUES ($1, $2)
        RETURNING *;`,[customerid, active])
        // console.log(rows)
        return rows
    } catch (error) {
        console.log(error)
    }
}
async function getAllOrders(){
    try {
        const { rows } = await client.query(`
        SELECT * FROM "order";`)
        // console.log(rows)
        return rows
    } catch (error) {
        console.log(error)
    }
}
async function getActiveOrders(){
    try {
        const { rows } = await client.query(`
        SELECT * FROM "order"
        WHERE "orderstatus" = false;`)
        // console.log(rows)
        return rows
    } catch (error) {
        console.log(error)
    }
}
async function getActiveOrdersByCustomerId({id}){
    try {
        const { rows: [activeOrder] } = await client.query(`
        SELECT * FROM "order"
        WHERE "orderstatus" = false AND "customerid" = $1;`,[id])
        console.log(activeOrder)
        return activeOrder
    } catch (error) {
        console.log(error)
    }
}
async function getAllOrdersByCustomerId({id}){
    try {
        const { rows } = await client.query(`
        SELECT * FROM "order"
        WHERE "customerid" = $1;`,[id])
        console.log(rows)
        return rows
    } catch (error) {
        console.log(error)
    }
}
async function getOrderByOrderId(id){
    try {
        const { rows } = await client.query(`
        SELECT * FROM "order"
        WHERE "id" = $1;`,[id])
        console.log(rows)
        return rows
    } catch (error) {
        console.log(error)
    }
}



module.exports = {getAllOrders,getActiveOrders,getActiveOrdersByCustomerId,getAllOrdersByCustomerId,getOrderByOrderId,createOrder}