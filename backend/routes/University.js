const express = require('express');
const router = express.Router();
const { create_univ_handler} = require("../controllers/UnivController");
const { body, validationResult } = require("express-validator");

//Create university profile
router.post('/create_univ_profile', 
        //Validate email and password
        body("email").isEmail(),
        body("password").isLength({min : 8}), async (req, res)=>{
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(403).json({"success": false, "message": error.array()});
    }
    await create_univ_handler(req, res);
});

module.exports = router;