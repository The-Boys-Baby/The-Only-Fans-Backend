const client = require("./client")



async function isAdmin(id){
    try {
        const {rows: [user]} = await client.query(`
        SELECT isadmin FROM users
        WHERE id = $1;
        `, [id])

        return user
    } catch (error) {
        console.log(error)
    }
}
async function promoteAdmin(id){
    try {
        await client.query(`
        UPDATE users
        SET "isadmin" = TRUE
        WHERE "id" = $1
        RETURNING *;
        `,[id])
    } catch (error) {
        console.log(error)
    }
}
async function demoteAdmin(id){
    try {
        await client.query(`
        UPDATE users
        SET "isadmin" = False
        WHERE "id" = $1
        RETURNING *;
        `,[id])
    } catch (error) {
        console.log(error)
    } 

}

module.exports = { isAdmin,promoteAdmin,demoteAdmin }