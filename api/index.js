const express = require("express")
const router = express.Router()
const productRouter = require("./products")
const checkoutRouter = require("./checkout")
const userRouter = require("./users")


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
        // console.log(token)
        try {
            const parsedtoken = jwt.verify(token, JWT_SECRET)
            const id = parsedtoken && parsedtoken.id
            // console.log(id)
            if (id) {
                req.user = await getUserById(id)
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



router.use("/products", productRouter)
router.use("/checkout", checkoutRouter)
router.use("/users", userRouter)

module.exports = router