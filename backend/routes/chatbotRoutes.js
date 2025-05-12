const express = require('express');
const router = express.Router();
const { respondToMessage } = require('../controllers/chatbotController');

router.post('/respond', respondToMessage);

module.exports = router;