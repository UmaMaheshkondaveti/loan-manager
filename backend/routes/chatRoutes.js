const express = require('express');
const router = express.Router();
const { getChats, saveChat } = require('../controllers/chatController');

router.get('/', getChats);
router.post('/', saveChat);

module.exports = router;
