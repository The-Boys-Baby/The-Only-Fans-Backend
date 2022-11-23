const client = require("./seed")

async function createUser({username, password, firstname, lastname, email}){
    try {
        const { rows: [user] } =  await client.query(`
        INSERT INTO USERS(username, password, firstname, lastname, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username;
        `, [username, password,firstname,lastname,email]
        )
        // RETURNING *
        // delete user.password
        // console.log(user)
        return user
    } catch (error) {
        console.log(error)
    }
}

async function getUserById(id){
    try {
        const {rows: [user]} = await client.query(`
        SELECT id, username
        FROM users
        WHERE "id" = $1;`
        ,[id])
        // console.log(user)
        return user
    } catch (error) {
        console.log(error)
    }
}

async function getUserByUsername(username){
    try {
        const {rows: [user]} = await client.query(`
        SELECT id, username
        FROM users
        WHERE "username" = $1;`,[username])
        return user
    } catch (error) {
        console.log(error);
    }
}

async function updateUser(id, fields ={} ) {
    const keys = Object.keys(fields)
    const values = Object.values(fields)
    // build the set string
    const setString = keys.map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ user ] } = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE "id"=${ id }
        RETURNING *;
      `, values);
        //look at similar function in products
      return user;
    } catch (error) {
      throw error;
    }
}
  async function deleteUser(id){
    try {
        const { rows: [cheese]}= await client.query(`
        SELECT isactive
        FROM users
        WHERE "id" = $1;`
        ,[id])

        const { rows: [deleteProduct]} = await client.query(`
        UPDATE users
        SET "isactive" = $1
        WHERE "id" = ${id};
        `, [!cheese.isactive]) //interpolate id as $2
    } catch (error) {
        console.log(error)
    }
}

    

module.exports = {createUser, getUserById,getUserByUsername, updateUser,deleteUser}