const express = require('express');
const router = express.Router();
const { create_event_handler, create_comment_handler, display_comments_handler, edit_comment_handler, 
    display_event_handler, display_all_events_handler, delete_comment_handler} = require("../controllers/EventController");

router.post('/create', create_event_handler);
router.get('/show_event', display_event_handler);
router.get('/show_all_events', display_all_events_handler);
router.post('/create_comment', create_comment_handler);
router.get('/get_comments', display_comments_handler);
router.put('/edit_comment', edit_comment_handler);
router.put('/delete_comment', delete_comment_handler);

module.exports = router;