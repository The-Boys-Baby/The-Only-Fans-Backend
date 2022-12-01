const express = require("express")
const userRouter = express.Router()

const { getUserByUsername, createUser} = require("../db/users")
const {createOrder} = require("../db/order")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



userRouter.post("/register", async (req, res, next) => {
    
    const {username, password, firstname, lastname, email} = req.body
    // console.log(username)
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
        // console.log(user.id)
        await createOrder(user.id)
        res.send({
            user,
            message: `Successfully created Username and password thank you for signing up ${username}`,
            token
        });

    } catch ({name, message}) {
        next({name, message})
    }
})

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