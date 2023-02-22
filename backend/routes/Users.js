const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');


// Define your endpoints
// Login endpoint
router.get('/login', login_handler);

//Sign up endpoint
router.post('/sign up', signup_handler);

module.exports = router;







//USMAN CODE

// /** DB Instance */
// const db = require("./../Database")
// /** DB Constants */
// const { userTableConstant } = require("../constants/DatabaseConstants")

// /** Express Instance */
// const express = require("express")
// /** Instantiate usersRouter */
// const usersRouter = express.Router()

// /** 
//  * GET: Users
//  */
// usersRouter.get("/", (req, res) => {
//     // Prepare GET Query
//     const q = "SELECT * FROM " + userTableConstant

//     // Query the database
//     db.query(q, (err, data) => {
//         if (err) return res.json(err)

//         return res.json(data)
//     })
// })

// /** Export Users Router */
// module.exports = usersRouter