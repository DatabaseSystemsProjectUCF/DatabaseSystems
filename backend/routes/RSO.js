const express = require('express');
const router = express.Router();
const { join_rso_handler, create_rso_handler } = require("../controllers/RSOController");


//Join RSO endpoint
router.post('/join_rso', join_rso_handler);

router.post('/create_rso', create_rso_handler);

module.exports = router;