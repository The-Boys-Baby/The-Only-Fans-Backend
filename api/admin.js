const express = require("express")
const adminRouter = express.Router()
const {isAdmin,promoteAdmin} = require("../db/admin")
const {getUserById, getAllUsers} = require("../db/users")
const { createProduct } = require("../db/index")

async function requireAdmin(req, res, next){
    console.log(req.user)
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
        console.log(error)
    }
})
adminRouter.post("/:user", requireAdmin, async (req, res, next) => {
    try {
        const id = req.params.user
        const checkUser = await getUserById(id)
        if(checkUser){
            await promoteAdmin(id)
            res.send({name: "PromoteAdmin", message: `you have successfully promoted userId ${id} to admin`})
        } else{
            res.send({name: "NoUser",message: "There is not a user with that name"})
        }
        
    } catch (error) {
        console.log(error)
    }
})


adminRouter.post("/createProduct", requireAdmin, async (req, res, next) => {
    try {
        const createdItem = await createProduct({})
        console.log(createdItem)

    } catch (error) {
        
    }
})
adminRouter.post("/update/:itemId", requireAdmin, async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
})




module.exports = adminRouter