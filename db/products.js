const client = require("./seed")

async function getAllProducts(){
    try {
        const {rows} = await client.query(`
        SELECT * FROM product
        WHERE "isactive" = TRUE;`)
        console.log(rows)
        return rows
    } catch (error) {
        console.log(error)
    }
}

// jeremy: separate function for inactive products.
// jeremy: separate function for ALL products, regardless of activity.

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
        `, [!getit.isactive]) // jeremy: interpolate id here, $2 and [isactive, id]
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
        WHERE "productid" = ${keys.length + 1}
        RETURNING *;`,
        [...values, id])
        //  jeremy: getting rowCount but not using it
        // opportunity to return the count, the row, check if it was more than 1, etc. and return something.
        // can also get { rows } and get the count from the rows.length, etc.
    } catch (error) {
        console.log(error)
    }
}



module.exports = { getAllProducts,createProduct, getProductById, getProductByName,updateProduct,deleteProduct }