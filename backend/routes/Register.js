/** DB Instance */
const db = require("./../Database")

/** Bcrypt Instance */
const bcrypt = require("bcrypt")
const saltRounds = 10

/** DB Constants */
const { AUTHLEVEL, 
        CREATETIME, 
        ID, 
        PASSWORD, 
        USER, 
        USERNAME, 
        USERTABLE } = require("../constants/DatabaseConstants")
/** DB Errors */
const { NO_USERNAME_OR_PASSWORD } = require("../constants/DatabaseErrors")

/** Express Instance */
const express = require("express")
/** Instantiate usersRouter */
const signUpRouter = express.Router()

/** 
 * POST: Register
 * 
 * Params: Username, Password
 */
signUpRouter.post("/", (req, res) => {

    // Parameter Error Handling
    if(!req.body || !req.body.id || !req.body.username || !req.body.password || !req.body.authLevel || !req.body.createTime) {
        throw new Error(NO_USERNAME_OR_PASSWORD)
    }

    // Extract necessary attributes
    const user_id = req.body.id
    const username = req.body.username
    const password = req.body.password
    const authLevel = req.body.authLevel
    const createTime = req.body.createTime

    // Password Hashing
    bcrypt.hash(password, saltRounds, (error, hash) => {

        // Prepare DB Query
        const q = "INSERT INTO " + USERTABLE + 
                  " (" + ID + ", " + 
                  USERNAME + ", " +
                  PASSWORD + ", " +
                  AUTHLEVEL + ", " +
                  CREATETIME + ") "+ 
                  "VALUES (?,?,?,?,?)"

        // Query the database
        db.query(q, 
            [user_id, username, hash, authLevel, createTime],
            (err, result) => {

                // DB error
                if (err) {
                    res.status(400)

                    return res.send(err.sqlMessage)
                }

                return res.json(result)
            })
    })

})

/** Export Signup Router */
module.exports = signUpRouter