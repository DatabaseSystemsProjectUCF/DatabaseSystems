/** Import Bcrypt */
const bcrypt = require("bcrypt")

/** Import Database Connection */
const db = require("./../Database")





//USMAN CODE

// /** DB Constants */
// const { USERTABLE, 
//         USERNAME } = require("../constants/DatabaseConstants")
// /** DB Errors */
// const { NO_USERNAME_OR_PASSWORD } = require("../constants/DatabaseErrors")
/** DB Constants */
const { USERTABLE, USERNAME } = require("../constants/DatabaseConstants");
/** DB Errors */
const { NO_USERNAME_OR_PASSWORD } = require("../constants/DatabaseErrors");

// /** Import Express */
// const express = require("express");

// /** Instantiate usersRouter */
// const loginRouter = express.Router()

// /** 
//  * POST: Login
//  * 
//  * Params: Username, Password
//  */
// loginRouter.post("/", (req, res) => {

//     // Parameter Error Handling
//     if(!req.body || !req.body.username || !req.body.password) {
//         return res.json(NO_USERNAME_OR_PASSWORD)
//     }

//     // Extract Username and password
//     const username = req.body.username
//     const password = req.body.password

//     // Prepare DB Query
//     const q = "SELECT * FROM " + USERTABLE + " WHERE " + USERNAME + " = ?;"

//     // Query the database
//     db.query(q, 
//         [username], 
//         (q_err, data) => {

//             // DB Error
//             if (q_err){

//                 res.status(400)
//                 return res.json(q_err)
//             }

//             // If Database response isn't empty
//             if(data.length > 0){

//                 // Compare user's password input and hashed entry. There can only be one entry
//                 // returned since username is a Primary Key
//                 bcrypt.compare(password, data[0].password, (b_error, response) => {

//                     // Incorrect password
//                     if (b_error){
//                         res.status(403)
//                         return res.json("Incorrect Password!")
//                     }
                    
//                     return res.json(data)
//                 })
//             }
//             else {

//                 // Username's incorrect
//                 res.status(404)
//                 return res.json("Username does not exist!")
//             }
//         })
// })

// /** Export Login Router */
// module.exports = loginRouter
