const express = require("express")
const adminRouter = express.Router()
const {isAdmin,promoteAdmin} = require("../db/admin")
const {getUserById} = require("../db/users")

async function requireAdmin(req, res, next){
        const checkAdmin = await isAdmin(req.user.id)
        if(checkAdmin.isadmin === true){
            next()
        }else{
            res.send({name: "NoAuthorization", message: "Please insert correct Credentials and try again"})
        }
}

adminRouter.post("/", requireAdmin, async (req,res,next) => {
    try {
        
        res.send({name: "cheese"})
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


adminRouter.post("/newItem", requireAdmin, async (req, res, next) => {
    try {
        

        res.send
    } catch (error) {
        
    }
})
adminRouter.post("/update/:itemId", requireAdmin, async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
})




module.exports = adminRouter