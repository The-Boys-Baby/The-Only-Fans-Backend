// jeremy: require('dotenv').config()
const pg = require("pg");

const client = new pg.Client(`postgres://localhost:5432/theonlyfans`);
// jeremy: pg.Client(process.env.DB_URL || `postgres://localhost:5432/theonlyfans`)

module.exports = client;
