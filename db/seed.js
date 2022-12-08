const client = require("./client")
const { createUser, getUserById, getUserByUsername, updateUser,deleteUser } = require("./users")
const { createProduct, getProductById,getProductByName,updateProduct, deleteProduct,getAllProducts  } = require("./products")
const {getAllOrders,getActiveOrders,getActiveOrdersByCustomerId,getAllOrdersByCustomerId,getOrderByOrderId,createOrder} = require("./order")
const { createOrderItem, getOrderItemsByOrderNumber,attachObjectsToOrder }= require("./orderitem")

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
        isactive BOOLEAN DEFAULT(TRUE),
        isadmin BOOLEAN DEFAULT(FALSE));
        
        CREATE TABLE product(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        price FLOAT NOT NULL,
        description VARCHAR(500) NOT NULL,
        isActive BOOLEAN DEFAULT(TRUE),
        pictures TEXT UNIQUE NOT NULL
        );

        CREATE TABLE "order"(
        id SERIAL PRIMARY KEY,
        customerid INTEGER REFERENCES users(id),
        totalamount FLOAT NOT NULL DEFAULT(0),
        Orderstatus BOOLEAN DEFAULT(false)
        );

        CREATE TABLE orderitem(
        id SERIAL PRIMARY KEY,
        orderid INTEGER REFERENCES "order"(id),
        productid INTEGER REFERENCES product(id),
        orderprice FLOAT DEFAULT(0),
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
        , lastname: "LovesHisGirlfriend"
        , email: "Kenny@email.com"
    })
}
async function createTestProducts (){
    await createProduct({
        name: "Power Breezer Mach 4",
        price: 6000.99,
        description: "Mach 4 fan link",
        filePath: "https://images-ext-2.discordapp.net/external/cX-sXQdCZEkO2fe-pX3B6skLotqBQUIZUdvqUnLVzow/https/www.powerbreezer.com/wp-content/uploads/2021/07/mach-4-left.webp"})
    await createProduct({
        name: "Dyson Cool Link",
        price: 299,
        description: "The Second Product",
        filePath: "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/305158-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920"})
    await createProduct({
        name: "Global Industrial 30 inch fan",
        price: 292,
        description: "The Second Product",
        filePath: "https://images.globalindustrial.com/images/pd/x607050.jpg"})
    await createProduct({
        name: "Lasko 20inch Premium fan",
        price: 22,
        description: "The Second Product",
        filePath: "https://img.cdn4dd.com/cdn-cgi/image/fit=contain,width=2688,height=1512,format=auto/https://doordash-static.s3.amazonaws.com/media/photosV2/ea8832ee-b3b4-4e1e-8d1f-3152a70737ea-retina-large.jpg"})
    await createProduct({
        name: "6ft Indoor/ OutDoor blower",
        price: 7499,
        description: "The Second Product",
        filePath: "https://s3-assets.sylvane.com/media/images/products/big-ass-fans-black-jack-six-foot-indoor-outdoor-portable-barrel-fan-main.png"})
    await createProduct({
        name: "Black+Decker Fan",
        price: 36,
        description: "The Second Product",
        filePath: "https://m.media-amazon.com/images/I/81FkIq3LikL._AC_SX679_.jpg"})
    await createProduct({
        name: "8 Foot Big Ass Brand Fan",
        price: 9998,
        description: "A big golden fan",
        filePath: "https://s3-assets.sylvane.com/media/images/products/big-ass-fans-airgo-8-foot-oaw-indoor-outdoor-portable-barrel-fan-main.png"})
    await createProduct({
        name: "62 inch wood accent ceiling fan",
        price: 788,
        description: "Wood Accented Fans",
        filePath: "https://image.lampsplus.com/is/image/b9gt8/62-inch-artemis-xl5-distressed-koa-led-dc-ceiling-fan-with-remote__19x62cropped.jpg?qlt=65&wid=274&hei=274&op_sharpen=1&fmt=jpeg"})
    await createProduct({
        name: "Lasko air dryer for floods",
        price: 62,
        description: "The perfect fan for plumbers with floods",
        filePath: "https://m.media-amazon.com/images/I/81c60z1zlNS._AC_SX679_.jpg"})
    await createProduct({
        name: "The X-Tream Bladed fan",
        price: 538,
        description: "For those time travelers who are stick in the past but want to feel more at home",
        filePath: "https://image.lampsplus.com/is/image/b9gt8/84-inch-minka-aire-xtreme-h2o-iron-wet-ceiling-fan-with-remote-control__34j72cropped.jpg?qlt=65&wid=274&hei=274&op_sharpen=1&fmt=jpeg"})
    await createProduct({
        name: "The Straight Up Fan",
        price: 35,
        description: "This fan kinda looks like something, you know what I mean",
        filePath: "https://images.thdstatic.com/productImages/4f7af9be-3f4e-4106-9f45-070fd6ba06a3/svn/black-comfort-zone-tower-fans-cztfr1bk-4f_145.jpg"})
    await createProduct({
        name: "The Whale Tale Fan",
        price: 489,
        description: "For those who love whales and tales, this is the right fan for you",
        filePath: "https://cdn.shopify.com/s/files/1/0074/5999/5707/products/01-_000008_4474a653-4277-460a-864b-c53caa8f3770_1296x.png?v=1648899569"})
    await createProduct({
        name: "50 inch modern fan",
        price: 559,
        description: "If you dont like curved edges, this is the perfect fan for you",
        filePath: "https://image.lampsplus.com/is/image/b9gt8/60-inch-modern-forms-vortex-automotive-silver-wet-smart-ceiling-fan__61w85cropped.jpg?qlt=65&wid=274&hei=274&op_sharpen=1&fmt=jpeg"})              
    await createProduct({
        name: "Dyson pure hot and cold",
        price: 499,
        description: "for those who prefer a warm pillow to sleep on and make a lot of money.",
        filePath: "https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/311383-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920"})
    await createProduct({
        name: "MinkaAire double fan",
        price: 1009,
        description: "steampunk fan isn’t really that cool though.",
        filePath: "https://s3.img-b.com/image/private/t_base,c_lpad,f_auto,dpr_auto,w_80,h_80/product/minkaaire/traditional_gyrobelcaro_walnut.jpg"})
    await createProduct({
        name: "Kichler Kyte",
        price: 536,
        description: "Think about buying this fan at least three times. Sit on that feeling and don’t buy it. Why would you buy this? Does anyone love you? Have you seen your family recently?",
        filePath: "https://s3.img-b.com/image/private/t_base,c_lpad,f_auto,dpr_auto,w_70,h_70/product/kichler/300254ni_weathed-white-walnut.jpg"})
    await createProduct({
        name: "Fanimation Brewmaster",
        price: 25511,
        description: "56 inch double blade. Comes with remote control",
        filePath: "https://s3.img-b.com/image/private/t_base,c_lpad,f_auto,dpr_auto,w_80,h_80/product/fanimation/fanimation-fp1280bl1026-l1-4917719_1.jpg"})
    await createProduct({
        name: "ALLMODERN Ceiling Fan",
        price: 620,
        description: "48 inch triple blade fan.",
        filePath: "https://secure.img1-cg.wfcdn.com/im/50510622/resize-h445%5Ecompr-r85/2075/207590966/48%27%27+Ceiling+Fan.jpg"})                       
}

async function TB (){
    client.connect()
    await dropTables()
    await createTables()
    await createUsersForData()
    // await getUserById(1)
    // await getUserByUsername("Kenny")
    await createTestProducts()
    // await getProductById(2)
    // await getProductByName("firstProduct")
    // await updateProduct(1, {name: "cheese", description: "owuga"})
    // await updateUser(1, {username: "cheezyboi", email: "crapface@icloud.com"})
    // await deleteProduct(2)
    // await deleteUser(1)
    // await getAllProducts()
    await createOrder(1)
    await createOrder(1,true)
    await createOrder(2)
    await createOrder(3)
    // await getAllOrders()
    // await getActiveOrders()
    // await getActiveOrdersByCustomerId({id: 1})
    // await getAllOrdersByCustomerId({id: 1})
    // await getOrderByOrderId(1)
    await createOrderItem({orderId: 1, productId: 1, quantity: 4})
    await createOrderItem({orderId: 1, productId: 2, quantity: 2})
    await createOrderItem({orderId: 2, productId: 3, quantity: 3})
    await createOrderItem({orderId: 2, productId: 3, quantity: 3})
    await createOrderItem({orderId: 3, productId: 3, quantity: 8})
    await createOrderItem({orderId: 3, productId: 3, quantity: 2})
    // await getOrderByOrderNumber({id:2})
    client.end()
}

TB()