

const express = require('express');
const router = express.Router();
const { handleChatQuestion } = require('../controllers/chatAssistantController');

router.post('/', handleChatQuestion);

module.exports = router;
