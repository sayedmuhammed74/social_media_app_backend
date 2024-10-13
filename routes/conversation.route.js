const { Router } = require('express');
// Create Router
const router = Router();
// Controllers
const { protect } = require('../controllers/authController');
const {
  getConversation,
  sendMessage,
  getMessage,
  getAllConversations,
  getAllMessages,
} = require('../controllers/conversation.controller');

// Protect Route
router.use(protect);

router.route('/').get(getAllConversations);
router.route('/:conversationId').get(getConversation);
router.route('/:conversationId/messages').get(getAllMessages).post(sendMessage);
router.route('/:conversationId/messages/:messageId').get(getMessage);

module.exports = router;
