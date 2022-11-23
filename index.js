require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const apiRouter = require("./api")
const cors = require('cors') // nice catch


const app = express();
app.use(cors())
const client = require("./db/seed")
app.use(morgan("dev")) //the middle man - third wheel

client.connect()

app.use(express.json())

app.use((req, res, next)=> { // get rid of this on production branch
    console.log("Beginning to use")
    console.log(req.body)
    next()
})


const port = 1337

app.listen(port, () => {
    console.log(`now running on ${port}`) // get rid of this on prod
})

app.use("/api", apiRouter)