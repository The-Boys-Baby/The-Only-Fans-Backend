const pg = require('pg') // switch this file with index

const client = new pg.Client(`postgres://localhost:5432/theonlyfans`)
// set it up so you have process.env.DB_URL OR this string ^

module.exports = client
