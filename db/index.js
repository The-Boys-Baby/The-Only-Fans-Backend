const client = require("./seed")
const { createUser, getUserById, getUserByUsername, updateUser,deleteUser } = require("./users")
const { createProduct, getProductById,getProductByName,updateProduct, deleteProduct,getAllProducts  } = require("./products")
const {getAllOrders,getActiveOrders,getActiveOrdersByCustomerId,getAllOrdersByCustomerId,getOrderByOrderId,createOrder} = require("./order")
const { createOrderItem, getOrderByOrderNumber,attachObjectsToOrder }= require("./orderitem")

async function dropTables(){
        try{

            await client.query(`
            DROP TABLE IF EXISTS orderitem;
            DROP TABLE IF EXISTS "order";
            DROP TABLE IF EXISTS product;
            DROP TABLE IF EXISTS users;`)

        }catch(error){
            console.log(error)
        }
}

async function createTables(){
    try {
        await client.query(`
        CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstname VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        isactive BOOLEAN DEFAULT(TRUE));
        
        CREATE TABLE product(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        price INTEGER NOT NULL,
        description VARCHAR(500) NOT NULL,
        isActive BOOLEAN DEFAULT(TRUE)
        );

        CREATE TABLE "order"(
        id SERIAL PRIMARY KEY,
        customerid INTEGER REFERENCES users(id),
        totalamount MONEY NOT NULL DEFAULT(0),
        Orderstatus BOOLEAN DEFAULT(false)
        );

        CREATE TABLE orderitem(
        id SERIAL PRIMARY KEY,
        orderid INTEGER REFERENCES "order"(id),
        productid INTEGER REFERENCES product(id),
        quantity INTEGER NOT NULL
        );
        `)
    } catch (error) {
        console.log(error)
    }
}
async function createUsersForData(){
    await createUser({
        username: "cheesy"
        , password: "cheese"
        , firstname: "cheese"
        , lastname: "johnson"
        , email: "swisscheeze@email.com"
    })
    await createUser({
        username: "dsfdsfg"
        , password: "dsgsdgdsg"
        , firstname: "csdgsdgdsg"
        , lastname: "jamestone"
        , email: "dsfdsfgjameston@email.com"
    })
    await createUser({
        username: "Kenny"
        , password: "Benny"
        , firstname: "Keenny"
        , lastname: "myGirlfriendGotUpperCutByASpecialNeedsKenderGartner"
        , email: "Kenny@email.com"
    })
}
async function createTestProducts (){
    await createProduct({
        name: "firstProduct",
        price: 10,
        description: "The First Product"})
    await createProduct({
        name: "SecondProduct",
        price: 15,
        description: "The Second Product"})
    await createProduct({
        name: "ThirdProduct",
        price: 35,
        description: "The Second Product"})
}

async function TB (){
    client.connect()
    await dropTables()
    await createTables()
    await createUsersForData()
    await getUserById(1)
    await getUserByUsername("Kenny")
    await createTestProducts()
    await getProductById(2)
    await getProductByName("firstProduct")
    await updateProduct(1, {name: "cheese", description: "owuga"})
    await updateUser(1, {username: "cheezyboi", email: "crapface@icloud.com"})
    await deleteProduct(2)
    await deleteUser(1)
    await getAllProducts()
    await createOrder(1)
    await createOrder(1,true)
    await createOrder(2)
    await createOrder(3)
    // await getAllOrders()
    // await getActiveOrders()
    await getActiveOrdersByCustomerId({id: 1})
    await getAllOrdersByCustomerId({id: 1})
    // await getOrderByOrderId(1)
    await createOrderItem({orderId: 1, productId: 1, quantity: 4})
    await createOrderItem({orderId: 1, productId: 2, quantity: 2})
    await createOrderItem({orderId: 2, productId: 3, quantity: 3})
    await createOrderItem({orderId: 2, productId: 3, quantity: 3})
    await createOrderItem({orderId: 3, productId: 3, quantity: 8})
    await createOrderItem({orderId: 3, productId: 3, quantity: 2})
    await getOrderByOrderNumber({id:2})
    console.log(await attachObjectsToOrder(2))
    client.end()
}

TB()