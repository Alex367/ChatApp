const express = require('express');
const router = express.Router();

const messageControllers = require('../controllers/messages');

// GET all messages
router.get('/', messageControllers.getAllMessages);

// POST a new message
router.post('/', messageControllers.postMessage);

// DELETE one message
router.delete('/', messageControllers.deleteMessage);

module.exports = router;