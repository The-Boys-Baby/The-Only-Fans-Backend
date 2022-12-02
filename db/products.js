
const client = require("./seed")

async function getAllProducts(){
    try {
        const {rows} = await client.query(`
        SELECT * FROM product
        WHERE "isactive" = TRUE;`)
        // console.log(rows)
        return rows
    } catch (error) {
        console.log(error)
    }
}
async function createProduct({name, price, description,filePath}){
    try{
        const {rows: [product]} = await client.query(`
        INSERT INTO product(name, price, description, pictures)
        VALUES ($1,$2,$3,$4)
        RETURNING *;`, [name,price,description,filePath])
        // console.log(product)
        return product
    }catch(error){
        console.log(error)
    }
}
async function getProductById(id){
    try {
        console.log("this is id in getProductbyId", id)
        const {rows: [product]} = await client.query(`
        SELECT *
        FROM product
        WHERE "id" = $1;`,[id])
        console.log(product)
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
        console.log(getit)
        const {rowCount}= await client.query(`
        UPDATE product
        SET "isactive" = $1
        WHERE "id" = ${id};
        `, [!getit.isactive])
        if(rowCount){
           return !!rowCount
        } else{
            return false
        }
        
    } catch (error) {
        return error
    }
}

async function updateProduct(id, fields = {}){
        const keys = Object.keys(fields)
        const values = Object.values(fields)
        if (keys.length === 0){
            return
        }

        const colums = keys.map((el, index) => `"${el}" = $${index + 1}` ).join(", ")

    try {
        const { rowCount } = await client.query(`
        UPDATE product
        SET ${colums}
        WHERE "id" = ${id}
        RETURNING *;`,
        values)
        // console.log(!!rowCount)
    } catch (error) {
        console.log(error)
    }
}




module.exports = { getAllProducts,createProduct, getProductById, getProductByName,updateProduct,deleteProduct }