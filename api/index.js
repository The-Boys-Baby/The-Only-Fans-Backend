const express = require("express")
const router = express.Router()


const jwt = require("jsonwebtoken")
const { getUserById } = require("../db/users")
const { JWT_SECRET } = process.env



router.use(async (req, res, next) => {
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


const productRouter = require("./products")
router.use("/products", productRouter)

const userRouter = require("./users")
router.use("/users", userRouter)

module.exports = router