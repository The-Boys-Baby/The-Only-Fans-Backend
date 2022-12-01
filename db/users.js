const client = require("./seed")
const bcrypt = require('bcrypt')

async function createUser({username, password, firstname, lastname, email}){
    const hashedpassword = await bcrypt.hash(password, 10)
    try {
        const { rows: [user] } =  await client.query(`
        INSERT INTO USERS(username, password, firstname, lastname, email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username;
        `, [username, hashedpassword,firstname,lastname,email]
        )
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
        SELECT id, username, password
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
        `, [!cheese.isactive])
    } catch (error) {
        console.log(error)
    }
}


    

module.exports = {createUser, getUserById,getUserByUsername, updateUser,deleteUser}