const { Schema, model, Types } = require('mongoose');

const notificationSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User' },
  chat: { type: Types.ObjectId, ref: 'Chat' },
  message: { type: Types.ObjectId, ref: 'Message' },
  type: { type: String, enum: ['new_message'] },
  createdAt: { type: Date, default: Date.now },
});

const ChatNotification = model('ChatNotification', notificationSchema);

module.exports = ChatNotification;
