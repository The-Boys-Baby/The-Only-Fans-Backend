const client = require("./seed")
const { createUser, getUserById, getUserByUsername } = require("./users")
const { createProduct, getProductById,getProductByName,updateProduct  } = require("./products")


async function dropTables(){
        try{
            await client.query(`
            DROP TABLE IF EXISTS completeorder;
            DROP TABLE IF EXISTS cart;
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
        active BOOLEAN DEFAULT(TRUE));
        
        CREATE TABLE product(
        productid SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        price INTEGER NOT NULL,
        description VARCHAR(500) NOT NULL,
        isActive BOOLEAN DEFAULT(TRUE)
        );

        CREATE TABLE cart(
        cartid SERIAL PRIMARY KEY,
        customerid INTEGER REFERENCES users(id),
        totalamount MONEY NOT NULL,
        Orderstatus BOOLEAN DEFAULT(false)
        );

        CREATE TABLE completeorder(
        orderlineid SERIAL PRIMARY KEY,
        orderid INTEGER REFERENCES cart(cartid),
        productid INTEGER REFERENCES product(productid),
        quantity INTEGER NOT NULL,
        UNIQUE (orderid, productid)
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
    client.end()
}

TB()