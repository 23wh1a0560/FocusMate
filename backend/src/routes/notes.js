const express = require('express');
const router = express.Router();
const { createNote, getNotes } = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createNote);
router.get('/', protect, getNotes);

module.exports = router;