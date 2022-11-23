const express = require("express")
const app = express.Router()
const morgan = require("morgan")


const jwt = require("jsonwebtoken")
const { getUserById } = require("../db/users")
const { JWT_SECRET } = process.env

app.use(morgan)

app.use(async (req, res, use) => {
    const prefix = "Bearer "
    const auth = req.header("Authorization")

    if(!auth){
        next()
    } else if(auth.startsWith(prefix)){
        const token = auth.slice(prefix.length)
        try {
            const parsedtoken = jwt.verify(token, JWT_SECRET)

            const id = parsedtoken && parsedtoken.id
            if (id) {
                req.user = await getUserById()
                next()
            }
        } catch (error) {
            console.log(error)
        }
    }else{
        next({
            name: "AuthorizationHeaderError",
            message: `Authorization token must start with {${ prefix}}`
        })
    }
})