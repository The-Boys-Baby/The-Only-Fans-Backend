const express = require("express")
const adminRouter = express.Router()
const {isAdmin,promoteAdmin} = require("../db/admin")
const {getUserById, getAllUsers} = require("../db/users")
const { createProduct } = require("../db/index")

async function requireAdmin(req, res, next){
        const checkAdmin = await isAdmin(req.user.id)
        if(checkAdmin.isadmin === true){
            next()
        }else{
            res.send({name: "NoAuthorization", message: "Please insert correct Credentials and try again"})
        }
}

adminRouter.get("/getUsers", requireAdmin, async (req,res,next) => {
    try {
        const allUsers = await getAllUsers()
        if(!!allUsers){
            res.send({name: "FetchingAllUsers", message: "Successfully Caight users", status: "successful", users: allUsers})
        }else{
            res.send({name: "FetchProblem", message: "Problem with fetching users"})
        }
    } catch (error) {
        next(error)
    }
})
adminRouter.post("/createproduct", requireAdmin, async (req, res, next) => {
    const {name, price, description, filePath} = req.body
    console.log(name, price,description,filePath)
    try {
        const post = await createProduct({name, price, description, filePath})
        console.log("this is post:", post)
        if (post){
            res.send(post)
        } else {
            res.send({
                name: "CreatePostError",
                message: "Creating a post error has occurred"
            })
        }
    } catch (error) {
        next(error)
    }
})
adminRouter.post("/promote", requireAdmin, async (req, res, next) => {
    try {
        const id = req.body.id
        console.log("this is promote id:", id)
        const checkUser = await getUserById(id)
        if(checkUser){
            await promoteAdmin(id)
            res.send({name: "PromoteAdmin", message: `you have successfully promoted userId ${id} to admin`})
        } else{
            res.send({name: "NoUser",message: "There is not a user with that name"})
        }
        next()
    } catch (error) {
        console.log(error)
    }
})

adminRouter.post("/update", requireAdmin, async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
})




module.exports = adminRouter