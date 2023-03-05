const express = require('express');
const router = express.Router();
const { asyncHandler } = require("../index.js");
const { create_event_handler } = require("../controllers/EventController");

router.post('/create', asyncHandler(create_event_handler));

module.exports = router;