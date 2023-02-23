const express = require('express');
const router = express.Router();
const { join_rso_handler } = require("../controllers/RSOController");

//Join RSO endpoint
router.post('/rso:rso_id', join_rso_handler);

module.exports = router;