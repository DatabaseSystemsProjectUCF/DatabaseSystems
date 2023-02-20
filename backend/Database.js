/** MYSQL Instance */
const mysql = require("mysql")

/**
 * Database Connection: Takes the following parameters:
 * 
 *      host:       Where the DB is hosted
 *      user:       Username for DB account
 *      password:   Corresponding password for DB account
 *      database:   Which DB to access
 */
const db_er = mysql.createConnection({
    host: "10.32.248.112",
    user: "root",
    password: "password",
    database: "vu"
})

/** Export DB Connection */
module.exports = db_er