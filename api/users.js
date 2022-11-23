const express = require("express")
const userRouter = express.Router()

const { getUserByUsername, createUser} = require("../db/users")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



userRouter.post("/register", async (req, res, next) => {
    
    const {username, password, firstname, lastname, email} = req.body
    console.log(username)
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


module.exports = userRouter