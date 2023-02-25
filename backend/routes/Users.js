const express = require('express');
const router = express.Router();
const { login_handler, register_handler } = require("../controllers/UserController");
const { body, validationResult } = require("express-validator");

// Login endpoint
router.get('/login', login_handler);

//Register endpoint
router.post('/register',
    //Validate email and password
        body("email").isEmail(),
        body("password").isLength({min : 8}), async (req, res)=>{
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({"success": false, "message": error.array()});
    }
    await register_handler(req, res);
});

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