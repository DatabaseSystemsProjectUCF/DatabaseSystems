const express = require('express');
const router = express.Router();
const { create_event_handler, create_comment_handler, display_comments_handler, edit_comment_handler } = require("../controllers/EventController");

router.post('/create', create_event_handler);
router.post('/create_comment', create_comment_handler);
router.get('/get_comments', display_comments_handler);
//router.get('/get_all_comments', display_all_comments_handler)
router.put('/edit_comment', edit_comment_handler);

module.exports = router;