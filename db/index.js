const client = require("./client")
module.exports = {
    ...require("./admin"),
    client,
    ...require("./order"),
    ...require("./orderitem"),
    ...require("./users"),
    ...require("./products")
}