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