const express = require("express")
const userRouter = express.Router()


const { getUserByUsername, createUser} = require("../db/users")
const {createOrder} = require("../db/order")
const bcrypt = require("bcrypt")
//importing jwt
const jwt = require("jsonwebtoken")
const { application } = require("express")
const router = require(".")

userRouter.post("/register", async (req, res, next) => {
    
    const {username, password, firstname, lastname, email} = req.body
    console.log(username)
    try {
        const checkuser = await getUserByUsername(username)

        if (checkuser) {
            res.send({
                status: "Unsuccessful",
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
        // console.log(token)
        console.log(user.id)
        await createOrder(user.id)
        res.send({
            user,
            status: "Successful",
            message: `Successfully created Username and password thank you for signing up ${username}`,
            token
        });

    } catch (error) {
        console.log(error)
        next()
    }


})

// // calling an async function after the create user function to hash and encrypt the password
// async function hashedPassword (password){
//     try {
//         // assigning saltValue to an await function to then generate the salt value
//         const saltValue = await bcrypt.genSalt(8)
//         console.log(`I am the salt value: ${saltValue}`)
//         // now we are hashing our salt value by passing password and saltValue as a promise 
//         const hashedValue = await bcrypt.hash(password, saltValue)
//         console.log(`I am the hashed value: `, hashedValue)
//     } catch (error) {
//         console.log(error)
//     }
// }
// callling the hashedPassword function to show in our terminal/console
// hashedPassword('password');

// using bcrpyt.compare we will tell if two values are one and the same
userRouter.post("/login", async (req,res, next) => {
    const {username,password} = req.body 
   
    if (!username, !password){
        res.send({  name: "MissingCredentials",
                message: "Please put in username and password"})
    }

    try{
    const user = await getUserByUsername(username)
    // console.log(user)
    const hashedpassword = user.password
    // console.log(hashedpassword)
    const validity = await bcrypt.compare(password, hashedpassword)
    // console.log(validity)
    if(user && validity){
        // console.log("did that")
        const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "1w"})
        // console.log("token")
        res.send({message: `thank you for logging in ${username}`, token: token})

    }else{
        res.send({name: "INVALIDUSERCREDENTIALS", 
        message: "Invalid Username or password"})
    }
    }catch(error){
        // console.log(error)
        next(error)
    }
})


module.exports = userRouter