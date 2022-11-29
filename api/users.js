const express = require("express")
const userRouter = express.Router()


const { getUserByUsername, createUser} = require("../db/users")

// importing bcrypt
const bcrypt = require("bcrypt")
//importing jwt
const jwt = require("jsonwebtoken")
const { application } = require("express")
const router = require(".")

userRouter.post("/register", async (req, res, next) => {
    
    const {username, password, firstname, lastname, email} = req.body
    console.log(username)
    console.log('i am the body of this request')
    try {
        const checkuser = await getUserByUsername(username)
        
      

        if (checkuser) {
            next({
                name: "userExists",
                message: "Username already exists, please input another username"
            });
        }

        const user = await createUser({
            username,
            password,
            firstname,
            lastname,
            email
        });

        const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "1w"})

        res.send({
            user,
            message: `Successfully created Username and password thank you for signing up ${username}`,
            token
        });

       

        
        


    } catch ({name, message}) {
        next({name, message})
    }


})

// calling an async function after the create user function to hash and encrypt the password
async function hashedPassword (password){
    try {
        // assigning saltValue to an await function to then generate the salt value
        const saltValue = await bcrypt.genSalt(8)
        console.log(`I am the salt value: ${saltValue}`)
        // now we are hashing our salt value by passing password and saltValue as a promise 
        const hashedValue = await bcrypt.hash(password, saltValue)
        console.log(`I am the hashed value: `, hashedValue)
    } catch (error) {
        console.log(error)
    }
}
// callling the hashedPassword function to show in our terminal/console
hashedPassword('password');

// using bcrpyt.compare we will tell if two values are one and the same

module.exports = userRouter