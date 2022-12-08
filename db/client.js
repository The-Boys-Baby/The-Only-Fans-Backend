require('dotenv').config()
const pg = require("pg")

const client = new pg.Client(proccess.env.DB_URL || `postgres://localhost:5432/theonlyfans`)

module.exports = client