require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const apiRouter = require("./api")
const cors = require('cors')
const PORT = process.env.PORT || 1337



const app = express();
app.use(cors())
const client = require("./db/client")
app.use(morgan("dev"))

client.connect()

app.use(express.json())

app.use((req, res, next)=> {
    console.log("Beginning to use")
    console.log(req.body)
    next()
})

app.listen(PORT, () => {
    console.log(`now running on ${PORT}`)
})

app.use("/api", apiRouter)