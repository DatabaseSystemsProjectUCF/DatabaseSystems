const express = require('express');
const router = express.Router();
const { create_event_handler } = require("../controllers/EventController");


router.post('/create', create_event_handler);


module.exports = router;