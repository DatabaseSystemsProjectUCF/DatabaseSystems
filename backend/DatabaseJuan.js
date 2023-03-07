/** MYSQL Instance */
const mysql = require("mysql2");

/**
 * Database Connection: Takes the following parameters:
 *
 *      host:       Where the DB is hosted
 *      user:       Username for DB account
 *      password:   Corresponding password for DB account
 *      database:   Which DB to access
 */
const db_er = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "D18eLqVs",
  database: "dbproject",
});

/** Export DB Connection */
module.exports = db_er;
