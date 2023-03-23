const express = require('express');
const router = express.Router();
const { join_rso_handler, create_rso_handler, display_all_rso_handler, display_rso_handler } = require("../controllers/RSOController");


//Join RSO endpoint
router.post('/join_rso', join_rso_handler);

//Create RSO endpoint
router.post('/create_rso', create_rso_handler);

//Display RSO endpoint
router.get('/display_rso', display_rso_handler)

//Display All RSO's
router.get('/display_all_rso', display_all_rso_handler);

module.exports = router;