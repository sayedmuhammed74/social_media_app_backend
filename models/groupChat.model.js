const { Schema, model, Types } = require('mongoose');

const groupChatSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  admin: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GroupChat = model('GroupChat', groupChatSchema);

module.exports = GroupChat;
