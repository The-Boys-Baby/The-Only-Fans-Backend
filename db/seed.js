const pg = require('pg') // jeremy: switch this file with index.js

const client = new pg.Client(`postgres://localhost:5432/theonlyfans`)
// jeremy: set it up so you have process.env.DB_URL OR this string ^

module.exports = client
