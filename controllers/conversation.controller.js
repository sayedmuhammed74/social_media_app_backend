const { isObjectIdOrHexString, isValidObjectId } = require('mongoose');
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const catchAsync = require('../utils/catchAsync');

// Get All Exists Conversations
exports.getAllConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    members: { $in: [req.user._id] },
  }).sort({ updatedAt: -1 });

  res.status(200).json({
    status: 'success',
    result: conversations.length,
    data: {
      conversations,
    },
  });
});

// Get Conversation with members & messages or Create Conversation if not exist
exports.getConversation = catchAsync(async (req, res, next) => {
  const { member } = req.query;
  const { conversationId } = req.params;
  let conversation;
  if (conversationId) {
    conversation = await Conversation.findById(conversationId);
  } else {
    conversation = await Conversation.findOne({
      members: { $all: [req.user._id, member] },
    });
  }

  //   If Conversation not Exist
  if (!conversation) {
    const newConversation = await Conversation.create({
      members: [req.user._id, member],
    });
    return res.status(200).json({
      status: 'success',
      data: {
        conversation: newConversation,
      },
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      conversation,
    },
  });
});

exports.getAllMessages = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;
  const { member } = req.query;
  let messages;
  if (!isValidObjectId(conversationId)) {
    const conversation = await Conversation.findOne({
      members: { $all: [req.user._id, member] },
    });
    if (conversation) {
      messages = await Message.find({ conversation: conversationId });
      conversationId = conversation._id;
    } else {
      messages = [];
    }
  } else {
    messages = await Message.find({ conversation: conversationId });
  }

  res.status(200).json({
    status: 'success',
    data: {
      messages,
    },
  });
});

exports.getMessage = catchAsync(async (req, res, next) => {
  const { messageId } = req.params;
  const message = await Message.findById(messageId);
  res.status(200).json({
    status: 'success',
    data: {
      message,
    },
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { content } = req.body;
  const { member } = req.query;
  let { conversationId } = req.params;

  // Check if valid conversation id
  if (!isValidObjectId(conversationId)) {
    const conversation = await Conversation.findOne({
      members: { $all: [req.user._id, member] },
    });
    if (!conversation) {
      const newConversation = await Conversation.create({
        members: [req.user._id, member],
      });
      conversationId = newConversation._id;
    } else {
      conversationId = conversation._id;
    }
  }

  // Create Message
  const message = await Message.create({
    sender: req.user._id,
    conversation: conversationId,
    content,
  });

  // Update Last Message
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      message,
    },
  });
});
