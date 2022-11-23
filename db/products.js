const client = require("./seed")


async function createProduct({name, price, description}){
    try{
        const {rows: [product]} = await client.query(`
        INSERT INTO product(name, price, description)
        VALUES ($1,$2,$3)
        RETURNING *;`, [name,price,description])
        // console.log(product)
        return product
    }catch(error){
        console.log(error)
    }
}
async function getProductById(id){
    try {
        const {rows: [product]} = await client.query(`
        SELECT *
        FROM product
        WHERE "productid" = $1;`,[id])
        // console.log(product)
        return product
    } catch (error) {
        console.log(error)
    }
}
async function getProductByName(name){
    try {
        const {rows: [product]} = await client.query(`
        SELECT * 
        FROM product
        WHERE "name" = $1;`,[name])
        // console.log(product)
        return product
    } catch (error) {
        console.log(error)
    }
}
async function deleteProduct(id){
    try {
        const getit = await getProductById(id)
        // console.log(getit)
        const { rows: [deleteProduct]} = await client.query(`
        UPDATE product
        SET "isactive" = $1
        WHERE "productid" = ${id};
        `, [!getit.isactive])
    } catch (error) {
        console.log(error)
    }
}

async function updateProduct(id, fields = {}){
        const keys = Object.keys(fields)
        const values = Object.values(fields)

        if (keys.length === 0){
            return
        }

        const colums = keys.map((el, index) => `${el} = $${index + 1}` ).join(", ")

    try {
        const { rowCount } = await client.query(`
        UPDATE product
        SET ${colums}
        WHERE "productid" = ${id}
        RETURNING *;`,
        values)
        // console.log(!!rowCount)
    } catch (error) {
        console.log(error)
    }
}



module.exports = { createProduct, getProductById, getProductByName,updateProduct,deleteProduct }